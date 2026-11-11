/* Nafis Plus offline app — works under any GitHub Pages repository path. */
const VERSION = 'nafis-pwa-2026-11-11-v4';
const SHELL = ['', 'index.html', 'manifest.webmanifest', 'pwa.js', 'icons/favicon.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png'];
const EXAMS = [];
for (const grade of ['3', '6', '9']) {
  for (const subject of ['math', 'arabic', 'science']) {
    for (let exam = 1; exam <= 6; exam++) {
      EXAMS.push(`pdf/g${grade}_${subject}_n${exam}.pdf`);
    }
  }
}
const absolute = path => new URL(path, self.registration.scope).href;
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await cache.addAll(SHELL.map(absolute));
    // Precache 54 PDFs in small batches; a failed PDF won't stop app installation.
    for (let i = 0; i < EXAMS.length; i += 6) {
      await Promise.allSettled(EXAMS.slice(i, i + 6).map(path => cache.add(absolute(path))));
    }
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('nafis-pwa-') && key !== VERSION).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(VERSION);
          cache.put(request, response.clone()).catch(() => {});
        }
        return response;
      } catch (_e) {
        return (await caches.match(request)) || (await caches.match(absolute('index.html'))) || Response.error();
      }
    })());
    return;
  }
  event.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const stored = await cache.match(request, {ignoreSearch:true});
    if (stored) return stored;
    try {
      const response = await fetch(request);
      if (response.ok) cache.put(request, response.clone()).catch(() => {});
      return response;
    } catch (_e) {
      return Response.error();
    }
  })());
});
