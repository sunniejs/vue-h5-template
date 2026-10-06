const { match } = require('path-to-regexp')

const matchesPrefix = (path, prefix) => path === prefix || path.startsWith(`${prefix}/`)
const localPrefix = (value, fallback) => {
  if (!value || !/^\/(?!\/)[^?#]+$/.test(value)) return fallback
  return value.replace(/\/+$/, '')
}
const escapePattern = prefix => prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function sendJson(response, status, payload) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(payload))
}

async function readBody(request) {
  let body = ''
  request.setEncoding('utf8')
  for await (const chunk of request) {
    body += chunk
    if (body.length > 131_072) throw new Error('Mock payload is too large')
  }
  return body ? JSON.parse(body) : {}
}

async function streamChat(request, response) {
  const body = await readBody(request)
  const prompt = Array.isArray(body.messages) && body.messages.at(-1)?.content?.trim()
  const answer = prompt
    ? 'Vue is a progressive JavaScript framework for building user interfaces.\n\n' +
      'Use **Composition API** for reusable logic and keep remote state in TanStack Query.\n\n' +
      '```js\nconst message = ref("Hello Vue")\n```'
    : 'Please send a message to begin.'

  response.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    'X-Accel-Buffering': 'no'
  })
  const event = data => response.write(`data: ${JSON.stringify(data)}\n\n`)
  event({ type: 'start', conversationId: body.conversationId || 'mock-conversation' })
  for (const delta of answer.match(/\S+\s*|\n/g)) {
    if (response.destroyed) return
    event({ type: 'delta', delta })
    await delay(45)
  }
  if (!response.destroyed) {
    event({ type: 'usage', inputTokens: 8, outputTokens: 43 })
    event({ type: 'done' })
    response.end()
  }
}

function createMockMiddleware(api, ai, apiTarget, aiTarget) {
  const routes = require('../mock').map(route => ({
    ...route,
    match: match(route.url, { decode: decodeURIComponent })
  }))

  return async (request, response, next) => {
    try {
      const url = new URL(request.url, 'http://localhost')
      const aiRequest = matchesPrefix(url.pathname, ai)
      const prefix = aiRequest ? ai : api
      if ((aiRequest ? aiTarget : apiTarget) || !matchesPrefix(url.pathname, prefix)) {
        next()
        return
      }
      const path = (aiRequest ? '/api/ai' : '/api') + url.pathname.slice(prefix.length)
      const method = request.method.toLowerCase()
      if (path === '/api/ai/chat' && method === 'post') {
        await streamChat(request, response)
        return
      }
      const route = routes.find(candidate => candidate.method === method && candidate.match(path))
      if (!route) {
        sendJson(response, 404, { code: 404, msg: 'Mock endpoint not found', data: null })
        return
      }
      const params = route.match(path).params
      const query = { ...Object.fromEntries(url.searchParams), ...params }
      const body = ['post', 'patch', 'put'].includes(method) ? await readBody(request) : {}
      if (route.timeout) await delay(route.timeout)
      if (response.destroyed) return
      if (request.headers['x-request-id']) response.setHeader('X-Request-ID', request.headers['x-request-id'])
      sendJson(response, route.statusCode || 200, route.response({ body, query, headers: request.headers, url: path }))
    } catch {
      if (response.destroyed) return
      if (response.headersSent) {
        response.end()
      } else {
        sendJson(response, 400, { code: 400, msg: 'Invalid mock request', data: null })
      }
    }
  }
}

function createDevServer(env) {
  const api = localPrefix(env.VUE_APP_API_BASE_URL, '/api')
  const ai = localPrefix(env.VUE_APP_AI_API_BASE_URL, '/api/ai')
  const apiTarget = env.VUE_APP_API_TARGET
  const aiTarget = env.VUE_APP_AI_API_TARGET
  const proxy = {}

  function addProxy(prefix, target, rewrite, pattern) {
    if (!target) return
    proxy[pattern] = {
      target,
      changeOrigin: true,
      secure: true,
      ws: false,
      ...(rewrite === 'true'
        ? {
            pathRewrite: path => '/' + path.slice(prefix.length).replace(/^\/+/, '')
          }
        : {})
    }
  }
  addProxy(ai, aiTarget, env.VUE_APP_AI_API_PROXY_REWRITE, `^${escapePattern(ai)}(?:/|$)`)
  addProxy(
    api,
    apiTarget,
    env.VUE_APP_API_PROXY_REWRITE,
    `^(?!${escapePattern(ai)}(?:/|$))${escapePattern(api)}(?:/|$)`
  )

  return {
    host: '127.0.0.1',
    port: 9020,
    client: { overlay: { warnings: false, errors: true } },
    proxy,
    setupMiddlewares(middlewares) {
      if (env.VUE_APP_USE_MOCK === 'true') {
        middlewares.unshift({
          name: 'h5-api-mock',
          middleware: createMockMiddleware(api, ai, apiTarget, aiTarget)
        })
      }
      return middlewares
    }
  }
}

module.exports = { createDevServer }
