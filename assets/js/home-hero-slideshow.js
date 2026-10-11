/* CT-01 Subflow 01 — Homepage-only, dependency-free slideshow */
(function(){
  "use strict";
  var root=document.querySelector("[data-home-hero-slideshow]");
  if(!root)return;
  var slides=Array.prototype.slice.call(root.querySelectorAll(".home-hero-slideshow__slide"));
  var dots=Array.prototype.slice.call(root.querySelectorAll(".home-hero-slideshow__dot"));
  if(!slides.length||slides.length!==dots.length)return;
  var current=0,timer=null,paused=false;
  var motion=window.matchMedia("(prefers-reduced-motion: reduce)");
  function load(i){var img=slides[i];if(img&&img.dataset.src){img.src=img.dataset.src;delete img.dataset.src;}}
  function show(i){
    if(i===current)return;
    load(i);
    slides[current].classList.remove("is-active");
    slides[current].setAttribute("aria-hidden","true");
    dots[current].removeAttribute("aria-current");
    current=i;
    slides[current].classList.add("is-active");
    slides[current].setAttribute("aria-hidden","false");
    dots[current].setAttribute("aria-current","true");
    load((current+1)%slides.length);
  }
  function stop(){if(timer!==null){window.clearInterval(timer);timer=null;}}
  function start(){stop();if(!paused&&!motion.matches&&!document.hidden){timer=window.setInterval(function(){show((current+1)%slides.length);},5000);}}
  dots.forEach(function(dot,i){dot.addEventListener("click",function(){show(i);start();});});
  root.addEventListener("mouseenter",function(){paused=true;stop();});
  root.addEventListener("mouseleave",function(){paused=false;start();});
  root.addEventListener("focusin",function(){paused=true;stop();});
  root.addEventListener("focusout",function(ev){if(!root.contains(ev.relatedTarget)){paused=false;start();}});
  document.addEventListener("visibilitychange",start);
  if(motion.addEventListener)motion.addEventListener("change",start);
  else if(motion.addListener)motion.addListener(start);
  load(1);
  start();
})();
