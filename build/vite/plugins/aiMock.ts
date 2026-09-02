import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';

const ANSWER = `Vue is a progressive JavaScript framework for building user interfaces.

It is especially useful for mobile H5 applications because it combines a small runtime with an approachable component model:

\`\`\`vue
<script setup lang="ts">
const message = ref('Hello Vue')
</script>
\`\`\`

Use **Composition API** for reusable logic and keep server state outside Pinia.`;

function readBody(request: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    request.setEncoding('utf8');
    request.on('data', (chunk: string) => {
      body += chunk;
    });
    request.on('end', () => resolve(body));
    request.on('error', reject);
  });
}

function writeEvent(response: ServerResponse, data: object) {
  response.write(`data: ${JSON.stringify(data)}\n\n`);
}

export function ConfigAiMockPlugin(): Plugin {
  return {
    name: 'vue-h5-template:ai-stream-mock',
    configureServer(server) {
      // Vite 中间件（非 Express），下方 async handler 已有完整 try/catch 兜底，不会产生未捕获拒绝
      // oxlint-disable-next-line oxc/no-async-endpoint-handlers
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url ?? '/', 'http://localhost')
          .pathname;
        if (request.method !== 'POST' || pathname !== '/api/ai/chat') {
          next();
          return;
        }

        try {
          const body = JSON.parse(await readBody(request)) as {
            messages?: Array<{ content?: string }>;
          };
          const prompt =
            body.messages?.[body.messages.length - 1]?.content?.trim();
          const answer = prompt ? ANSWER : 'Please send a message to begin.';
          const chunks = answer.match(/\S+\s*|\n/g) ?? [answer];
          let closed = false;

          request.on('aborted', () => {
            closed = true;
          });
          response.on('close', () => {
            closed = true;
          });
          response.writeHead(200, {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
            'X-Accel-Buffering': 'no',
          });

          for (const delta of chunks) {
            if (closed) return;
            writeEvent(response, { type: 'delta', delta });
            await new Promise((resolve) => setTimeout(resolve, 45));
          }

          if (!closed) {
            writeEvent(response, { type: 'done' });
            response.end();
          }
        } catch (error) {
          response.statusCode = 400;
          writeEvent(response, {
            type: 'error',
            message: error instanceof Error ? error.message : 'Invalid request',
          });
          response.end();
        }
      });
    },
  };
}
