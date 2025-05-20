const CACHE_NAME = 'snake-game-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/script.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  'https://cdn.tailwindcss.com',
  'https://cdn.pixabay.com/audio/2022/03/15/audio_9f1b9c43e3.mp3',
  'https://cdn.pixabay.com/audio/2022/03/15/audio_3c5b8a0f3b.mp3',
  'https://cdn.pixabay.com/audio/2022/03/15/audio_b6d4e015f1.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});
