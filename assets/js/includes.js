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
    const version = "v=20260505_force_top_fix";
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
      initHeaderNavigation();
      setActiveNavLink();
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

  let backdrop = document.querySelector(".nav-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    backdrop.setAttribute("hidden", "");
    header.insertAdjacentElement("afterend", backdrop);
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
    toggle.setAttribute("aria-label", "فتح القائمة");
    toggle.textContent = "☰";
    backdrop.setAttribute("hidden", "");
    closeSubmenus();
  }

  function openMobileNav() {
    nav.classList.add("open");
    document.body.classList.add("nav-is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "إغلاق القائمة");
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

  submenuToggles.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const parentItem = event.currentTarget.closest(".has-submenu");
      if (!parentItem || !isMobileView()) return;

      const willOpen = !parentItem.classList.contains("submenu-open");
      closeSubmenus();

      if (willOpen) {
        parentItem.classList.add("submenu-open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (isMobileView()) {
        closeMobileNav();
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

  loadPartial("#header-placeholder", `${partialsBase}/header.html`);
  loadPartial("#footer-placeholder", `${partialsBase}/footer.html`);
  initBreadcrumbs();
});

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
  const container = document.getElementById("breadcrumbs-placeholder");
  if (!container) return;

  const root = getRootPath();
  const section = document.body.dataset.breadcrumbSection;
  const title = document.body.dataset.breadcrumbTitle;

  if (!section || !title) return;

  let sectionHref = null;

  if (section === "البداية") {
    sectionHref = `${root}/start-here.html`;
  } else if (section === "التعلّم") {
    sectionHref = `${root}/learn.html`;
  } else if (section === "الأدوات") {
    sectionHref = `${root}/tools.html`;
  } else if (section === "الخدمات") {
    sectionHref = `${root}/services.html`;
  } else if (section === "حول المنصة") {
    sectionHref = `${root}/about.html`;
  }

  const nav = document.createElement("nav");
  nav.className = "breadcrumbs";
  nav.setAttribute("aria-label", "مسار التنقل");

  const list = document.createElement("ol");

  const homeItem = document.createElement("li");
  homeItem.innerHTML = `<a href="${root}/index.html">الرئيسية</a>`;
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