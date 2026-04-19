// Simple service worker for offline caching of core assets
const CACHE_NAME = 'dev-portfolio-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.tsx',
  'https://cdn.tailwindcss.com',
];

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event: any) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
---