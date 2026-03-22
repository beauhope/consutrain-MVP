/*
  =========================================================
  FILE: assets/js/article-page.js
  PURPOSE:
  هذا الملف مسؤول عن صفحة learn/article.html

  RESPONSIBILITIES:
  - قراءة id من الرابط
  - تحميل articles.json
  - إيجاد المقال المطلوب
  - عرض بيانات المقال داخل الصفحة
  - عرض رسالة خطأ مناسبة إذا لم يوجد المقال
  - تشغيل زر العودة للأعلى
  =========================================================
*/

/* =========================================================
   1) ELEMENT REFERENCES
   ========================================================= */
const articleContainer = document.getElementById("articleContainer");
const backToTopBtn = document.getElementById("backToTopBtn");

/* =========================================================
   2) HELPERS
   ========================================================= */

/*
  حماية النصوص من HTML غير المرغوب
*/
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/*
  تنسيق التاريخ بصيغة عربية
*/
function formatArabicDate(dateString) {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(date);
  } catch {
    return dateString || "";
  }
}

/*
  قراءة id من الرابط
  مثال:
  article.html?id=ai-in-business
*/
function getArticleIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || "";
}

/* =========================================================
   3) BUILD ARTICLE HTML
   ========================================================= */
function buildArticleHtml(article) {
  const title = escapeHtml(article.title || "");
  const excerpt = escapeHtml(article.excerpt || "");
  const date = formatArabicDate(article.date || "");

  const tagsHtml = (article.tags || [])
    .map(tag => `<span class="article-tag">${escapeHtml(tag)}</span>`)
    .join("");

  /*
    NOTE:
    content في ملف JSON عبارة عن مصفوفة فقرات.
    بعض الفقرات تحتوي على HTML بسيط مثل <strong>.
    لذلك سنعرضها كما هي مباشرة بعد فحص كونها نصًا.
  */
  const contentHtml = (article.content || [])
    .map(paragraph => `<p>${paragraph}</p>`)
    .join("");

  return `
    <article class="article-full section-card">
      <div class="article-full-top">
        <a class="back-link" href="articles.html">← العودة إلى المقالات</a>
      </div>

      <header class="article-full-header">
        <span class="eyebrow">مقال مهني</span>
        <h1>${title}</h1>
        <p class="article-full-excerpt">${excerpt}</p>

        <div class="article-full-meta">
          <span class="article-date">${date}</span>
        </div>

        <div class="article-tags">
          ${tagsHtml}
        </div>
      </header>

      <section class="article-full-content">
        ${contentHtml}
      </section>
    </article>
  `;
}

/* =========================================================
   4) EMPTY / ERROR STATES
   ========================================================= */
function renderNotFound() {
  if (!articleContainer) return;

  articleContainer.innerHTML = `
    <div class="section-card article-error-state">
      <h2>المقال غير موجود</h2>
      <p>تعذر العثور على المقال المطلوب. قد يكون الرابط غير صحيح أو أن المقال غير متاح حاليًا.</p>
      <a class="btn btn-primary" href="articles.html">العودة إلى قائمة المقالات</a>
    </div>
  `;
}

function renderLoadError() {
  if (!articleContainer) return;

  articleContainer.innerHTML = `
    <div class="section-card article-error-state">
      <h2>تعذر تحميل المقال</h2>
      <p>حدث خطأ أثناء قراءة بيانات المقالات. يرجى التحقق من ملف البيانات أو إعادة المحاولة لاحقًا.</p>
      <a class="btn btn-primary" href="articles.html">العودة إلى قائمة المقالات</a>
    </div>
  `;
}

/* =========================================================
   5) MAIN LOGIC
   ========================================================= */
async function loadSingleArticle() {
  const articleId = getArticleIdFromUrl();

  if (!articleId) {
    renderNotFound();
    return;
  }

  try {
    const response = await fetch("../assets/data/articles.json");

    if (!response.ok) {
      throw new Error("Failed to load articles.json");
    }

    const rawData = await response.json();

    const sourceArray =
      Array.isArray(rawData) ? rawData :
      Array.isArray(rawData.articles) ? rawData.articles :
      [];

    const article = sourceArray.find(item => item.id === articleId);

    if (!article) {
      renderNotFound();
      return;
    }

    /*
      تحديث عنوان الصفحة ديناميكيًا
    */
    document.title = `${article.title} | ConsuTrain`;

    /*
      عرض المقال
    */
    articleContainer.innerHTML = buildArticleHtml(article);

  } catch (error) {
    console.error("Single article loading error:", error);
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
  loadSingleArticle();
});