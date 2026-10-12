/* CT-01 Subflow 04 — Latest Article Homepage Card */
(() => {
  "use strict";

  const root = document.querySelector("[data-latest-article]");
  if (!root) return;

  const locale = root.dataset.locale === "fr" ? "fr" : "ar";
  const isFrench = locale === "fr";
  const labels = isFrench
    ? { heading: "Dernier article publié", read: "Lire l’article", image: "Illustration de l’article" }
    : { heading: "آخر مقال منشور", read: "اضغط للقراءة", image: "صورة المقال" };

  const dataPath = isFrench
    ? "../assets/data/fr-articles.json"
    : "assets/data/articles.json";

  const articleBase = new URL(isFrench ? "learn/" : "learn/", document.baseURI);
  const dataURL = new URL(dataPath, document.baseURI);

  function validDate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const timestamp = Date.parse(`${value}T00:00:00Z`);
    return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value
      ? timestamp
      : null;
  }

  function timestamp(article) {
    if (typeof article.published_at === "string" && article.published_at.trim()) {
      const precise = Date.parse(article.published_at);
      if (Number.isFinite(precise)) return precise;
    }
    return validDate(article.date);
  }

  function safeLink(article) {
    if (!article || typeof article.id !== "string") return null;
    const id = article.id.trim();
    if (!id) return null;

    if (typeof article.url === "string" && article.url.trim()) {
      const path = article.url.trim();
      if (/^[a-z][a-z0-9+.-]*:/i.test(path) || path.startsWith("/") ||
          path.startsWith("//") || path.includes("\\") || path.split("/").includes("..")) {
        return null;
      }
      const url = new URL(path, articleBase);
      if (url.origin !== location.origin || url.protocol !== location.protocol) return null;
      return url.href;
    }

    const fallback = new URL("article.html", articleBase);
    fallback.searchParams.set("id", id);
    return fallback.href;
  }

  function imageURL(article) {
    if (typeof article.image_url !== "string" || !article.image_url.trim()) return null;
    try {
      const url = new URL(article.image_url.trim(), articleBase);
      if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return null;
      return url.href;
    } catch (_) {
      return null;
    }
  }

  function chooseLatest(items) {
    const today = new Date().toISOString().slice(0, 10);
    return items
      .filter(article =>
        article &&
        article.content_type === "article" &&
        typeof article.title === "string" &&
        article.title.trim() &&
        validDate(article.date) !== null &&
        article.date <= today &&
        timestamp(article) !== null &&
        safeLink(article)
      )
      .sort((a, b) =>
        timestamp(b) - timestamp(a) ||
        String(a.id).localeCompare(String(b.id), "en")
      )[0] || null;
  }

  function appendText(parent, tag, className, value) {
    const el = document.createElement(tag);
    el.className = className;
    el.textContent = value;
    parent.appendChild(el);
    return el;
  }

  function render(article) {
    const link = safeLink(article);
    if (!link) return;

    const container = document.createElement("div");
    container.className = "container";

    const card = document.createElement("article");
    card.className = "ct-latest-article__card";

    const media = document.createElement("div");
    media.className = "ct-latest-article__media";

    const src = imageURL(article);
    if (src) {
      const img = document.createElement("img");
      img.className = "ct-latest-article__image";
      img.src = src;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      img.addEventListener("error", () => {
        media.replaceChildren();
        appendText(media, "span", "ct-latest-article__placeholder", labels.image);
      }, { once: true });
      media.appendChild(img);
    } else {
      appendText(media, "span", "ct-latest-article__placeholder", labels.image);
    }

    const body = document.createElement("div");
    body.className = "ct-latest-article__body";

    appendText(body, "p", "ct-latest-article__eyebrow", labels.heading);
    appendText(body, "h2", "ct-latest-article__title", article.title.trim());

    if (typeof article.excerpt === "string" && article.excerpt.trim()) {
      appendText(body, "p", "ct-latest-article__excerpt", article.excerpt.trim());
    }

    const formatter = new Intl.DateTimeFormat(isFrench ? "fr-FR" : "ar-MA", {
      year: "numeric", month: "long", day: "numeric", timeZone: "UTC"
    });
    const dateText = formatter.format(new Date(`${article.date}T00:00:00Z`));
    const category = typeof article.category === "string" ? article.category.trim() : "";
    appendText(body, "p", "ct-latest-article__meta",
      category ? `${dateText} · ${category}` : dateText);

    const cta = appendText(body, "a", "ct-latest-article__link", labels.read);
    cta.href = link;

    card.append(media, body);
    container.appendChild(card);
    root.replaceChildren(container);
    root.hidden = false;
  }

  async function init() {
    try {
      const response = await fetch(dataURL.href, { cache: "no-store" });
      if (!response.ok) throw new Error(`Articles HTTP ${response.status}`);

      const data = await response.json();
      if (!data || !Array.isArray(data.articles)) return;

      const article = chooseLatest(data.articles);
      if (article) render(article);
    } catch (error) {
      console.warn("[ConsuTrain Latest Article] Unable to load articles:", error);
    }
  }

  init();
})();
