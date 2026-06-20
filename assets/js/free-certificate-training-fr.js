(function () {
  "use strict";

  const TRAINING_ID = "digital-transformation-intro-fr";
  const LANGUAGE = "fr";
  const TRAINING_TITLE = "Introduction à la digitalisation et à la transformation numérique";
  const CERTIFICATE_TYPE = "free_test";
  const LEARNING_TYPE = "free_training";
  const TRAINING_CATEGORY = "transformation_numerique";
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
  const resetButton = document.getElementById("resetAssessmentBtnFr");

  if (!form || !questionsContainer || !statusBox || !resetButton) {
    return;
  }

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

  function validateRequiredFields() {
    const requiredNames = ["fullName", "email", "country"];
    const missingField = requiredNames.find(function (name) {
      const field = form.elements[name];
      return !field || !field.value.trim();
    });

    if (missingField) {
      form.elements[missingField].focus();
      setStatus("Veuillez compléter le nom, l'adresse e-mail et le pays avant de calculer votre résultat.", "error");
      return false;
    }

    if (!form.elements.email.checkValidity()) {
      form.elements.email.focus();
      setStatus("Veuillez saisir une adresse e-mail valide.", "error");
      return false;
    }

    if (!form.elements.legalAcknowledgment.checked) {
      form.elements.legalAcknowledgment.focus();
      setStatus("Vous devez accepter la déclaration obligatoire avant de calculer votre résultat.", "error");
      return false;
    }

    return true;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearStatus();

    if (!validateRequiredFields()) {
      return;
    }

    const answers = getAnswers();
    const missingQuestionIndex = findMissingQuestion(answers);

    if (missingQuestionIndex !== -1) {
      const questionId = questions[missingQuestionIndex].id;
      const firstOption = form.querySelector(`input[name="${questionId}"]`);
      if (firstOption) {
        firstOption.focus();
      }
      setStatus(`Veuillez répondre à la question ${missingQuestionIndex + 1} avant de calculer votre résultat.`, "error");
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
      setStatus(
        `Résultat provisoire : ${score}/${TOTAL_QUESTIONS} (${percentage} %). Vous atteignez le seuil de réussite. ` +
        "Ce résultat doit encore être validé avant tout traitement d'attestation ; aucune demande n'a été envoyée.",
        "success"
      );
    } else {
      setStatus(
        `Résultat provisoire : ${score}/${TOTAL_QUESTIONS} (${percentage} %). Le seuil requis est de 9/12, soit 75 %. ` +
        "Revoyez les ressources puis recommencez l'évaluation. Aucune demande n'a été envoyée.",
        "fail"
      );
    }
  });

  resetButton.addEventListener("click", function () {
    form.reset();
    delete form.dataset.provisionalScore;
    delete form.dataset.totalQuestions;
    delete form.dataset.provisionalPercentage;
    delete form.dataset.provisionalPassed;
    clearStatus();
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  renderQuestions();

  void TRAINING_ID;
  void LANGUAGE;
  void TRAINING_TITLE;
  void CERTIFICATE_TYPE;
  void LEARNING_TYPE;
  void TRAINING_CATEGORY;
})();
