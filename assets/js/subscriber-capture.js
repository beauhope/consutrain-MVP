/*
  =========================================================
  FILE: assets/js/subscriber-capture.js
  PURPOSE:
  - إظهار زر اشتراك عالمي مصغر تحت الهيدر
  - فتح نافذة اشتراك موحدة دون مغادرة الصفحة
  - التحقق من البريد والموافقة
  - دعم العربية والفرنسية
  - تجهيز Payload موحد لربطه بمسار CT-05

  IMPORTANT:
  - لا يظهر نجاح إلا بعد استجابة HTTP ناجحة من الـEndpoint.
  - CT-05 هو مالك الـEndpoint والتخزين والأتمتة وإلغاء الاشتراك.
  =========================================================
*/

(() => {
  "use strict";

  if (window.ConsuTrainSubscriber?.initialized) {
    return;
  }

  const CONSENT_VERSION = "email_updates_v1";

  /*
    CT-05:
    ضع هنا Webhook / API endpoint النهائي بعد اعتماده واختباره.
    يجب أن يقبل POST JSON ويعيد HTTP 2xx فقط عند نجاح المعالجة.
  */
  const SUBSCRIBER_ENDPOINT =
    "https://api.consutrain.com/v1/subscribers";

  const RESUBSCRIBE_ENDPOINT =
    "https://api.consutrain.com/v1/resubscribe";

  const copy = {
    ar: {
      trigger: "أرسل لي ما يستحق المتابعة",
      eyebrow: "ابقَ على اطلاع",
      title: "لا تفوّت الجديد من ConsuTrain",
      intro: "اشترك لتصلك أهم الإضافات المهنية الجديدة مباشرة إلى بريدك.",
      benefits: [
        "أدوات وقوالب وموارد عملية جديدة.",
        "مقالات ودورات وتدريبات مجانية.",
        "تحديثات مهنية مختارة تستحق المتابعة."
      ],
      note: "نستخدم بريدك الإلكتروني لهذا الغرض فقط، ويمكنك إلغاء الاشتراك في أي وقت.",
      emailLabel: "بريدك الإلكتروني",
      emailPlaceholder: "بريدك الإلكتروني",
      submit: "اشترك في التحديثات",
      consent: "أوافق على تلقي تحديثات ومحتوى مهني من ConsuTrain عبر البريد الإلكتروني، ويمكنني إلغاء الاشتراك في أي وقت.",
      privacy: "سياسة الخصوصية",
      privacyHide: "إخفاء سياسة الخصوصية",
      privacyLoading: "جارٍ تحميل سياسة الخصوصية...",
      privacyError: "تعذر تحميل سياسة الخصوصية داخل النافذة حاليًا. يمكنك فتحها من الرابط الثابت في أسفل الموقع.",
      close: "إغلاق نافذة الاشتراك",
      emptyEmail: "يرجى إدخال بريدك الإلكتروني.",
      invalidEmail: "يرجى إدخال بريد إلكتروني صالح.",
      consentRequired: "يرجى تأكيد موافقتك على استلام التحديثات عبر البريد الإلكتروني.",
      success: "تم الاشتراك. شكرًا لك!",
      duplicate: "أنت مشترك بالفعل.",
      resubscribePrompt: "سبق أن ألغيت الاشتراك بهذا البريد. اضغط مرة أخرى لتأكيد إعادة تفعيل اشتراكك.",
      resubscribeSubmit: "إعادة تفعيل الاشتراك",
      resubscribed: "تمت إعادة تفعيل اشتراكك. شكرًا لك!",
      technical: "تعذر إكمال الاشتراك حاليًا. يرجى المحاولة مرة أخرى.",
      sending: "جارٍ تسجيل اشتراكك..."
    },
    fr: {
      trigger: "Recevoir l’essentiel à suivre",
      eyebrow: "Restez informé",
      title: "Ne manquez pas les nouveautés de ConsuTrain",
      intro: "Recevez directement par e-mail les principales nouveautés professionnelles de ConsuTrain.",
      benefits: [
        "Nouveaux outils, modèles et ressources pratiques.",
        "Articles, formations et contenus gratuits.",
        "Actualités professionnelles sélectionnées."
      ],
      note: "Nous utilisons votre adresse e-mail uniquement à cette fin. Vous pouvez vous désabonner à tout moment.",
      emailLabel: "Votre adresse e-mail",
      emailPlaceholder: "Votre adresse e-mail",
      submit: "Recevoir les nouveautés",
      consent: "J’accepte de recevoir par e-mail les actualités et contenus professionnels de ConsuTrain. Je peux me désabonner à tout moment.",
      privacy: "Politique de confidentialité",
      privacyHide: "Masquer la politique de confidentialité",
      privacyLoading: "Chargement de la politique de confidentialité...",
      privacyError: "Impossible de charger la politique de confidentialité dans cette fenêtre. Vous pouvez toujours l’ouvrir depuis le lien permanent en bas du site.",
      close: "Fermer la fenêtre d’inscription",
      emptyEmail: "Veuillez saisir votre adresse e-mail.",
      invalidEmail: "Veuillez saisir une adresse e-mail valide.",
      consentRequired: "Veuillez confirmer votre accord pour recevoir les actualités par e-mail.",
      success: "Inscription confirmée. Merci !",
      duplicate: "Vous êtes déjà inscrit.",
      resubscribePrompt: "Vous vous êtes déjà désabonné avec cette adresse. Cliquez à nouveau pour confirmer la réactivation de votre inscription.",
      resubscribeSubmit: "Réactiver mon inscription",
      resubscribed: "Votre inscription a été réactivée. Merci !",
      technical: "L’inscription n’a pas pu être finalisée. Veuillez réessayer.",
      sending: "Inscription en cours..."
    }
  };

  let lastFocusedElement = null;

  function getLanguage() {
    return (document.documentElement.lang || "").toLowerCase().startsWith("fr") ? "fr" : "ar";
  }

  function getRootPath() {
    return document.body?.dataset.root || ".";
  }

  function getPrivacyHref(language) {
    const root = getRootPath();
    return language === "fr"
      ? `${root}/fr/privacy.html`
      : `${root}/privacy.html`;
  }

  function t(key) {
    return copy[getLanguage()][key];
  }

  function buildGlobalUi() {
    const language = getLanguage();
    const strings = copy[language];
    const privacyHref = getPrivacyHref(language);
    const benefits = strings.benefits.map((item) => `<li>${item}</li>`).join("");

    const shell = document.createElement("div");
    shell.className = "subscriber-global-entry";
    shell.dataset.subscriberGlobalEntry = "true";
    shell.innerHTML = `
      <div class="container">
        <button
          class="subscriber-global-trigger"
          style="background:var(--gold);color:var(--primary);font-size:.70rem;font-weight:400;min-height:32px;padding:5px 10px;border:0;border-radius:999px;box-shadow:0 2px 6px rgba(15,39,71,.05);"
          type="button"
          data-subscriber-open
          aria-haspopup="dialog"
          aria-controls="subscriberGlobalModal"
          dir="${language === "fr" ? "ltr" : "rtl"}"
        >
          <span class="subscriber-global-trigger__icon" style="background:transparent;color:var(--primary);width:22px;height:22px;font-size:.76rem;" aria-hidden="true">✉</span>
          <span>${strings.trigger}</span>
        </button>
      </div>
    `;

    const modal = document.createElement("div");
    modal.className = "subscriber-modal";
    modal.id = "subscriberGlobalModal";
    modal.hidden = true;
    modal.innerHTML = `
      <div class="subscriber-modal__backdrop" data-subscriber-close></div>

      <section
        class="subscriber-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscriberModalTitle"
        aria-describedby="subscriberModalIntro"
        dir="${language === "fr" ? "ltr" : "rtl"}"
      >
        <div class="subscriber-modal__head">
          <span class="subscriber-modal__eyebrow">${strings.eyebrow}</span>
          <button
            class="subscriber-modal__close"
            type="button"
            data-subscriber-close
            aria-label="${strings.close}"
          >×</button>
        </div>

        <div class="subscriber-modal__body">
          <h2 id="subscriberModalTitle">${strings.title}</h2>
          <p class="subscriber-modal__intro" id="subscriberModalIntro">${strings.intro}</p>
          <ul class="subscriber-modal__benefits">${benefits}</ul>
          <p class="subscriber-modal__note">${strings.note}</p>

          <form class="subscriber-form" data-subscriber-form data-cta-location="global_subscribe" novalidate>
            <div class="subscriber-form-row">
              <label class="subscriber-sr-only" for="globalSubscriberEmail">${strings.emailLabel}</label>
              <input
                id="globalSubscriberEmail"
                name="email"
                type="email"
                inputmode="email"
                autocomplete="email"
                placeholder="${strings.emailPlaceholder}"
                required
              >
              <button class="btn btn-primary" type="submit">${strings.submit}</button>
            </div>

            <label class="subscriber-consent">
              <input name="consent" type="checkbox" value="yes" required>
              <span>${strings.consent}</span>
            </label>

            <p class="subscriber-privacy-note">
              <button
                class="subscriber-privacy-toggle"
                type="button"
                data-subscriber-privacy-toggle
                aria-expanded="false"
                aria-controls="subscriberPrivacyPanel"
              >${strings.privacy}</button>
            </p>

            <section
              class="subscriber-privacy-panel"
              id="subscriberPrivacyPanel"
              data-subscriber-privacy-panel
              data-privacy-url="${privacyHref}"
              hidden
              aria-label="${strings.privacy}"
            >
              <div class="subscriber-privacy-panel__head">
                <strong>${strings.privacy}</strong>
              </div>
              <div
                class="subscriber-privacy-panel__content"
                data-subscriber-privacy-content
                tabindex="0"
              ></div>
            </section>

            <div class="subscriber-hp" aria-hidden="true">
              <label>Website <input name="website" type="text" tabindex="-1" autocomplete="off"></label>
            </div>

            <p class="subscriber-status" data-subscriber-status role="status" aria-live="polite"></p>
          </form>
        </div>
      </section>
    `;

    return { shell, modal };
  }

  function mountGlobalSubscriberUi() {
    const headerPlaceholder = document.getElementById("header-placeholder");
    if (!headerPlaceholder) return false;

    const siteHeader = headerPlaceholder.querySelector(".site-header");
    if (!siteHeader) return false;

    const existingShell = document.querySelector("[data-subscriber-global-entry]");
    const existingModal = document.getElementById("subscriberGlobalModal");

    if (!existingShell || !existingModal) {
      const { shell, modal } = buildGlobalUi();

      if (!existingShell) {
        siteHeader.insertAdjacentElement("afterend", shell);
      }

      if (!existingModal) {
        document.body.appendChild(modal);
      }
    }

    return true;
  }

  function waitForHeaderAndMount() {
    if (mountGlobalSubscriberUi()) return;

    const headerPlaceholder = document.getElementById("header-placeholder");
    if (!headerPlaceholder) return;

    const observer = new MutationObserver(() => {
      if (mountGlobalSubscriberUi()) {
        observer.disconnect();
      }
    });

    observer.observe(headerPlaceholder, { childList: true, subtree: true });
  }

  function openModal(trigger) {
    const modal = document.getElementById("subscriberGlobalModal");
    if (!modal) return;

    lastFocusedElement = trigger || document.activeElement;
    modal.hidden = false;
    document.body.classList.add("subscriber-modal-open");

    window.requestAnimationFrame(() => {
      modal.querySelector('input[type="email"]')?.focus();
    });
  }

  function closeModal() {
    const modal = document.getElementById("subscriberGlobalModal");
    if (!modal || modal.hidden) return;

    modal.hidden = true;
    document.body.classList.remove("subscriber-modal-open");
    resetPrivacyPanel();

    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  }

  function setPrivacyToggleState(panel, expanded) {
    const modal = panel.closest(".subscriber-modal");
    const strings = copy[getLanguage()];
    const toggle = modal?.querySelector("[data-subscriber-privacy-toggle]");

    if (toggle) {
      toggle.setAttribute("aria-expanded", String(expanded));
      toggle.textContent = expanded ? strings.privacyHide : strings.privacy;
    }

    modal?.querySelector(".subscriber-modal__dialog")?.classList.toggle("is-privacy-open", expanded);
  }

  async function loadPrivacyContent(panel) {
    if (panel.dataset.loaded === "true") return;

    const content = panel.querySelector("[data-subscriber-privacy-content]");
    if (!content) return;

    const strings = copy[getLanguage()];
    content.innerHTML = `<p class="subscriber-privacy-loading">${strings.privacyLoading}</p>`;

    try {
      const privacyUrl = new URL(panel.dataset.privacyUrl || getPrivacyHref(getLanguage()), document.baseURI).href;
      const response = await fetch(privacyUrl, {
        method: "GET",
        cache: "no-store",
        headers: {
          "Accept": "text/html"
        }
      });

      if (!response.ok) {
        throw new Error(`Privacy page request failed with HTTP ${response.status}`);
      }

      const html = await response.text();
      const parsed = new DOMParser().parseFromString(html, "text/html");
      const source = parsed.querySelector("main.inner-page .home-section .container");

      if (!source) {
        throw new Error("Privacy content container was not found.");
      }

      const fragment = document.createElement("div");
      fragment.className = "subscriber-privacy-source";
      fragment.innerHTML = source.innerHTML;

      fragment.querySelectorAll("a[href]").forEach((link) => {
        const href = link.getAttribute("href");
        if (!href) return;

        try {
          link.href = new URL(href, privacyUrl).href;
          link.target = "_blank";
          link.rel = "noopener";
        } catch (error) {
          // Keep the original href if URL normalization is not possible.
        }
      });

      content.replaceChildren(fragment);
      panel.dataset.loaded = "true";
    } catch (error) {
      console.error("Subscriber privacy content error:", error);
      content.innerHTML = `<p class="subscriber-privacy-error">${strings.privacyError}</p>`;
    }
  }

  async function togglePrivacyPanel() {
    const panel = document.querySelector("[data-subscriber-privacy-panel]");
    if (!panel) return;

    const willOpen = panel.hidden;
    panel.hidden = !willOpen;
    setPrivacyToggleState(panel, willOpen);

    if (willOpen) {
      await loadPrivacyContent(panel);
      window.requestAnimationFrame(() => {
        panel.scrollIntoView({ block: "nearest", behavior: "smooth" });
      });
    }
  }

  function resetPrivacyPanel() {
    const panel = document.querySelector("[data-subscriber-privacy-panel]");
    if (!panel) return;

    panel.hidden = true;
    setPrivacyToggleState(panel, false);
  }

  function setStatus(form, message, state = "") {
    const status = form.querySelector("[data-subscriber-status]");
    if (!status) return;

    status.textContent = message;
    status.dataset.state = state;
  }

  function setSubmitting(form, isSubmitting) {
    const button = form.querySelector('button[type="submit"]');
    if (!button) return;

    if (isSubmitting) {
      button.dataset.originalText = button.textContent;
      button.disabled = true;
      button.textContent = t("sending");
      return;
    }

    button.disabled = false;
    if (button.dataset.originalText) {
      button.textContent = button.dataset.originalText;
      delete button.dataset.originalText;
    }
  }

  function isValidEmail(value) {
    const email = String(value || "").trim();
    if (!email) return false;

    const input = document.createElement("input");
    input.type = "email";
    input.value = email;
    return input.checkValidity();
  }

  function getFormData(form) {
    const emailField = form.querySelector('input[type="email"]');
    const consentField = form.querySelector('input[name="consent"]');
    const honeypot = form.querySelector('input[name="website"]');

    return {
      email: String(emailField?.value || "").trim().toLowerCase(),
      consent: Boolean(consentField?.checked),
      honeypot: String(honeypot?.value || "").trim()
    };
  }

  function validateForm(form) {
    const data = getFormData(form);

    if (!data.email) {
      setStatus(form, t("emptyEmail"), "error");
      form.querySelector('input[type="email"]')?.focus();
      return null;
    }

    if (!isValidEmail(data.email)) {
      setStatus(form, t("invalidEmail"), "error");
      form.querySelector('input[type="email"]')?.focus();
      return null;
    }

    if (!data.consent) {
      setStatus(form, t("consentRequired"), "error");
      form.querySelector('input[name="consent"]')?.focus();
      return null;
    }

    return data;
  }

  function buildPayload(form, data) {
    return {
      email: data.email,
      consent: true,
      consentVersion: CONSENT_VERSION,
      language: getLanguage(),
      ctaLocation: form.dataset.ctaLocation || "global_subscribe"
    };
  }

  async function submitSubscription(form, payload, endpoint = SUBSCRIBER_ENDPOINT) {
    if (!endpoint) {
      throw new Error("Subscriber endpoint is not configured.");
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      credentials: "omit",
      body: JSON.stringify(payload)
    });

    let body = null;
    try {
      body = await response.json();
    } catch (error) {
      body = null;
    }

    if (!response.ok || body?.ok === false) {
      const requestError = new Error("Subscriber request failed.");
      requestError.response = response;
      requestError.body = body;
      throw requestError;
    }

    return body || { ok: true, status: "subscribed" };
  }

  async function handleSubmit(event) {
    const form = event.target.closest("[data-subscriber-form]");
    if (!form) return;

    event.preventDefault();

    const data = validateForm(form);
    if (!data) return;

    if (data.honeypot) {
      return;
    }

    if (
      form.dataset.resubscribePending === "true" &&
      form.dataset.resubscribeEmail !== data.email
    ) {
      delete form.dataset.resubscribePending;
      delete form.dataset.resubscribeEmail;
    }

    const isResubscribe =
      form.dataset.resubscribePending === "true" &&
      form.dataset.resubscribeEmail === data.email;

    const payload = buildPayload(form, data);

    if (isResubscribe) {
      payload.confirmResubscribe = true;
    }

    setStatus(form, "", "");
    setSubmitting(form, true);

    try {
      const result = await submitSubscription(
        form,
        payload,
        isResubscribe
          ? RESUBSCRIBE_ENDPOINT
          : SUBSCRIBER_ENDPOINT
      );

      const status = String(result?.status || "").toLowerCase();

      if (["already_subscribed", "duplicate", "exists"].includes(status)) {
        delete form.dataset.resubscribePending;
        delete form.dataset.resubscribeEmail;

        setStatus(form, t("duplicate"), "info");
        return;
      }

      if (status === "resubscribed") {
        form.reset();

        delete form.dataset.resubscribePending;
        delete form.dataset.resubscribeEmail;

        setStatus(form, t("resubscribed"), "success");
        return;
      }

      form.reset();

      delete form.dataset.resubscribePending;
      delete form.dataset.resubscribeEmail;

      setStatus(form, t("success"), "success");

    } catch (error) {
      const status = String(error?.body?.status || "").toLowerCase();

      if (status === "resubscribe_required") {
        form.dataset.resubscribePending = "true";
        form.dataset.resubscribeEmail = data.email;

        setStatus(form, t("resubscribePrompt"), "info");
        return;
      }

      console.error("Subscriber capture error:", error);
      setStatus(form, t("technical"), "error");

    } finally {
      setSubmitting(form, false);

      const button = form.querySelector('button[type="submit"]');

      if (button) {
        button.textContent =
          form.dataset.resubscribePending === "true"
            ? t("resubscribeSubmit")
            : t("submit");

        delete button.dataset.originalText;
      }
    }
  }

  document.addEventListener("click", (event) => {
    const openButton = event.target.closest("[data-subscriber-open]");
    if (openButton) {
      event.preventDefault();
      openModal(openButton);
      return;
    }

    if (event.target.closest("[data-subscriber-privacy-toggle]")) {
      event.preventDefault();
      togglePrivacyPanel();
      return;
    }

    if (event.target.closest("[data-subscriber-close]")) {
      event.preventDefault();
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  document.addEventListener("submit", handleSubmit);
  waitForHeaderAndMount();

  window.ConsuTrainSubscriber = {
    initialized: true,
    open: openModal,
    close: closeModal
  };
})();
