/*
  =========================================================
  FILE: assets/js/articles-page.js
  PURPOSE:
  صفحة مكتبة المعرفة الإدارية ضمن قسم التعلّم.

  RESPONSIBILITIES:
  - تحميل ملف articles.json
  - عرض مواد المعرفة كبطاقات أو جدول
  - تنفيذ البحث الحي
  - توليد قائمة الموضوعات والكلمات المفتاحية
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
let currentView = localStorage.getItem("consutrainArticlesView") || "cards";
let allArticleTags = [];
let allTagsExpanded = false;

const preferredPopularTags = [
  "إدارة المشاريع",
  "القيادة",
  "التخطيط",
  "التنظيم",
  "اتخاذ القرار",
  "فرق العمل",
  "الذكاء الاصطناعي",
  "Agile",
  "Scrum",
  "Kanban",
  "Lean",
  "Waterfall"
];

/* =========================================================
   2) ELEMENT REFERENCES
   ========================================================= */
const articlesList = document.getElementById("articlesList");
const articlesTableWrap = document.getElementById("articlesTableWrap");
const articlesTableBody = document.getElementById("articlesTableBody");
const articlesSearch = document.getElementById("articlesSearch");
const articlesCount = document.getElementById("articlesCount");
const articlesResetBtn = document.getElementById("articlesResetBtn");
const articlesEmptyState = document.getElementById("articlesEmptyState");
const articlesTags = document.getElementById("articlesTags");
const articlesPopularTags = document.getElementById("articlesPopularTags");
const articlesTopicSelect = document.getElementById("articlesTopicSelect");
const articlesToggleTagsBtn = document.getElementById("articlesToggleTagsBtn");
const articlesCardsViewBtn = document.getElementById("articlesCardsViewBtn");
const articlesTableViewBtn = document.getElementById("articlesTableViewBtn");
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
    if (Number.isNaN(date.getTime())) return dateString || "";

    return new Intl.DateTimeFormat("ar", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(date);
  } catch {
    return dateString || "";
  }
}

function getArticleVideoUrl(article) {
  return article.video_url || article.videoUrl || "";
}

function getArticleCategory(article) {
  return (
    article.category ||
    article.field ||
    article.domain ||
    (Array.isArray(article.tags) && article.tags.length ? article.tags[0] : "مقال عام")
  );
}

function getArticleReadLink(article) {
  if (article.url) return article.url;
  return `article.html?id=${encodeURIComponent(article.id || "")}`;
}

function getTagFrequencyMap() {
  const freq = new Map();

  articlesData.forEach((article) => {
    (article.tags || []).forEach((tag) => {
      freq.set(tag, (freq.get(tag) || 0) + 1);
    });
  });

  return freq;
}

function buildTagButton(tag, label = tag) {
  return `
    <button class="tag-chip ${activeTag === tag ? "active" : ""}" type="button" data-tag="${escapeHtml(tag)}">
      ${escapeHtml(label)}
    </button>
  `;
}

function syncTopicSelect() {
  if (articlesTopicSelect) {
    articlesTopicSelect.value = activeTag || "";
  }
}

/* =========================================================
   4) BUILD ARTICLE CARD
   ========================================================= */
function buildArticleCard(article) {
  const title = escapeHtml(article.title || "");
  const excerpt = escapeHtml(article.excerpt || "");
  const date = formatArabicDate(article.date || "");
  const hasVideo = Boolean(getArticleVideoUrl(article));

  const tagsHtml = (article.tags || [])
    .map(tag => `<span class="article-tag">${escapeHtml(tag)}</span>`)
    .join("");

  return `
    <article class="section-card article-card">
      <div class="article-meta-row">
        <span class="article-date">${date}</span>
        ${hasVideo ? `<span class="article-media-badge">يتضمن فيديو</span>` : ""}
      </div>

      <h3>${title}</h3>
      <p>${excerpt}</p>

      <div class="article-tags">
        ${tagsHtml}
      </div>

      <a class="card-link" href="${getArticleReadLink(article)}">قراءة المقال</a>
    </article>
  `;
}

/* =========================================================
   5) BUILD ARTICLE TABLE ROW
   ========================================================= */
function buildArticleTableRow(article) {
  const title = escapeHtml(article.title || "");
  const excerpt = escapeHtml(article.excerpt || "");
  const date = formatArabicDate(article.date || "");
  const category = escapeHtml(getArticleCategory(article));
  const videoUrl = getArticleVideoUrl(article);
  const videoTitle = escapeHtml(article.video_title || article.videoTitle || "شاهد الفيديو");

  const tagsHtml = (article.tags || [])
    .map(tag => `<span class="article-table-tag">${escapeHtml(tag)}</span>`)
    .join("");

  return `
    <tr>
      <td class="articles-table-title-cell">
        <a href="${getArticleReadLink(article)}">${title}</a>
        ${excerpt ? `<small>${excerpt}</small>` : ""}
      </td>
      <td>${date}</td>
      <td><span class="article-category-pill">${category}</span></td>
      <td><div class="article-table-tags">${tagsHtml || "—"}</div></td>
      <td>
        ${videoUrl ? `<span class="article-video-yes">نعم</span>` : `<span class="article-video-no">لا</span>`}
      </td>
      <td>
        <div class="article-table-actions">
          <a href="${getArticleReadLink(article)}">قراءة</a>
          ${videoUrl ? `<a href="${escapeHtml(videoUrl)}" target="_blank" rel="noopener">${videoTitle}</a>` : ""}
        </div>
      </td>
    </tr>
  `;
}

/* =========================================================
   6) COUNT UPDATE
   ========================================================= */
function updateArticlesCount() {
  const count = filteredArticles.length;

  if (count === 0) {
    articlesCount.textContent = "لم يتم العثور على محتوى مطابق.";
  } else if (count === 1) {
    articlesCount.textContent = "تم العثور على مادة معرفة واحدة.";
  } else {
    articlesCount.textContent = `عدد مواد المعرفة المعروضة: ${count}`;
  }
}

/* =========================================================
   7) VIEW SWITCH
   ========================================================= */
function updateViewButtons() {
  const isCards = currentView === "cards";

  if (articlesCardsViewBtn) {
    articlesCardsViewBtn.classList.toggle("active", isCards);
    articlesCardsViewBtn.setAttribute("aria-pressed", String(isCards));
  }

  if (articlesTableViewBtn) {
    articlesTableViewBtn.classList.toggle("active", !isCards);
    articlesTableViewBtn.setAttribute("aria-pressed", String(!isCards));
  }
}

function setArticlesView(view) {
  currentView = view === "table" ? "table" : "cards";
  localStorage.setItem("consutrainArticlesView", currentView);
  renderArticles();
}

/* =========================================================
   8) RENDER ARTICLES
   ========================================================= */
function renderArticles() {
  if (!articlesList) return;

  updateViewButtons();

  if (!filteredArticles.length) {
    articlesList.innerHTML = "";
    articlesList.hidden = true;

    if (articlesTableBody) articlesTableBody.innerHTML = "";
    if (articlesTableWrap) articlesTableWrap.hidden = true;

    if (articlesEmptyState) articlesEmptyState.hidden = false;
    updateArticlesCount();
    return;
  }

  if (articlesEmptyState) articlesEmptyState.hidden = true;

  if (currentView === "table") {
    articlesList.innerHTML = "";
    articlesList.hidden = true;

    if (articlesTableBody) {
      articlesTableBody.innerHTML = filteredArticles
        .map(buildArticleTableRow)
        .join("");
    }

    if (articlesTableWrap) articlesTableWrap.hidden = false;
  } else {
    if (articlesTableBody) articlesTableBody.innerHTML = "";
    if (articlesTableWrap) articlesTableWrap.hidden = true;

    articlesList.hidden = false;
    articlesList.innerHTML = filteredArticles
      .map(buildArticleCard)
      .join("");
  }

  updateArticlesCount();
}

/* =========================================================
   9) FILTER LOGIC
   ========================================================= */
function applyFilters() {
  const query = (articlesSearch?.value || "").trim().toLowerCase();

  filteredArticles = articlesData.filter((article) => {
    const title = (article.title || "").toLowerCase();
    const excerpt = (article.excerpt || "").toLowerCase();
    const category = getArticleCategory(article).toLowerCase();
    const tags = (article.tags || []).join(" ").toLowerCase();
    const relatedTerms = (article.related_terms || article.relatedTerms || []).join(" ").toLowerCase();

    const matchesQuery =
      !query ||
      title.includes(query) ||
      excerpt.includes(query) ||
      category.includes(query) ||
      tags.includes(query) ||
      relatedTerms.includes(query);

    const matchesTag =
      !activeTag ||
      (article.tags || []).includes(activeTag);

    return matchesQuery && matchesTag;
  });

  syncTopicSelect();
  renderFilters();
  renderArticles();
}

/* =========================================================
   10) TAGS AND TOPIC FILTERS
   ========================================================= */
function renderTopicSelect() {
  if (!articlesTopicSelect) return;

  articlesTopicSelect.innerHTML = `
    <option value="">كل الموضوعات</option>
    ${allArticleTags.map(tag => `
      <option value="${escapeHtml(tag)}">${escapeHtml(tag)}</option>
    `).join("")}
  `;

  syncTopicSelect();
}

function getPopularTags() {
  const freq = getTagFrequencyMap();
  const existingPreferred = preferredPopularTags.filter(tag => allArticleTags.includes(tag));
  const frequentTags = [...allArticleTags]
    .filter(tag => !existingPreferred.includes(tag))
    .sort((a, b) => {
      const countDiff = (freq.get(b) || 0) - (freq.get(a) || 0);
      return countDiff || a.localeCompare(b, "ar");
    });

  return [...existingPreferred, ...frequentTags].slice(0, 12);
}

function renderTagButtons(container, tags, includeAll = false) {
  if (!container) return;

  container.innerHTML = `
    ${includeAll ? buildTagButton("", "الكل") : ""}
    ${tags.map(tag => buildTagButton(tag)).join("")}
  `;
}

function renderFilters() {
  const popularTags = getPopularTags();

  renderTagButtons(articlesPopularTags, popularTags, true);
  renderTagButtons(articlesTags, allArticleTags, true);

  if (articlesTags) {
    const shouldHideAllTags = !allTagsExpanded;
    articlesTags.hidden = shouldHideAllTags;
    articlesTags.setAttribute("aria-hidden", String(shouldHideAllTags));
    articlesTags.style.display = shouldHideAllTags ? "none" : "flex";
  }

  if (articlesToggleTagsBtn) {
    articlesToggleTagsBtn.textContent = allTagsExpanded
      ? "إخفاء الكلمات المفتاحية"
      : "عرض كل الكلمات المفتاحية";
    articlesToggleTagsBtn.setAttribute("aria-expanded", String(allTagsExpanded));
  }
}

function renderTagsBar() {
  const tagsSet = new Set();

  articlesData.forEach((article) => {
    (article.tags || []).forEach((tag) => tagsSet.add(tag));
  });

  allArticleTags = Array.from(tagsSet).sort((a, b) => a.localeCompare(b, "ar"));

  renderTopicSelect();
  renderFilters();
}

/* =========================================================
   11) LOAD DATA
   ========================================================= */
async function loadArticlesData() {
  try {
    articlesCount.textContent = "جاري تحميل مكتبة المعرفة...";

    const response = await fetch(`../assets/data/articles.json?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to load articles.json");
    }

    const rawData = await response.json();

    const sourceArray =
      Array.isArray(rawData) ? rawData :
      Array.isArray(rawData.articles) ? rawData.articles :
      [];

    articlesData = sourceArray
      .filter((article) => article.content_type === "article")
      .map((article) => ({
        id: article.id || "",
        title: article.title || "",
        excerpt: article.excerpt || "",
        date: article.date || "",
        category: article.category || article.field || article.domain || "",
        tags: Array.isArray(article.tags) ? article.tags : [],
        content: Array.isArray(article.content) ? article.content : [],
        video_title: article.video_title || article.videoTitle || "",
        video_url: article.video_url || article.videoUrl || "",
        related_terms: Array.isArray(article.related_terms) ? article.related_terms : [],
        url: article.url || article.link || ""
      }));

    filteredArticles = [...articlesData];

    renderTagsBar();
    renderArticles();

  } catch (error) {
    console.error("Knowledge library loading error:", error);

    if (articlesList) {
      articlesList.innerHTML = `
        <div class="section-card glossary-error">
          <h3>تعذر تحميل مكتبة المعرفة</h3>
          <p>يرجى التحقق من ملف البيانات ومساره ثم إعادة المحاولة.</p>
        </div>
      `;
      articlesList.hidden = false;
    }

    if (articlesTableWrap) articlesTableWrap.hidden = true;

    if (articlesCount) {
      articlesCount.textContent = "حدث خطأ أثناء تحميل البيانات.";
    }
  }
}

/* =========================================================
   12) EVENTS
   ========================================================= */
if (articlesSearch) {
  articlesSearch.addEventListener("input", applyFilters);
}

if (articlesTopicSelect) {
  articlesTopicSelect.addEventListener("change", () => {
    activeTag = articlesTopicSelect.value || "";
    applyFilters();
  });
}

if (articlesResetBtn) {
  articlesResetBtn.addEventListener("click", () => {
    if (articlesSearch) articlesSearch.value = "";
    activeTag = "";
    allTagsExpanded = false;
    syncTopicSelect();
    applyFilters();
    articlesSearch?.focus();
  });
}

function handleTagClick(event) {
  const btn = event.target.closest("[data-tag]");
  if (!btn) return;

  activeTag = btn.dataset.tag || "";
  applyFilters();
}

if (articlesPopularTags) {
  articlesPopularTags.addEventListener("click", handleTagClick);
}

if (articlesTags) {
  articlesTags.addEventListener("click", handleTagClick);
}

if (articlesToggleTagsBtn) {
  articlesToggleTagsBtn.addEventListener("click", () => {
    allTagsExpanded = !allTagsExpanded;
    renderFilters();
  });
}

if (articlesCardsViewBtn) {
  articlesCardsViewBtn.addEventListener("click", () => setArticlesView("cards"));
}

if (articlesTableViewBtn) {
  articlesTableViewBtn.addEventListener("click", () => setArticlesView("table"));
}

/* =========================================================
   13) BACK TO TOP
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
   14) INIT
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  loadArticlesData();
});
