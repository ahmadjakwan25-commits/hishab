/* আল-মিফতাহ Service Worker — অফলাইন ক্যাশ */
'use strict';

var CACHE_NAME = 'almiftah-offline-v7';

var CORE_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './content.json'
];

// প্রথমবার অ্যাপের প্রয়োজনীয় ফাইল ক্যাশে রাখা
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return Promise.all(
          CORE_FILES.map(function (url) {
            return fetch(url, { cache: 'reload' })
              .then(function (response) {
                if (response && response.ok) {
                  return cache.put(url, response);
                }
              })
              .catch(function () {});
          })
        );
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

// পুরোনো আল-মিফতাহ ক্যাশ সরানো
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(
          keys.filter(function (key) {
            return key.indexOf('almiftah-') === 0 &&
              key !== CACHE_NAME;
          }).map(function (key) {
            return caches.delete(key);
          })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

// কোন ফাইলগুলো ক্যাশে রাখা হবে
function shouldRuntimeCache(request, url) {
  if (request.method !== 'GET') {
    return false;
  }

  if (url.origin === self.location.origin) {
    return true;
  }

  return url.hostname === 'api.alquran.cloud' ||
    url.hostname === 'cdn.jsdelivr.net' ||
    url.hostname === 'raw.githubusercontent.com' ||
    url.hostname === 'github.com';
}

// গ্রহণযোগ্য রেসপন্স যাচাই
function cacheableResponse(response) {
  return response &&
    (response.ok || response.type === 'opaque');
}

// অনলাইন থেকে ফাইল নেওয়া এবং ক্যাশে রাখা
self.addEventListener('fetch', function (event) {
  var request = event.request;

  if (request.method !== 'GET') {
    return;
  }

  var url;

  try {
    url = new URL(request.url);
  } catch (error) {
    return;
  }

  if (!shouldRuntimeCache(request, url)) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then(function (response) {
        if (cacheableResponse(response)) {
          var copy = response.clone();

          caches.open(CACHE_NAME)
            .then(function (cache) {
              cache.put(request, copy).catch(function () {});
            });
        }

        return response;
      })
      .catch(function () {
        return caches.match(request)
          .then(function (cached) {
            if (cached) {
              return cached;
            }

            // অফলাইনে content.json-এর বিকল্প
            if (
              url.origin === self.location.origin &&
              /\/content\.json$/.test(url.pathname)
            ) {
              return caches.match('./content.json', {
                ignoreSearch: true
              });
            }

            // অফলাইনে অ্যাপের মূল পেজ দেখানো
            if (request.mode === 'navigate') {
              return caches.match('./index.html', {
                ignoreSearch: true
              }).then(function (page) {
                return page || caches.match('./');
              });
            }

            // ক্যাশে না থাকা ফাইল অফলাইনে পাওয়া যাবে না
            return Response.error();
          });
      })
  );
});
