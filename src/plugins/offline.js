export function registerOfflineShell() {
  if (process.env.NODE_ENV !== 'production' || process.env.VUE_APP_PWA_ENABLED !== 'true') return
  if (!('serviceWorker' in navigator)) return
  const worker = new URL(`${process.env.BASE_URL}sw.js`, window.location.href)
  navigator.serviceWorker.register(worker).catch(() => {
    // The app stays available when the browser declines service worker registration.
  })
}
