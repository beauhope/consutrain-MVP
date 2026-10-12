/* Homepage view only: one flash, independent of the hero and shared header. */
(function () {
  "use strict";
  var card = document.querySelector("[data-home-management-flash]");
  if (!card) return;
  var lang = document.documentElement.lang.toLowerCase().indexOf("fr") === 0 ? "fr" : "ar";
  var previousPreferences = "";
  var rendered = false;

  function render() {
    var api = window.ConsuTrainManagementFlash;
    var status = card.querySelector("[data-flash-status]");
    try {
      var preferences = api.readPreferences(lang);
      var signature = JSON.stringify(preferences);
      if (rendered && signature === previousPreferences) return;
      var selection = api.select(lang, preferences);
      if (!selection) throw new Error("No flash available");
      var item = selection.item;
      var root = document.body.dataset.root || ".";
      card.querySelector("[data-flash-settings]").href = api.toolUrl(lang, root, document.baseURI);
      card.querySelector("[data-flash-meta]").textContent = lang === "fr"
        ? item.level + " · " + item.theme
        : item.level + " · " + item.category;
      card.querySelector("[data-flash-text]").textContent = item.text;
      var title = card.querySelector("[data-flash-title]");
      title.textContent = item.title || "";
      title.hidden = !item.title;
      var action = card.querySelector("[data-flash-action]");
      action.textContent = item.action || "";
      action.hidden = !item.action;
      var resource = card.querySelector("[data-flash-resource]");
      resource.hidden = !item.ctaHref;
      if (item.ctaHref) {
        resource.textContent = item.ctaText;
        resource.href = api.resourceUrl(item, root, document.baseURI);
      }
      status.textContent = selection.fallback
        ? (lang === "fr" ? "Aucun flash ne correspond à ces préférences. Voici un autre rappel." : "لا توجد ومضة مطابقة لهذه الإعدادات؛ إليك ومضة أخرى.")
        : "";
      status.hidden = !selection.fallback;
      card.querySelector("[data-flash-content]").hidden = false;
      previousPreferences = signature;
      rendered = true;
      api.recordDisplay(lang, item.id);
    } catch (error) {
      status.hidden = false;
      status.textContent = lang === "fr"
        ? "Le flash est indisponible. Retrouvez les flashs dans l’outil."
        : "تعذر عرض الومضة. يمكنك الاطلاع على الومضات في الأداة.";
    }
  }
  render();
  // Preserve the current flash on back navigation unless tool preferences changed.
  window.addEventListener("pageshow", function (event) { if (event.persisted) render(); });
}());
