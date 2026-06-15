(function () {
  const PAGE_SELECTOR = ".fr-service-detail-page";
  const FRENCH_BASE = "/fr";
  const WHATSAPP_URL = "https://wa.me/212773275105";
  const MAIL_URL = "mailto:consutrain@gmail.com";

  function getPageTitle() {
    return (document.title || "ConsuTrain").replace(/\s*\|\s*ConsuTrain\s*$/i, "").trim() || "ConsuTrain";
  }

  function getPageUrl() {
    return window.location.href;
  }

  async function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  function showStatus(message) {
    const status = document.getElementById("globalShareStatus");
    if (!status) return;

    status.textContent = message;
    status.classList.add("show");
    window.clearTimeout(showStatus.timer);
    showStatus.timer = window.setTimeout(() => {
      status.classList.remove("show");
    }, 2400);
  }

  function buildQuickContactWidget() {
    const widget = document.createElement("div");
    widget.className = "quick-contact-widget";
    widget.setAttribute("dir", "ltr");
    widget.setAttribute("aria-live", "polite");

    widget.innerHTML = `
      <button
        class="quick-contact-toggle"
        type="button"
        id="quickContactToggle"
        aria-controls="quickContactPanel"
        aria-expanded="false"
      >
        <span class="quick-contact-icon" aria-hidden="true">✉</span>
        <span>Contact rapide</span>
      </button>

      <div class="quick-contact-panel" id="quickContactPanel" hidden>
        <div class="quick-contact-panel__head">
          <strong>Choisissez une option</strong>
          <button type="button" class="quick-contact-close" aria-label="Fermer la fenêtre de contact">×</button>
        </div>
        <p>Pour une demande structurée, utilisez le formulaire. Pour un contact rapide, choisissez l'une des options ci-dessous.</p>
        <div class="quick-contact-actions">
          <a href="${FRENCH_BASE}/services/consultation-form.html" class="quick-contact-action primary">Demander une consultation</a>
          <a href="${WHATSAPP_URL}" target="_blank" rel="noopener" class="quick-contact-action whatsapp">WhatsApp</a>
          <a href="${MAIL_URL}" class="quick-contact-action mail">Envoyer un e-mail</a>
          <a href="${FRENCH_BASE}/contact.html" class="quick-contact-action feedback">Nous contacter</a>
        </div>
      </div>
    `;

    return widget;
  }

  function buildBackToTopButton() {
    const button = document.createElement("button");
    button.id = "backToTop";
    button.className = "scroll-top-left";
    button.type = "button";
    button.setAttribute("aria-label", "Retour en haut");
    button.setAttribute("title", "Retour en haut");
    button.textContent = "↑";
    return button;
  }

  function buildShareButton() {
    const button = document.createElement("button");
    button.id = "globalShareButton";
    button.className = "global-share-button";
    button.type = "button";
    button.setAttribute("aria-label", "Partager");
    button.setAttribute("title", "Partager");
    button.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M18 8.5c-5.25 0-8.75 2.15-10.55 6.45-.18.43-.79.39-.91-.06-.72-2.83-.16-5.13 1.69-6.91C10.06 6.22 13.32 5.34 18 5.34V2l5 5-5 5V8.5Z"></path>
        <path d="M5 19.5h10.8"></path>
      </svg>
    `;
    return button;
  }

  function buildShareStatus() {
    const status = document.createElement("div");
    status.id = "globalShareStatus";
    status.className = "global-share-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    return status;
  }

  function initQuickContact(widget) {
    const toggle = widget.querySelector("#quickContactToggle");
    const panel = widget.querySelector("#quickContactPanel");
    const closeButton = widget.querySelector(".quick-contact-close");

    if (!toggle || !panel) return;

    function openPanel() {
      panel.removeAttribute("hidden");
      toggle.setAttribute("aria-expanded", "true");
    }

    function closePanel() {
      panel.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (panel.hasAttribute("hidden")) {
        openPanel();
      } else {
        closePanel();
      }
    });

    closeButton?.addEventListener("click", (event) => {
      event.preventDefault();
      closePanel();
      toggle.focus();
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".quick-contact-widget")) {
        closePanel();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closePanel();
      }
    });
  }

  function initBackToTop(button) {
    function updateVisibility() {
      if (window.scrollY > 250) {
        button.classList.add("show");
      } else {
        button.classList.remove("show");
      }
    }

    window.addEventListener("scroll", updateVisibility, { passive: true });
    updateVisibility();

    button.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  function initShareButton(button, pageTitle, pageUrl) {
    button.addEventListener("click", async (event) => {
      event.preventDefault();

      const sharePayload = {
        title: pageTitle,
        text: `ConsuTrain - ${pageTitle}`,
        url: pageUrl
      };

      if (navigator.share) {
        try {
          await navigator.share(sharePayload);
          return;
        } catch (error) {
          if (error?.name === "AbortError") return;
        }
      }

      try {
        await copyTextToClipboard(pageUrl);
        showStatus("Lien copié");
      } catch (error) {
        showStatus("Impossible de copier le lien");
      }
    });
  }

  function init() {
    const body = document.body;
    if (!body || !body.classList.contains("fr-service-detail-page")) return;
    if (document.getElementById("backToTop") || document.getElementById("globalShareButton") || document.querySelector(".quick-contact-widget")) return;

    const footer = document.querySelector(".fr-footer");
    const pageTitle = getPageTitle();
    const pageUrl = getPageUrl();

    const quickContactWidget = buildQuickContactWidget();
    const backToTopButton = buildBackToTopButton();
    const shareButton = buildShareButton();
    const shareStatus = buildShareStatus();

    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(quickContactWidget, footer.nextSibling);
      quickContactWidget.insertAdjacentElement("afterend", backToTopButton);
      backToTopButton.insertAdjacentElement("afterend", shareButton);
      shareButton.insertAdjacentElement("afterend", shareStatus);
    } else {
      document.body.appendChild(quickContactWidget);
      document.body.appendChild(backToTopButton);
      document.body.appendChild(shareButton);
      document.body.appendChild(shareStatus);
    }

    initQuickContact(quickContactWidget);
    initBackToTop(backToTopButton);
    initShareButton(shareButton, pageTitle, pageUrl);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
