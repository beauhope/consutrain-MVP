/*
  =========================================================
  FILE: assets/js/unsubscribe.js
  PURPOSE:
  - قراءة token من Query String
  - عدم تنفيذ أي إلغاء عند GET
  - تنفيذ POST فقط بعد تأكيد المستخدم
  - معالجة حالات الإلغاء المعتمدة AR/FR
  =========================================================
*/

(() => {
  "use strict";

  const API_ENDPOINT = "https://api.consutrain.com/v1/unsubscribe";
  const token = new URLSearchParams(window.location.search).get("token")?.trim() || "";
  const language = (document.documentElement.lang || "").toLowerCase().startsWith("fr") ? "fr" : "ar";

  const copy = {
    ar: {
      confirmTitle: "هل تريد إلغاء الاشتراك؟",
      confirmText: "بعد التأكيد، لن نرسل إلى هذا الاشتراك تحديثات ConsuTrain عبر البريد الإلكتروني. يمكنك الاشتراك من جديد مستقبلًا بموافقة جديدة.",
      submit: "إلغاء الاشتراك",
      submitting: "جارٍ إلغاء الاشتراك...",
      successTitle: "تم إلغاء الاشتراك",
      successText: "تم إلغاء اشتراكك بنجاح، ولن تصلك تحديثات ConsuTrain عبر هذا الاشتراك.",
      alreadyTitle: "الاشتراك ملغى بالفعل",
      alreadyText: "هذا الاشتراك ملغى بالفعل، ولا يلزم اتخاذ أي إجراء إضافي.",
      invalidTitle: "رابط إلغاء الاشتراك غير صالح",
      invalidText: "رابط إلغاء الاشتراك غير صالح أو لم يعد قابلًا للاستخدام.",
      errorTitle: "تعذر إكمال الطلب",
      errorText: "تعذر إلغاء الاشتراك حاليًا. يرجى المحاولة مرة أخرى لاحقًا.",
      retry: "المحاولة مرة أخرى"
    },
    fr: {
      confirmTitle: "Souhaitez-vous vous désabonner ?",
      confirmText: "Après confirmation, nous n’enverrons plus les actualités ConsuTrain associées à cet abonnement. Vous pourrez vous réinscrire ultérieurement avec un nouveau consentement.",
      submit: "Se désabonner",
      submitting: "Désinscription en cours...",
      successTitle: "Désinscription confirmée",
      successText: "Votre désinscription a bien été enregistrée. Vous ne recevrez plus les actualités ConsuTrain liées à cet abonnement.",
      alreadyTitle: "Abonnement déjà désactivé",
      alreadyText: "Cet abonnement est déjà désactivé. Aucune action supplémentaire n’est nécessaire.",
      invalidTitle: "Lien de désinscription invalide",
      invalidText: "Ce lien de désinscription est invalide ou ne peut plus être utilisé.",
      errorTitle: "Impossible de finaliser la demande",
      errorText: "La désinscription n’a pas pu être effectuée pour le moment. Veuillez réessayer plus tard.",
      retry: "Réessayer"
    }
  };

  const strings = copy[language];
  const title = document.getElementById("unsubscribeStateTitle");
  const message = document.getElementById("unsubscribeStateMessage");
  const status = document.getElementById("unsubscribeStatus");
  const button = document.getElementById("unsubscribeConfirmButton");
  const card = document.querySelector("[data-unsubscribe-card]");

  function setVisualState(state) {
    if (!card) return;
    card.dataset.state = state;
  }

  function setStatusText(textValue, state = "") {
    if (!status) return;
    status.textContent = textValue;
    status.dataset.state = state;
  }

  function setResult(kind) {
    if (!title || !message || !button) return;

    if (kind === "unsubscribed") {
      title.textContent = strings.successTitle;
      message.textContent = strings.successText;
      button.disabled = true;
      button.textContent = strings.submit;
      button.hidden = true;
      button.style.display = "none";
      setStatusText("", "success");
      setVisualState("success");
      return;
    }

    if (kind === "already_unsubscribed") {
      title.textContent = strings.alreadyTitle;
      message.textContent = strings.alreadyText;
      button.disabled = true;
      button.textContent = strings.submit;
      button.hidden = true;
      button.style.display = "none";
      setStatusText("", "info");
      setVisualState("info");
      return;
    }

    if (kind === "invalid_unsubscribe_token") {
      title.textContent = strings.invalidTitle;
      message.textContent = strings.invalidText;
      button.disabled = true;
      button.textContent = strings.submit;
      button.hidden = true;
      button.style.display = "none";
      setStatusText("", "error");
      setVisualState("error");
      return;
    }

    title.textContent = strings.errorTitle;
    message.textContent = strings.errorText;
    button.hidden = false;
    button.style.removeProperty("display");
    button.disabled = false;
    button.textContent = strings.retry;
    setStatusText("", "error");
    setVisualState("error");
  }

  function syncLanguageLinkWithToken() {
    const header = document.getElementById("header-placeholder");
    if (!header) return false;

    const languageLink = header.querySelector(".language-badge");
    if (!languageLink) return false;

    const baseTarget = language === "fr"
      ? (document.body.dataset.arLink || "../unsubscribe.html")
      : (document.documentElement.dataset.frLink || "fr/unsubscribe.html");

    const targetUrl = new URL(baseTarget, document.baseURI);
    if (token) {
      targetUrl.searchParams.set("token", token);
    }

    languageLink.href = targetUrl.href;
    return true;
  }

  function watchLanguageLink() {
    if (syncLanguageLinkWithToken()) return;

    const header = document.getElementById("header-placeholder");
    if (!header) return;

    const observer = new MutationObserver(() => {
      if (syncLanguageLinkWithToken()) {
        observer.disconnect();
      }
    });

    observer.observe(header, { childList: true, subtree: true });
  }

  async function submitUnsubscribe() {
    if (!token || !button) {
      setResult("invalid_unsubscribe_token");
      return;
    }

    button.disabled = true;
    button.textContent = strings.submitting;
    setStatusText(strings.submitting, "info");
    setVisualState("loading");

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        mode: "cors",
        credentials: "omit",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ token }),
        signal: controller.signal
      });

      let body = null;
      try {
        body = await response.json();
      } catch (error) {
        body = null;
      }

      const responseStatus = String(
        body?.status ||
        body?.code ||
        body?.error ||
        ""
      ).trim().toLowerCase();

      const responseReason = String(
        body?.reason ||
        ""
      ).trim().toLowerCase();

      if (["unsubscribed", "already_unsubscribed", "invalid_unsubscribe_token"].includes(responseStatus)) {
        setResult(responseStatus);
        return;
      }

      if (responseStatus === "validation_failed" && responseReason === "invalid_unsubscribe_token") {
        setResult("invalid_unsubscribe_token");
        return;
      }

      setResult("error");
    } catch (error) {
      setResult("error");
    } finally {
      window.clearTimeout(timeoutId);
      if (button && !button.hidden && button.textContent === strings.submitting) {
        button.disabled = false;
        button.textContent = strings.submit;
      }
    }
  }

  if (!token) {
    setResult("invalid_unsubscribe_token");
  } else {
    if (button) {
      button.disabled = false;
      button.addEventListener("click", submitUnsubscribe);
    }
    setVisualState("ready");
  }

  watchLanguageLink();
})();
