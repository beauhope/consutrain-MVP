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

const STATIC_CACHE = "consutrain-static-v20260324-2";
const RUNTIME_CACHE = "consutrain-runtime-v20260324-2";

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./about.html",
  "./contact.html",
  "./expert.html",
  "./learn.html",
  "./services.html",
  "./tools.html",

  "./learn/ai-prompts.html",
  "./learn/ai.html",
  "./learn/article.html",
  "./learn/articles.html",
  "./learn/glossary.html",
  "./learn/soft-skill.html",
  "./learn/soft-skills.html",
  "./learn/topics.html",

  "./services/feasibility-studies.html",
  "./services/iso-consulting.html",
  "./services/project-management.html",
  "./services/strategic-planning.html",

  "./tools/feasibility/indexFeasibility.html",

  "./partials/header.html",
  "./partials/footer.html",

  "./assets/css/style.css",

  "./assets/js/includes.js",
  "./assets/js/main.js",
  "./assets/js/ai-page.js",
  "./assets/js/ai-prompts-page.js",
  "./assets/js/article-page.js",
  "./assets/js/articles-page.js",
  "./assets/js/glossary.js",
  "./assets/js/soft-skill-page.js",
  "./assets/js/pwa.js",

  "./assets/data/articles.json",
  "./assets/data/glossary.json",
  "./assets/data/soft-skills.json",

  "./assets/fonts/Cairo-Bold.ttf",
  "./assets/fonts/Cairo-Regular.ttf",
  "./assets/fonts/Cairo-VariableFont_slnt,wght.woff2",

  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-192-maskable.png",
  "./assets/icons/icon-512-maskable.png",

  "./assets/screenshots/screenshot-desktop-wide.png",
  "./assets/screenshots/screenshot-mobile.png",

  "./manifest.webmanifest",
  "./offline.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
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

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request));
    return;
  }

  event.respondWith(cacheFirstAsset(request));
});

async function networkFirstPage(request) {
  try {
    const networkResponse = await fetch(request);
    const runtimeCache = await caches.open(RUNTIME_CACHE);
    runtimeCache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    const fallbackPage = await caches.match("./offline.html");
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
    const runtimeCache = await caches.open(RUNTIME_CACHE);
    runtimeCache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    return caches.match("./assets/icons/icon-192.png");
  }
}