const CACHE_NAME = 'vita-romana-v1';
const urlsToCache = [
  '/Vita-Romana/',
  '/Vita-Romana/index.html',
  '/Vita-Romana/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
