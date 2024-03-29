
var cacheName = 'HxHTWA';
var files = [
  '',
  'index.html',
  'images/icons/gon.png',
]


  // <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.light_blue-blue.min.css" />
  // <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching')
      return cache.addAll(files);
    })
  );
  console.log('[ServiceWorker] Cached');
});

self.addEventListener('fetch', async function(event) {
  console.log('[ServiceWorker] Fetching ', event.request.url);

  event.respondWith(async function() {

    const cachePromise = caches.open(cacheName);
    const responsePromise = fetch(event.request);

    const cache = await cachePromise;
    try {
      const response = await responsePromise;
      console.log("[ServiceWorker] Fetch successful.");
      cache.put(event.request, response.clone());
      return response;
    } catch (error) {
      console.log("[ServiceWorker] Fetch failed, returning cached response.");
      // Could not connect to the internet.
      // Return cached response.
      const cached = await cache.match(event.request);
      if (cached == undefined) {
        // What can we do - 404!
        console.log("Not in cache :-(");
        return Promise.reject("Not cached.");
      }
      console.log("In cache!");
      return cached;
      // console.log(error);
    }
  }());
});