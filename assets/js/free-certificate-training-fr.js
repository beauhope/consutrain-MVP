(function () {
  "use strict";

  const WEBHOOK_URL = "https://hooks.consutrain.com/webhook/consutrain-certificate-submission";
  const TRAINING_ID = "digital-transformation-intro";
  const TRAINING_TITLE = "Introduction à la digitalisation et à la transformation numérique";
  const TOTAL_QUESTIONS = 12;
  const PASSING_SCORE = 9;

  const questions = [
    {
      id: "q1",
      text: "Quelle définition décrit le mieux la digitalisation d'une organisation ?",
      correct: "B",
      options: {
        A: "Convertir uniquement tous les documents papier en fichiers PDF",
        B: "Organiser les processus, les données et le travail à l'aide de solutions numériques",
        C: "Acheter le plus grand nombre possible de logiciels",
        D: "Remplacer tous les collaborateurs par des systèmes électroniques"
      }
    },
    {
      id: "q2",
      text: "Quelle est la première étape avant de digitaliser un processus dans une organisation ?",
      correct: "B",
      options: {
        A: "Choisir immédiatement un logiciel prêt à l'emploi",
        B: "Comprendre le fonctionnement actuel du processus",
        C: "Supprimer toutes les procédures existantes",
        D: "Lancer une campagne de communication"
      }
    },
    {
      id: "q3",
      text: "Pourquoi faut-il simplifier une procédure avant de la digitaliser ?",
      correct: "A",
      options: {
        A: "Pour éviter de transférer sa complexité dans le système numérique",
        B: "Pour la rendre plus longue et plus détaillée",
        C: "Pour empêcher l'utilisation des données",
        D: "Pour supprimer la répartition claire des responsabilités"
      }
    },
    {
      id: "q4",
      text: "Quelle différence essentielle existe entre digitalisation et transformation numérique ?",
      correct: "C",
      options: {
        A: "Il n'existe aucune différence entre les deux",
        B: "La digitalisation supprime le besoin de management",
        C: "La digitalisation met le travail sous forme numérique ; la transformation numérique améliore la manière de travailler",
        D: "La transformation numérique consiste uniquement à stocker des fichiers"
      }
    },
    {
      id: "q5",
      text: "Dans quel cas la digitalisation produit-elle un effet limité ?",
      correct: "A",
      options: {
        A: "Quand une procédure est simplement reproduite sur un écran sans améliorer le processus",
        B: "Quand les données alimentent un tableau de bord",
        C: "Quand les étapes inutiles sont supprimées",
        D: "Quand le délai de traitement est mesuré"
      }
    },
    {
      id: "q6",
      text: "Quel signe indique qu'une organisation doit dépasser la simple digitalisation et avancer vers une transformation numérique ?",
      correct: "D",
      options: {
        A: "Un formulaire numérique clair avec un suivi automatisé",
        B: "Une diminution des erreurs et une amélioration des rapports",
        C: "Des indicateurs de performance clairement définis",
        D: "Des formulaires numériques encore suivis manuellement avec plusieurs saisies des mêmes données"
      }
    },
    {
      id: "q7",
      text: "Pourquoi définir des étapes dans un projet de digitalisation d'une organisation ?",
      correct: "B",
      options: {
        A: "Pour tout déployer en une seule fois",
        B: "Pour fixer les priorités et progresser graduellement de manière structurée",
        C: "Pour éviter de mesurer les résultats",
        D: "Pour utiliser un seul outil pour toutes les activités"
      }
    },
    {
      id: "q8",
      text: "Quel est le meilleur point de départ pour un petit projet de digitalisation ?",
      correct: "C",
      options: {
        A: "Un processus rare dont l'effet est peu visible",
        B: "Un système très vaste couvrant immédiatement tous les services",
        C: "Un processus fréquent qui provoque des retards ou des erreurs et dont l'amélioration aura un effet clair",
        D: "Une page de présentation qui ne collecte aucune donnée"
      }
    },
    {
      id: "q9",
      text: "Lorsqu'un service papier devient un service numérique plus intelligent et mieux suivi, quel élément est prioritaire ?",
      correct: "A",
      options: {
        A: "Améliorer l'expérience, le suivi et réduire les étapes inutiles",
        B: "Reproduire exactement le formulaire papier sur un écran",
        C: "Demander davantage de données à l'utilisateur",
        D: "Assurer uniquement un suivi oral après l'envoi"
      }
    },
    {
      id: "q10",
      text: "Pourquoi des données structurées sont-elles essentielles à la digitalisation ?",
      correct: "B",
      options: {
        A: "Parce qu'elles empêchent l'organisation de prendre des décisions",
        B: "Parce qu'elles facilitent le stockage, le suivi, l'analyse et la production de rapports",
        C: "Parce qu'elles rendent la recherche plus difficile",
        D: "Parce qu'elles remplacent la définition claire des responsabilités"
      }
    },
    {
      id: "q11",
      text: "Quel exemple correspond à une transformation numérique plutôt qu'à une digitalisation superficielle ?",
      correct: "D",
      options: {
        A: "Transformer uniquement un formulaire papier en fichier PDF",
        B: "Enregistrer des fichiers dans des dossiers sans classement",
        C: "Recevoir une demande en ligne puis la suivre oralement",
        D: "Utiliser un formulaire harmonisé, un numéro de suivi, un tableau de bord et des alertes automatiques"
      }
    },
    {
      id: "q12",
      text: "Comment mesurer la réussite d'une digitalisation dans une organisation ?",
      correct: "C",
      options: {
        A: "Uniquement par le nombre de logiciels achetés",
        B: "Uniquement par le nombre de fichiers téléversés",
        C: "Par l'amélioration des délais, de la qualité, du suivi et de la satisfaction des usagers",
        D: "Par le nombre de réunions organisées autour du projet"
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

  if (!form || !questionsContainer || !statusBox || !calculateResultButton || !resetButton || !finalSubmitButton || !submissionStatusBox) {
    return;
  }

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

  function findMissingQuestion(answers) {
    return questions.findIndex(function (question) {
      return !answers[question.id];
    });
  }

  function calculateScore(answers) {
    return questions.reduce(function (score, question) {
      return score + (answers[question.id] === question.correct ? 1 : 0);
    }, 0);
  }

  function validateIdentityFields() {
    const requiredNames = ["fullName", "email", "country"];
    const missingField = requiredNames.find(function (name) {
      return !getTextValue(name);
    });

    if (missingField) {
      form.elements[missingField].focus();
      setStatus("Veuillez compléter les informations d'identité obligatoires.", "error");
      return false;
    }

    if (!form.elements.email.checkValidity()) {
      form.elements.email.focus();
      setStatus("Veuillez saisir une adresse e-mail valide.", "error");
      return false;
    }

    return true;
  }

  function validateLegalAcknowledgment() {
    if (form.elements.legalAcknowledgment.checked) {
      return true;
    }

    form.elements.legalAcknowledgment.focus();
    setStatus("Veuillez accepter la déclaration obligatoire.", "error");
    return false;
  }

  function validateAnswers(answers) {
    const missingQuestionIndex = findMissingQuestion(answers);

    if (missingQuestionIndex === -1) {
      return true;
    }

    const questionId = questions[missingQuestionIndex].id;
    const firstOption = form.querySelector(`input[name="${questionId}"]`);
    if (firstOption) {
      firstOption.focus();
    }
    setStatus(`Veuillez répondre à la question ${missingQuestionIndex + 1}.`, "error");
    return false;
  }

  function createProvisionalSignature(answers) {
    return JSON.stringify({
      fullName: getTextValue("fullName"),
      email: getTextValue("email").toLowerCase(),
      country: getTextValue("country"),
      legalAcknowledgment: Boolean(form.elements.legalAcknowledgment.checked),
      answers: answers
    });
  }

  function createCertificateKey() {
    const email = getTextValue("email").toLowerCase();
    return `${TRAINING_ID}-${email}`;
  }

  function invalidateProvisionalPass() {
    if (!provisionalPassIsCurrent || submissionFinished) {
      return;
    }

    provisionalPassIsCurrent = false;
    provisionalPassSignature = "";
    delete form.dataset.provisionalScore;
    delete form.dataset.totalQuestions;
    delete form.dataset.provisionalPercentage;
    delete form.dataset.provisionalPassed;
    setFinalSubmitEnabled(false);
    clearSubmissionStatus();
    setStatus("Vos réponses ou informations obligatoires ont changé. Veuillez valider à nouveau l'évaluation.", "fail");
  }

  function buildSubmissionPayload(score, percentage, passed, answers) {
    return {
      certificateKey: createCertificateKey(),
      trainingId: "digital-transformation-intro",
      trainingTitle: TRAINING_TITLE,
      certificateType: "free_test",
      learningType: "free_training",
      trainingCategory: "digital_transformation",
      language: "fr",
      name: getTextValue("fullName"),
      fullName: getTextValue("fullName"),
      email: getTextValue("email"),
      country: getTextValue("country"),
      organization: getTextValue("organization"),
      jobTitle: getTextValue("jobTitle"),
      answersJson: JSON.stringify(answers),
      score: score,
      totalQuestions: TOTAL_QUESTIONS,
      percentage: percentage,
      result: passed ? "passed" : "failed",
      passed: passed,
      legalAcknowledgment: Boolean(form.elements.legalAcknowledgment.checked),
      marketingConsent: Boolean(form.elements.marketingConsent.checked)
    };
  }

  async function sendCertificateSubmission(payload) {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Webhook returned ${response.status}`);
    }

    const responseText = await response.text();
    if (!responseText.trim()) {
      return null;
    }

    try {
      return JSON.parse(responseText);
    } catch (error) {
      console.warn("Webhook returned a non-JSON success response:", error);
      return null;
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearStatus();
    clearSubmissionStatus();
    provisionalPassIsCurrent = false;
    provisionalPassSignature = "";
    delete form.dataset.provisionalScore;
    delete form.dataset.totalQuestions;
    delete form.dataset.provisionalPercentage;
    delete form.dataset.provisionalPassed;
    setFinalSubmitEnabled(false);

    if (!validateIdentityFields() || !validateLegalAcknowledgment()) {
      return;
    }

    const answers = getAnswers();
    if (!validateAnswers(answers)) {
      return;
    }

    const score = calculateScore(answers);
    const percentage = Number(((score / TOTAL_QUESTIONS) * 100).toFixed(2));
    const passed = score >= PASSING_SCORE;

    form.dataset.provisionalScore = String(score);
    form.dataset.totalQuestions = String(TOTAL_QUESTIONS);
    form.dataset.provisionalPercentage = String(percentage);
    form.dataset.provisionalPassed = String(passed);

    if (passed) {
      provisionalPassIsCurrent = true;
      provisionalPassSignature = createProvisionalSignature(answers);
      setFinalSubmitEnabled(true);
      setStatus(
        `Résultat provisoire : ${score}/${TOTAL_QUESTIONS} (${percentage} %). Vous atteignez le seuil de réussite. ` +
        "Vous pouvez maintenant envoyer votre demande pour vérification.",
        "success"
      );
    } else {
      setFinalSubmitEnabled(false);
      setStatus(
        `Résultat provisoire : ${score}/${TOTAL_QUESTIONS} (${percentage} %). Le seuil requis est de 9/12, soit 75 %. ` +
        "Votre score est inférieur à 9/12. Revoyez les ressources puis recommencez l'évaluation.",
        "fail"
      );
    }
  });

  finalSubmitButton.addEventListener("click", async function () {
    if (isSending || submissionFinished) {
      return;
    }

    clearStatus();
    clearSubmissionStatus();

    if (!validateIdentityFields()) {
      setFinalSubmitEnabled(false);
      return;
    }

    const answers = getAnswers();
    if (!validateAnswers(answers)) {
      setFinalSubmitEnabled(false);
      return;
    }

    if (!validateLegalAcknowledgment()) {
      setFinalSubmitEnabled(false);
      return;
    }

    const score = calculateScore(answers);
    if (score < PASSING_SCORE) {
      provisionalPassIsCurrent = false;
      provisionalPassSignature = "";
      setFinalSubmitEnabled(false);
      setStatus("Votre score est inférieur à 9/12. Veuillez revoir les ressources puis valider à nouveau l'évaluation.", "fail");
      return;
    }

    const currentSignature = createProvisionalSignature(answers);
    if (!provisionalPassIsCurrent || currentSignature !== provisionalPassSignature) {
      setFinalSubmitEnabled(false);
      setStatus("Veuillez valider à nouveau l'évaluation avant d'envoyer votre demande.", "fail");
      return;
    }

    const percentage = Number(((score / TOTAL_QUESTIONS) * 100).toFixed(2));
    const payload = buildSubmissionPayload(score, percentage, true, answers);
    const originalButtonText = finalSubmitButton.textContent;
    isSending = true;
    setFinalSubmitEnabled(false);
    calculateResultButton.disabled = true;
    resetButton.disabled = true;
    finalSubmitButton.textContent = "Envoi en cours...";
    setSubmissionStatus("Enregistrement de votre demande en cours...", "success");

    try {
      const result = await sendCertificateSubmission(payload);

      if (result && result.status === "duplicate") {
        submissionFinished = true;
        setSubmissionStatus(
          result.message || "Une demande d’attestation existe déjà pour cette formation et cette adresse e-mail.",
          "success"
        );
      } else if (result && result.status === "pending") {
        submissionFinished = true;
        setSubmissionStatus(
          "Votre demande est déjà en cours de traitement. Veuillez consulter votre boîte e-mail ultérieurement.",
          "success"
        );
      } else {
        submissionFinished = true;
        setSubmissionStatus(
          "Votre demande a été enregistrée. L’attestation sera traitée après vérification de votre réussite.",
          "success"
        );
      }
    } catch (error) {
      setSubmissionStatus(
        "Une difficulté technique empêche l’enregistrement de votre demande. Vérifiez votre connexion puis réessayez.",
        "error"
      );
    } finally {
      isSending = false;
      calculateResultButton.disabled = false;
      resetButton.disabled = false;
      finalSubmitButton.textContent = originalButtonText;
      setFinalSubmitEnabled(provisionalPassIsCurrent);
    }
  });

  form.addEventListener("input", function (event) {
    if (event.target.matches('input[name="fullName"], input[name="email"], input[name="country"], input[name^="q"]')) {
      invalidateProvisionalPass();
    }
  });

  form.addEventListener("change", function (event) {
    if (event.target.matches('input[name="legalAcknowledgment"], input[name^="q"]')) {
      invalidateProvisionalPass();
    }
  });

  resetButton.addEventListener("click", function () {
    if (isSending) {
      return;
    }

    form.reset();
    provisionalPassIsCurrent = false;
    provisionalPassSignature = "";
    submissionFinished = false;
    delete form.dataset.provisionalScore;
    delete form.dataset.totalQuestions;
    delete form.dataset.provisionalPercentage;
    delete form.dataset.provisionalPassed;
    clearStatus();
    clearSubmissionStatus();
    finalSubmitButton.textContent = "Envoyer la demande d'attestation";
    setFinalSubmitEnabled(false);
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  renderQuestions();
  setFinalSubmitEnabled(false);

  void TRAINING_ID;
  void TRAINING_TITLE;
})();
