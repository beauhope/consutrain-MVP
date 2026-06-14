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



const STATIC_CACHE = "consutrain-v20260526-pwa-icons-maskable-v2";
const RUNTIME_CACHE = "consutrain-runtime-v20260526-pwa-icons-maskable-v2";

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./start-here.html",
  "./about.html",
  "./contact.html",
  "./quote-request.html",
  "./expert.html",
  "./learn.html",
  "./services.html",
  "./services/digital-transformation-roadmap.html",
  "./tools.html",

  "./templates/operational-plan-template.html",
  "./downloads/ConsuTrain_Free_Operational_Plan_Template_AR.docx",
  "./downloads/ConsuTrain_Free_Operational_Plan_Template_AR.pdf",
  "./templates/operational-plan-checklist.html",
  "./templates/simple-risk-register.html",
  "./downloads/ConsuTrain_Operational_Plan_Readiness_Checklist_AR.docx",
  "./downloads/ConsuTrain_Operational_Plan_Readiness_Checklist_AR.pdf",
  "./downloads/ConsuTrain_Simple_Risk_Register_AR.docx",
  "./downloads/ConsuTrain_Simple_Risk_Register_AR.pdf",
  "./learn/ai.html",
  "./learn/digitization-guide.html",
  "./learn/digital-services-evolution.html",
  "./learn/free-certificate-training.html",
  "./learn/free-certificate-training/digital-transformation-intro/index.html",
  "./learn/free-certificate-training/digital-transformation-intro/lesson-01.html",
  "./learn/free-certificate-training/digital-transformation-intro/lesson-02.html",
  "./learn/free-certificate-training/digital-transformation-intro/lesson-03.html",
  "./learn/free-certificate-training/digital-transformation-intro/lesson-04.html",
  "./learn/free-certificate-training/digital-transformation-intro/lesson-05.html",
  "./learn/free-certificate-training/digital-transformation-intro/final-assessment.html",
  "./learn/free-certificate-training/digital-transformation-intro/certificate-request.html",
  "./learn/management-tech-radar.html",
  "./learn/radar/ai-workflow-integration.html",
  "./learn/radar/ai-model-flexibility.html",
  "./learn/radar/ai-governance.html",
  "./learn/radar/process-automation.html",
  "./learn/learning-paths.html",
  "./learn/management-skills.html",
  "./learn/business-economics/index.html",
  "./learn/porter-generic-strategies/index.html",
  "./learn/value-chain-analysis/index.html",
  "./learn/environmental-strategic-analysis/index.html",
  "./learn/porter-generic-strategies/articles/lesson-01.html",
  "./learn/porter-generic-strategies/articles/lesson-02.html",
  "./learn/porter-generic-strategies/articles/lesson-03.html",
  "./learn/porter-generic-strategies/articles/lesson-04.html",
  "./learn/porter-generic-strategies/articles/lesson-05.html",
  "./article.html",
  "./learn/article.html",
  "./learn/articles.html",
  "./learn/glossary.html",
  "./learn/soft-skill.html",
  "./learn/soft-skills.html",
  "./learn/topics.html",

  "./services/feasibility-studies.html",
  "./services/integrated-management-system.html",
  "./services/iso-consulting.html",
  "./services/organizational-structures.html",
  "./services/project-management.html",
  "./services/risk-management.html",
  "./services/sop-operational-manuals.html",
  "./services/strategic-planning.html",
  "./services/book-consultation.html",

  "./tools/feasibility/indexFeasibility.html",

  "./partials/header.html",
  "./partials/footer.html",

  "./assets/css/style.css",

  "./assets/images/consutrain-logo-horizontal.png",
  "./assets/images/consutrain-logo-mark.png",
  "./assets/images/consutrain-banner.png",
  "./assets/images/articles/ai-introduction.svg",
  "./assets/images/articles/ai-sense.svg",
  "./assets/images/articles/ai-vuca.svg",

  "./assets/js/includes.js",
  "./assets/js/free-certificate-training.js",
  "./assets/js/main.js",
  "./assets/js/ai-page.js",
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

  "./assets/icons/icon-192-v2.png",
  "./assets/icons/icon-512-v2.png",
  "./assets/icons/icon-192-maskable-v2.png",
  "./assets/icons/icon-512-maskable-v2.png",

  "./assets/screenshots/screenshot-desktop-wide.png",
  "./assets/screenshots/screenshot-mobile.png",

  "./resources/index.html",
  "./courses/index.html",
  "./courses/objectives-management.html",
  "./courses/mor-foundation.html",
  "./feedback.html",
  "./fr/about.html",
  "./fr/contact.html",
  "./fr/tools.html",
  "./services/consultation-form.html",
  "./tools/calculators/index.html",
  "./tools/crm/index.html",
  "./tools/invoice/index.html",
  "./tools/timer/index.html",
  "./tools/tool-templates/index.html",
  "./tools/mytodo/index.html",
  "./tools/mytodo/templates/page-shell.html",

  "./manifest.webmanifest",
  "./offline.html"
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


function shouldUseNetworkFirstForUiAsset(url) {
  const path = url.pathname;

  return (
    path.includes("/partials/") ||
    path.endsWith("/assets/js/includes.js") ||
    path.endsWith("/assets/js/pwa.js") ||
    path.endsWith("/assets/css/style.css") ||
    path.endsWith("/manifest.webmanifest")
  );
}

async function networkFirstAsset(request) {
  try {
    const networkResponse = await fetch(request, { cache: "no-store" });
    const runtimeCache = await caches.open(RUNTIME_CACHE);
    runtimeCache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;
    throw error;
  }
}

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
    return caches.match("./assets/icons/icon-192-v2.png");
  }
}
