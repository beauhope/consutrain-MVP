/*
  =========================================================
  FILE: sw.js
  PURPOSE:
  تفعيل وضع PWA في موقع ConsuTrain عبر:
  - التخزين المسبق للملفات الأساسية
  - دعم التصفح دون اتصال
  - إظهار صفحة fallback عند تعذر تحميل الصفحات
  =========================================================
*/
const STATIC_CACHE = "consutrain-v20261018-certificate-footer-v1";
const RUNTIME_CACHE = "consutrain-runtime-v20261018-certificate-footer-v1";
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./fr/index.html",
  "./offline.html",
  "./fr/offline.html",
  "./assets/css/style.css",
  "./assets/css/home-hero-slideshow.css",
  "./assets/js/includes.js",
  "./assets/js/home-hero-slideshow.js",
  "./assets/js/pwa.js",
  "./partials/header.html",
  "./partials/fr-header.html",
  "./partials/footer.html",
  "./partials/fr-footer.html",
  "./assets/images/consutrain-logo-horizontal.png",
  "./assets/fonts/Cairo-VariableFont_slnt,wght.woff2",
  "./assets/icons/icon-192-v2.png",
  "./assets/icons/icon-512-v2.png",
  "./manifest.webmanifest",
  "./manifest-fr.webmanifest"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) =>
        Promise.allSettled(
          PRECACHE_URLS.map((url) =>
            fetch(url, { cache: "reload" })
              .then((response) => {
                if (!response || !response.ok) {
                  throw new Error(`Precache failed: ${url}`);
                }
                return cache.put(url, response);
              })
          )
        )
      )
      .then((results) => {
        const failed = results.filter((result) => result.status === "rejected");
        if (failed.length) {
          console.warn("Some precache files were skipped:", failed);
        }
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![STATIC_CACHE, RUNTIME_CACHE].includes(key))
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (isPlatformGuideProfileAsset(url)) {
    event.respondWith(networkFirstAsset(request));
    return;
  }

  if (isPdfAsset(url)) {
    event.respondWith(networkFirstAsset(request));
    return;
  }

  if (isSensitiveTokenPage(url)) {
    event.respondWith(fetch(request, { cache: "no-store" }));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request));
    return;
  }

  if (shouldUseNetworkFirstForUiAsset(url)) {
    event.respondWith(networkFirstAsset(request));
    return;
  }

  event.respondWith(cacheFirstAsset(request));
});


function isSensitiveTokenPage(url) {
  const path = url.pathname.toLowerCase();
  return (
    path === "/admin" ||
    path.startsWith("/admin/") ||
    path.endsWith("/unsubscribe.html")
  );
}

function isPlatformGuideProfileAsset(url) {
  const path = url.pathname;
  return (
    path.includes("/resources/downloads/profile/") &&
    (path.endsWith(".pdf") || path.endsWith("latest-ar.html") || path.endsWith("latest-fr.html"))
  );
}

function isPdfAsset(url) {
  return url.pathname.toLowerCase().endsWith(".pdf");
}

function shouldUseNetworkFirstForUiAsset(url) {
  const path = url.pathname;

  return (
    path.includes("/pagefind/") ||
    path.endsWith("/assets/js/site-search.js") ||
    path.endsWith("/assets/css/site-search.css") ||
    path.includes("/partials/") ||
    path.endsWith("/assets/js/includes.js") ||
    path.endsWith("/assets/js/subscriber-capture.js") ||
    path.endsWith("/assets/js/unsubscribe.js") ||
    path.endsWith("/assets/js/free-certificate-training.js") ||
    path.endsWith("/assets/js/free-certificate-training-blue-ocean.js") ||
    path.endsWith("/assets/js/free-certificate-training-blue-ocean-fr.js") ||
    path.endsWith("/assets/js/pwa.js") ||
    path.endsWith("/assets/js/platform-guide.js") ||
    path.endsWith("/assets/data/articles.json") ||
    path.endsWith("/assets/data/fr-articles.json") ||
    path.endsWith("/assets/data/platform-guide.json") ||
    path.endsWith("/assets/data/fr-platform-guide.json") ||
    path.endsWith("/assets/data/platform-guide-pdf-manifest.json") ||
    path.endsWith("/assets/css/style.css") ||
    path.endsWith("/manifest.webmanifest") ||
    path.endsWith("/manifest-fr.webmanifest")
  );
}
async function matchCachedAsset(request) {
  const url = new URL(request.url);
  const expectedType = url.pathname.endsWith(".js")
    ? "javascript"
    : url.pathname.endsWith(".css")
      ? "text/css"
      : null;

  async function isValid(response) {
    if (!response || !response.ok) return false;

    const contentType = (
      response.headers.get("content-type") || ""
    ).toLowerCase();

    if (expectedType === "javascript") {
      return (
        contentType.includes("javascript") ||
        contentType.includes("ecmascript")
      );
    }

    if (expectedType === "text/css") {
      return contentType.includes("text/css");
    }

    return true;
  }

  const exact = await caches.match(request);
  if (await isValid(exact)) return exact;

  // Fallback for versioned static resources already cached
  // under the same path without a query string.
  if (url.search && (
    expectedType ||
    url.pathname.endsWith("/assets/data/articles.json") ||
    url.pathname.endsWith("/assets/data/fr-articles.json")
  )) {
    const fallback = await caches.match(request, {
      ignoreSearch: true
    });
    if (await isValid(fallback)) return fallback;
  }

  return undefined;
}
async function networkFirstAsset(request) {
  try {
    const networkResponse = await fetch(request, { cache: "no-store" });
    if (networkResponse && networkResponse.ok) {
      const runtimeCache = await caches.open(RUNTIME_CACHE);
      await runtimeCache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await matchCachedAsset(request);
    if (cachedResponse) return cachedResponse;
    throw error;
  }
}

async function networkFirstPage(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      const runtimeCache = await caches.open(RUNTIME_CACHE);
      await runtimeCache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    const fallbackUrl = new URL(request.url).pathname.startsWith("/fr/")
      ? "./fr/offline.html"
      : "./offline.html";
    const fallbackPage = await caches.match(fallbackUrl);
    if (fallbackPage) return fallbackPage;

    const cachedIndex = await caches.match("./index.html");
    if (cachedIndex) return cachedIndex;

    throw error;
  }
}

async function cacheFirstAsset(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      const runtimeCache = await caches.open(RUNTIME_CACHE);
      await runtimeCache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const fallback = await matchCachedAsset(request);
    if (fallback) return fallback;

    // Do not return an image for a missing JS or CSS file.
    throw error;
  }
}