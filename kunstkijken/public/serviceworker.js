const cacheName = 'v1';

const cacheAssets = [
  '/css/style.css',
  '/js/script.js',
  '../views/partials/header',
  '../views/partials/head',
  '../views/partials/footer'
]

self.addEventListener('install', e => {
  console.log('serviceworker: installed');

  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        console.log('Serviceworker: cashing files')
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', e => {
  console.log('serviceworker: activated');
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if(cache !== cacheName) {
            return caches.delete(cache);
          }
        })
      )
    })
  )
})

self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(()=> caches.match(e.request)));
})