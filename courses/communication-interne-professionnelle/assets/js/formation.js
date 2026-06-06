(function () {
  "use strict";

  const data = window.CIP_SLIDES;
  if (!data) return;

  const quizBank = {
    1: [
      { q: "Une bonne communication interne aide à savoir quoi dire, à qui, quand et par quel canal.", a: 0, o: ["Vrai", "Faux"], f: "La séance 1 insiste sur le bon interlocuteur, le canal, l’urgence et l’action attendue." },
      { q: "Quel élément confirme la bonne compréhension du message ?", a: 2, o: ["Le canal", "L’organigramme", "Le feedback"], f: "Sans feedback, le risque de malentendu reste élevé." },
      { q: "Dans la méthode C.L.A.I.R., la lettre A renvoie à :", a: 1, o: ["Analyse du client", "Action attendue", "Archivage automatique"], f: "A signifie Action attendue : informer, demander, alerter ou escalader." },
      { q: "Un organigramme suffit toujours pour régler tous les échanges internes.", a: 1, o: ["Vrai", "Faux"], f: "Il doit être complété par les procédures, les règles d’escalade et les responsabilités." },
      { q: "Le message FIAB contient notamment :", a: 0, o: ["Faits, impact, action déjà faite, besoin attendu", "Formule, image, archive, bilan", "Filtre, incident, autorisation, budget"], f: "FIAB sert à rendre un message factuel et orienté action." }
    ],
    2: [
      { q: "Informer et demander ont exactement la même intention.", a: 1, o: ["Vrai", "Faux"], f: "Informer transmet une information ; demander attend une action ou une réponse." },
      { q: "Dans RACI, la personne accountable est celle qui :", a: 1, o: ["Reçoit uniquement l’information", "Valide ou porte la responsabilité finale", "Classe les emails"], f: "Le rôle A porte la responsabilité finale ou la validation." },
      { q: "Multiplier les CC est une bonne pratique systématique.", a: 1, o: ["Vrai", "Faux"], f: "Les copies doivent être limitées aux personnes réellement concernées." },
      { q: "La méthode I.D.E.A. sert principalement à :", a: 0, o: ["Clarifier l’intention avant de rédiger", "Créer une signature email", "Remplacer l’organigramme"], f: "Elle aide à transformer une situation en message clair et utile." },
      { q: "Une escalade sert surtout quand :", a: 2, o: ["Le sujet est déjà résolu", "On veut éviter le responsable direct", "Le blocage, l’urgence ou le risque dépasse le niveau habituel"], f: "L’escalade doit être justifiée par l’impact, l’urgence ou le niveau de responsabilité." }
    ],
    3: [
      { q: "Une stratégie de communication interne précise les objectifs, cibles, canaux et messages.", a: 0, o: ["Vrai", "Faux"], f: "La séance 3 structure la communication interne comme une démarche organisée." },
      { q: "Un canal doit être choisi selon :", a: 2, o: ["La préférence personnelle seulement", "La couleur du tableau de bord", "Le sujet, l’urgence, la trace et le destinataire"], f: "Le bon canal dépend du besoin professionnel et de la traçabilité attendue." },
      { q: "RACI aide à clarifier qui fait quoi.", a: 0, o: ["Vrai", "Faux"], f: "RACI évite les confusions entre action, validation, consultation et information." },
      { q: "Un message interne efficace doit être :", a: 1, o: ["Long et exhaustif dans tous les cas", "Clair, ciblé et orienté action", "Envoyé à toute l’équipe par sécurité"], f: "La qualité vient de la clarté, du bon destinataire et de l’action attendue." },
      { q: "Un mini-plan de communication sert à :", a: 0, o: ["Préparer les messages importants et leur diffusion", "Remplacer toute procédure interne", "Supprimer les retours terrain"], f: "Il organise l’objectif, les personnes concernées, le canal, le moment et le suivi." }
    ],
    4: [
      { q: "Un écrit professionnel est un outil de coordination et de traçabilité.", a: 0, o: ["Vrai", "Faux"], f: "La séance 4 traite l’email, le rapport et le suivi comme des preuves utiles." },
      { q: "PLACE aide surtout à :", a: 1, o: ["Choisir une salle", "Rendre le message lisible et structuré", "Calculer un score qualité"], f: "PLACE guide la présentation du message pour faciliter la lecture." },
      { q: "VISA est une grille de vérification avant envoi.", a: 0, o: ["Vrai", "Faux"], f: "Elle aide à contrôler destinataires, objet, pièces jointes, ton et confidentialité." },
      { q: "Dans un rapport d’incident, il faut éviter :", a: 2, o: ["Les faits datés", "L’impact observé", "Les jugements ou accusations inutiles"], f: "Un rapport professionnel reste factuel et orienté résolution." },
      { q: "PDCA appliqué aux écrits signifie :", a: 0, o: ["Préparer, faire, vérifier, améliorer", "Publier, dupliquer, copier, archiver", "Prioriser, décider, classer, annuler"], f: "PDCA installe une logique d’amélioration continue." }
    ],
    5: [
      { q: "Un email professionnel ne se termine pas au bouton Envoyer.", a: 0, o: ["Vrai", "Faux"], f: "Il doit aussi être classé, suivi, archivé ou relancé selon le besoin." },
      { q: "Dans Gmail, le classement repose notamment sur :", a: 1, o: ["Les dossiers Windows", "Les libellés", "Les macros PowerPoint"], f: "Gmail utilise les libellés ; Outlook utilise dossiers, catégories et indicateurs." },
      { q: "Une signature automatique doit respecter la charte de l’entreprise.", a: 0, o: ["Vrai", "Faux"], f: "Logo, photo, coordonnées et mention de confidentialité doivent être autorisés." },
      { q: "Un message en attente doit contenir une trace de :", a: 2, o: ["La météo du jour", "Tous les collègues en copie", "Date, destinataire, action attendue et relance"], f: "Le suivi évite les oublis et rend la relance plus professionnelle." },
      { q: "La boîte de réception doit idéalement garder :", a: 1, o: ["Tous les emails reçus", "Les actions en cours", "Seulement les emails avec pièces jointes"], f: "Les informations sans action doivent être classées ou archivées." }
    ]
  };

  function esc(value) {
    return String(value || "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
    }[char]));
  }

  function sessionByNumber(number) {
    return data.sessions.find((session) => session.number === Number(number));
  }

  function slideBodyLines(slide, sessionNumber) {
    const skip = new Set([
      `Séance ${sessionNumber}`,
      "Communication interne professionnelle",
      slide.title
    ]);
    return slide.lines.filter((line) => !skip.has(line) && !/^Durée/.test(line) && !/^Formation interne/.test(line));
  }

  function objectivesFrom(session) {
    const slide = session.slides.find((item) => /objectifs/i.test(item.title)) || session.slides[2] || session.slides[0];
    return slideBodyLines(slide, session.number).filter((line) => !/résultat attendu|message clé/i.test(line)).slice(0, 6);
  }

  function renderLocalChrome() {
    const sessionNumber = document.body.dataset.session;
    const header = document.getElementById("header-placeholder");
    if (header) {
      header.innerHTML = `
        <header class="cip-local-header" dir="ltr">
          <div class="container">
            <a class="cip-local-brand" href="../../index.html" aria-label="Accueil ConsuTrain">
              <img src="../../assets/images/consutrain-logo-horizontal.png" alt="ConsuTrain">
            </a>
            <nav aria-label="Navigation locale">
              <a href="../../index.html">Accueil</a>
              <a href="../index.html">Cours</a>
              <a href="index.html">Formation</a>
            </nav>
          </div>
        </header>`;
    }

    const breadcrumbs = document.getElementById("breadcrumbs-placeholder");
    if (breadcrumbs) {
      breadcrumbs.innerHTML = `
        <nav class="cip-local-breadcrumbs" aria-label="Fil d'Ariane" dir="ltr">
          <a href="../../index.html">Accueil</a>
          <span aria-hidden="true">&gt;</span>
          <a href="../index.html">Cours</a>
          <span aria-hidden="true">&gt;</span>
          <a href="index.html">Communication interne professionnelle</a>
          ${sessionNumber ? `<span aria-hidden="true">&gt;</span><span>Séance ${sessionNumber}</span>` : ""}
        </nav>`;
    }

    const footer = document.getElementById("footer-placeholder");
    if (footer) {
      footer.innerHTML = `
        <footer class="cip-local-footer" dir="ltr">
          <div class="container">
            <span>ConsuTrain · Communication interne professionnelle</span>
            <a href="index.html">Retour au programme</a>
          </div>
        </footer>`;
    }
  }

  function renderIndex() {
    const target = document.getElementById("sessionCards");
    if (!target) return;
    target.innerHTML = data.sessions.map((session) => `
      <article class="course-card">
        <span class="eyebrow">Séance ${session.number} · ${session.slideCount} slides · Quiz final</span>
        <h3>${esc(session.title)}</h3>
        <p>${esc(objectivesFrom(session).slice(0, 2).join(" "))}</p>
        <div class="course-actions-row">
          <a class="btn btn-primary btn-small" href="seance-${session.number}.html">Ouvrir la séance</a>
          <a class="btn btn-secondary btn-small" href="communication-interne-source/${esc(session.source)}">Support PowerPoint</a>
        </div>
      </article>
    `).join("");
  }

  function renderSession() {
    const app = document.getElementById("sessionApp");
    const sessionNumber = document.body.dataset.session;
    if (!app || !sessionNumber) return;
    const session = sessionByNumber(sessionNumber);
    if (!session) return;

    const prev = session.number > 1 ? `seance-${session.number - 1}.html` : "";
    const next = session.number < data.sessions.length ? `seance-${session.number + 1}.html` : "";
    const objectives = objectivesFrom(session);

    app.innerHTML = `
      <section class="hero cip-session-hero">
        <div class="container hero-grid">
          <div class="hero-card">
            <span class="eyebrow">Séance ${session.number} · ${session.slideCount} slides</span>
            <h1>${esc(session.title)}</h1>
            <p>${esc(data.subtitle)}</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="#slides">Lancer les slides</a>
              <a class="btn btn-secondary" href="#quiz">Questionnaire final</a>
            </div>
          </div>
          <div class="hero-side">
            <article class="feature-card"><h3>Source</h3><p>${esc(session.source)}</p></article>
            <article class="feature-card"><h3>Navigation</h3><p>Flèche droite pour avancer, flèche gauche pour revenir.</p></article>
          </div>
        </div>
      </section>

      <section class="home-section cip-session-summary">
        <div class="container">
          <div class="section-head"><div><h2>Objectifs de la séance</h2><p>Objectifs extraits et structurés depuis le support source.</p></div></div>
          <div class="cip-session-objectives">
            ${objectives.map((item) => `<article class="course-info-card"><strong>${esc(item)}</strong><span>À appliquer pendant les exercices et les mises en situation.</span></article>`).join("")}
          </div>
        </div>
      </section>

      <section id="slides" class="cip-slide-deck" aria-label="Slides de la séance">
        <div class="cip-toolbar">
          <div class="container cip-toolbar-inner">
            <div class="cip-progress" id="slideProgress">Slide 1 / ${session.slideCount}</div>
            <div class="cip-toolbar-actions">
              <button class="btn btn-secondary btn-small" type="button" data-action="presentation">Mode présentation</button>
              <button class="btn btn-secondary btn-small" type="button" data-action="fullscreen">Plein écran</button>
            </div>
            <div class="cip-step-actions">
              <button class="btn btn-secondary btn-small" type="button" data-action="prev">Précédente</button>
              <button class="btn btn-primary btn-small" type="button" data-action="next">Suivante</button>
            </div>
          </div>
        </div>
        <div class="container cip-slide-layout">
          <nav class="cip-slide-nav" id="slideNav" aria-label="Navigation des slides"></nav>
          <div class="cip-slide-stage" id="slideStage"></div>
        </div>
      </section>

      <section class="home-section cip-quiz-section" id="quiz">
        <div class="container">
          <div class="section-head"><div><h2>Questionnaire final de compréhension</h2><p>Correction immédiate et score local, sans enregistrement.</p></div></div>
          <div class="cip-quiz" id="quizApp"></div>
        </div>
      </section>

      <section class="home-section home-section--soft cip-bottom-nav">
        <div class="container cip-session-nav">
          ${prev ? `<a class="btn btn-secondary" href="${prev}">Séance précédente</a>` : ""}
          <a class="btn btn-secondary" href="index.html">Retour au programme</a>
          ${next ? `<a class="btn btn-primary" href="${next}">Séance suivante</a>` : ""}
        </div>
      </section>`;

    initSlides(session);
    initQuiz(session.number);
  }

  function initSlides(session) {
    const stage = document.getElementById("slideStage");
    const nav = document.getElementById("slideNav");
    const progress = document.getElementById("slideProgress");
    const presentationButton = document.querySelector('[data-action="presentation"]');
    let current = 0;

    stage.innerHTML = session.slides.map((slide, index) => {
      const lines = slideBodyLines(slide, session.number);
      const images = slide.images || [];
      const dense = lines.length > 14 ? " is-dense" : "";
      const short = lines.length <= 4 ? " is-short" : "";
      return `
        <article class="cip-slide${index === 0 ? " is-active" : ""}" data-slide="${index}">
          <div class="cip-slide-fit">
          <div class="cip-slide-kicker">Séance ${session.number} · Slide ${slide.number}</div>
          <h2>${esc(slide.title)}</h2>
          ${images.length ? `<div class="cip-slide-media">${images.map((src, imageIndex) => `<img src="${esc(src)}" alt="Illustration de la slide ${slide.number}, image ${imageIndex + 1}">`).join("")}</div>` : ""}
          ${lines.length ? `<ul class="cip-slide-lines${dense}${short}">${lines.map((line) => `<li>${esc(line)}</li>`).join("")}</ul>` : `<p class="cip-empty-slide">Slide visuelle issue du support PowerPoint. À commenter oralement pendant la projection.</p>`}
          </div>
        </article>`;
    }).join("");

    nav.innerHTML = session.slides.map((slide, index) => `
      <button type="button" class="${index === 0 ? "is-active" : ""}" data-go="${index}">
        ${slide.number}. ${esc(slide.title)}
      </button>
    `).join("");

    function activeSlide() {
      return stage.querySelector(".cip-slide.is-active");
    }

    function applySlideFit() {
      const slide = activeSlide();
      if (!slide) return;
      const fit = slide.querySelector(".cip-slide-fit");
      if (!fit) return;

      slide.style.setProperty("--slide-scale", "1");
      if (!document.body.classList.contains("presentation-mode")) return;

      const styles = window.getComputedStyle(slide);
      const availableWidth = slide.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
      const availableHeight = slide.clientHeight - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom);
      const neededWidth = fit.scrollWidth;
      const neededHeight = fit.scrollHeight;
      const scale = Math.min(1, availableWidth / neededWidth, availableHeight / neededHeight);
      slide.style.setProperty("--slide-scale", String(Math.max(0.62, Math.floor(scale * 1000) / 1000)));
    }

    function setPresentationMode(enabled) {
      document.body.classList.toggle("presentation-mode", enabled);
      document.documentElement.classList.toggle("cip-presentation-root", enabled);
      if (presentationButton) {
        presentationButton.textContent = enabled ? "Quitter présentation" : "Mode présentation";
        presentationButton.setAttribute("aria-pressed", String(enabled));
      }
      window.setTimeout(applySlideFit, 0);
    }

    function show(index) {
      current = Math.max(0, Math.min(index, session.slides.length - 1));
      stage.querySelectorAll(".cip-slide").forEach((slide, itemIndex) => {
        slide.classList.toggle("is-active", itemIndex === current);
      });
      nav.querySelectorAll("button").forEach((button, itemIndex) => {
        button.classList.toggle("is-active", itemIndex === current);
      });
      progress.textContent = `Slide ${current + 1} / ${session.slides.length}`;
      location.hash = `slide-${current + 1}`;
      applySlideFit();
    }

    nav.addEventListener("click", (event) => {
      const button = event.target.closest("[data-go]");
      if (button) show(Number(button.dataset.go));
    });

    document.addEventListener("click", (event) => {
      const action = event.target.closest("[data-action]")?.dataset.action;
      if (!action) return;
      if (action === "prev") show(current - 1);
      if (action === "next") show(current + 1);
      if (action === "presentation") setPresentationMode(!document.body.classList.contains("presentation-mode"));
      if (action === "fullscreen") {
        setPresentationMode(true);
        toggleFullscreen();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (shouldIgnoreSlideKey(event)) return;
      if (["ArrowRight", "PageDown", " ", "Enter"].includes(event.key)) {
        event.preventDefault();
        show(current + 1);
      }
      if (["ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        show(current - 1);
      }
      if (event.key === "Home") {
        event.preventDefault();
        show(0);
      }
      if (event.key === "End") {
        event.preventDefault();
        show(session.slides.length - 1);
      }
      if (event.key === "Escape") setPresentationMode(false);
    });

    document.addEventListener("fullscreenchange", () => {
      setPresentationMode(Boolean(document.fullscreenElement));
    });

    window.addEventListener("resize", applySlideFit);

    const requested = Number((location.hash.match(/slide-(\d+)/) || [])[1]);
    if (requested) show(requested - 1);
    applySlideFit();
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.body.classList.add("presentation-mode");
      document.documentElement.requestFullscreen().catch(() => {
        document.body.classList.remove("presentation-mode");
        document.documentElement.classList.remove("cip-presentation-root");
      });
      return;
    }
    if (document.exitFullscreen) document.exitFullscreen();
  }

  function shouldIgnoreSlideKey(event) {
    const target = event.target;
    if (!target || target === document.body || target === document.documentElement) return false;
    if (target.closest?.(".cip-quiz")) return true;
    return Boolean(target.closest?.("input, textarea, select, [contenteditable='true']"));
  }

  function initQuiz(sessionNumber) {
    const target = document.getElementById("quizApp");
    const questions = quizBank[sessionNumber] || [];
    const answered = new Array(questions.length).fill(false);
    const correct = new Array(questions.length).fill(false);

    function score() {
      return correct.filter(Boolean).length;
    }

    function render() {
      target.innerHTML = `
        ${questions.map((item, index) => `
          <article class="cip-quiz-question" data-question="${index}">
            <h3>${index + 1}. ${esc(item.q)}</h3>
            <div class="cip-quiz-options">
              ${item.o.map((option, optionIndex) => `<button type="button" data-answer="${optionIndex}">${esc(option)}</button>`).join("")}
            </div>
            <div class="cip-feedback" aria-live="polite"></div>
          </article>
        `).join("")}
        <div class="cip-score" id="quizScore">Score : 0 / ${questions.length}</div>
        <button class="btn btn-secondary btn-small" type="button" data-quiz-reset>Recommencer</button>`;
    }

    render();
    target.addEventListener("click", (event) => {
      const reset = event.target.closest("[data-quiz-reset]");
      if (reset) {
        answered.fill(false);
        correct.fill(false);
        render();
        return;
      }
      const button = event.target.closest("[data-answer]");
      if (!button) return;
      const questionNode = button.closest("[data-question]");
      const questionIndex = Number(questionNode.dataset.question);
      if (answered[questionIndex]) return;
      const answerIndex = Number(button.dataset.answer);
      const item = questions[questionIndex];
      answered[questionIndex] = true;
      correct[questionIndex] = answerIndex === item.a;
      questionNode.querySelectorAll("[data-answer]").forEach((optionButton) => {
        const optionIndex = Number(optionButton.dataset.answer);
        optionButton.disabled = true;
        optionButton.classList.toggle("is-correct", optionIndex === item.a);
        optionButton.classList.toggle("is-wrong", optionIndex === answerIndex && answerIndex !== item.a);
      });
      questionNode.querySelector(".cip-feedback").textContent = `${correct[questionIndex] ? "Correct." : "À revoir."} ${item.f}`;
      document.getElementById("quizScore").textContent = `Score : ${score()} / ${questions.length}`;
    });
  }

  renderLocalChrome();
  renderIndex();
  renderSession();
})();
