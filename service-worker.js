// Простой offline-first service worker. При изменении файлов — поднимите CACHE_VERSION,
// чтобы у пользователей обновился кэш.

const CACHE_VERSION = "trn-v1";

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/app.js",
  "./js/db.js",
  "./js/modal.js",
  "./js/placeholder.js",
  "./js/animations.js",
  "./js/data/exercises.js",
  "./js/views/today.js",
  "./js/views/planner.js",
  "./js/views/library.js",
  "./js/views/history.js",
  "./assets/icons/icon-16.png",
  "./assets/icons/icon-32.png",
  "./assets/icons/icon-180.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-512-maskable.png",
  "./assets/icons/apple-touch-icon.png",
  "./assets/exercises/chest-cable-crossover.jpg",
  "./assets/exercises/arms-seated-curl.jpg",
  "./assets/exercises/arms-standing-dumbbell-curl.jpg",
  "./assets/exercises/back-dumbbell-row.jpg",
  "./assets/exercises/chest-bench-press.jpg",
  "./assets/exercises/chest-dumbbell-press.jpg",
  "./assets/exercises/chest-pushup.jpg",
  "./assets/exercises/chest-fly.jpg",
  "./assets/exercises/chest-dips.jpg",
  "./assets/exercises/chest-incline-press.jpg",
  "./assets/exercises/chest-pec-deck.jpg",
  "./assets/exercises/back-lat-pulldown.jpg",
  "./assets/exercises/back-pullup.jpg",
  "./assets/exercises/back-one-arm-row.jpg",
  "./assets/exercises/back-hyperextension.jpg",
  "./assets/exercises/legs-squat.jpg",
  "./assets/exercises/legs-leg-press.jpg",
  "./assets/exercises/legs-lunge.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || !req.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, res.clone()));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
