/*
  =========================================================
  FILE: assets/js/subscriber-capture.js
  PURPOSE:
  - تشغيل نماذج الاشتراك في تحديثات ConsuTrain
  - التحقق من البريد والموافقة
  - دعم العربية والفرنسية
  - إضافة نموذج نهاية المقال للصفحات المعرفة كمقالات
  - تجهيز Payload موحد لربطه لاحقًا بمسار CT-05

  IMPORTANT:
  - لا يظهر نجاح إلا بعد استجابة HTTP ناجحة من الـEndpoint.
  - CT-05 هو مالك الـEndpoint والتخزين والأتمتة وإلغاء الاشتراك.
  =========================================================
*/

(() => {
  "use strict";

  const CONSENT_VERSION = "email_updates_v1";

  /*
    CT-05:
    ضع هنا Webhook / API endpoint النهائي بعد اعتماده واختباره.
    يجب أن يقبل POST JSON ويعيد HTTP 2xx فقط عند نجاح المعالجة.
  */
  const SUBSCRIBER_ENDPOINT = "";

  const messages = {
    ar: {
      emptyEmail: "يرجى إدخال بريدك الإلكتروني.",
      invalidEmail: "يرجى إدخال بريد إلكتروني صالح.",
      consentRequired: "يرجى تأكيد موافقتك على استلام التحديثات عبر البريد الإلكتروني.",
      success: "تم الاشتراك. شكرًا لك!",
      duplicate: "أنت مشترك بالفعل.",
      technical: "تعذر إكمال الاشتراك حاليًا. يرجى المحاولة مرة أخرى.",
      sending: "جارٍ تسجيل اشتراكك..."
    },
    fr: {
      emptyEmail: "Veuillez saisir votre adresse e-mail.",
      invalidEmail: "Veuillez saisir une adresse e-mail valide.",
      consentRequired: "Veuillez confirmer votre accord pour recevoir les actualités par e-mail.",
      success: "Inscription confirmée. Merci !",
      duplicate: "Vous êtes déjà inscrit.",
      technical: "L’inscription n’a pas pu être finalisée. Veuillez réessayer.",
      sending: "Inscription en cours..."
    }
  };

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

  function getMessage(key) {
    return messages[getLanguage()][key];
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
      button.textContent = getMessage("sending");
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
      setStatus(form, getMessage("emptyEmail"), "error");
      form.querySelector('input[type="email"]')?.focus();
      return null;
    }

    if (!isValidEmail(data.email)) {
      setStatus(form, getMessage("invalidEmail"), "error");
      form.querySelector('input[type="email"]')?.focus();
      return null;
    }

    if (!data.consent) {
      setStatus(form, getMessage("consentRequired"), "error");
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
      ctaLocation: form.dataset.ctaLocation || "unknown"
    };
  }

  async function submitSubscription(form, payload) {
    if (!SUBSCRIBER_ENDPOINT) {
      throw new Error("Subscriber endpoint is not configured.");
    }

    const response = await fetch(SUBSCRIBER_ENDPOINT, {
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

    /*
      Honeypot:
      إذا تم ملؤه غالبًا الطلب آلي. نظهر نجاحًا شكليًا دون إرسال أي بيانات.
    */
    if (data.honeypot) {
      form.reset();
      setStatus(form, getMessage("success"), "success");
      return;
    }

    const payload = buildPayload(form, data);

    setStatus(form, "", "");
    setSubmitting(form, true);

    try {
      const result = await submitSubscription(form, payload);
      const status = String(result?.status || "").toLowerCase();

      if (["already_subscribed", "duplicate", "exists"].includes(status)) {
        setStatus(form, getMessage("duplicate"), "info");
      } else {
        form.reset();
        setStatus(form, getMessage("success"), "success");
      }
    } catch (error) {
      console.error("Subscriber capture error:", error);
      setStatus(form, getMessage("technical"), "error");
    } finally {
      setSubmitting(form, false);
    }
  }

  function hasArticleStructuredData() {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');

    function containsArticleType(value) {
      if (Array.isArray(value)) return value.some(containsArticleType);
      if (!value || typeof value !== "object") return false;

      const type = value["@type"];
      const types = Array.isArray(type) ? type : [type];
      if (types.some((item) => ["Article", "BlogPosting", "NewsArticle"].includes(item))) {
        return true;
      }

      return Object.values(value).some(containsArticleType);
    }

    return Array.from(scripts).some((script) => {
      try {
        return containsArticleType(JSON.parse(script.textContent || "{}"));
      } catch (error) {
        return false;
      }
    });
  }

  function getPrimaryArticle() {
    const articles = Array.from(document.querySelectorAll("main article"));
    if (!articles.length) return null;

    return articles.sort((a, b) =>
      (b.textContent || "").length - (a.textContent || "").length
    )[0];
  }

  function getArticleCaptureMarkup() {
    const language = getLanguage();
    const privacyHref = getPrivacyHref(language);

    if (language === "fr") {
      return `
        <section class="subscriber-capture subscriber-capture--article" data-article-subscriber-capture aria-labelledby="articleSubscriberTitle">
          <div class="subscriber-card">
            <div class="subscriber-copy">
              <span class="subscriber-eyebrow">Restez informé</span>
              <h2 id="articleSubscriberTitle">Ce contenu vous a été utile ?</h2>
              <p>Recevez les prochains articles, outils et ressources pratiques publiés par ConsuTrain.</p>
            </div>

            <form class="subscriber-form" data-subscriber-form data-cta-location="article_end" novalidate>
              <div class="subscriber-form-row">
                <label class="subscriber-sr-only" for="articleSubscriberEmail">Votre adresse e-mail</label>
                <input id="articleSubscriberEmail" name="email" type="email" inputmode="email" autocomplete="email" placeholder="Votre adresse e-mail" required>
                <button class="btn btn-primary" type="submit">Recevoir les nouveautés</button>
              </div>

              <label class="subscriber-consent">
                <input name="consent" type="checkbox" value="yes" required>
                <span>J’accepte de recevoir par e-mail les actualités et contenus professionnels de ConsuTrain. Je peux me désabonner à tout moment.</span>
              </label>

              <p class="subscriber-privacy-note"><a href="${privacyHref}">Politique de confidentialité</a></p>
              <div class="subscriber-hp" aria-hidden="true">
                <label>Website <input name="website" type="text" tabindex="-1" autocomplete="off"></label>
              </div>
              <p class="subscriber-status" data-subscriber-status role="status" aria-live="polite"></p>
            </form>
          </div>
        </section>
      `;
    }

    return `
      <section class="subscriber-capture subscriber-capture--article" data-article-subscriber-capture aria-labelledby="articleSubscriberTitle">
        <div class="subscriber-card">
          <div class="subscriber-copy">
            <span class="subscriber-eyebrow">ابقَ على اطلاع</span>
            <h2 id="articleSubscriberTitle">هل كان هذا المحتوى مفيدًا؟</h2>
            <p>اشترك ليصلك جديد المقالات والأدوات والموارد المهنية من ConsuTrain.</p>
          </div>

          <form class="subscriber-form" data-subscriber-form data-cta-location="article_end" novalidate>
            <div class="subscriber-form-row">
              <label class="subscriber-sr-only" for="articleSubscriberEmail">بريدك الإلكتروني</label>
              <input id="articleSubscriberEmail" name="email" type="email" inputmode="email" autocomplete="email" placeholder="بريدك الإلكتروني" required>
              <button class="btn btn-primary" type="submit">أرسل لي الجديد</button>
            </div>

            <label class="subscriber-consent">
              <input name="consent" type="checkbox" value="yes" required>
              <span>أوافق على تلقي تحديثات ومحتوى مهني من ConsuTrain عبر البريد الإلكتروني، ويمكنني إلغاء الاشتراك في أي وقت.</span>
            </label>

            <p class="subscriber-privacy-note"><a href="${privacyHref}">سياسة الخصوصية</a></p>
            <div class="subscriber-hp" aria-hidden="true">
              <label>Website <input name="website" type="text" tabindex="-1" autocomplete="off"></label>
            </div>
            <p class="subscriber-status" data-subscriber-status role="status" aria-live="polite"></p>
          </form>
        </div>
      </section>
    `;
  }

  function injectArticleCapture() {
    if (document.querySelector("[data-article-subscriber-capture]")) return;
    if (!hasArticleStructuredData()) return;

    const article = getPrimaryArticle();
    if (!article) return;

    article.insertAdjacentHTML("beforeend", getArticleCaptureMarkup());
  }

  document.addEventListener("submit", handleSubmit);
  injectArticleCapture();
})();
