const CACHE_NAME = 'sapper-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/startGame.html',
    '/startCustomGame.html',
    '/documentation.html',
    '/css/styles.css',
    '/css/game.css',
    '/css/custom-game.css',
    '/css/documentation.css',
    '/js/game.js',
    '/js/customGame.js',
    '/js/explosion.js',
    '/js/audio.js',
    '/js/network-status.js',
    '/js/service-worker.js',
    '/js/sw-register.js',
    '/song/main.mp3',
    '/picture/beer.png',
    '/picture/bomb.png',
    '/picture/flag.png',
    '/picture/skoda.png',
];

// Install event - caching resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serving cached content when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response; // Return cached response if found
                }
                return fetch(event.request); // Fetch from network if not in cache
            })
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName); // Delete old caches
                    }
                })
            );
        })
    );
});
