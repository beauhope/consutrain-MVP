(function () {
  "use strict";

  const WEBHOOK_URL = "https://hooks.consutrain.com/webhook/consutrain-certificate-submission";
  const TRAINING_ID = "kaizen-continuous-improvement";
  const LANGUAGE = "fr";
  const TRAINING_TITLE = "Kaizen : l’amélioration continue au travail";
  const CERTIFICATE_TYPE = "free_test";
  const LEARNING_TYPE = "free_training";
  const TRAINING_CATEGORY = "Qualité et amélioration continue";
  const TOTAL_QUESTIONS = 20;
  const PASSING_SCORE = 14;

  const questions = [
    {
      id: "q1",
      text: "Quelle définition décrit le mieux le Kaizen au travail ?",
      correct: "B",
      options: {
        A: "Un grand changement réalisé une seule fois sans suivi",
        B: "Des améliorations petites, régulières et structurées avec la participation des équipes",
        C: "Le remplacement immédiat de toutes les procédures existantes",
        D: "L’augmentation du nombre de rapports sans changer le travail"
      }
    },
    {
      id: "q2",
      text: "Pourquoi l’amélioration continue est-elle utile dans les services et les fonctions administratives ?",
      correct: "C",
      options: {
        A: "Elle supprime le besoin de suivi",
        B: "Elle consiste seulement à acheter de nouveaux outils",
        C: "Elle réduit progressivement les gaspillages, les erreurs et les temps d’attente",
        D: "Elle empêche les collaborateurs de proposer des idées"
      }
    },
    {
      id: "q3",
      text: "Quelle différence existe entre amélioration progressive et amélioration majeure ?",
      correct: "A",
      options: {
        A: "L’amélioration progressive est petite et fréquente ; l’amélioration majeure est plus large et moins fréquente",
        B: "L’amélioration progressive ne se mesure jamais",
        C: "L’amélioration majeure se produit tous les jours dans chaque activité",
        D: "Il n’existe aucune différence"
      }
    },
    {
      id: "q4",
      text: "Que signifie Muda dans l’approche 3M ?",
      correct: "B",
      options: {
        A: "Une variation dans le volume des demandes",
        B: "Un gaspillage ou une activité sans valeur ajoutée",
        C: "Une surcharge imposée aux personnes ou au système",
        D: "La standardisation du travail"
      }
    },
    {
      id: "q5",
      text: "Que signifie Mura ?",
      correct: "C",
      options: {
        A: "Des erreurs répétées",
        B: "Le rangement des dossiers",
        C: "L’irrégularité ou la variation dans le flux de travail",
        D: "L’arrêt d’un processus en cas d’anomalie"
      }
    },
    {
      id: "q6",
      text: "Que signifie Muri ?",
      correct: "A",
      options: {
        A: "Une surcharge ou une pression excessive sur les personnes ou le système",
        B: "Un travail sans valeur ajoutée",
        C: "Une méthode de travail standardisée",
        D: "Un test de solution à petite échelle"
      }
    },
    {
      id: "q7",
      text: "La ressaisie des mêmes données client dans trois formulaires différents représente le plus souvent :",
      correct: "D",
      options: {
        A: "Jidoka",
        B: "Mura",
        C: "Muri",
        D: "Muda"
      }
    },
    {
      id: "q8",
      text: "L’accumulation des demandes en fin de semaine à cause d’une répartition irrégulière du travail représente surtout :",
      correct: "B",
      options: {
        A: "Muda",
        B: "Mura",
        C: "Poka-Yoke",
        D: "Le travail standardisé"
      }
    },
    {
      id: "q9",
      text: "Confier toutes les validations urgentes à une seule personne toute la journée représente surtout :",
      correct: "C",
      options: {
        A: "Le tri",
        B: "Muda",
        C: "Muri",
        D: "Pareto"
      }
    },
    {
      id: "q10",
      text: "Quel est l’objectif de l’étape Trier dans 5S ?",
      correct: "A",
      options: {
        A: "Retirer ce qui n’est pas utile au travail quotidien",
        B: "Changer toutes les procédures en une seule fois",
        C: "Ajouter des fichiers de secours sans classement",
        D: "Multiplier les réunions"
      }
    },
    {
      id: "q11",
      text: "Que signifie Ranger dans 5S pour un bureau ou un service ?",
      correct: "B",
      options: {
        A: "Conserver tout dans des emplacements aléatoires",
        B: "Placer dossiers et outils de manière à les retrouver et les utiliser facilement",
        C: "Supprimer tous les formulaires",
        D: "Limiter le partage d’information"
      }
    },
    {
      id: "q12",
      text: "Que signifie Standardiser dans 5S ?",
      correct: "D",
      options: {
        A: "Laisser chaque équipe travailler différemment",
        B: "Nettoyer une seule fois",
        C: "Supprimer les responsabilités de suivi",
        D: "Définir une méthode claire et répétable pour maintenir l’organisation"
      }
    },
    {
      id: "q13",
      text: "Quel est le bon ordre du cycle PDCA ?",
      correct: "A",
      options: {
        A: "Planifier, Déployer, Contrôler, Ajuster",
        B: "Déployer, Ajuster, Planifier, Ignorer la mesure",
        C: "Contrôler, Déployer, Planifier, Supprimer le processus",
        D: "Planifier, acheter un outil, arrêter"
      }
    },
    {
      id: "q14",
      text: "Quel est l’objectif de l’analyse de cause racine ?",
      correct: "C",
      options: {
        A: "Désigner une personne responsable à blâmer",
        B: "Augmenter le nombre d’indicateurs sans décision",
        C: "Comprendre la vraie cause du problème au-delà du symptôme visible",
        D: "Éviter d’échanger avec les personnes concernées"
      }
    },
    {
      id: "q15",
      text: "À quoi sert le diagramme d’Ishikawa ?",
      correct: "B",
      options: {
        A: "À fournir une solution automatique sans discussion",
        B: "À organiser les causes possibles d’un problème par catégories",
        C: "À remplacer les données par des impressions",
        D: "À supprimer les tests"
      }
    },
    {
      id: "q16",
      text: "Quel est l’intérêt de l’analyse de Pareto ?",
      correct: "A",
      options: {
        A: "Se concentrer sur les quelques causes qui produisent le plus d’effet",
        B: "Traiter toutes les causes avec le même effort, quel que soit leur impact",
        C: "Choisir toujours la solution la plus coûteuse",
        D: "Éviter de mesurer les résultats"
      }
    },
    {
      id: "q17",
      text: "Pour une première action Kaizen, quelle solution est généralement préférable ?",
      correct: "D",
      options: {
        A: "Une solution coûteuse nécessitant plusieurs mois sans test",
        B: "Une solution dont l’effet ne peut pas être mesuré",
        C: "Une solution qui ajoute des étapes sans valeur",
        D: "Une solution simple, peu coûteuse, rapide à tester et mesurable"
      }
    },
    {
      id: "q18",
      text: "Que signifie Poka-Yoke ?",
      correct: "C",
      options: {
        A: "Masquer les erreurs après leur apparition",
        B: "S’appuyer uniquement sur la mémoire",
        C: "Concevoir un dispositif qui empêche l’erreur ou la détecte avant qu’elle ne se propage",
        D: "Reporter le contrôle à la fin du mois"
      }
    },
    {
      id: "q19",
      text: "Quelle est l’idée pratique derrière Jidoka ?",
      correct: "B",
      options: {
        A: "Transmettre l’anomalie à l’étape suivante",
        B: "Arrêter ou signaler le processus lorsqu’une anomalie apparaît",
        C: "Supprimer le rôle des collaborateurs dans l’amélioration",
        D: "Mesurer les résultats une seule fois"
      }
    },
    {
      id: "q20",
      text: "Dans un service ralenti par des dossiers dispersés et des validations peu claires, quel est le meilleur point de départ ?",
      correct: "A",
      options: {
        A: "Cartographier le processus, identifier les gaspillages, puis tester une petite amélioration avec 5S ou PDCA",
        B: "Acheter un nouvel outil sans comprendre le travail actuel",
        C: "Ajouter une validation supplémentaire à chaque demande",
        D: "Attendre l’accumulation des réclamations avant de chercher une solution globale"
      }
    }
  ];

  const form = document.getElementById("certificateTrainingFormFr");
  const questionsContainer = document.getElementById("certificateQuestionsFr");
  const statusBox = document.getElementById("certificateStatusFr");
  const calculateResultButton = document.getElementById("calculateResultBtnFr");
  const resetButton = document.getElementById("resetAssessmentBtnFr");
  const finalSubmitButton = document.getElementById("frenchCertificateSubmitButton");
  const submissionStatusBox = document.getElementById("frenchCertificateSubmissionStatus");

  if (!form || !questionsContainer || !statusBox || !calculateResultButton || !resetButton || !finalSubmitButton || !submissionStatusBox) return;

  let provisionalPassIsCurrent = false;
  let provisionalPassSignature = "";
  let isSending = false;
  let submissionFinished = false;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderQuestions() {
    questionsContainer.innerHTML = questions.map(function (question, index) {
      const optionsHtml = Object.keys(question.options).map(function (key) {
        const inputId = `${question.id}-${key}`;
        return `
          <label class="certificate-radio" for="${inputId}">
            <input id="${inputId}" name="${question.id}" type="radio" value="${key}" required>
            <span>${key}. ${escapeHtml(question.options[key])}</span>
          </label>
        `;
      }).join("");

      return `
        <article class="certificate-question">
          <h3>Question ${index + 1} : ${escapeHtml(question.text)}</h3>
          <div class="certificate-options">${optionsHtml}</div>
        </article>
      `;
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

  function setSubmissionStatus(message, type) {
    submissionStatusBox.textContent = message;
    submissionStatusBox.className = `certificate-status ${type}`;
    submissionStatusBox.hidden = false;
  }

  function clearSubmissionStatus() {
    submissionStatusBox.textContent = "";
    submissionStatusBox.className = "certificate-status";
    submissionStatusBox.hidden = true;
  }

  function setFinalSubmitEnabled(enabled) {
    const shouldEnable = enabled && !isSending && !submissionFinished;
    finalSubmitButton.disabled = !shouldEnable;
    finalSubmitButton.setAttribute("aria-disabled", String(!shouldEnable));
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

  function getAnswerSignature(answers) {
    return questions.map(function (question) {
      return `${question.id}:${answers[question.id] || ""}`;
    }).join("|");
  }

  function buildSubmissionPayload(score, answers) {
    const percentage = Math.round((score / TOTAL_QUESTIONS) * 100);
    return {
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
      score,
      totalQuestions: TOTAL_QUESTIONS,
      percentage,
      passed: score >= PASSING_SCORE,
      answersJson: JSON.stringify(answers),
      legalAcknowledgment: Boolean(form.elements.legalAcknowledgment && form.elements.legalAcknowledgment.checked),
      marketingConsent: Boolean(form.elements.marketingConsent && form.elements.marketingConsent.checked)
    };
  }

  function updateAssessmentState() {
    provisionalPassIsCurrent = false;
    provisionalPassSignature = "";
    setFinalSubmitEnabled(false);
    clearSubmissionStatus();
    submissionFinished = false;
  }

  calculateResultButton.addEventListener("click", function () {
    clearStatus();
    clearSubmissionStatus();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const answers = getAnswers();
    const score = calculateScore(answers);
    const percentage = Math.round((score / TOTAL_QUESTIONS) * 100);

    if (score >= PASSING_SCORE) {
      provisionalPassIsCurrent = true;
      provisionalPassSignature = getAnswerSignature(answers);
      setStatus(`Réussite validée : ${score}/${TOTAL_QUESTIONS} (${percentage}%). Vous pouvez envoyer votre demande d’attestation.`, "success");
      setFinalSubmitEnabled(true);
      return;
    }

    provisionalPassIsCurrent = false;
    provisionalPassSignature = "";
    setStatus(`Résultat insuffisant : ${score}/${TOTAL_QUESTIONS} (${percentage}%). Le seuil de réussite est de ${PASSING_SCORE}/${TOTAL_QUESTIONS}. Vous pouvez refaire l’évaluation.`, "error");
    setFinalSubmitEnabled(false);
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearSubmissionStatus();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const answers = getAnswers();
    const score = calculateScore(answers);
    const signature = getAnswerSignature(answers);

    if (!provisionalPassIsCurrent || provisionalPassSignature !== signature || score < PASSING_SCORE) {
      setStatus("Calculez d’abord votre résultat et vérifiez que le seuil de réussite est atteint avant l’envoi.", "error");
      setFinalSubmitEnabled(false);
      return;
    }

    isSending = true;
    setFinalSubmitEnabled(false);
    finalSubmitButton.textContent = "Envoi en cours...";

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildSubmissionPayload(score, answers))
      });
      if (!response.ok) throw new Error(`Webhook returned ${response.status}`);

      submissionFinished = true;
      setSubmissionStatus("Votre demande d’attestation a été envoyée. Vérifiez votre boîte mail après traitement.", "success");
    } catch (error) {
      setSubmissionStatus("L’envoi n’a pas abouti. Vérifiez votre connexion puis réessayez.", "error");
      setFinalSubmitEnabled(true);
    } finally {
      isSending = false;
      finalSubmitButton.textContent = "Envoyer la demande d’attestation";
      setFinalSubmitEnabled(!submissionFinished && provisionalPassIsCurrent);
    }
  });

  resetButton.addEventListener("click", function () {
    form.reset();
    clearStatus();
    clearSubmissionStatus();
    updateAssessmentState();
  });

  form.addEventListener("change", function (event) {
    if (event.target && event.target.name && /^q\d+$/.test(event.target.name)) {
      updateAssessmentState();
      clearStatus();
    }
  });

  renderQuestions();
  setFinalSubmitEnabled(false);
}());
