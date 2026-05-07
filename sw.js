/* ConsuTrain service worker - updated for project quality prompts resource */
const STATIC_CACHE = "consutrain-20260507-project-quality-prompts";
const RUNTIME_CACHE = "consutrain-runtime-v20260507-project-quality-prompts";

const PRECACHE_URLS = [
  './',
  './index.html',
  './start-here.html',
  './about.html',
  './contact.html',
  './expert.html',
  './learn.html',
  './services.html',
  './tools.html',
  './resources/index.html',
  './templates/index.html',
  './templates/strategic-planning-prompts.html',
  './resources/downloads/ai-management/ConsuTrain_Strategic_Planning_Prompts_AR.docx',
  './resources/downloads/ai-management/ConsuTrain_Strategic_Planning_Prompts_AR.pdf',
  './templates/feasibility-study-prompts.html',
  './resources/downloads/ai-management/ConsuTrain_Feasibility_Study_Prompts_AR.docx',
  './resources/downloads/ai-management/ConsuTrain_Feasibility_Study_Prompts_AR.pdf',
  './templates/project-quality-prompts.html',
  './resources/downloads/ai-management/ConsuTrain_Project_Quality_Prompts_AR.docx',
  './resources/downloads/ai-management/ConsuTrain_Project_Quality_Prompts_AR.pdf',
  'resources/downloads/risk-management/ConsuTrain_Risk_Assessment_Matrix_AR.pdf',
  'resources/downloads/risk-management/ConsuTrain_Risk_Assessment_Matrix_AR.docx',
  'resources/downloads/risk-management/ConsuTrain_Risk_Treatment_Plan_AR.pdf',
  'resources/downloads/risk-management/ConsuTrain_Risk_Treatment_Plan_AR.docx',
  'templates/risk-assessment-matrix.html',
  'templates/risk-treatment-plan.html',
  './templates/operational-plan-template.html',
  './templates/operational-plan-checklist.html',
  './templates/simple-risk-register.html',
  './templates/kpi-performance-card.html',
  './templates/operational-plan-follow-up-report.html',
  './templates/stakeholder-register.html',
  './templates/project-charter.html',
  './templates/project-communication-plan.html',
  './templates/meeting-minutes-decision-tracking.html',
  './templates/corrective-improvement-actions-register.html',
  './templates/process-improvement-plan.html',
  './templates/process-card.html',
  './templates/sop-template.html',
  'templates/risk-assessment-matrix.html',
  './resources/downloads/sop-procedures/ConsuTrain_SOP_Template_AR.docx',
  './resources/downloads/sop-procedures/ConsuTrain_SOP_Template_AR.pdf',
  './resources/downloads/sop-procedures/ConsuTrain_Process_Card_AR.docx',
  './resources/downloads/sop-procedures/ConsuTrain_Process_Card_AR.pdf',
  './resources/downloads/iso-quality/ConsuTrain_Process_Improvement_Plan_AR.docx',
  './resources/downloads/iso-quality/ConsuTrain_Process_Improvement_Plan_AR.pdf',
  './resources/downloads/iso-quality/ConsuTrain_Corrective_Improvement_Actions_Register_AR.docx',
  './resources/downloads/iso-quality/ConsuTrain_Corrective_Improvement_Actions_Register_AR.pdf',
  './resources/downloads/operational-plans/ConsuTrain_Free_Operational_Plan_Template_AR.pdf',
  './resources/downloads/operational-plans/ConsuTrain_Operational_Plan_Readiness_Checklist_AR.pdf',
  './resources/downloads/operational-plans/ConsuTrain_Operational_Plan_Follow_Up_Report_AR.pdf',
  './resources/downloads/risk-management/ConsuTrain_Simple_Risk_Register_AR.pdf',
  './resources/downloads/performance-management/ConsuTrain_KPI_Performance_Card_AR.pdf',
  './resources/downloads/project-management/ConsuTrain_Stakeholder_Register_AR.pdf',
  './resources/downloads/project-management/ConsuTrain_Project_Charter_AR.pdf',
  './resources/downloads/project-management/ConsuTrain_Project_Communication_Plan_AR.docx',
  './resources/downloads/project-management/ConsuTrain_Project_Communication_Plan_AR.pdf',
  './resources/downloads/project-management/ConsuTrain_Meeting_Minutes_Decision_Tracking_AR.docx',
  './resources/downloads/project-management/ConsuTrain_Meeting_Minutes_Decision_Tracking_AR.pdf',
  './resources/downloads/profile/ConsuTrain_Profile_and_Services_AR.pdf',
  './learn/ai-prompts.html',
  './learn/ai.html',
  './learn/article.html',
  './learn/articles.html',
  './learn/glossary.html',
  './learn/soft-skill.html',
  './learn/soft-skills.html',
  './learn/topics.html',
  './services/book-consultation.html',
  './services/feasibility-studies.html',
  './services/iso-consulting.html',
  './services/project-management.html',
  './services/strategic-planning.html',
  './tools/feasibility/indexFeasibility.html',
  './partials/header.html',
  './partials/footer.html',
  './assets/css/style.css',
  './assets/js/includes.js',
  './assets/js/main.js',
  './assets/js/ai-page.js',
  './assets/js/ai-prompts-page.js',
  './assets/js/article-page.js',
  './assets/js/articles-page.js',
  './assets/js/glossary.js',
  './assets/js/soft-skill-page.js',
  './assets/js/pwa.js',
  './assets/data/articles.json',
  './assets/data/glossary.json',
  './assets/data/soft-skills.json',
  './assets/fonts/Cairo-Bold.ttf',
  './assets/fonts/Cairo-Regular.ttf',
  './assets/fonts/Cairo-VariableFont_slnt,wght.woff2',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-192-maskable.png',
  './assets/icons/icon-512-maskable.png',
  './assets/screenshots/screenshot-desktop-wide.png',
  './assets/screenshots/screenshot-mobile.png',
  './manifest.webmanifest',
  './offline.html',
  './templates/internal-audit-plan.html',
  './resources/downloads/iso-quality/ConsuTrain_Internal_Audit_Plan_AR.docx',
  './resources/downloads/iso-quality/ConsuTrain_Internal_Audit_Plan_AR.pdf',
  './templates/iso9001-internal-audit-checklist.html',
  './resources/downloads/iso-quality/ConsuTrain_ISO9001_Internal_Audit_Checklist_AR.docx',
  './resources/downloads/iso-quality/ConsuTrain_ISO9001_Internal_Audit_Checklist_AR.pdf',
  './templates/nonconformity-register.html',
  './resources/downloads/iso-quality/ConsuTrain_Nonconformity_Register_AR.docx',
  './resources/downloads/iso-quality/ConsuTrain_Nonconformity_Register_AR.pdf',
  './templates/quality-policy-template.html',
  './resources/downloads/iso-quality/ConsuTrain_Quality_Policy_Template_AR.docx',
  './resources/downloads/iso-quality/ConsuTrain_Quality_Policy_Template_AR.pdf',
  './templates/quality-objectives-kpis.html',
  './resources/downloads/iso-quality/ConsuTrain_Quality_Objectives_KPIs_AR.docx',
  './resources/downloads/iso-quality/ConsuTrain_Quality_Objectives_KPIs_AR.pdf',
  "templates/swot-analysis-template.html",
  "resources/downloads/strategic-planning/ConsuTrain_SWOT_Analysis_Template_AR.docx",
  "resources/downloads/strategic-planning/ConsuTrain_SWOT_Analysis_Template_AR.pdf",
  "templates/pestel-analysis-template.html",
  "resources/downloads/strategic-planning/ConsuTrain_PESTEL_Analysis_Template_AR.docx",
  "resources/downloads/strategic-planning/ConsuTrain_PESTEL_Analysis_Template_AR.pdf",
  "/templates/strategic-objective-card.html",
  "/resources/downloads/strategic-planning/ConsuTrain_Strategic_Objective_Card_AR.docx",
  "/resources/downloads/strategic-planning/ConsuTrain_Strategic_Objective_Card_AR.pdf",
  "/templates/strategic-initiatives-register.html",
  "/resources/downloads/strategic-planning/ConsuTrain_Strategic_Initiatives_Register_AR.docx",
  "/resources/downloads/strategic-planning/ConsuTrain_Strategic_Initiatives_Register_AR.pdf",
  "/templates/strategic-plan-review-checklist.html",
  "/resources/downloads/strategic-planning/ConsuTrain_Strategic_Plan_Review_Checklist_AR.docx",
  "/resources/downloads/strategic-planning/ConsuTrain_Strategic_Plan_Review_Checklist_AR.pdf",
  "/templates/objectives-to-actions-template.html",
  "/resources/downloads/operational-plans/ConsuTrain_Objectives_To_Actions_Template_AR.docx",
  "/resources/downloads/operational-plans/ConsuTrain_Objectives_To_Actions_Template_AR.pdf",
  'templates/risk-management-system-review-checklist.html',
  'resources/downloads/risk-management/ConsuTrain_Risk_Management_System_Review_Checklist_AR.docx',
  'resources/downloads/risk-management/ConsuTrain_Risk_Management_System_Review_Checklist_AR.pdf',
  "templates/project-idea-description-template.html",
  "resources/downloads/feasibility-studies/ConsuTrain_Project_Idea_Description_Template_AR.docx",
  "resources/downloads/feasibility-studies/ConsuTrain_Project_Idea_Description_Template_AR.pdf",
  "templates/market-analysis-template.html",
  "resources/downloads/feasibility-studies/ConsuTrain_Market_Analysis_Template_AR.docx",
  "resources/downloads/feasibility-studies/ConsuTrain_Market_Analysis_Template_AR.pdf",
  './templates/initial-cost-estimate-template.html',
  './resources/downloads/feasibility-studies/ConsuTrain_Initial_Cost_Estimate_Template_AR.docx',
  './resources/downloads/feasibility-studies/ConsuTrain_Initial_Cost_Estimate_Template_AR.pdf',
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => ![STATIC_CACHE, RUNTIME_CACHE].includes(key)).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === "navigate") { event.respondWith(networkFirstPage(request)); return; }
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
