/*
  =========================================================
  FILE: assets/js/includes.js
  PURPOSE:
  - تحميل الهيدر والفوتر المشتركين
  - استبدال __ROOT__ بمسار الجذر المناسب
  - تفعيل القائمة الرئيسية في الشاشات الصغيرة
  - تفعيل القوائم الفرعية داخل الهيدر على الجوال

  IMPORTANT:
  هذا الملف يدعم الصفحات الموجودة:
  - في الجذر
  - داخل مجلدات فرعية مثل learn/ و tools/

  لذلك نعتمد على:
  1) data-root على body
  2) بناء مسار partials بناءً على root
  =========================================================
*/


/*
  ---------------------------------------------------------
  GLOBAL SCROLL FIX
  PURPOSE:
  منع المتصفح من فتح الصفحات الداخلية من منتصفها عند التنقل
  من القوائم أو عند الرجوع من الكاش.
  ---------------------------------------------------------
*/
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

function forceTopOnFreshNavigation() {
  if (window.location.hash) return;

  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  if (document.body) {
    document.body.scrollTop = 0;
  }
}

forceTopOnFreshNavigation();
window.addEventListener("DOMContentLoaded", forceTopOnFreshNavigation);
window.addEventListener("load", () => {
  forceTopOnFreshNavigation();
  setTimeout(forceTopOnFreshNavigation, 120);
  setTimeout(forceTopOnFreshNavigation, 400);
});
window.addEventListener("pageshow", () => {
  forceTopOnFreshNavigation();
  setTimeout(forceTopOnFreshNavigation, 80);
  setTimeout(forceTopOnFreshNavigation, 250);
});

/*
  ---------------------------------------------------------
  FUNCTION: getRootPath
  PURPOSE:
  قراءة قيمة data-root من body.
  إذا لم تكن موجودة، يتم اعتماد "." كقيمة افتراضية.
  ---------------------------------------------------------
*/
function getRootPath() {
  return document.body.dataset.root || ".";
}

/*
  ---------------------------------------------------------
  FUNCTION: getPartialsBasePath
  PURPOSE:
  تحديد المسار الصحيح لمجلد partials حسب موقع الصفحة.

  EXAMPLES:
  - إذا كانت الصفحة في الجذر:
    data-root="."
    الناتج: ./partials

  - إذا كانت الصفحة داخل learn/:
    data-root=".."
    الناتج: ../partials
  ---------------------------------------------------------
*/
function getPartialsBasePath() {
  const root = getRootPath();
  return `${root}/partials`;
}

function isFrenchPage() {
  const lang = (document.documentElement.lang || "").toLowerCase();
  const path = window.location.pathname.toLowerCase();
  return lang === "fr" || path.includes("/fr/");
}

function getLocalizedPartialFileName(baseName) {
  return isFrenchPage() ? `fr-${baseName}` : baseName;
}

function getLocalizedHomeHref(root) {
  return isFrenchPage() ? `${root}/fr/index.html` : `${root}/index.html`;
}

function getLocalizedServiceHref(root) {
  return isFrenchPage() ? `${root}/fr/services.html` : `${root}/services.html`;
}

function syncLocalizedLanguageLink() {
  if (!isFrenchPage()) return;

  const targetHref = document.body.dataset.arLink || document.body.dataset.languageSwitchAr;
  if (!targetHref) return;

  document.querySelectorAll(".fr-language-link, .language-badge, a[lang=\"ar\"], a[hreflang=\"ar\"]").forEach((languageLink) => {
    languageLink.setAttribute("href", targetHref);
  });
}

/*
  ---------------------------------------------------------
  FUNCTION: applyRootPath
  PURPOSE:
  استبدال __ROOT__ داخل محتوى الهيدر أو الفوتر
  بالمسار الصحيح المناسب للصفحة الحالية.
  ---------------------------------------------------------
*/
function applyRootPath(htmlText) {
  const root = getRootPath();
  return htmlText.replaceAll("__ROOT__", root);
}

function initCloudflareAnalytics() {
  if (document.getElementById("cloudflare-web-analytics")) return;

  const script = document.createElement("script");
  script.id = "cloudflare-web-analytics";
  script.defer = true;
  script.src = "https://static.cloudflareinsights.com/beacon.min.js";
  script.setAttribute("data-cf-beacon", '{"token":"f26620d1e6a1405da300ec65f33439dc"}');
  document.body.appendChild(script);
}

/*
  ---------------------------------------------------------
  FUNCTION: loadPartial
  PURPOSE:
  تحميل ملف HTML جزئي ووضعه داخل العنصر المطلوب.

  PARAMETERS:
  - selector: مكان إدراج الجزء
  - filePath: المسار الكامل للملف الجزئي
  ---------------------------------------------------------
*/
async function loadPartial(selector, filePath) {
  const target = document.querySelector(selector);
  if (!target) return;

  try {
    const version = "v=20260509_header_courses_index_fix";
    const separator = filePath.includes("?") ? "&" : "?";
    const cacheSafePath = `${filePath}${separator}${version}`;

    const res = await fetch(cacheSafePath, {
      cache: "no-store"
    });

    if (!res.ok) {
      throw new Error(`Failed to load ${filePath}`);
    }

    let html = await res.text();
    html = applyRootPath(html);

    target.innerHTML = html;

    if (selector === "#header-placeholder") {
      syncLocalizedLanguageLink();
      initHeaderNavigation();
      setActiveNavLink();
      restoreHomeHashScroll();
    }

    if (selector === "#footer-placeholder") {
      initQuickContact();
      initBackToTop();
      initGlobalShareButton();
      initCloudflareAnalytics();
    }

  } catch (error) {
    console.error("Partial loading error:", error);
  }
}

/*
  ---------------------------------------------------------
  FUNCTION: initHeaderNavigation
  PURPOSE:
  تشغيل عناصر الهيدر بعد تحميله:
  - زر فتح/إغلاق القائمة الرئيسية على الجوال
  - فتح/إغلاق القوائم الفرعية كـ accordion على الجوال
  - إغلاق القوائم عند الضغط خارج الهيدر
  - إعادة ضبط الحالة عند تغيير حجم الشاشة
  ---------------------------------------------------------
*/
function initHeaderNavigation() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  const header = document.querySelector(".site-header");

  if (!toggle || !nav || !header) return;

  const MOBILE_BREAKPOINT = 900;
  const submenuToggles = document.querySelectorAll(".submenu-toggle");
  const submenuParents = document.querySelectorAll(".has-submenu");
  const navLinks = nav.querySelectorAll("a");
  const menuLabels = isFrenchPage()
    ? { open: "Ouvrir le menu", close: "Fermer le menu" }
    : { open: "فتح القائمة", close: "إغلاق القائمة" };

  let backdrop = document.querySelector(".nav-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    backdrop.setAttribute("hidden", "");
    document.body.appendChild(backdrop);
  } else if (backdrop.parentElement !== document.body) {
    document.body.appendChild(backdrop);
  }

  // لا نضيف زر إغلاق نصي داخل القائمة حتى لا يظهر بجانب العناوين.
  // يتم الإغلاق من زر القائمة نفسه أو بالضغط خارج القائمة.
  const closeButton = null;

  function isMobileView() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function closeSubmenus() {
    submenuParents.forEach((item) => {
      item.classList.remove("submenu-open");

      const button = item.querySelector(".submenu-toggle");
      if (button) {
        button.setAttribute("aria-expanded", "false");
      }
    });
  }

  function closeMobileNav() {
    nav.classList.remove("open");
    document.body.classList.remove("nav-is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", menuLabels.open);
    toggle.textContent = "☰";
    backdrop.setAttribute("hidden", "");
    closeSubmenus();
  }

  function openMobileNav() {
    nav.classList.add("open");
    document.body.classList.add("nav-is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", menuLabels.close);
    toggle.textContent = "×";
    backdrop.removeAttribute("hidden");
  }

  // Reset any stale state after partial injection.
  closeMobileNav();

  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isMobileView()) return;

    const isOpen = nav.classList.contains("open");
    isOpen ? closeMobileNav() : openMobileNav();
  });

  if (closeButton) {
    closeButton.addEventListener("click", (event) => {
      event.preventDefault();
      closeMobileNav();
    });
  }

  backdrop.addEventListener("click", closeMobileNav);

  function toggleSubmenu(parentItem) {
    const button = parentItem.querySelector(".submenu-toggle");
    const willOpen = !parentItem.classList.contains("submenu-open");
    closeSubmenus();

    if (willOpen) {
      parentItem.classList.add("submenu-open");
      if (button) {
        button.setAttribute("aria-expanded", "true");
      }
    }
  }

  submenuToggles.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const parentItem = event.currentTarget.closest(".has-submenu");
      if (!parentItem || !isMobileView()) return;

      toggleSubmenu(parentItem);
    });
  });

  nav.querySelectorAll(".nav-link--parent").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!isMobileView()) return;

      const parentItem = event.currentTarget.closest(".has-submenu");
      if (!parentItem) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      toggleSubmenu(parentItem);
    });
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (link.classList.contains("nav-link--parent")) return;

      if (isMobileView()) {
        window.setTimeout(closeMobileNav, 0);
      }
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInsideHeader = event.target.closest(".site-header");
    const clickedInsideNav = event.target.closest("#mainNav");

    if (isMobileView() && !clickedInsideHeader && !clickedInsideNav) {
      closeMobileNav();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileNav();
    }
  });

  window.addEventListener("resize", () => {
    if (!isMobileView()) {
      closeMobileNav();
    }
  });

  window.addEventListener("pageshow", closeMobileNav);
}

/*
  ---------------------------------------------------------
  FUNCTION: setActiveNavLink
  PURPOSE:
  تحديد:
  1) القسم الرئيسي النشط
  2) الرابط الفرعي النشط داخل القائمة المنسدلة

  المنهجية:
  - مطابقة دقيقة للرابط الفرعي الحالي إن أمكن
  - ثم تفعيل الرابط الرئيسي المناسب حسب القسم
  ---------------------------------------------------------
*/
function setActiveNavLink() {
  const path = window.location.pathname.toLowerCase();

  const mainLinks = document.querySelectorAll(".main-nav .nav-link");
  const submenuLinks = document.querySelectorAll(".submenu a");

  if (!mainLinks.length) return;

  mainLinks.forEach((link) => link.classList.remove("is-active"));
  submenuLinks.forEach((link) => link.classList.remove("is-active-sub"));

  /*
    -------------------------------------------------------
    STEP 1:
    محاولة مطابقة الصفحة الحالية مع أحد الروابط الفرعية
    -------------------------------------------------------
  */
  let matchedSubmenuLink = null;

  submenuLinks.forEach((link) => {
    const href = (link.getAttribute("href") || "").toLowerCase();
    if (!href) return;

    const cleanHref = href.split("?")[0].split("#")[0];

    if (path.endsWith(cleanHref)) {
      matchedSubmenuLink = link;
    }
  });

  if (matchedSubmenuLink) {
    matchedSubmenuLink.classList.add("is-active-sub");

    const parentNavItem = matchedSubmenuLink.closest(".has-submenu");
    const parentMainLink = parentNavItem?.querySelector(".nav-link--parent");

    if (parentMainLink) {
      parentMainLink.classList.add("is-active");
      return;
    }
  }

  /*
    -------------------------------------------------------
    STEP 2:
    إذا لم توجد مطابقة فرعية، نفعل الرابط الرئيسي حسب القسم
    -------------------------------------------------------
  */
  let activeHref = null;

  if (
    path.endsWith("/index.html") ||
    path.endsWith("/")
  ) {
    activeHref = "index.html";
  } else if (path.endsWith("/start-here.html")) {
    activeHref = "start-here.html";
  } else if (path.includes("/learn/") || path.endsWith("/learn.html")) {
    activeHref = "learn.html";
  } else if (path.includes("/courses/") || path.endsWith("/courses.html")) {
    activeHref = "courses/index.html";
  } else if (path.includes("/services/") || path.endsWith("/services.html")) {
    activeHref = "services.html";
  } else if (path.includes("/tools/") || path.endsWith("/tools.html")) {
    activeHref = "tools.html";
  } else if (path.endsWith("/about.html") || path.endsWith("/expert.html")) {
    activeHref = "about.html";
  } else if (path.endsWith("/contact.html")) {
    activeHref = "contact.html";
  }

  if (!activeHref) return;

  mainLinks.forEach((link) => {
    const href = (link.getAttribute("href") || "").toLowerCase();
    if (href.endsWith(activeHref)) {
      link.classList.add("is-active");
    }
  });
}



/*
  ---------------------------------------------------------
  FUNCTION: initQuickContact
  PURPOSE:
  تشغيل زر التواصل السريع العائم بعد تحميل الفوتر.
  ---------------------------------------------------------
*/
function initQuickContact() {
  const widget = document.querySelector(".quick-contact-widget");
  const toggle = document.getElementById("quickContactToggle");
  const panel = document.getElementById("quickContactPanel");
  const closeButton = widget?.querySelector(".quick-contact-close");

  if (!widget || !toggle || !panel) return;

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

/*
  ---------------------------------------------------------
  FUNCTION: initBackToTop
  PURPOSE:
  تشغيل زر العودة إلى الأعلى المشترك بعد تحميل الفوتر.
  ---------------------------------------------------------
*/
function initBackToTop() {
  const backToTop = document.getElementById("backToTop");
  if (!backToTop) return;

  function updateBackToTopVisibility() {
    if (window.scrollY > 250) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }

  window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
  updateBackToTopVisibility();

  backToTop.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

function getConsuTrainHomepageUrl() {
  const root = getRootPath();
  const homePath = isFrenchPage() ? `${root}/fr/index.html` : `${root}/index.html`;
  return new URL(homePath, window.location.href).href;
}

function getConsuTrainShareText() {
  if (isFrenchPage()) {
    return `ConsuTrain propose des outils, ressources et services pratiques pour l'administration, la stratégie, la qualité, les études de faisabilité et la gestion de projet.\n\nDécouvrir la plateforme :\n${getConsuTrainHomepageUrl()}`;
  }

  return `منصة ConsuTrain تقدم أدوات وموارد مجانية في الإدارة، التخطيط، الجودة، دراسات الجدوى، وإدارة المشاريع.\n\nجرّب المنصة:\n${getConsuTrainHomepageUrl()}`;
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

function showGlobalShareStatus(message) {
  const status = document.getElementById("globalShareStatus");
  if (!status) return;

  status.textContent = message;
  status.classList.add("show");
  window.clearTimeout(showGlobalShareStatus.timer);
  showGlobalShareStatus.timer = window.setTimeout(() => {
    status.classList.remove("show");
  }, 2400);
}

function initGlobalShareButton() {
  const shareButton = document.getElementById("globalShareButton");
  if (!shareButton) return;

  shareButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const homepageUrl = getConsuTrainHomepageUrl();
    const shareText = getConsuTrainShareText();

    if (navigator.share) {
      try {
        await navigator.share({
          title: "ConsuTrain",
          text: shareText,
          url: homepageUrl
        });
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }

    try {
      await copyTextToClipboard(shareText);
      showGlobalShareStatus(isFrenchPage() ? "Lien copié" : "تم نسخ رابط الموقع");
    } catch (error) {
      showGlobalShareStatus(isFrenchPage() ? "Impossible de copier le lien" : "تعذر النسخ، حاول مرة أخرى");
    }
  });
}

/*
  ---------------------------------------------------------
  DOM READY
  PURPOSE:
  بعد اكتمال تحميل الصفحة:
  - يتم احتساب مسار partials
  - يتم تحميل الهيدر
  - يتم تحميل الفوتر
  ---------------------------------------------------------
*/
document.addEventListener("DOMContentLoaded", () => {
  const partialsBase = getPartialsBasePath();

  loadPartial("#header-placeholder", `${partialsBase}/${getLocalizedPartialFileName("header.html")}`);
  loadPartial("#footer-placeholder", `${partialsBase}/${getLocalizedPartialFileName("footer.html")}`);
  initBreadcrumbs();
  initFriendlyNextSteps();
  restoreHomeHashScroll();
});

window.addEventListener("load", () => {
  restoreHomeHashScroll();
  setTimeout(restoreHomeHashScroll, 120);
});

function restoreHomeHashScroll() {
  if (window.location.hash !== "#share-benefit") return;

  const path = window.location.pathname.toLowerCase();
  const isHomePage = path.endsWith("/") || path.endsWith("/index.html");
  if (!isHomePage) return;

  const target = document.getElementById("share-benefit");
  if (!target) return;

  target.scrollIntoView({ block: "start" });
}

/*
  ---------------------------------------------------------
  FUNCTION: initBreadcrumbs
  PURPOSE:
  إنشاء Breadcrumbs داخل الصفحات الداخلية اعتمادًا على:
  - data-breadcrumb-section
  - data-breadcrumb-title

  EXAMPLE:
  <body
    data-root="."
    data-breadcrumb-section="التعلّم"
    data-breadcrumb-title="القاموس الإداري"
  >
  ---------------------------------------------------------
*/
function initBreadcrumbs() {
  const root = getRootPath();
  const section = document.body.dataset.breadcrumbSection;
  const title = document.body.dataset.breadcrumbTitle;

  if (!section || !title) return;

  const container = ensureBreadcrumbsContainer();
  if (!container) return;

  let sectionHref = null;

  if (isFrenchPage()) {
    if (section === "Services") {
      sectionHref = `${root}/fr/services.html`;
    } else if (section === "Apprendre") {
      sectionHref = `${root}/fr/learn.html`;
    } else if (section === "Outils") {
      sectionHref = `${root}/fr/tools.html`;
    } else if (section === "Ressources") {
      sectionHref = `${root}/fr/resources/index.html`;
    } else if (section === "Formations") {
      sectionHref = `${root}/fr/courses/index.html`;
    } else if (section === "À propos" || section === "A propos") {
      sectionHref = `${root}/fr/about.html`;
    } else if (section === "Contact") {
      sectionHref = `${root}/fr/contact.html`;
    }
  }

  if (section === "البداية") {
    sectionHref = `${root}/start-here.html`;
  } else if (section === "التعلّم") {
    sectionHref = `${root}/learn.html`;
  } else if (section === "الدورات") {
    sectionHref = `${root}/courses/index.html`;
  } else if (section === "الأدوات") {
    sectionHref = `${root}/tools.html`;
  } else if (section === "الخدمات") {
    sectionHref = `${root}/services.html`;
  } else if (section === "حول المنصة") {
    sectionHref = `${root}/about.html`;
  }

  const nav = document.createElement("nav");
  nav.className = "breadcrumbs";
  nav.setAttribute("aria-label", isFrenchPage() ? "Fil d'Ariane" : "مسار التنقل");

  const list = document.createElement("ol");

  const homeItem = document.createElement("li");
  homeItem.innerHTML = isFrenchPage()
    ? `<a href="${root}/fr/index.html">Accueil</a>`
    : `<a href="${root}/index.html">الرئيسية</a>`;
  list.appendChild(homeItem);

  if (section && sectionHref && section !== title) {
    const sectionItem = document.createElement("li");
    sectionItem.innerHTML = `<a href="${sectionHref}">${section}</a>`;
    list.appendChild(sectionItem);
  }

  const currentItem = document.createElement("li");
  currentItem.innerHTML = `<span class="current">${title}</span>`;
  list.appendChild(currentItem);

  nav.appendChild(list);
  container.innerHTML = "";
  container.appendChild(nav);
}

/*
  ---------------------------------------------------------
  FUNCTION: ensureBreadcrumbsContainer
  PURPOSE:
  توحيد مكان Breadcrumbs مركزيًا بعد الهيدر مباشرة.
  إذا كانت الصفحة لا تحتوي على الحاوية، يتم إنشاؤها تلقائيًا.
  وإذا كانت داخل حاوية أخرى، يتم نقلها بعد #header-placeholder.
  ---------------------------------------------------------
*/
function ensureBreadcrumbsContainer() {
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (!headerPlaceholder) return null;

  let container = document.getElementById("breadcrumbs-placeholder");

  if (!container) {
    container = document.createElement("div");
    container.id = "breadcrumbs-placeholder";
  }

  if (container.previousElementSibling !== headerPlaceholder) {
    headerPlaceholder.insertAdjacentElement("afterend", container);
  }

  return container;
}

/*
  ---------------------------------------------------------
  FUNCTION: initFriendlyNextSteps
  PURPOSE:
  إضافة قسم "ماذا أفعل الآن؟" تلقائيًا في الصفحات الداخلية.
  الهدف: تسهيل حركة المستخدم غير الخبير دون تعديل كل صفحة يدويًا.
  ---------------------------------------------------------
*/
function initFriendlyNextSteps() {
  const title = document.body.dataset.breadcrumbTitle;
  const section = document.body.dataset.breadcrumbSection;
  const root = getRootPath();

  if (!title || !section) return;
  if (document.getElementById("friendlyNextSteps")) return;
  if (document.getElementById("resourcesNextStepsTitle")) return;

  const path = window.location.pathname.toLowerCase();
  const isHomePage = path.endsWith("/") || path.endsWith("/index.html");
  if (isHomePage) return;

  const main = document.querySelector("main");
  if (!main) return;

  const steps = getFriendlyNextStepsBySection(section, root);
  if (!steps.length) return;

  const sectionElement = document.createElement("section");
  sectionElement.className = "home-section friendly-next-steps";
  sectionElement.id = "friendlyNextSteps";
  sectionElement.setAttribute("aria-labelledby", "friendlyNextStepsTitle");

  sectionElement.innerHTML = `
    <div class="container">
      <div class="section-card friendly-next-steps-card">
        <div class="section-head">
          <div>
            <span class="eyebrow">ماذا أفعل الآن؟</span>
            <h2 id="friendlyNextStepsTitle">اختر خطوتك التالية بسهولة</h2>
            <p>
              يمكنك الانتقال مباشرة إلى الخطوة الأنسب دون الرجوع إلى أعلى الصفحة أو البحث في القوائم.
            </p>
          </div>
        </div>

        <div class="cards-grid friendly-next-steps-grid">
          ${steps.map((step) => `
            <article class="feature-card friendly-next-step-card">
              <h3>${step.title}</h3>
              <p>${step.description}</p>
              <a class="card-link" href="${step.href}">${step.label}</a>
            </article>
          `).join("")}
        </div>
      </div>
    </div>
  `;

  main.appendChild(sectionElement);
}

function getFriendlyNextStepsBySection(section, root) {
  const commonSteps = {
    learn: [
      {
        title: "أريد قراءة مقال آخر",
        description: "ارجع إلى مكتبة المعرفة واختر موضوعًا آخر حسب المجال أو الكلمات المفتاحية.",
        href: `${root}/learn/articles.html`,
        label: "فتح مكتبة المعرفة"
      },
      {
        title: "أريد تحميل مورد مجاني",
        description: "انتقل إلى مكتبة الموارد لتحميل قوالب ونماذج عملية قابلة للاستخدام.",
        href: `${root}/resources/index.html`,
        label: "فتح الموارد المجانية"
      },
      {
        title: "أريد استخدام أداة عملية",
        description: "جرّب أدوات ConsuTrain لمساعدتك في التخطيط والتنظيم والمتابعة.",
        href: `${root}/tools.html`,
        label: "فتح الأدوات"
      },
      {
        title: "أريد طلب استشارة أو دورة",
        description: "إذا احتجت تطبيقًا عمليًا أو تدريبًا منظمًا، أرسل طلبك عبر النموذج.",
        href: `${root}/services/consultation-form.html`,
        label: "إرسال طلب"
      }
    ],
    tools: [
      {
        title: "أريد تجربة أداة أخرى",
        description: "ارجع إلى صفحة الأدوات واختر الأداة الأنسب لاحتياجك الحالي.",
        href: `${root}/tools.html`,
        label: "فتح كل الأدوات"
      },
      {
        title: "أريد تحميل قالب جاهز",
        description: "استخدم الموارد المجانية للحصول على نماذج وقوالب قابلة للتعديل.",
        href: `${root}/resources/index.html`,
        label: "فتح الموارد"
      },
      {
        title: "أريد فهم المفهوم أولًا",
        description: "افتح مكتبة المعرفة لقراءة مقالات مبسطة قبل استخدام الأداة.",
        href: `${root}/learn/articles.html`,
        label: "فتح المقالات"
      },
      {
        title: "أريد دعمًا في التطبيق",
        description: "اطلب استشارة أو دورة إذا كنت تحتاج تطبيق الأداة على حالة واقعية.",
        href: `${root}/services/consultation-form.html`,
        label: "طلب دعم"
      }
    ],
    services: [
      {
        title: "أريد مقارنة الخدمات",
        description: "ارجع إلى صفحة الخدمات العامة لاختيار الخدمة الأقرب لاحتياجك.",
        href: `${root}/services.html`,
        label: "فتح الخدمات"
      },
      {
        title: "أريد طلب استشارة أو دورة",
        description: "أرسل طلبك عبر النموذج المنظم لتوضيح احتياجك وتسهيل المتابعة.",
        href: `${root}/services/consultation-form.html`,
        label: "إرسال طلب"
      },
      {
        title: "أريد موردًا يساعدني على البدء",
        description: "حمّل موردًا مجانيًا مرتبطًا بالتخطيط أو الجودة أو المخاطر أو الجدوى.",
        href: `${root}/resources/index.html`,
        label: "فتح الموارد"
      },
      {
        title: "أريد التعلم قبل الطلب",
        description: "اقرأ مقالات مبسطة تساعدك على فهم المجال قبل طلب الخدمة.",
        href: `${root}/learn/articles.html`,
        label: "فتح مكتبة المعرفة"
      }
    ],
    courses: [
      {
        title: "أريد رؤية كل الدورات",
        description: "ارجع إلى صفحة الدورات لاختيار المسار التدريبي المناسب.",
        href: `${root}/courses/index.html`,
        label: "فتح الدورات"
      },
      {
        title: "أريد طلب دورة مخصصة",
        description: "استخدم النموذج لتوضيح نوع الدورة والفئة المستهدفة وطريقة التنفيذ.",
        href: `${root}/services/consultation-form.html`,
        label: "طلب دورة"
      },
      {
        title: "أريد موارد قبل الدورة",
        description: "حمّل قوالب ونماذج تساعدك على التحضير العملي قبل التدريب.",
        href: `${root}/resources/index.html`,
        label: "فتح الموارد"
      },
      {
        title: "أريد محتوى تعليمي مجاني",
        description: "ابدأ بمقالات مبسطة قبل الانتقال إلى دورة كاملة أو ورشة تطبيقية.",
        href: `${root}/learn/articles.html`,
        label: "فتح المقالات"
      }
    ],
    resources: [
      {
        title: "أريد تحميل مورد آخر",
        description: "ارجع إلى مكتبة الموارد واختر التصنيف المناسب أو استخدم البحث.",
        href: `${root}/resources/index.html#resourcesLibrary`,
        label: "العودة إلى الموارد"
      },
      {
        title: "أريد استخدام أداة عملية",
        description: "انتقل إلى قسم الأدوات لاستخدام أدوات تساعدك في التخطيط والتنظيم والمتابعة.",
        href: `${root}/tools.html`,
        label: "فتح الأدوات"
      },
      {
        title: "أريد قراءة محتوى تعليمي",
        description: "استفد من المقالات والمسارات التعليمية لفهم المفاهيم قبل تطبيق النماذج.",
        href: `${root}/learn/articles.html`,
        label: "فتح مكتبة المعرفة"
      },
      {
        title: "أريد طلب استشارة أو دورة",
        description: "إذا احتجت تطبيقًا مخصصًا أو تدريبًا عمليًا، يمكنك إرسال طلبك عبر النموذج.",
        href: `${root}/services/consultation-form.html`,
        label: "إرسال طلب"
      }
    ]
  };

  if (section === "التعلّم") return commonSteps.learn;
  if (section === "الأدوات") return commonSteps.tools;
  if (section === "الخدمات") return commonSteps.services;
  if (section === "الدورات") return commonSteps.courses;
  if (section === "الموارد المجانية") return commonSteps.resources;

  return [];
}
