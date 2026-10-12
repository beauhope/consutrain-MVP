/* CT-01 Subflow 01 — lightweight, layout-safe homepage slideshow */
(function () {
  "use strict";
  var root = document.querySelector("[data-home-hero-slideshow]");
  if (!root) return;
  var slides = Array.prototype.slice.call(root.querySelectorAll(".home-hero-slideshow__slide"));
  var dots = Array.prototype.slice.call(root.querySelectorAll(".home-hero-slideshow__dot"));
  if (!slides.length || slides.length !== dots.length) return;
  var current = 0, timer = null, paused = false, requestId = 0, ready = false;
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function preload(i) {
    var img = slides[i];
    var source = img.parentElement.querySelector("source[data-srcset]");
    if (source) { source.srcset = source.dataset.srcset; delete source.dataset.srcset; }
    if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; }
    if (img.complete && img.naturalWidth > 0) return Promise.resolve(true);
    if (typeof img.decode === "function") {
      return img.decode().then(function () { return true; }, function () { return false; });
    }
    return new Promise(function (resolve) {
      img.addEventListener("load", function () { resolve(true); }, { once: true });
      img.addEventListener("error", function () { resolve(false); }, { once: true });
    });
  }
  function show(i) {
    if (i === current) return;
    var request = ++requestId;
    preload(i).then(function (loaded) {
      if (!loaded || request !== requestId) return;
      slides[current].classList.remove("is-active");
      slides[current].setAttribute("aria-hidden", "true");
      dots[current].removeAttribute("aria-current");
      current = i;
      slides[current].classList.add("is-active");
      slides[current].setAttribute("aria-hidden", "false");
      dots[current].setAttribute("aria-current", "true");
      preload((current + 1) % slides.length);
    });
  }
  function stop() { if (timer !== null) { window.clearTimeout(timer); timer = null; } }
  function start() {
    stop();
    if (ready && !paused && !motion.matches && !document.hidden) {
      timer = window.setTimeout(function () { show((current + 1) % slides.length); start(); }, 5000);
    }
  }
  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () { show(i); start(); });
  });
  root.addEventListener("mouseenter", function () { paused = true; stop(); });
  root.addEventListener("mouseleave", function () { paused = false; start(); });
  root.addEventListener("focusin", function () { paused = true; stop(); });
  root.addEventListener("focusout", function (event) {
    if (!root.contains(event.relatedTarget)) { paused = false; start(); }
  });
  document.addEventListener("visibilitychange", start);
  if (motion.addEventListener) motion.addEventListener("change", start);
  else if (motion.addListener) motion.addListener(start);
  function initialize() {
    ready = true;
    if (!motion.matches) preload(1);
    start();
  }
  if (document.readyState === "complete") initialize();
  else window.addEventListener("load", initialize, { once: true });
}());
