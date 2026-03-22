/*
  =========================================================
  FILE: assets/js/includes.js
  PURPOSE:
  - تحميل الهيدر والفوتر المشتركين
  - استبدال __ROOT__ بمسار الجذر المناسب
  - تفعيل القائمة في الشاشات الصغيرة

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
    const version = "v=20260322_1";
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
      initMobileNav();
    }

  } catch (error) {
    console.error("Partial loading error:", error);
  }
}

/*
  ---------------------------------------------------------
  FUNCTION: initMobileNav
  PURPOSE:
  تشغيل زر القائمة في الشاشات الصغيرة
  ---------------------------------------------------------
*/
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
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