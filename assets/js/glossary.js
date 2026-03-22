/*
  =========================================================
  FILE: assets/js/glossary.js
  PURPOSE:
  هذا الملف مسؤول عن منطق صفحة القاموس الإداري.

  MAIN RESPONSIBILITIES:
  - تحميل البيانات من glossary.json
  - تطبيع شكل البيانات
  - عرض المصطلحات داخل الصفحة
  - تنفيذ البحث الحي
  - تحديث عداد النتائج
  - نسخ المصطلح أو التعريف
  - تشغيل زر العودة للأعلى

  IMPORTANT:
  الملف مخصص حاليًا لصفحة:
  learn/glossary.html
  =========================================================
*/

/* =========================================================
   1) GLOBAL STATE
   متغيرات عامة لتخزين البيانات
   ========================================================= */
let glossaryData = [];
let filteredGlossaryData = [];

/* =========================================================
   2) ELEMENT REFERENCES
   ربط العناصر المستخدمة في الصفحة
   ========================================================= */
const glossaryList = document.getElementById("glossaryList");
const glossarySearch = document.getElementById("glossarySearch");
const glossaryCount = document.getElementById("glossaryCount");
const glossaryResetBtn = document.getElementById("glossaryResetBtn");
const glossaryEmptyState = document.getElementById("glossaryEmptyState");
const backToTopBtn = document.getElementById("backToTopBtn");

/* =========================================================
   3) HELPER: normalizeGlossaryItem
   PURPOSE:
   توحيد شكل كل عنصر قادم من glossary.json

   الهدف:
   بعض الملفات قد تستعمل مفاتيح مختلفة مثل:
   - term
   - word
   - title
   - ar
   - definition
   - def
   - meaning

   لذلك نقوم بتوحيد البنية إلى:
   {
     term: "...",
     definition: "..."
   }
   ========================================================= */
/* =========================================================
   3) HELPER: normalizeGlossaryItem
   PURPOSE:
   توحيد شكل كل عنصر قادم من glossary.json

   CURRENT DATA FILE SHAPE:
   الملف الحالي يستعمل مفاتيح مثل:
   - term_ar
   - term_en
   - definition

   لذلك نلتقطها هنا بشكل صريح، مع إبقاء دعم أي صيغ أخرى
   محتملة مستقبلًا.
   ========================================================= */
function normalizeGlossaryItem(item) {
  const term =
    item.term_ar ||
    item.term ||
    item.word ||
    item.title ||
    item.name ||
    item.ar ||
    "";

  const termEn =
    item.term_en ||
    item.en ||
    item.english ||
    "";

  const definition =
    item.definition ||
    item.def ||
    item.meaning ||
    item.description ||
    item.explanation ||
    "";

  return {
    term: String(term).trim(),
    termEn: String(termEn).trim(),
    definition: String(definition).trim()
  };
}

/* =========================================================
   4) HELPER: escapeHtml
   PURPOSE:
   حماية العرض من أي نص يحتوي على رموز HTML
   ========================================================= */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/* =========================================================
   5) HELPER: copyText
   PURPOSE:
   نسخ نص إلى الحافظة مع إشعار بسيط
   ========================================================= */
async function copyText(text, successMessage = "تم النسخ بنجاح") {
  try {
    await navigator.clipboard.writeText(text);
    alert(successMessage);
  } catch (error) {
    console.error("Copy failed:", error);
    alert("تعذر النسخ من المتصفح الحالي.");
  }
}


/* =========================================================
   6) FUNCTION: buildGlossaryCard
   PURPOSE:
   إنشاء بطاقة HTML لمصطلح واحد
   مع دعم الاسم الإنجليزي إذا وجد
   ========================================================= */
function buildGlossaryCard(item) {
  const term = escapeHtml(item.term);
  const termEn = escapeHtml(item.termEn || "");
  const definition = escapeHtml(item.definition);

  return `
    <article class="section-card glossary-item">
      <div class="glossary-item-head">
        <div class="glossary-item-title-wrap">
          <h3>${term}</h3>
          ${termEn ? `<div class="glossary-item-en">${termEn}</div>` : ""}
        </div>

        <div class="glossary-item-actions">
          <button
            class="mini-btn"
            type="button"
            data-copy-type="term"
            data-copy-value="${term}"
            aria-label="نسخ المصطلح"
          >
            نسخ المصطلح
          </button>

          <button
            class="mini-btn"
            type="button"
            data-copy-type="definition"
            data-copy-value="${definition}"
            aria-label="نسخ التعريف"
          >
            نسخ التعريف
          </button>
        </div>
      </div>

      <p>${definition}</p>
    </article>
  `;
}

/* =========================================================
   7) FUNCTION: updateGlossaryCount
   PURPOSE:
   تحديث النص الذي يعرض عدد النتائج الحالية
   ========================================================= */
function updateGlossaryCount() {
  const count = filteredGlossaryData.length;

  if (count === 0) {
    glossaryCount.textContent = "لم يتم العثور على نتائج.";
  } else if (count === 1) {
    glossaryCount.textContent = "تم العثور على مصطلح واحد.";
  } else {
    glossaryCount.textContent = `عدد المصطلحات المعروضة: ${count}`;
  }
}

/* =========================================================
   8) FUNCTION: renderGlossary
   PURPOSE:
   عرض النتائج الحالية داخل الصفحة
   ========================================================= */
function renderGlossary() {
  if (!glossaryList) return;

  if (!filteredGlossaryData.length) {
    glossaryList.innerHTML = "";
    if (glossaryEmptyState) glossaryEmptyState.hidden = false;
    updateGlossaryCount();
    return;
  }

  if (glossaryEmptyState) glossaryEmptyState.hidden = true;

  glossaryList.innerHTML = filteredGlossaryData
    .map(buildGlossaryCard)
    .join("");

  updateGlossaryCount();
}

/* =========================================================
   9) FUNCTION: filterGlossary
   PURPOSE:
   تصفية المصطلحات حسب النص الذي يكتبه المستخدم
   ========================================================= */
function filterGlossary(query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    filteredGlossaryData = [...glossaryData];
    renderGlossary();
    return;
  }

  filteredGlossaryData = glossaryData.filter((item) => {
  const termText = (item.term || "").toLowerCase();
  const termEnText = (item.termEn || "").toLowerCase();
  const definitionText = (item.definition || "").toLowerCase();

  return (
    termText.includes(normalizedQuery) ||
    termEnText.includes(normalizedQuery) ||
    definitionText.includes(normalizedQuery)
  );
});
  renderGlossary();
}

/* =========================================================
   10) FUNCTION: injectStructuredData
   PURPOSE:
   إضافة Schema.org من نوع DefinedTermSet
   لتحسين البنية المنظمة لمحركات البحث
   ========================================================= */
function injectStructuredData() {
  const structuredItems = glossaryData.slice(0, 50).map((item) => ({
    "@type": "DefinedTerm",
    "name": item.term,
    "description": item.definition
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "name": "القاموس الإداري - ConsuTrain",
    "description": "مجموعة من المصطلحات الإدارية الأساسية مع تعريفات مبسطة.",
    "hasDefinedTerm": structuredItems
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema, null, 2);
  document.head.appendChild(script);
}

/* =========================================================
   11) FUNCTION: loadGlossaryData
   PURPOSE:
   تحميل البيانات من ملف JSON الحقيقي
   ========================================================= */
async function loadGlossaryData() {
  try {
    glossaryCount.textContent = "جاري تحميل المصطلحات...";

    const response = await fetch("../assets/data/glossary.json");
    if (!response.ok) {
      throw new Error("Failed to load glossary.json");
    }

    const rawData = await response.json();

    /*
      بعض الملفات قد تكون:
      - مصفوفة مباشرة []
      - أو كائنًا يحتوي على glossary أو terms أو items
    */
    const sourceArray =
      Array.isArray(rawData) ? rawData :
      Array.isArray(rawData.glossary) ? rawData.glossary :
      Array.isArray(rawData.terms) ? rawData.terms :
      Array.isArray(rawData.items) ? rawData.items :
      [];

    glossaryData = sourceArray
      .map(normalizeGlossaryItem)
      .filter((item) => item.term && item.definition)
      .sort((a, b) => a.term.localeCompare(b.term, "ar"));

    filteredGlossaryData = [...glossaryData];

    renderGlossary();
    injectStructuredData();

  } catch (error) {
    console.error("Glossary loading error:", error);

    if (glossaryList) {
      glossaryList.innerHTML = `
        <div class="section-card glossary-error">
          <h3>تعذر تحميل القاموس</h3>
          <p>يرجى التحقق من وجود الملف ومسار البيانات ثم إعادة المحاولة.</p>
        </div>
      `;
    }

    if (glossaryCount) {
      glossaryCount.textContent = "حدث خطأ أثناء تحميل البيانات.";
    }
  }
}

/* =========================================================
   12) EVENT: Search input
   PURPOSE:
   تنفيذ البحث الحي عند الكتابة
   ========================================================= */
if (glossarySearch) {
  glossarySearch.addEventListener("input", () => {
    filterGlossary(glossarySearch.value);
  });
}

/* =========================================================
   13) EVENT: Reset button
   PURPOSE:
   إعادة ضبط البحث وعرض جميع المصطلحات
   ========================================================= */
if (glossaryResetBtn) {
  glossaryResetBtn.addEventListener("click", () => {
    glossarySearch.value = "";
    filteredGlossaryData = [...glossaryData];
    renderGlossary();
    glossarySearch.focus();
  });
}

/* =========================================================
   14) EVENT: Delegated click for copy buttons
   PURPOSE:
   التعامل مع أزرار النسخ داخل بطاقات المصطلحات
   ========================================================= */
if (glossaryList) {
  glossaryList.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-copy-value]");
    if (!btn) return;

    const value = btn.dataset.copyValue || "";
    const type = btn.dataset.copyType || "";

    if (type === "term") {
      copyText(value, "تم نسخ المصطلح.");
    } else {
      copyText(value, "تم نسخ التعريف.");
    }
  });
}

/* =========================================================
   15) BACK TO TOP BUTTON
   PURPOSE:
   إظهار زر العودة للأعلى عند النزول في الصفحة
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
   16) INITIALIZATION
   PURPOSE:
   بدء تحميل البيانات عند فتح الصفحة
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  loadGlossaryData();
});