(function () {
  "use strict";

  const WEBHOOK_URL = "https://hooks.consutrain.com/webhook/consutrain-certificate-submission";
  const TRAINING_ID = "blue-ocean-strategy-fundamentals-fr";
  const TRAINING_TITLE = "Stratégie Océan Bleu : innover par la valeur et créer de nouveaux marchés";
  const CERTIFICATE_TYPE = "free_test";
  const LEARNING_TYPE = "free_training";
  const TRAINING_CATEGORY = "strategic_management_and_innovation";
  const LANGUAGE = "fr";
  const TOTAL_QUESTIONS = 20;
  const PASSING_SCORE = 14;
  const PENDING_SUBMISSIONS_KEY = "consutrain_pending_certificate_submissions";

  const questions = [
    { id: "q1", text: "Que désigne un Océan Rouge ?", correct: "A", options: { A: "Un marché saturé où les acteurs se battent sur les mêmes clients et critères", B: "Un marché sans aucun concurrent ni alternative", C: "Une méthode de comptabilité interne", D: "Une simple baisse de prix sans réflexion sur la valeur" } },
    { id: "q2", text: "Quelle est l'idée centrale d'un Océan Bleu ?", correct: "C", options: { A: "Copier le concurrent le plus visible", B: "Baisser le prix sans changer l'offre", C: "Créer un espace de valeur qui rend la comparaison classique moins centrale", D: "Ignorer les besoins des clients" } },
    { id: "q3", text: "Pourquoi la concurrence directe peut-elle devenir limitée dans un marché saturé ?", correct: "B", options: { A: "Parce que les clients ne comparent jamais", B: "Parce qu'elle peut produire pression sur les prix, offres similaires et promesses répétées", C: "Parce qu'elle supprime la qualité", D: "Parce qu'elle empêche toute analyse du marché" } },
    { id: "q4", text: "Quand la concurrence classique reste-t-elle nécessaire ?", correct: "D", options: { A: "Quand l'organisation veut ignorer la qualité", B: "Quand aucun standard n'existe", C: "Quand il faut supprimer toutes les offres existantes", D: "Quand il faut améliorer les bases de qualité, confiance et prix acceptable" } },
    { id: "q5", text: "Que signifie Innovation de valeur ?", correct: "B", options: { A: "Ajouter un maximum de fonctionnalités quel que soit le coût", B: "Augmenter l'utilité client tout en réorganisant coûts et efforts", C: "Utiliser une technologie même sans problème réel", D: "Changer uniquement le logo" } },
    { id: "q6", text: "Quel exemple illustre une Innovation de valeur ?", correct: "C", options: { A: "Allonger un formulaire car le concurrent le fait", B: "Ajouter un rapport long que le client ne lit pas", C: "Simplifier le parcours de demande et clarifier le délai et le résultat", D: "Masquer le prix pour forcer le contact" } },
    { id: "q7", text: "Quelle différence existe entre innovation technologique seule et Innovation de valeur ?", correct: "A", options: { A: "L'Innovation de valeur part de l'utilité client et du coût, pas de la technologie seule", B: "La technologie suffit toujours", C: "L'Innovation de valeur consiste à acheter plus d'outils", D: "Il n'existe aucune différence pratique" } },
    { id: "q8", text: "À quoi sert le Canvas stratégique ?", correct: "D", options: { A: "Lister uniquement les tâches quotidiennes", B: "Éliminer tous les concurrents", C: "Identifier seulement les clients actuels", D: "Visualiser les facteurs de concurrence et la Courbe de valeur" } },
    { id: "q9", text: "Que sont les facteurs de concurrence ?", correct: "B", options: { A: "Les noms des entreprises du marché seulement", B: "Les éléments comparés par les clients comme prix, rapidité ou assistance", C: "Les services internes de l'organisation", D: "Les résultats financiers annuels seulement" } },
    { id: "q10", text: "Que représente la Courbe de valeur ?", correct: "C", options: { A: "Le nombre de salariés", B: "Un tableau de paie", C: "Le niveau d'effort ou de valeur sur les différents facteurs de concurrence", D: "La liste des publicités publiées" } },
    { id: "q11", text: "Quels sont les éléments du Cadre des quatre actions ?", correct: "A", options: { A: "Éliminer, Réduire, Augmenter, Créer", B: "Planifier, organiser, diriger, contrôler", C: "Produit, prix, place, promotion", D: "Acheter, stocker, vendre, encaisser" } },
    { id: "q12", text: "Quel choix correspond à Éliminer ?", correct: "B", options: { A: "Ajouter des étapes inutiles", B: "Supprimer un contenu ou une procédure sans valeur claire pour le client", C: "Augmenter le prix sans valeur nouvelle", D: "Ajouter un service dont le client n'a pas besoin" } },
    { id: "q13", text: "Quel choix correspond à Réduire ?", correct: "D", options: { A: "Créer un marché sans test", B: "Supprimer tous les éléments essentiels", C: "Augmenter la complexité du parcours", D: "Diminuer un élément coûteux qui influence peu la satisfaction client" } },
    { id: "q14", text: "Quel choix correspond à Augmenter ?", correct: "C", options: { A: "Réduire la visibilité du suivi", B: "Supprimer le suivi après service", C: "Renforcer un élément important comme l'assistance ou la clarté du résultat", D: "Cacher les informations de décision au client" } },
    { id: "q15", text: "Quel choix correspond à Créer ?", correct: "A", options: { A: "Ajouter une valeur nouvelle comme un diagnostic initial rapide", B: "Copier l'offre d'un concurrent", C: "Réduire la qualité de base", D: "Supprimer tous les points de contact" } },
    { id: "q16", text: "Qui sont les Non-clients ?", correct: "B", options: { A: "Les clients les plus fidèles uniquement", B: "Des catégories qui n'utilisent pas l'offre, l'utilisent par défaut ou rejettent la catégorie", C: "Les employés internes uniquement", D: "Les concurrents directs uniquement" } },
    { id: "q17", text: "Pourquoi les grandes opportunités peuvent-elles se trouver hors de la base client actuelle ?", correct: "D", options: { A: "Parce que les clients actuels n'apportent jamais d'information", B: "Parce que les Non-clients achètent toujours sans obstacle", C: "Parce qu'il faut ignorer le marché actuel", D: "Parce que les Non-clients révèlent des barrières et besoins non satisfaits" } },
    { id: "q18", text: "Qu'est-ce qui rend une opportunité Océan Bleu applicable ?", correct: "C", options: { A: "Une idée originale seulement", B: "Un coût toujours élevé", C: "Un besoin réel, une capacité d'exécution, un coût cohérent et une proposition claire", D: "Une idée impossible à tester" } },
    { id: "q19", text: "Pour un service administratif numérique avec formulaire long, quel bon départ illustre l'Innovation de valeur ?", correct: "B", options: { A: "Ajouter davantage de champs", B: "Réduire les champs inutiles et créer un diagnostic initial clair", C: "Arrêter le suivi client", D: "Copier le formulaire du concurrent" } },
    { id: "q20", text: "Quel résultat pratique cette formation doit-elle produire ?", correct: "A", options: { A: "Formuler une proposition de valeur avec les facteurs de concurrence et les quatre actions", B: "Mémoriser uniquement des définitions", C: "Supprimer l'analyse client", D: "Dépendre uniquement des remises" } }
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
  function savePendingSubmission(payload) {
    try {
      const storedValue = window.localStorage.getItem(PENDING_SUBMISSIONS_KEY);
      const pending = storedValue ? JSON.parse(storedValue) : [];
      pending.push({ queuedAt: new Date().toISOString(), payload: payload });
      window.localStorage.setItem(PENDING_SUBMISSIONS_KEY, JSON.stringify(pending));
    } catch (error) {
      console.error("Could not save pending certificate submission:", error);
    }
  }
  function createSubmissionId() {
    return `${TRAINING_ID}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
  function createCertificateKey() {
    return `${TRAINING_ID}-${getTextValue("email").toLowerCase()}`;
  }
  function buildPayload(score, answers) {
    const submittedAt = new Date().toISOString();
    const percentage = Math.round((score / TOTAL_QUESTIONS) * 100);
    const passed = score >= PASSING_SCORE;
    return {
      submittedAt: submittedAt,
      timestamp: submittedAt,
      name: getTextValue("fullName"),
      fullName: getTextValue("fullName"),
      email: getTextValue("email"),
      trainingId: TRAINING_ID,
      language: LANGUAGE,
      trainingTitle: TRAINING_TITLE,
      answersJson: JSON.stringify(answers),
      score: score,
      totalQuestions: TOTAL_QUESTIONS,
      percentage: percentage,
      result: passed ? "passed" : "failed",
      passed: passed,
      submissionId: createSubmissionId(),
      certificateKey: createCertificateKey(),
      processingStatus: "pending",
      certificateStatus: "Pending",
      learningType: LEARNING_TYPE,
      trainingCategory: TRAINING_CATEGORY,
      country: getTextValue("country"),
      organization: getTextValue("organization"),
      jobTitle: getTextValue("jobTitle"),
      legalAcknowledgment: Boolean(form.elements.legalAcknowledgment && form.elements.legalAcknowledgment.checked),
      marketingConsent: Boolean(form.elements.marketingConsent && form.elements.marketingConsent.checked),
      certificateType: CERTIFICATE_TYPE,
      notes: ""
    };
  }
  async function submitPayload(payload) {
    const response = await fetch(WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error(`Webhook returned ${response.status}`);
    const responseText = await response.text();
    if (!responseText.trim()) return null;
    try { return JSON.parse(responseText); } catch (error) { console.warn("Webhook returned a non-JSON success response:", error); return null; }
  }
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearStatus();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const answers = getAnswers();
    const score = calculateScore(answers);
    const percentage = Math.round((score / TOTAL_QUESTIONS) * 100);
    if (score < PASSING_SCORE) {
      setStatus(`Le seuil n'est pas atteint. Votre score est ${score}/${TOTAL_QUESTIONS} (${percentage}%). Vous pouvez revoir la formation et recommencer.`, "error");
      resultActions.hidden = true;
      return;
    }
    const payload = buildPayload(score, answers);
    submitButton.disabled = true;
    submitButton.textContent = "Envoi de la demande...";
    try {
      const result = await submitPayload(payload);
      if (result && result.status === "duplicate") {
        setStatus(result.message || "Une demande d'attestation existe déjà pour cet e-mail et cette formation.", "success");
      } else {
        setStatus(`Évaluation réussie. Votre score est ${score}/${TOTAL_QUESTIONS} (${percentage}%). La demande d'attestation a été envoyée.`, "success");
      }
      resultActions.hidden = false;
    } catch (error) {
      savePendingSubmission(payload);
      setStatus(`Évaluation réussie, mais l'envoi est momentanément impossible. La demande a été conservée localement. Score : ${score}/${TOTAL_QUESTIONS} (${percentage}%).`, "warning");
      resultActions.hidden = false;
      console.error("Certificate submission failed:", error);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Envoyer la demande d'attestation";
    }
  });
  resetButton.addEventListener("click", function () {
    form.reset();
    clearStatus();
    resultActions.hidden = true;
  });
  renderQuestions();
}());
