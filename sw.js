// Lets the app open even without internet.
const CACHE = 'budget-v10';
const FILES = ['./', './index.html', './manifest.json', './firebase-config.js', './icon-192.png', './icon-512.png'];
const CACHE_HOSTS = [location.origin, 'https://fonts.googleapis.com', 'https://fonts.gstatic.com', 'https://www.gstatic.com'];

self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); });
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Only handle app files, fonts and the Firebase library. Cloud sync traffic goes straight to Firebase.
  if (e.request.method !== 'GET' || !CACHE_HOSTS.includes(url.origin)) return;
  e.respondWith(fetch(e.request).then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
  }).catch(() => caches.match(e.request)));
})
