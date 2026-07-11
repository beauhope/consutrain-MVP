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



const STATIC_CACHE = "consutrain-v20260711-ar-fr-parity";
const RUNTIME_CACHE = "consutrain-runtime-v20260711-ar-fr-parity";

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

  "./fr/index.html",
  "./fr/quote-request.html",
  "./fr/services.html",
  "./fr/services/consultation-form.html",
  "./fr/courses/strategic-planning.html",
  "./fr/courses/agile-project-management.html",
  "./fr/courses/balanced-scorecard-performance-management.html",
  "./fr/courses/integrated-management-system-ims.html",
  "./fr/courses/iso-9001-internal-auditor.html",
  "./fr/courses/institutional-excellence.html",
  "./fr/courses/health-safety-environment.html",
  "./fr/courses/corporate-governance.html",
  "./fr/courses/startup-creation-structuring.html",
  "./fr/courses/practical-workshops.html",
  "./fr/courses/professional-internal-communication.html",
  "./templates/operational-plan-template.html",
  "./resources/downloads/operational-plans/ConsuTrain_Free_Operational_Plan_Template_AR.docx",
  "./resources/downloads/operational-plans/ConsuTrain_Free_Operational_Plan_Template_AR.pdf",
  "./templates/operational-plan-checklist.html",
  "./templates/simple-risk-register.html",
  "./resources/downloads/operational-plans/ConsuTrain_Operational_Plan_Readiness_Checklist_AR.docx",
  "./resources/downloads/operational-plans/ConsuTrain_Operational_Plan_Readiness_Checklist_AR.pdf",
  "./resources/downloads/risk-management/ConsuTrain_Simple_Risk_Register_AR.docx",
  "./resources/downloads/risk-management/ConsuTrain_Simple_Risk_Register_AR.pdf",
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
  "./learn/free-certificate-training/blue-ocean-strategy-fundamentals/index.html",
  "./learn/free-certificate-training/blue-ocean-strategy-fundamentals/final-assessment.html",
  "./learn/free-certificate-training/blue-ocean-strategy-fundamentals/certificate-request.html",
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
  "./partials/fr-header.html",
  "./partials/fr-footer.html",

  "./assets/css/style.css",

  "./assets/images/consutrain-logo-horizontal.png",
  "./assets/images/consutrain-logo-mark.png",
  "./assets/images/consutrain-banner.png",
  "./assets/images/articles/ai-introduction.svg",
  "./assets/images/articles/ai-sense.svg",
  "./assets/images/articles/ai-vuca.svg",

  "./assets/js/includes.js",
  "./assets/js/free-certificate-training.js",
  "./assets/js/free-certificate-training-blue-ocean.js",
  "./assets/js/free-certificate-training-blue-ocean-fr.js",
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

  "./resources/index.html",
  "./courses/index.html",
  "./courses/objectives-management.html",
  "./courses/mor-foundation.html",
  "./feedback.html",
  "./fr/about.html",
  "./fr/contact.html",
  "./fr/tools.html",
  "./fr/tools/smart-goal-generator.html",
  "./fr/tools/feasibility/indexFeasibility.html",
  "./fr/tools/tool-templates.html",
  "./fr/tools/management-flash.html",
  "./fr/tools/calculators.html",
  "./fr/tools/mytodo.html",
  "./fr/tools/crm.html",
  "./fr/tools/invoice.html",
  "./fr/tools/timer.html",
  "./fr/learn.html",
  "./fr/learn/articles.html",
  "./fr/learn/learning-paths.html",
  "./fr/learn/glossary.html",
  "./fr/learn/management-tech-radar.html",
  "./fr/learn/free-certificate-training.html",
  "./fr/learn/free-certificate-training/blue-ocean-strategy-fundamentals/index.html",
  "./fr/learn/free-certificate-training/blue-ocean-strategy-fundamentals/final-assessment.html",
  "./fr/learn/free-certificate-training/blue-ocean-strategy-fundamentals/certificate-request.html",
  "./fr/learn/management-skills.html",
  "./fr/learn/ai.html",
  "./fr/learn/ai-prompts.html",
  "./fr/learn/digitization-guide.html",
  "./fr/learn/futures-and-scenarios.html",
  "./fr/resources/index.html",
  "./fr/templates/swot-analysis-template.html",
  "./fr/templates/pestel-analysis-template.html",
  "./fr/templates/operational-plan-template.html",
  "./fr/templates/kpi-performance-card.html",
  "./fr/templates/simple-risk-register.html",
  "./resources/downloads/fr/strategic-planning/ConsuTrain_SWOT_Analysis_Template_FR.docx",
  "./resources/downloads/fr/strategic-planning/ConsuTrain_PESTEL_Analysis_Template_FR.docx",
  "./resources/downloads/fr/operational-plans/ConsuTrain_Free_Operational_Plan_Template_FR.docx",
  "./resources/downloads/fr/performance-management/ConsuTrain_KPI_Performance_Card_FR.docx",
  "./resources/downloads/fr/risk-management/ConsuTrain_Simple_Risk_Register_FR.docx",
  "./fr/templates/iso9001-readiness-checklist.html",
  "./fr/templates/pre-feasibility-checklist.html",
  "./fr/templates/project-charter.html",
  "./fr/templates/process-card.html",
  "./fr/templates/sop-template.html",
  "./fr/templates/initial-cost-estimate-template.html",
  "./fr/templates/market-analysis-template.html",
  "./fr/templates/project-idea-description-template.html",
  "./fr/templates/quality-policy-template.html",
  "./fr/templates/quality-objectives-kpis.html",
  "./fr/templates/internal-audit-plan.html",
  "./fr/templates/iso9001-internal-audit-checklist.html",
  "./fr/templates/corrective-action-template.html",
  "./fr/templates/corrective-improvement-actions-register.html",
  "./fr/templates/document-records-control-register.html",
  "./fr/templates/management-review-report.html",
  "./fr/templates/nonconformity-register.html",
  "./fr/templates/nonconformity-report-template.html",
  "./fr/templates/complaints-customer-satisfaction-register.html",
  "./fr/templates/process-improvement-plan.html",
  "./fr/templates/operational-plan-checklist.html",
  "./fr/templates/objectives-to-actions-template.html",
  "./fr/templates/operational-plan-follow-up-report.html",
  "./fr/templates/project-communication-plan.html",
  "./fr/templates/meeting-minutes-decision-tracking.html",
  "./fr/templates/stakeholder-register.html",
  "./fr/templates/project-task-tracker.html",
  "./fr/templates/project-status-report.html",
  "./fr/templates/risk-assessment-matrix.html",
  "./fr/templates/risk-treatment-plan.html",
  "./fr/templates/risk-management-system-review-checklist.html",
  "./fr/templates/procedure-manual-review-checklist.html",
  "./resources/downloads/fr/feasibility-studies/ConsuTrain_Pre_Feasibility_Checklist_FR.docx",
  "./resources/downloads/fr/feasibility-studies/ConsuTrain_Initial_Cost_Estimate_Template_FR.docx",
  "./resources/downloads/fr/feasibility-studies/ConsuTrain_Market_Analysis_Template_FR.docx",
  "./resources/downloads/fr/feasibility-studies/ConsuTrain_Project_Idea_Description_Template_FR.docx",
  "./resources/downloads/fr/iso-quality/ConsuTrain_Quality_Policy_Template_FR.docx",
  "./resources/downloads/fr/iso-quality/ConsuTrain_Quality_Objectives_KPIs_FR.docx",
  "./resources/downloads/fr/iso-quality/ConsuTrain_Internal_Audit_Plan_FR.docx",
  "./resources/downloads/fr/iso-quality/ConsuTrain_ISO9001_Internal_Audit_Checklist_FR.docx",
  "./resources/downloads/fr/iso-quality/ConsuTrain_Corrective_Action_Template_FR.docx",
  "./resources/downloads/fr/iso-quality/ConsuTrain_Corrective_Improvement_Actions_Register_FR.docx",
  "./resources/downloads/fr/iso-quality/ConsuTrain_Document_Records_Control_Register_FR.docx",
  "./resources/downloads/fr/iso-quality/ConsuTrain_Management_Review_Report_FR.docx",
  "./resources/downloads/fr/iso-quality/ConsuTrain_Nonconformity_Register_FR.docx",
  "./resources/downloads/fr/iso-quality/ConsuTrain_Nonconformity_Report_Template_FR.docx",
  "./resources/downloads/fr/iso-quality/ConsuTrain_Complaints_Customer_Satisfaction_Register_FR.docx",
  "./resources/downloads/fr/iso-quality/ConsuTrain_Process_Improvement_Plan_FR.docx",
  "./resources/downloads/fr/operational-plans/ConsuTrain_Operational_Plan_Readiness_Checklist_FR.docx",
  "./resources/downloads/fr/operational-plans/ConsuTrain_Objectives_To_Actions_Template_FR.docx",
  "./resources/downloads/fr/operational-plans/ConsuTrain_Operational_Plan_Follow_Up_Report_FR.docx",
  "./resources/downloads/fr/project-management/ConsuTrain_Project_Charter_FR.docx",
  "./resources/downloads/fr/project-management/ConsuTrain_Project_Communication_Plan_FR.docx",
  "./resources/downloads/fr/project-management/ConsuTrain_Meeting_Minutes_Decision_Tracking_FR.docx",
  "./resources/downloads/fr/project-management/ConsuTrain_Stakeholder_Register_FR.docx",
  "./resources/downloads/fr/project-management/ConsuTrain_Project_Task_Tracker_FR.docx",
  "./resources/downloads/fr/project-management/ConsuTrain_Project_Status_Report_FR.docx",
  "./resources/downloads/fr/risk-management/ConsuTrain_Risk_Assessment_Matrix_FR.docx",
  "./resources/downloads/fr/risk-management/ConsuTrain_Risk_Treatment_Plan_FR.docx",
  "./resources/downloads/fr/risk-management/ConsuTrain_Risk_Management_System_Review_Checklist_FR.docx",
  "./resources/downloads/fr/sop-procedures/ConsuTrain_Process_Card_FR.docx",
  "./resources/downloads/fr/sop-procedures/ConsuTrain_SOP_Template_FR.docx",
  "./resources/downloads/fr/sop-procedures/ConsuTrain_Procedure_Manual_Review_Checklist_FR.docx",
  "./fr/courses/index.html",
  "./fr/services/strategic-planning.html",
  "./fr/services/feasibility-studies.html",
  "./fr/services/iso-consulting.html",
  "./fr/services/risk-management.html",
  "./fr/services/project-management.html",
  "./fr/services/sop-operational-manuals.html",
  "./fr/services/integrated-management-system.html",
  "./fr/services/digital-transformation-roadmap.html",
  "./fr/services/organizational-structures.html",
  "./fr/services/operational-plans.html",
  "./fr/services/organizational-performance-management.html",
  "./fr/services/excellence-awards.html",
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
    path.endsWith("/assets/js/free-certificate-training.js") ||
    path.endsWith("/assets/js/free-certificate-training-blue-ocean.js") ||
    path.endsWith("/assets/js/free-certificate-training-blue-ocean-fr.js") ||
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
