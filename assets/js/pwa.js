/*
  =========================================================
  FILE: pwa.js
  PURPOSE:
  تسجيل service worker الخاص بموقع ConsuTrain
  =========================================================
*/

(function () {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./sw.js");
      console.log("Service Worker registered successfully.");
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  });
})();