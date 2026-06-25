(function () {
  const root = document.querySelector("[data-tech-radar-archive]");
  if (!root) return;

  const list = root.querySelector("[data-tech-radar-list]");
  const emptyState = root.querySelector("[data-tech-radar-empty]");
  const source = root.dataset.articlesSource || "";
  const locale = root.dataset.locale || "ar";
  const readLabel = root.dataset.readLabel || "Read";
  const loadingLabel = root.dataset.loadingLabel || "Loading...";
  const errorLabel = root.dataset.errorLabel || "Unable to load articles.";

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value || "";
    return div.innerHTML;
  }

  function isTechRadarArticle(article) {
    const tags = Array.isArray(article.tags) ? article.tags : [];
    return (
      article.contentType === "tech-radar" ||
      article.content_type === "tech-radar" ||
      article.category === "tech-radar" ||
      tags.includes("tech-radar")
    );
  }

  function articleTime(article) {
    const time = new Date(article.date || "").getTime();
    return Number.isNaN(time) ? 0 : time;
  }

  function formatDate(date) {
    const value = new Date(date || "");
    if (Number.isNaN(value.getTime())) return date || "";

    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(value);
  }

  function buildCard(article) {
    const title = escapeHtml(article.title);
    const excerpt = escapeHtml(article.excerpt);
    const date = escapeHtml(formatDate(article.date));
    const category = escapeHtml(article.category || "Radar technologique");
    const url = escapeHtml(article.url || "#");

    return `
      <article class="section-card article-card">
        <div class="article-meta-row">
          <span class="article-date">${date}</span>
          <span class="article-category-pill">${category}</span>
        </div>
        <h3>${title}</h3>
        ${excerpt ? `<p>${excerpt}</p>` : ""}
        <div class="article-tags">
          <span class="article-tag">${category}</span>
        </div>
        <a class="card-link" href="${url}">${escapeHtml(readLabel)}</a>
      </article>
    `;
  }

  async function loadArchive() {
    if (!list || !source) return;

    list.innerHTML = `<div class="section-card">${escapeHtml(loadingLabel)}</div>`;

    try {
      const response = await fetch(`${source}?v=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`Failed to load ${source}`);

      const data = await response.json();
      const sourceArticles = Array.isArray(data) ? data : Array.isArray(data.articles) ? data.articles : [];
      const articles = sourceArticles
        .filter(isTechRadarArticle)
        .sort((a, b) => articleTime(b) - articleTime(a));

      if (!articles.length) {
        list.innerHTML = "";
        if (emptyState) emptyState.hidden = false;
        return;
      }

      if (emptyState) emptyState.hidden = true;
      list.innerHTML = articles.map(buildCard).join("");
    } catch (error) {
      console.error("Tech radar archive loading error:", error);
      list.innerHTML = `<div class="section-card glossary-error">${escapeHtml(errorLabel)}</div>`;
    }
  }

  document.addEventListener("DOMContentLoaded", loadArchive);
})();
