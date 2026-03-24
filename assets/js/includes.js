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
    const version = "v=20260324_3";
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

  if (!toggle || !nav) return;

  const submenuToggles = document.querySelectorAll(".submenu-toggle");
  const submenuParents = document.querySelectorAll(".has-submenu");

  /*
    -------------------------------------------------------
    MAIN MOBILE NAV TOGGLE
    PURPOSE:
    فتح وإغلاق القائمة الرئيسية في الشاشات الصغيرة
    -------------------------------------------------------
  */
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  /*
    -------------------------------------------------------
    SUBMENU TOGGLES
    PURPOSE:
    على الجوال فقط:
    فتح وإغلاق القوائم الفرعية داخل الهيدر
    بشكل accordion
    -------------------------------------------------------
  */
  submenuToggles.forEach((button) => {
    button.addEventListener("click", (event) => {
      const parentItem = event.currentTarget.closest(".has-submenu");
      if (!parentItem) return;

      /*
        على سطح المكتب لا نستخدم هذا السلوك،
        لأن القوائم الفرعية تظهر عبر hover / focus في CSS
      */
      if (window.innerWidth > 900) return;

      const isOpen = parentItem.classList.toggle("submenu-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });

  /*
    -------------------------------------------------------
    OUTSIDE CLICK HANDLER
    PURPOSE:
    عند الضغط خارج الهيدر:
    - تغلق القائمة الرئيسية على الجوال
    - وتغلق أي قائمة فرعية مفتوحة
    -------------------------------------------------------
  */
  document.addEventListener("click", (event) => {
    const clickedInsideHeader = event.target.closest(".site-header");
    if (clickedInsideHeader) return;

    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");

    submenuParents.forEach((item) => {
      item.classList.remove("submenu-open");

      const button = item.querySelector(".submenu-toggle");
      if (button) {
        button.setAttribute("aria-expanded", "false");
      }
    });
  });

  /*
    -------------------------------------------------------
    RESIZE HANDLER
    PURPOSE:
    عند الانتقال من موبايل إلى سطح مكتب:
    تنظيف حالات الفتح القديمة حتى لا تنتقل
    إلى التخطيط الأكبر بشكل غير مرغوب
    -------------------------------------------------------
  */
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");

      submenuParents.forEach((item) => {
        item.classList.remove("submenu-open");

        const button = item.querySelector(".submenu-toggle");
        if (button) {
          button.setAttribute("aria-expanded", "false");
        }
      });
    }
  });
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
});