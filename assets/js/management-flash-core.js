/* Shared Management Flash selection and storage. No DOM initialization. */
(function (global) {
  "use strict";
  var api = global.ConsuTrainManagementFlash = global.ConsuTrainManagementFlash || {};
  var memory = Object.create(null);
  var pendingWrites = Object.create(null);
  var lastDisplayed = Object.create(null);
  var historyLimit = 20;

  function language(lang) { return lang === "fr" ? "fr" : "ar"; }
  function bank(lang) { return api.data[language(lang)]; }
  function config(lang) {
    return language(lang) === "fr"
      ? { topic: "theme", levelKey: "managementFlashLevelFr", topicKey: "managementFlashThemeFr", level: "Tous", value: "Tous" }
      : { topic: "category", levelKey: "managementFlashLevel", topicKey: "managementFlashCategory", level: "مبتدئ", value: "التخطيط الاستراتيجي" };
  }
  function read(key) {
    if (pendingWrites[key]) return memory[key];
    try { return global.localStorage.getItem(key); }
    catch (error) { return memory[key] || null; }
  }
  function write(key, value) {
    memory[key] = value;
    try { global.localStorage.setItem(key, value); delete pendingWrites[key]; }
    catch (error) { pendingWrites[key] = true; }
  }
  function validatePreferences(lang, preferences) {
    var c = config(lang), records = bank(lang);
    preferences = preferences || {};
    var level = preferences.level, topic = preferences[c.topic];
    var validLevel = (language(lang) === "fr" && level === "Tous") || records.some(function (item) { return item.level === level; });
    var validTopic = (language(lang) === "fr" && topic === "Tous") || records.some(function (item) { return item[c.topic] === topic; });
    var result = { level: validLevel ? level : c.level };
    result[c.topic] = validTopic ? topic : c.value;
    return result;
  }
  function readPreferences(lang) {
    var c = config(lang), preferences = { level: read(c.levelKey) };
    preferences[c.topic] = read(c.topicKey);
    return validatePreferences(lang, preferences);
  }
  function savePreferences(lang, preferences) {
    var c = config(lang), valid = validatePreferences(lang, preferences);
    write(c.levelKey, valid.level);
    write(c.topicKey, valid[c.topic]);
    return valid;
  }
  function historyKey(lang) { return "managementFlashHistoryV1:" + language(lang); }
  function readHistory(lang) {
    try {
      var parsed = JSON.parse(read(historyKey(lang)) || "[]");
      if (!Array.isArray(parsed)) return [];
      parsed = parsed.slice(-historyLimit);
      var ids = bank(lang).map(function (item) { return item.id; });
      return parsed.filter(function (id, index) {
        return typeof id === "string" && ids.indexOf(id) !== -1 && parsed.lastIndexOf(id) === index;
      }).slice(-historyLimit);
    } catch (error) { return []; }
  }
  function select(lang, preferences) {
    lang = language(lang);
    var c = config(lang), records = bank(lang);
    var valid = validatePreferences(lang, preferences || readPreferences(lang));
    var pool = records.filter(function (item) {
      return (lang === "fr" && valid.level === "Tous" || item.level === valid.level) &&
        (lang === "fr" && valid[c.topic] === "Tous" || item[c.topic] === valid[c.topic]);
    });
    var fallback = !pool.length;
    if (fallback) {
      // Preserve each tool's original fallback; never change saved filters.
      pool = lang === "fr" ? records.slice(0, 1) : records.filter(function (item) { return item.level === valid.level; });
    }
    if (!pool.length) return null;
    var history = readHistory(lang);
    var last = history[history.length - 1];
    var available = pool.filter(function (item) {
      return pool.length === 1 || (item.id !== last && item.id !== lastDisplayed[lang]);
    });
    // Two tabs may have different last records. The latest persisted one wins.
    if (!available.length) available = pool.filter(function (item) { return item.id !== last; });
    if (!available.length) available = pool;
    var unseen = available.filter(function (item) { return history.indexOf(item.id) === -1; });
    if (unseen.length) available = unseen;
    else {
      // Exhausted pool: relax the oldest exclusion, keeping recent records out.
      var oldest = Math.min.apply(null, available.map(function (item) { return history.indexOf(item.id); }));
      available = available.filter(function (item) { return history.indexOf(item.id) === oldest; });
    }
    return { item: available[Math.floor(Math.random() * available.length)], fallback: fallback };
  }
  function recordDisplay(lang, id) {
    lang = language(lang);
    if (!bank(lang).some(function (item) { return item.id === id; })) return;
    // Read again at write time so another tab's latest history is retained.
    var history = readHistory(lang).filter(function (previous) { return previous !== id; });
    history.push(id);
    lastDisplayed[lang] = id;
    write(historyKey(lang), JSON.stringify(history.slice(-historyLimit)));
  }
  function toolUrl(lang, root, baseURI) {
    var site = new URL((root || ".") + "/", baseURI);
    return new URL((language(lang) === "fr" ? "fr/" : "") + "tools/management-flash.html", site).href;
  }
  function resourceUrl(item, root, baseURI) {
    return item.ctaHref ? new URL(item.ctaHref, toolUrl("ar", root, baseURI)).href : "";
  }
  api.readPreferences = readPreferences;
  api.savePreferences = savePreferences;
  api.select = select;
  api.recordDisplay = recordDisplay;
  api.toolUrl = toolUrl;
  api.resourceUrl = resourceUrl;
}(window));
