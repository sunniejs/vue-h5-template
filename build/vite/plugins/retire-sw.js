// Replaces older Lite workers registered at /sw.js when PWA is turned off.
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim();
      await self.caches.delete('api-cache');
      await self.registration.unregister();
    })(),
  );
});
