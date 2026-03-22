/*
  =========================================================
  FILE: assets/js/soft-skill-page.js
  PURPOSE:
  منطق صفحة learn/soft-skill.html

  RESPONSIBILITIES:
  - قراءة id من الرابط
  - تحميل soft-skills.json
  - إيجاد المهارة المطلوبة
  - عرضها داخل الصفحة
  - إظهار رسالة مناسبة إذا لم توجد
  - تشغيل زر العودة للأعلى
  =========================================================
*/

/* =========================================================
   1) ELEMENT REFERENCES
   ========================================================= */
const softSkillContainer = document.getElementById("softSkillContainer");
const backToTopBtn = document.getElementById("backToTopBtn");

/* =========================================================
   2) HELPERS
   ========================================================= */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function getSkillIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || "";
}

function buildListHtml(items) {
  if (!Array.isArray(items) || !items.length) return "";
  return `
    <ul class="soft-detail-list">
      ${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

/* =========================================================
   3) BUILD PAGE HTML
   ========================================================= */
function buildSoftSkillHtml(skill) {
  const title = escapeHtml(skill.title || "");
  const category = escapeHtml(skill.category || "");
  const summary = escapeHtml(skill.summary || "");
  const importance = escapeHtml(skill.importance || "");
  const practice = escapeHtml(skill.practice || "");

  const examplesHtml = buildListHtml(skill.examples || []);
  const tipsHtml = buildListHtml(skill.tips || []);
  const indicatorsHtml = buildListHtml(skill.indicators || []);

  return `
    <article class="article-full section-card soft-detail-page">
      <div class="article-full-top">
        <a class="back-link" href="soft-skills.html">← العودة إلى المهارات الناعمة</a>
      </div>

      <header class="article-full-header">
        <span class="eyebrow">${category}</span>
        <h1>${title}</h1>
        <p class="article-full-excerpt">${summary}</p>
      </header>

      <section class="soft-detail-section">
        <h2>ما المقصود بهذه المهارة؟</h2>
        <p>${summary}</p>
      </section>

      <section class="soft-detail-section">
        <h2>لماذا تعد مهمة في بيئة العمل؟</h2>
        <p>${importance}</p>
      </section>

      <section class="soft-detail-section">
        <h2>كيف تظهر هذه المهارة عمليًا؟</h2>
        ${examplesHtml || "<p>سيتم إضافة أمثلة عملية لاحقًا.</p>"}
      </section>

      <section class="soft-detail-section">
        <h2>كيف يمكن تطوير هذه المهارة؟</h2>
        <p>${practice}</p>
        ${tipsHtml}
      </section>

      <section class="soft-detail-section">
        <h2>مؤشرات تدل على وجود المهارة</h2>
        ${indicatorsHtml || "<p>سيتم إضافة مؤشرات أكثر تفصيلًا لاحقًا.</p>"}
      </section>
    </article>
  `;
}

/* =========================================================
   4) ERROR STATES
   ========================================================= */
function renderNotFound() {
  if (!softSkillContainer) return;

  softSkillContainer.innerHTML = `
    <div class="section-card article-error-state">
      <h2>المهارة غير موجودة</h2>
      <p>تعذر العثور على المهارة المطلوبة. قد يكون الرابط غير صحيح أو أن الصفحة لم تُجهّز بعد.</p>
      <a class="btn btn-primary" href="soft-skills.html">العودة إلى صفحة المهارات الناعمة</a>
    </div>
  `;
}

function renderLoadError() {
  if (!softSkillContainer) return;

  softSkillContainer.innerHTML = `
    <div class="section-card article-error-state">
      <h2>تعذر تحميل بيانات المهارة</h2>
      <p>حدث خطأ أثناء قراءة ملف البيانات. يرجى التحقق من الملف أو إعادة المحاولة لاحقًا.</p>
      <a class="btn btn-primary" href="soft-skills.html">العودة إلى صفحة المهارات الناعمة</a>
    </div>
  `;
}

/* =========================================================
   5) MAIN LOGIC
   ========================================================= */
async function loadSoftSkill() {
  const skillId = getSkillIdFromUrl();

  if (!skillId) {
    renderNotFound();
    return;
  }

  try {
    const response = await fetch("../assets/data/soft-skills.json");
    if (!response.ok) {
      throw new Error("Failed to load soft-skills.json");
    }

    const rawData = await response.json();

    const sourceArray =
      Array.isArray(rawData) ? rawData :
      Array.isArray(rawData.skills) ? rawData.skills :
      [];

    const skill = sourceArray.find(item => item.id === skillId);

    if (!skill) {
      renderNotFound();
      return;
    }

    document.title = `${skill.title} | ConsuTrain`;

    softSkillContainer.innerHTML = buildSoftSkillHtml(skill);

  } catch (error) {
    console.error("Soft skill loading error:", error);
    renderLoadError();
  }
}

/* =========================================================
   6) BACK TO TOP
   ========================================================= */
window.addEventListener("scroll", () => {
  if (!backToTopBtn) return;

  if (window.scrollY > 300) {
    backToTopBtn.classList.add("show");
  } else {
    backToTopBtn.classList.remove("show");
  }
});

if (backToTopBtn) {
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/* =========================================================
   7) INIT
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  loadSoftSkill();
});