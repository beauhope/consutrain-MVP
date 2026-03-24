/*
  =========================================================
  FILE: pwa.js
  PURPOSE:
  - تسجيل Service Worker
  - إظهار شريط تثبيت ذكي حسب نوع الجهاز
  - Chrome/Edge: زر تثبيت مباشر
  - iPhone/iPad Safari: إرشاد Add to Home Screen
  =========================================================
*/

(function () {
  if (!("serviceWorker" in navigator)) return;

  let deferredPrompt = null;
  const BANNER_ID = "pwa-install-banner";
  const DISMISS_KEY = "consutrain-pwa-banner-dismissed";

  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./sw.js");
      console.log("Service Worker registered successfully.");
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }

    // بعد التحميل، إذا كان الجهاز iPhone/iPad Safari ولم يكن التطبيق مثبتًا
    // نظهر رسالة إرشادية بدل انتظار beforeinstallprompt
    if (shouldShowIOSInstallHelp()) {
      const dismissed = localStorage.getItem(DISMISS_KEY);
      if (dismissed !== "true") {
        showIOSBanner();
      }
    }
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;

    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed === "true") return;

    showInstallBanner();
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    removeBanner();
    localStorage.removeItem(DISMISS_KEY);
    console.log("ConsuTrain app installed.");
  });

  function shouldShowIOSInstallHelp() {
    const ua = window.navigator.userAgent;
    const isIOS =
      /iphone|ipad|ipod/i.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    const isSafari =
      /safari/i.test(ua) &&
      !/crios/i.test(ua) &&
      !/fxios/i.test(ua) &&
      !/edgios/i.test(ua);

    const isInStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    return isIOS && isSafari && !isInStandalone;
  }

  function showInstallBanner() {
    if (document.getElementById(BANNER_ID)) return;

    const banner = document.createElement("div");
    banner.id = BANNER_ID;
    banner.className = "pwa-install-banner";
    banner.innerHTML = `
      <div class="pwa-install-banner__content">
        <div class="pwa-install-banner__text">
          <strong>تطبيق ConsuTrain جاهز للتثبيت</strong>
          <span>يمكنك تثبيته للوصول السريع وتجربة أفضل على الهاتف وسطح المكتب.</span>
        </div>
        <div class="pwa-install-banner__actions">
          <button class="pwa-install-btn pwa-install-btn--primary" id="pwaInstallBtn">
            تثبيت التطبيق
          </button>
          <button class="pwa-install-btn pwa-install-btn--secondary" id="pwaDismissBtn">
            لاحقًا
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    document.getElementById("pwaInstallBtn")?.addEventListener("click", async () => {
      if (!deferredPrompt) return;

      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome !== "accepted") {
        console.log("User dismissed the install prompt.");
      }

      deferredPrompt = null;
      removeBanner();
    });

    document.getElementById("pwaDismissBtn")?.addEventListener("click", () => {
      localStorage.setItem(DISMISS_KEY, "true");
      removeBanner();
    });
  }

  function showIOSBanner() {
  if (document.getElementById(BANNER_ID)) return;

  const banner = document.createElement("div");
  banner.id = BANNER_ID;
  banner.className = "pwa-install-banner";
  banner.innerHTML = `
    <div class="pwa-install-banner__content">
      <div class="pwa-install-banner__text">
        <strong>ثبّت ConsuTrain على iPhone</strong>
        <span>
          للتثبيت على iPhone أو iPad: اضغط زر المشاركة
          <b>⬆︎</b>
          في Safari ثم اختر
          <b>Add to Home Screen</b>.
        </span>
      </div>
      <div class="pwa-install-banner__actions">
        <button class="pwa-install-btn pwa-install-btn--primary" id="pwaIosOkBtn">
          فهمت
        </button>
        <button class="pwa-install-btn pwa-install-btn--secondary" id="pwaDismissBtn">
          لاحقًا
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);

  document.getElementById("pwaIosOkBtn")?.addEventListener("click", () => {
    removeBanner();
  });

  document.getElementById("pwaDismissBtn")?.addEventListener("click", () => {
    localStorage.setItem(DISMISS_KEY, "true");
    removeBanner();
  });
}

  function removeBanner() {
    const banner = document.getElementById(BANNER_ID);
    if (banner) banner.remove();
  }
})();