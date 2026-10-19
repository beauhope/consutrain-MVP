(function () {
  "use strict";

  const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwqXE2__bb_XIx07-TTiAz_vYzpG-FAYUnE7I7IarGLPEhDOuCoKHq5DjydVHHKckq9/exec";

  async function sendToCloud(url, options) {
    const payload = JSON.parse(options.body);
    if (!payload.submissionId) payload.submissionId = "cloud-" + crypto.randomUUID();
    const controller = new AbortController();
    const timer = setTimeout(function () { controller.abort(); }, 30000);
    try {
      return await fetch(url, {
        ...options,
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify({ ...payload, form_type: "certificate_submission" }),
        redirect: "follow",
        signal: controller.signal
      });
    } finally { clearTimeout(timer); }
  }
  const TRAINING_ID = "nebosh-intro";
  const TRAINING_TITLE = "Introduction à la santé et à la sécurité au travail : préparer les bases NEBOSH";
  const TOTAL_QUESTIONS = 20;
  const PASSING_SCORE = 14;
  const PENDING_SUBMISSIONS_KEY = "consutrain_pending_certificate_submissions";
  const LANGUAGE = "fr";
  const PENDING_TTL_MS = 24 * 60 * 60 * 1000;
  let isRetryingPendingSubmissions = false;

  const questions = [
  {
    "id": "q1",
    "text": "Quel est l’objectif d’une formation d’introduction ?",
    "correct": "A",
    "options": {
      "A": "Construire des connaissances de base",
      "B": "Délivrer un diplôme officiel NEBOSH",
      "C": "Dispenser des évaluations"
    }
  },
  {
    "id": "q2",
    "text": "Où préparer une qualification NEBOSH officielle ?",
    "correct": "B",
    "options": {
      "A": "Sur toute page gratuite",
      "B": "Avec un partenaire d’apprentissage reconnu",
      "C": "En téléchargeant une attestation ConsuTrain"
    }
  },
  {
    "id": "q3",
    "text": "Qu’est-ce qu’un danger (Hazard) ?",
    "correct": "B",
    "options": {
      "A": "Le coût de l’assurance",
      "B": "Une source potentielle de dommage",
      "C": "La gravité d’une perte financière"
    }
  },
  {
    "id": "q4",
    "text": "Quelle est l’action la plus efficace face à un sol mouillé ?",
    "correct": "C",
    "options": {
      "A": "Afficher seulement un avertissement",
      "B": "Ignorer la situation",
      "C": "Traiter la cause et sécuriser la zone"
    }
  },
  {
    "id": "q5",
    "text": "Pourquoi déclarer un presque-accident ?",
    "correct": "B",
    "options": {
      "A": "Parce qu’il est sans intérêt",
      "B": "Pour apprendre et prévenir un futur accident",
      "C": "Uniquement pour produire des statistiques"
    }
  },
  {
    "id": "q6",
    "text": "Que signifie le risque ?",
    "correct": "A",
    "options": {
      "A": "La possibilité d’un dommage et ses conséquences",
      "B": "Seulement le type de machine",
      "C": "Le prix des équipements"
    }
  },
  {
    "id": "q7",
    "text": "Pourquoi gérer la santé et la sécurité ?",
    "correct": "A",
    "options": {
      "A": "Pour des raisons humaines, juridiques et économiques",
      "B": "Pour la publicité uniquement",
      "C": "Pour la finance uniquement"
    }
  },
  {
    "id": "q8",
    "text": "Qui doit principalement fournir une organisation du travail sûre ?",
    "correct": "B",
    "options": {
      "A": "Seulement le salarié",
      "B": "L’employeur",
      "C": "Seulement le client"
    }
  },
  {
    "id": "q9",
    "text": "Quelle est une conséquence indirecte possible d’un accident ?",
    "correct": "C",
    "options": {
      "A": "La réparation d’une machine",
      "B": "Les premiers soins",
      "C": "La dégradation de la réputation"
    }
  },
  {
    "id": "q10",
    "text": "Que faire avant l’intervention d’une entreprise extérieure ?",
    "correct": "A",
    "options": {
      "A": "Coordonner les risques et les mesures de prévention",
      "B": "Commencer sans concertation",
      "C": "Éviter le partage d’informations"
    }
  },
  {
    "id": "q11",
    "text": "Quels sont les éléments d’une politique SST ?",
    "correct": "B",
    "options": {
      "A": "Les ventes et la publicité",
      "B": "Engagement, organisation et dispositions pratiques",
      "C": "La rémunération seulement"
    }
  },
  {
    "id": "q12",
    "text": "Quelle attitude indique une culture de sécurité positive ?",
    "correct": "C",
    "options": {
      "A": "Cacher les erreurs",
      "B": "Ignorer les alertes",
      "C": "Encourager le signalement et la participation"
    }
  },
  {
    "id": "q13",
    "text": "Qu’est-ce que le suivi proactif ?",
    "correct": "A",
    "options": {
      "A": "Vérifier les protections avant un accident",
      "B": "Analyser uniquement les blessures passées",
      "C": "Consulter seulement les indemnisations"
    }
  },
  {
    "id": "q14",
    "text": "Quelle est la première étape de l’évaluation des risques ?",
    "correct": "B",
    "options": {
      "A": "Acheter des EPI",
      "B": "Repérer les dangers",
      "C": "Distribuer les attestations"
    }
  },
  {
    "id": "q15",
    "text": "Quelle mesure est généralement prioritaire pour réduire un danger ?",
    "correct": "B",
    "options": {
      "A": "Porter des gants uniquement",
      "B": "Éliminer le danger à la source",
      "C": "Ajouter des affiches seulement"
    }
  },
  {
    "id": "q16",
    "text": "Quel élément doit figurer dans un plan d’action ?",
    "correct": "A",
    "options": {
      "A": "Un responsable et une échéance",
      "B": "Uniquement une appréciation générale",
      "C": "Une décoration de sécurité"
    }
  },
  {
    "id": "q17",
    "text": "Quand réexaminer une évaluation des risques ?",
    "correct": "C",
    "options": {
      "A": "Jamais après signature",
      "B": "Uniquement une fois par décennie",
      "C": "Lors d’un changement ou après un événement pertinent"
    }
  },
  {
    "id": "q18",
    "text": "Quelle méthode améliore une réponse à un scénario ?",
    "correct": "A",
    "options": {
      "A": "Relier les recommandations aux faits observés",
      "B": "Répéter des slogans généraux",
      "C": "Inventer des faits manquants"
    }
  },
  {
    "id": "q19",
    "text": "Qu’est-ce qu’une bonne mesure de maîtrise ?",
    "correct": "B",
    "options": {
      "A": "Une mesure impossible à contrôler",
      "B": "Une mesure réalisable et vérifiable",
      "C": "Une mesure sans responsable"
    }
  },
  {
    "id": "q20",
    "text": "L’attestation gratuite ConsuTrain confirme :",
    "correct": "A",
    "options": {
      "A": "La réussite de l’évaluation du parcours ConsuTrain",
      "B": "Une qualification officielle NEBOSH",
      "C": "Une autorisation réglementaire"
    }
  }
];

  const form = document.getElementById("certificateTrainingFormFr");
  const questionsContainer = document.getElementById("certificateQuestionsFr");
  const submitButton = document.getElementById("certificateSubmitBtnFr");
  const resetButton = document.getElementById("certificateResetBtnFr");
  const statusBox = document.getElementById("certificateStatusFr");
  const resultActions = document.getElementById("certificateResultActionsFr");

  if (!form || !questionsContainer || !submitButton || !statusBox || !resultActions) return;

  function escapeHtml(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function renderQuestions() {
    questionsContainer.innerHTML = questions.map(function (question, index) {
      const optionsHtml = Object.keys(question.options).map(function (key) {
        const inputId = `${question.id}-${key}`;
        return `<label class="certificate-radio" for="${inputId}"><input id="${inputId}" name="${question.id}" type="radio" value="${key}" required><span>${key}. ${escapeHtml(question.options[key])}</span></label>`;
      }).join("");
      return `<article class="certificate-question"><h3>Question ${index + 1} : ${escapeHtml(question.text)}</h3><div class="certificate-options">${optionsHtml}</div></article>`;
    }).join("");
  }

  function setStatus(message, type) {
    statusBox.textContent = message;
    statusBox.className = `certificate-status ${type}`;
    statusBox.hidden = false;
  }

  function clearStatus() {
    statusBox.textContent = "";
    statusBox.className = "certificate-status";
    statusBox.hidden = true;
  }

  function getTextValue(name) {
    const field = form.elements[name];
    return field && typeof field.value === "string" ? field.value.trim() : "";
  }

  function getAnswers() {
    return questions.reduce(function (answers, question) {
      const selected = form.querySelector(`input[name="${question.id}"]:checked`);
      answers[question.id] = selected ? selected.value : "";
      return answers;
    }, {});
  }

  function calculateScore(answers) {
    return questions.reduce(function (score, question) {
      return answers[question.id] === question.correct ? score + 1 : score;
    }, 0);
  }

  function savePendingQueue(queue) {
    try {
      if (queue.length) window.localStorage.setItem(PENDING_SUBMISSIONS_KEY, JSON.stringify(queue));
      else window.localStorage.removeItem(PENDING_SUBMISSIONS_KEY);
    } catch (error) {
      console.error("Could not update pending certificate submissions:", error);
    }
  }
  function getPendingQueue() {
    let parsed;
    try { const storedValue = window.localStorage.getItem(PENDING_SUBMISSIONS_KEY); if (!storedValue) return []; parsed = JSON.parse(storedValue); }
    catch (error) { savePendingQueue([]); return []; }
    if (!Array.isArray(parsed)) { savePendingQueue([]); return []; }
    const now = Date.now();
    const valid = parsed.reduce(function (queue, entry) {
      if (!entry || typeof entry !== "object" || !entry.payload || typeof entry.payload !== "object") return queue;
      const queuedAt = typeof entry.queuedAt === "number" ? entry.queuedAt : Date.parse(entry.queuedAt);
      if (!Number.isFinite(queuedAt) || queuedAt <= 0 || queuedAt > now || now - queuedAt > PENDING_TTL_MS) return queue;
      if (typeof entry.payload.trainingId !== "string" || typeof entry.payload.language !== "string") return queue;
      queue.push({ queuedAt: queuedAt, payload: entry.payload }); return queue;
    }, []);
    if (JSON.stringify(valid) !== JSON.stringify(parsed)) savePendingQueue(valid);
    return valid;
  }
  function isCurrentPendingEntry(entry) { return entry.payload.trainingId === TRAINING_ID && entry.payload.language === LANGUAGE; }
  function savePendingSubmission(payload) {
    const queue = getPendingQueue(); const stableId = payload.submissionId || payload.certificateKey;
    if (stableId && queue.some(function (entry) { return isCurrentPendingEntry(entry) && (entry.payload.submissionId || entry.payload.certificateKey) === stableId; })) return;
    queue.push({ queuedAt: Date.now(), payload: payload }); savePendingQueue(queue);
  }
  function ensurePendingControls() {
    let retryButton = resultActions.querySelector("[data-pending-retry]"); let discardButton = resultActions.querySelector("[data-pending-discard]");
    if (!retryButton) { retryButton = document.createElement("button"); retryButton.type = "button"; retryButton.className = "btn btn-secondary"; retryButton.dataset.pendingRetry = "true"; retryButton.textContent = "Réessayer maintenant"; resultActions.appendChild(retryButton); }
    if (!discardButton) { discardButton = document.createElement("button"); discardButton.type = "button"; discardButton.className = "btn btn-secondary"; discardButton.dataset.pendingDiscard = "true"; discardButton.textContent = "Supprimer la demande en attente"; resultActions.appendChild(discardButton); }
    return { retryButton: retryButton, discardButton: discardButton };
  }
  function refreshPendingUI() {
    const controls = ensurePendingControls(); const hasPending = getPendingQueue().some(isCurrentPendingEntry);
    controls.retryButton.hidden = !hasPending; controls.discardButton.hidden = !hasPending;
    if (hasPending) { setStatus("Une demande d’attestation précédente est conservée temporairement dans ce navigateur pendant 24 heures au maximum. Elle ne sera pas renvoyée automatiquement ; vous pouvez réessayer maintenant ou la supprimer.", "warning"); resultActions.hidden = false; }
  }
  async function retryPendingSubmissions() {
    if (isRetryingPendingSubmissions) return;
    const queue = getPendingQueue(); const matching = queue.filter(isCurrentPendingEntry); if (!matching.length) { refreshPendingUI(); return; }
    isRetryingPendingSubmissions = true; const controls = ensurePendingControls(); controls.retryButton.disabled = true; const failed = []; let lastResult = null;
    for (const entry of matching) { try { const result = await submitPayload(entry.payload); if (isTerminalBackendResult(result)) lastResult = result; else failed.push(entry); } catch (error) { failed.push(entry); } }
    const matchingSet = new Set(matching); savePendingQueue(queue.filter(function (entry) { return !matchingSet.has(entry); }).concat(failed));
    isRetryingPendingSubmissions = false; controls.retryButton.disabled = false;
    refreshPendingUI(); if (failed.length) setStatus("Certaines demandes n’ont pas pu être renvoyées ou confirmées. Elles restent temporairement conservées jusqu’à leur expiration ou leur suppression.", "error"); else showBackendResult(lastResult, "Les demandes en attente ont été envoyées.");
  }
  function discardPendingSubmissions() { savePendingQueue(getPendingQueue().filter(function (entry) { return !isCurrentPendingEntry(entry); })); setStatus("La demande en attente a été supprimée de ce navigateur.", "info"); refreshPendingUI(); }
  const TERMINAL_BACKEND_STATUSES = new Set(["accepted", "issued", "duplicate", "validation_failed", "assessment_failed", "delivery_failed", "configuration_error", "success"]);
  function getBackendStatus(result) { return result && typeof result === "object" && typeof result.status === "string" ? result.status.trim().toLowerCase() : ""; }
  function isTerminalBackendResult(result) { return TERMINAL_BACKEND_STATUSES.has(getBackendStatus(result)); }
  function getSafeBackendMessage(result, fallback) { const message = result && typeof result.message === "string" ? result.message.trim() : ""; return !message || message.length > 300 || /[\r\n]|https?:\/\/|file:\/\/|[a-zA-Z]:\\|(?:^|\s)\/(?:home|tmp|var|usr|opt|root|Users)\/|\bn8n\b|\bat\s+\S+\s*\(/i.test(message) ? fallback : message; }
  function showBackendResult(result, successMessage) {
    const status = getBackendStatus(result);
    if (status === "accepted") { setStatus("Votre demande a été enregistrée. Votre attestation sera envoyée par e-mail après traitement.", "success"); return true; }
    if (status === "issued") { setStatus("Votre attestation a été émise et envoyée par e-mail.", "success"); return true; }
    if (status === "success") { // LEGACY C2 TRANSITION
      setStatus(successMessage, "success"); return true;
    }
    if (status === "duplicate") { setStatus(getSafeBackendMessage(result, "Une demande existe déjà pour cette adresse e-mail et cette formation."), "info"); return true; }
    if (status === "validation_failed") { setStatus(getSafeBackendMessage(result, "La demande n’a pas pu être validée. Vérifiez vos informations ou contactez le support."), "error"); return true; }
    if (status === "assessment_failed") { setStatus(getSafeBackendMessage(result, "Le résultat validé n’atteint pas le seuil de réussite requis."), "error"); return true; }
    if (status === "delivery_failed") { setStatus(getSafeBackendMessage(result, "La demande a été traitée, mais l’attestation n’a pas pu être livrée. Contactez le support."), "error"); return true; }
    if (status === "configuration_error") { setStatus(getSafeBackendMessage(result, "La demande ne peut pas être finalisée en raison d’un problème temporaire du service. Contactez le support."), "error"); return true; }
    setStatus("La réponse du service n’a pas permis de confirmer le résultat. Réessayez plus tard ou contactez le support.", "error"); return false;
  }

  function buildPayload(score, answers) {
    const percentage = Math.round((score / TOTAL_QUESTIONS) * 100);
    const email = getTextValue("email").toLowerCase();
    return {
      timestamp: new Date().toISOString(),
      submissionId: `${TRAINING_ID}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      certificateKey: `${TRAINING_ID}-${email}`,
      trainingId: "nebosh-intro",
      trainingTitle: TRAINING_TITLE,
      certificateType: "free_test",
      learningType: "free_training",
      trainingCategory: "occupational_health_safety",
      language: "fr",
      name: getTextValue("fullName"),
      fullName: getTextValue("fullName"),
      email: getTextValue("email"),
      country: getTextValue("country"),
      organization: getTextValue("organization"),
      jobTitle: getTextValue("jobTitle"),
      score: score,
      totalQuestions: TOTAL_QUESTIONS,
      percentage: percentage,
      result: score >= PASSING_SCORE ? "passed" : "failed",
      passed: score >= PASSING_SCORE,
      answersJson: JSON.stringify(answers),
      legalAcknowledgment: Boolean(form.elements.legalAcknowledgment && form.elements.legalAcknowledgment.checked),
      marketingConsent: Boolean(form.elements.marketingConsent && form.elements.marketingConsent.checked),
      certificateStatus: "Pending",
      notes: ""
    };
  }

  async function submitPayload(payload) {
    const response = await sendToCloud(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`Webhook returned ${response.status}`);
    const responseText = await response.text();
    if (!responseText.trim()) return null;
    try {
      return JSON.parse(responseText);
    } catch (error) {
      console.warn("Webhook returned a non-JSON success response:", error);
      return null;
    }
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearStatus();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const answers = getAnswers();
    const score = calculateScore(answers);
    const percentage = Math.round((score / TOTAL_QUESTIONS) * 100);

    if (score < PASSING_SCORE) {
      setStatus(`Résultat insuffisant : ${score}/${TOTAL_QUESTIONS} (${percentage}%). Revoyez les leçons puis recommencez.`, "error");
      resultActions.hidden = true;
      return;
    }

    const payload = buildPayload(score, answers);
    submitButton.disabled = true;
    submitButton.textContent = "Envoi en cours...";

    try {
      const result = await submitPayload(payload);
      showBackendResult(result, `Réussite validée : ${score}/${TOTAL_QUESTIONS} (${percentage}%). Votre demande d’attestation a été envoyée.`);
      resultActions.hidden = false;
    } catch (error) {
      savePendingSubmission(payload);
      setStatus(`Vous avez réussi l’évaluation, mais l’envoi n’a pas abouti. La demande a été conservée localement pour une nouvelle tentative. Score : ${score}/${TOTAL_QUESTIONS} (${percentage}%).`, "warning");
      resultActions.hidden = false;
      refreshPendingUI();
      console.error("Certificate submission failed:", error);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Envoyer la demande d’attestation";
    }
  });

  resetButton.addEventListener("click", function () {
    form.reset();
    clearStatus();
    resultActions.hidden = true;
  });
  resultActions.addEventListener("click", function (event) {
    if (event.target.matches("[data-pending-retry]")) retryPendingSubmissions();
    if (event.target.matches("[data-pending-discard]")) discardPendingSubmissions();
  });

  renderQuestions();
  refreshPendingUI();
}());

