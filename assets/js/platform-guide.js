(() => {
  "use strict";

  const pageLang = document.documentElement.lang === "fr" ? "fr" : "ar";
  const isFrench = pageLang === "fr";
  const content = document.getElementById("platformGuideContent");
  const quickNav = document.getElementById("platformGuideQuickNav");
  const searchInput = document.getElementById("platformGuideSearch");
  const resultsText = document.getElementById("platformGuideResults");
  const stats = document.getElementById("platformGuideStats");
  const updatedAt = document.getElementById("platformGuideUpdatedAt");
  const root = document.body.dataset.root || ".";

  const ui = isFrench
    ? {
        dataFile: "assets/data/fr-platform-guide.json",
        item: "élément",
        items: "éléments",
        section: "section",
        sections: "sections",
        open: "Ouvrir",
        loadingError: "Impossible de charger le contenu du guide",
        loadingHelp:
          "Utilisez le menu principal pour accéder aux rubriques du site ou téléchargez la version PDF résumée.",
        pdf: "Télécharger le guide PDF",
        found: (visible, total) =>
          `${visible} résultat${visible > 1 ? "s" : ""} trouvé${visible > 1 ? "s" : ""} sur ${total}.`,
        summary: (total, sections) =>
          `Le guide présente ${total} éléments répartis dans ${sections} sections.`
      }
    : {
        dataFile: "assets/data/platform-guide.json",
        item: "عنصر",
        items: "عناصر",
        section: "قسم",
        sections: "أقسام",
        open: "فتح الرابط",
        loadingError: "تعذر تحميل محتويات الدليل",
        loadingHelp:
          "يمكنك استخدام القائمة الرئيسية للوصول إلى أقسام الموقع، أو تحميل النسخة المختصرة بصيغة PDF.",
        pdf: "تحميل الدليل PDF",
        found: (visible, total) =>
          `تم العثور على ${visible} نتيجة من أصل ${total}.`,
        summary: (total, sections) =>
          `يعرض الدليل ${total} عنصرًا موزعة على ${sections} أقسام.`
      };

  let guideData = null;
  let totalItems = 0;

  const resolveUrl = (value) => {
    if (!value) return "#";
    if (/^(https?:|mailto:|tel:|#)/i.test(value)) return value;
    return `${root}/${value}`
      .replace(/\/\.\//g, "./")
      .replace(/([^:])\/\/{2,}/g, "$1/");
  };

  const create = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof text === "string") element.textContent = text;
    return element;
  };

  const normalized = (value) =>
    String(value || "")
      .normalize("NFKD")
      .toLocaleLowerCase(pageLang)
      .replace(/[ًٌٍَُِّْـ]/g, "")
      .trim();

  const itemCountLabel = (count) => {
    if (isFrench) {
      return `${count} ${count > 1 ? ui.items : ui.item}`;
    }
    return `${count} ${count > 10 ? "عنصرًا" : "عناصر"}`;
  };

  const renderCard = (item, sectionId) => {
    const article = create("article", "platform-guide-card section-card");
    article.dataset.section = sectionId;
    article.dataset.search = normalized([
      item.title,
      item.description,
      item.badge,
      ...(item.tags || [])
    ].join(" "));

    if (item.badge) {
      article.appendChild(create("span", "platform-guide-card__badge", item.badge));
    }

    article.appendChild(create("h3", "", item.title));
    article.appendChild(create("p", "", item.description));

    if (Array.isArray(item.tags) && item.tags.length) {
      const tags = create("div", "platform-guide-card__tags");
      item.tags.slice(0, 4).forEach((tag) => {
        tags.appendChild(create("span", "", tag));
      });
      article.appendChild(tags);
    }

    const link = create("a", "platform-guide-card__link", item.label || ui.open);
    link.href = resolveUrl(item.url);
    article.appendChild(link);

    return article;
  };

  const renderSection = (section, index) => {
    const sectionElement = create(
      "section",
      `home-section platform-guide-section${index % 2 ? " platform-guide-section--soft" : ""}`
    );
    sectionElement.id = section.id;

    const container = create("div", "container");
    const head = create("div", "section-head platform-guide-section__head");
    const copy = create("div");

    copy.appendChild(create("span", "eyebrow", section.eyebrow));
    copy.appendChild(create("h2", "", section.title));
    copy.appendChild(create("p", "", section.description));

    const count = create(
      "strong",
      "platform-guide-section__count",
      itemCountLabel(section.items.length)
    );

    head.appendChild(copy);
    head.appendChild(count);
    container.appendChild(head);

    const grid = create("div", "platform-guide-grid");
    section.items.forEach((item) => {
      grid.appendChild(renderCard(item, section.id));
    });
    container.appendChild(grid);

    if (section.footerLink) {
      const actions = create("div", "platform-guide-section__actions");
      const link = create("a", "btn btn-secondary", section.footerLink.label);
      link.href = resolveUrl(section.footerLink.url);
      actions.appendChild(link);
      container.appendChild(actions);
    }

    sectionElement.appendChild(container);
    return sectionElement;
  };

  const renderQuickNav = (sections) => {
    quickNav.replaceChildren();
    sections.forEach((section) => {
      const link = create("a", "", section.title);
      link.href = `#${section.id}`;
      quickNav.appendChild(link);
    });
  };

  const updateStats = (sections) => {
    totalItems = sections.reduce((sum, section) => sum + section.items.length, 0);
    const values = stats?.querySelectorAll("strong");
    if (values?.length >= 2) {
      values[0].textContent = String(sections.length);
      values[1].textContent = String(totalItems);
    }
  };

  const updateDate = (dateValue) => {
    if (!updatedAt || !dateValue) return;
    const date = new Date(`${dateValue}T00:00:00`);
    if (Number.isNaN(date.getTime())) return;

    updatedAt.textContent = new Intl.DateTimeFormat(
      isFrench ? "fr-FR" : "ar-MA",
      { year: "numeric", month: "long", day: "numeric" }
    ).format(date);
  };

  const applySearch = () => {
    const query = normalized(searchInput?.value);
    const cards = [...document.querySelectorAll(".platform-guide-card")];
    let visible = 0;

    cards.forEach((card) => {
      const match = !query || card.dataset.search.includes(query);
      card.hidden = !match;
      if (match) visible += 1;
    });

    document.querySelectorAll(".platform-guide-section").forEach((section) => {
      const visibleCards = section.querySelectorAll(
        ".platform-guide-card:not([hidden])"
      ).length;
      section.hidden = Boolean(query) && visibleCards === 0;
    });

    if (!resultsText) return;
    resultsText.textContent = query
      ? ui.found(visible, totalItems)
      : ui.summary(totalItems, guideData.sections.length);
  };

  const renderError = () => {
    content.replaceChildren();
    const section = create("section", "home-section");
    const container = create("div", "container");
    const card = create("div", "section-card platform-guide-error");
    card.appendChild(create("h2", "", ui.loadingError));
    card.appendChild(create("p", "", ui.loadingHelp));

    const link = create("a", "btn btn-primary", ui.pdf);
    link.href = resolveUrl(
      "resources/downloads/profile/ConsuTrain_Profile_and_Services_AR.pdf"
    );
    card.appendChild(link);
    container.appendChild(card);
    section.appendChild(container);
    content.appendChild(section);
  };

  const init = async () => {
    try {
      const response = await fetch(resolveUrl(ui.dataFile), { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`Guide data request failed: ${response.status}`);
      }

      guideData = await response.json();
      if (!guideData || !Array.isArray(guideData.sections)) {
        throw new Error("Invalid guide data.");
      }

      content.replaceChildren();
      guideData.sections.forEach((section, index) => {
        content.appendChild(renderSection(section, index));
      });

      renderQuickNav(guideData.sections);
      updateStats(guideData.sections);
      updateDate(guideData.meta?.lastUpdated);
      applySearch();

      searchInput?.addEventListener("input", applySearch);
    } catch (error) {
      console.error(error);
      renderError();
    }
  };

  init();
})();
