/*
  =========================================================
  FILE: assets/js/articles-page.js
  PURPOSE:
  هذا الملف مسؤول عن صفحة learn/articles.html

  RESPONSIBILITIES:
  - تحميل ملف articles.json
  - عرض المقالات كبطاقات
  - تنفيذ البحث الحي
  - توليد الوسوم
  - التصفية حسب الوسم
  - تحديث عداد النتائج
  - تشغيل زر العودة للأعلى
  =========================================================
*/

/* =========================================================
   1) STATE
   ========================================================= */
let articlesData = [];
let filteredArticles = [];
let activeTag = "";

/* =========================================================
   2) ELEMENT REFERENCES
   ========================================================= */
const articlesList = document.getElementById("articlesList");
const articlesSearch = document.getElementById("articlesSearch");
const articlesCount = document.getElementById("articlesCount");
const articlesResetBtn = document.getElementById("articlesResetBtn");
const articlesEmptyState = document.getElementById("articlesEmptyState");
const articlesTags = document.getElementById("articlesTags");
const backToTopBtn = document.getElementById("backToTopBtn");

/* =========================================================
   3) HELPERS
   ========================================================= */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

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

/* =========================================================
   4) BUILD ARTICLE CARD
   ========================================================= */
function buildArticleCard(article) {
  const title = escapeHtml(article.title || "");
  const excerpt = escapeHtml(article.excerpt || "");
  const date = formatArabicDate(article.date || "");
  const id = encodeURIComponent(article.id || "");

  const tagsHtml = (article.tags || [])
    .map(tag => `<span class="article-tag">${escapeHtml(tag)}</span>`)
    .join("");

  return `
    <article class="section-card article-card">
      <div class="article-meta-row">
        <span class="article-date">${date}</span>
      </div>

      <h3>${title}</h3>
      <p>${excerpt}</p>

      <div class="article-tags">
        ${tagsHtml}
      </div>

      <a class="card-link" href="article.html?id=${id}">قراءة المقال</a>
    </article>
  `;
}

/* =========================================================
   5) COUNT UPDATE
   ========================================================= */
function updateArticlesCount() {
  const count = filteredArticles.length;

  if (count === 0) {
    articlesCount.textContent = "لم يتم العثور على مقالات.";
  } else if (count === 1) {
    articlesCount.textContent = "تم العثور على مقال واحد.";
  } else {
    articlesCount.textContent = `عدد المقالات المعروضة: ${count}`;
  }
}

/* =========================================================
   6) RENDER ARTICLES
   ========================================================= */
function renderArticles() {
  if (!articlesList) return;

  if (!filteredArticles.length) {
    articlesList.innerHTML = "";
    if (articlesEmptyState) articlesEmptyState.hidden = false;
    updateArticlesCount();
    return;
  }

  if (articlesEmptyState) articlesEmptyState.hidden = true;

  articlesList.innerHTML = filteredArticles
    .map(buildArticleCard)
    .join("");

  updateArticlesCount();
}

/* =========================================================
   7) FILTER LOGIC
   ========================================================= */
function applyFilters() {
  const query = (articlesSearch?.value || "").trim().toLowerCase();

  filteredArticles = articlesData.filter((article) => {
    const title = (article.title || "").toLowerCase();
    const excerpt = (article.excerpt || "").toLowerCase();
    const tags = (article.tags || []).join(" ").toLowerCase();

    const matchesQuery =
      !query ||
      title.includes(query) ||
      excerpt.includes(query) ||
      tags.includes(query);

    const matchesTag =
      !activeTag ||
      (article.tags || []).includes(activeTag);

    return matchesQuery && matchesTag;
  });

  renderArticles();
}

/* =========================================================
   8) TAGS RENDER
   ========================================================= */
function renderTagsBar() {
  if (!articlesTags) return;

  const tagsSet = new Set();

  articlesData.forEach((article) => {
    (article.tags || []).forEach((tag) => tagsSet.add(tag));
  });

  const allTags = Array.from(tagsSet).sort((a, b) => a.localeCompare(b, "ar"));

  articlesTags.innerHTML = `
    <button class="tag-chip ${activeTag === "" ? "active" : ""}" type="button" data-tag="">
      الكل
    </button>
    ${allTags.map(tag => `
      <button class="tag-chip ${activeTag === tag ? "active" : ""}" type="button" data-tag="${escapeHtml(tag)}">
        ${escapeHtml(tag)}
      </button>
    `).join("")}
  `;
}

/* =========================================================
   9) LOAD DATA
   ========================================================= */
async function loadArticlesData() {
  try {
    articlesCount.textContent = "جاري تحميل المقالات...";

    const response = await fetch("../assets/data/articles.json");
    if (!response.ok) {
      throw new Error("Failed to load articles.json");
    }

    const rawData = await response.json();

    const sourceArray =
      Array.isArray(rawData) ? rawData :
      Array.isArray(rawData.articles) ? rawData.articles :
      [];

    articlesData = sourceArray.map((article) => ({
      id: article.id || "",
      title: article.title || "",
      excerpt: article.excerpt || "",
      date: article.date || "",
      tags: Array.isArray(article.tags) ? article.tags : [],
      content: Array.isArray(article.content) ? article.content : []
    }));

    filteredArticles = [...articlesData];

    renderTagsBar();
    renderArticles();

  } catch (error) {
    console.error("Articles loading error:", error);

    if (articlesList) {
      articlesList.innerHTML = `
        <div class="section-card glossary-error">
          <h3>تعذر تحميل المقالات</h3>
          <p>يرجى التحقق من ملف البيانات ومساره ثم إعادة المحاولة.</p>
        </div>
      `;
    }

    if (articlesCount) {
      articlesCount.textContent = "حدث خطأ أثناء تحميل البيانات.";
    }
  }
}

/* =========================================================
   10) EVENTS
   ========================================================= */
if (articlesSearch) {
  articlesSearch.addEventListener("input", applyFilters);
}

if (articlesResetBtn) {
  articlesResetBtn.addEventListener("click", () => {
    if (articlesSearch) articlesSearch.value = "";
    activeTag = "";
    renderTagsBar();
    applyFilters();
    articlesSearch?.focus();
  });
}

if (articlesTags) {
  articlesTags.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-tag]");
    if (!btn) return;

    activeTag = btn.dataset.tag || "";
    renderTagsBar();
    applyFilters();
  });
}

/* =========================================================
   11) BACK TO TOP
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
   12) INIT
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  loadArticlesData();
});