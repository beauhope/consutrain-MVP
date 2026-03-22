/*
  =========================================================
  FILE: assets/js/ai-page.js
  PURPOSE:
  منطق صفحة learn/ai.html

  RESPONSIBILITIES:
  - FAQ accordion
  - Highlight active section in TOC
  - Reading progress bar
  - Reading time estimate
  - Back to top button
  =========================================================
*/

/* =========================================================
   1) FAQ ACCORDION
   ========================================================= */
document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    const answer = button.nextElementSibling;
    const icon = button.querySelector(".faq-icon");

    button.setAttribute("aria-expanded", String(!isExpanded));
    answer.style.display = isExpanded ? "none" : "block";
    if (icon) icon.textContent = isExpanded ? "+" : "−";
  });
});

/* إغلاق answers افتراضيًا عند التحميل */
document.querySelectorAll(".faq-answer").forEach((answer) => {
  answer.style.display = "none";
});

/* =========================================================
   2) ACTIVE TOC LINKS
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".ai-toc-list a");

  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");

            navLinks.forEach((link) => {
              link.classList.remove("active");
              if (link.getAttribute("href") === "#" + id) {
                link.classList.add("active");
              }
            });
          }
        });
      },
      {
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => observer.observe(section));
  }
});

/* =========================================================
   3) READING PROGRESS BAR
   ========================================================= */
const progressBar = document.getElementById("readingProgress");

window.addEventListener("scroll", () => {
  if (!progressBar) return;

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  progressBar.style.width = `${progress}%`;
});

/* =========================================================
   4) READING TIME
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const readingTimeEl = document.getElementById("readingTime");
  const content = document.querySelector(".ai-content");

  if (!readingTimeEl || !content) return;

  const text = content.innerText || "";
  const words = text.trim().split(/\s+/).filter(Boolean).length;

  /* تقدير بسيط: 180 كلمة في الدقيقة */
  const minutes = Math.max(1, Math.ceil(words / 180));
  readingTimeEl.textContent = `${minutes} دقيقة`;
});

/* =========================================================
   5) BACK TO TOP BUTTON
   ========================================================= */
const aiScrollBtn = document.getElementById("aiScrollTopBtn");

window.addEventListener("scroll", () => {
  if (!aiScrollBtn) return;

  if (window.scrollY > 300) {
    aiScrollBtn.classList.add("show");
  } else {
    aiScrollBtn.classList.remove("show");
  }
});

if (aiScrollBtn) {
  aiScrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}