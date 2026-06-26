(function () {
  "use strict";

  const WEBHOOK_URL = "https://hooks.consutrain.com/webhook/consutrain-certificate-submission";
  const TRAINING_ID = "brand-customer-experience-basics";
  const TRAINING_TITLE = "Les fondamentaux de la marque et de l’expérience client pour les petites entreprises";
  const LANGUAGE = "fr";
  const CERTIFICATE_TYPE = "free_test";
  const LEARNING_TYPE = "free_training";
  const TRAINING_CATEGORY = "branding_customer_experience";
  const TOTAL_QUESTIONS = 20;
  const PASSING_SCORE = 14;
  const PENDING_SUBMISSIONS_KEY = "consutrain_pending_certificate_submissions";

  const questions = [
    { id: "q1", text: "Quelle est la meilleure définition d’une marque ?", correct: "B", options: { A: "Le logo uniquement", B: "L’impression, la promesse et l’expérience associées au projet", C: "Le nom légal de l’entreprise", D: "Les couleurs graphiques" } },
    { id: "q2", text: "Pourquoi le logo ne suffit-il pas à construire une marque forte ?", correct: "A", options: { A: "Parce que le client juge aussi l’expérience, la communication et le comportement", B: "Parce que le logo n’apparaît pas sur Internet", C: "Parce que les couleurs ne comptent pas", D: "Parce que chaque projet doit avoir un logo complexe" } },
    { id: "q3", text: "Que signifie la promesse de marque ?", correct: "B", options: { A: "Baisser les prix en permanence", B: "Ce que le client peut attendre régulièrement du service ou du produit", C: "Changer de nom régulièrement", D: "Utiliser la même publicité pour tous" } },
    { id: "q4", text: "Quel exemple reflète une bonne expérience client dans un service numérique ?", correct: "C", options: { A: "Un formulaire long sans explication", B: "Une réponse tardive et confuse", C: "Des étapes simples et des messages de suivi clairs", D: "Demander des données sans lien avec le service" } },
    { id: "q5", text: "Quelle est la première étape avant de rédiger un message marketing ?", correct: "B", options: { A: "Choisir les polices", B: "Comprendre le client et ses besoins", C: "Publier une annonce au hasard", D: "Copier les concurrents" } },
    { id: "q6", text: "Qu’est-ce qu’un point de contact client ?", correct: "A", options: { A: "Tout moment où le client interagit avec le projet ou le service", B: "Le commercial uniquement", C: "Le logo uniquement", D: "La facture uniquement" } },
    { id: "q7", text: "Quel choix aide une petite entreprise à construire la confiance ?", correct: "B", options: { A: "Des promesses importantes mais impossibles à tenir", B: "Des réponses claires, des délais réalistes et un suivi après service", C: "Changer les messages chaque jour", D: "Cacher systématiquement les prix" } },
    { id: "q8", text: "Quelle est la meilleure manière de différencier un petit service ?", correct: "B", options: { A: "Utiliser des mots génériques comme toujours le meilleur", B: "Définir une valeur claire et utile pour le client", C: "Ignorer les concurrents et les clients", D: "Réduire la qualité de la communication" } },
    { id: "q9", text: "Que signifie la cohérence d’une marque ?", correct: "B", options: { A: "Répéter uniquement le logo", B: "Aligner les messages, le design et le comportement sur tous les canaux", C: "Utiliser une seule couleur partout", D: "Ne jamais modifier aucun service" } },
    { id: "q10", text: "Quel indicateur aide à mesurer l’expérience client ?", correct: "B", options: { A: "Le nombre de fichiers internes seulement", B: "Le délai de réponse, la satisfaction et les achats répétés", C: "Le nombre de réunions internes", D: "Le nombre de logos proposés" } },
    { id: "q11", text: "Quel est le risque d’exagérer une promesse de marque ?", correct: "B", options: { A: "Augmenter toujours la confiance", B: "Créer des attentes que le service ne peut pas tenir", C: "Améliorer automatiquement l’expérience client", D: "Réduire toujours les réclamations" } },
    { id: "q12", text: "Face à un client mécontent, quelle réaction est la plus appropriée ?", correct: "B", options: { A: "Ignorer le message", B: "Reconnaître le problème et expliquer la prochaine étape", C: "Envoyer une nouvelle publicité", D: "Supprimer immédiatement tout commentaire" } },
    { id: "q13", text: "À quoi sert la cartographie du parcours client ?", correct: "A", options: { A: "Identifier les points de friction et les possibilités d’amélioration", B: "Remplacer le service par un nouveau design seulement", C: "Supprimer la communication avec le client", D: "Multiplier les canaux sans objectif" } },
    { id: "q14", text: "Quel exemple correspond à un ton de marque professionnel ?", correct: "B", options: { A: "Des messages vagues et contradictoires", B: "Un langage clair, respectueux et adapté au client", C: "Une exagération permanente des promesses", D: "Des réponses aléatoires selon l’humeur" } },
    { id: "q15", text: "Quel est le lien entre marque et expérience client ?", correct: "B", options: { A: "Il n’y a aucun lien", B: "L’expérience quotidienne renforce ou affaiblit la promesse de marque", C: "La marque s’arrête au logo", D: "L’expérience client ne concerne que les grandes entreprises" } },
    { id: "q16", text: "Quelle action améliore le mieux une demande de service en ligne ?", correct: "B", options: { A: "Rendre les étapes moins claires", B: "Clarifier les étapes, le délai et le message de confirmation", C: "Supprimer les informations de contact", D: "Demander plusieurs fois les mêmes données" } },
    { id: "q17", text: "Que signifie la différenciation d’une marque ?", correct: "B", options: { A: "Être seulement différent visuellement", B: "Aider le client à comprendre pourquoi vous choisir plutôt qu’une alternative", C: "Utiliser beaucoup de mots étrangers", D: "Éviter d’expliquer le service" } },
    { id: "q18", text: "Quel élément doit apparaître dans une proposition de service claire ?", correct: "A", options: { A: "Le résultat attendu, le périmètre, le prix ou le mode de tarification et les prochaines étapes", B: "Beaucoup d’images sans explication", C: "Des promesses générales uniquement", D: "Des conditions cachées" } },
    { id: "q19", text: "Comment une petite équipe peut-elle maintenir la cohérence ?", correct: "B", options: { A: "Laisser chacun répondre à sa façon", B: "Utiliser des modèles, des messages guides et une checklist simple", C: "Changer de canal chaque semaine", D: "Supprimer toutes les anciennes réponses" } },
    { id: "q20", text: "Quel est le meilleur résultat pratique de cette formation ?", correct: "B", options: { A: "Mémoriser uniquement des définitions théoriques", B: "Construire une promesse de marque claire et une carte d’expérience client améliorable", C: "Concevoir seulement un logo", D: "Lancer une annonce sans comprendre le client" } }
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

  function buildPayload(score, answers) {
    const percentage = Math.round((score / TOTAL_QUESTIONS) * 100);
    const email = getTextValue("email").toLowerCase();
    return {
      timestamp: new Date().toISOString(),
      submissionId: `${TRAINING_ID}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      certificateKey: `${TRAINING_ID}-${email}`,
      trainingId: TRAINING_ID,
      trainingTitle: TRAINING_TITLE,
      certificateType: CERTIFICATE_TYPE,
      learningType: LEARNING_TYPE,
      trainingCategory: TRAINING_CATEGORY,
      language: LANGUAGE,
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
    const response = await fetch(WEBHOOK_URL, {
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
      if (result && result.status === "duplicate") {
        setStatus(result.message || "Une demande existe déjà pour cette adresse e-mail et cette formation.", "success");
      } else {
        setStatus(`Réussite validée : ${score}/${TOTAL_QUESTIONS} (${percentage}%). Votre demande d’attestation a été envoyée.`, "success");
      }
      resultActions.hidden = false;
    } catch (error) {
      savePendingSubmission(payload);
      setStatus(`Vous avez réussi l’évaluation, mais l’envoi n’a pas abouti. La demande a été conservée localement pour une nouvelle tentative. Score : ${score}/${TOTAL_QUESTIONS} (${percentage}%).`, "warning");
      resultActions.hidden = false;
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

  renderQuestions();
}());
