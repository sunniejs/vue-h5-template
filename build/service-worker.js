/* global shell */
const scope = self.registration.scope
const root = new URL(scope)
const cachePrefix = `vue-h5-shell:${scope}:`
const cacheName = cachePrefix + shell.version
const indexUrl = new URL('index.html', root)
const assets = new Set(shell.assets.map(name => new URL(name, scope).href))

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll([...assets].map(url => new Request(url, { cache: 'reload' }))))
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(keys.filter(key => key.startsWith(cachePrefix) && key !== cacheName).map(key => caches.delete(key)))
      )
  )
})

self.addEventListener('fetch', event => {
  const { request } = event
  if (request.method !== 'GET') return

  // Hash routing always requests this document. API URLs are never part of the shell.
  const { origin, pathname } = new URL(request.url)
  if (
    request.mode === 'navigate' &&
    origin === root.origin &&
    (pathname === root.pathname || pathname === indexUrl.pathname)
  ) {
    event.respondWith(
      fetch(request).catch(async error => {
        const cached = await caches.open(cacheName).then(cache => cache.match(indexUrl.href))
        if (cached) return cached
        throw error
      })
    )
  } else if (assets.has(request.url)) {
    event.respondWith(caches.open(cacheName).then(async cache => (await cache.match(request)) || fetch(request)))
  }
})
