(function () {
  "use strict";

  const CERTIFICATE_ENABLED = false; // Switch only after approved Sheet records and E2E verification.
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
  const TRAINING_TITLE = "مدخل إلى الصحة والسلامة المهنية والاستعداد لدراسة النيبوش";
  const TOTAL_QUESTIONS = 20;
  const PASSING_SCORE = 14;
  const PENDING_SUBMISSIONS_KEY = "consutrain_pending_certificate_submissions";
  const LANGUAGE = "ar";
  const PENDING_TTL_MS = 24 * 60 * 60 * 1000;
  let isRetryingPendingSubmissions = false;

  const questions = [
  {
    "id": "q1",
    "text": "ما وظيفة الدورة التمهيدية؟",
    "correct": "A",
    "options": {
      "A": "بناء أساس معرفي",
      "B": "منح مؤهل NEBOSH رسمي",
      "C": "الإعفاء من التقييمات"
    }
  },
  {
    "id": "q2",
    "text": "أين يتم التسجيل للمؤهل الرسمي؟",
    "correct": "B",
    "options": {
      "A": "عبر أي صفحة مجانية",
      "B": "عبر شريك تعلم معتمد",
      "C": "بتحميل الشهادة التمهيدية"
    }
  },
  {
    "id": "q3",
    "text": "ما الخطر؟",
    "correct": "B",
    "options": {
      "A": "احتمال وقوع الضرر",
      "B": "شيء يمكن أن يسبب ضررًا",
      "C": "مجموع التكاليف"
    }
  },
  {
    "id": "q4",
    "text": "أرضية مبللة: ما الإجراء الأكثر فاعلية؟",
    "correct": "C",
    "options": {
      "A": "الاكتفاء بالتحذير",
      "B": "تجاهلها",
      "C": "معالجة البلل وتأمين الممر"
    }
  },
  {
    "id": "q5",
    "text": "لماذا نهتم بالحادث الوشيك؟",
    "correct": "B",
    "options": {
      "A": "لا داعي للاهتمام",
      "B": "للتعلم ومنع وقوع ضرر مستقبلي",
      "C": "لزيادة التقارير فقط"
    }
  },
  {
    "id": "q6",
    "text": "ماذا تعني المخاطرة؟",
    "correct": "A",
    "options": {
      "A": "إمكان وقوع الضرر وعواقبه",
      "B": "نوع المعدات فقط",
      "C": "سعر التأمين"
    }
  },
  {
    "id": "q7",
    "text": "ما الدوافع الرئيسية لإدارة السلامة؟",
    "correct": "A",
    "options": {
      "A": "أخلاقية وقانونية واقتصادية",
      "B": "تسويقية فقط",
      "C": "مالية فقط"
    }
  },
  {
    "id": "q8",
    "text": "من يوفر نظام عمل آمنًا أساسًا؟",
    "correct": "B",
    "options": {
      "A": "العامل وحده",
      "B": "صاحب العمل",
      "C": "العميل وحده"
    }
  },
  {
    "id": "q9",
    "text": "ما مثال تكلفة غير مباشرة للحادث؟",
    "correct": "C",
    "options": {
      "A": "إصلاح جهاز",
      "B": "تكلفة الإسعاف",
      "C": "تدهور سمعة المؤسسة"
    }
  },
  {
    "id": "q10",
    "text": "قبل بدء مقاول العمل ينبغي:",
    "correct": "A",
    "options": {
      "A": "تنسيق المخاطر والضوابط",
      "B": "البدء فورًا",
      "C": "تجنب تبادل المعلومات"
    }
  },
  {
    "id": "q11",
    "text": "مكونات سياسة السلامة؟",
    "correct": "B",
    "options": {
      "A": "الأجور والتسويق",
      "B": "بيان النوايا والتنظيم والترتيبات",
      "C": "تقرير الحوادث فقط"
    }
  },
  {
    "id": "q12",
    "text": "أي ممارسة تعزز ثقافة السلامة؟",
    "correct": "C",
    "options": {
      "A": "معاقبة جميع البلاغات",
      "B": "إخفاء الحوادث",
      "C": "تشجيع الإبلاغ والتعلم"
    }
  },
  {
    "id": "q13",
    "text": "ما مثال المتابعة الاستباقية؟",
    "correct": "A",
    "options": {
      "A": "تفتيش المعدات قبل العمل",
      "B": "حصر الإصابات",
      "C": "أيام الغياب بعد الحادث"
    }
  },
  {
    "id": "q14",
    "text": "ماذا تعني Check في PDCA؟",
    "correct": "B",
    "options": {
      "A": "التخطيط",
      "B": "التحقق من النتائج",
      "C": "إهمال الإجراءات"
    }
  },
  {
    "id": "q15",
    "text": "ما أول خطوة في تقييم المخاطر؟",
    "correct": "B",
    "options": {
      "A": "شراء PPE",
      "B": "تحديد الأخطار",
      "C": "تحديد الأجور"
    }
  },
  {
    "id": "q16",
    "text": "في ممر مشترك للرافعات والمشاة ما الضابط الأفضل؟",
    "correct": "A",
    "options": {
      "A": "الفصل المادي بين المسارات",
      "B": "لافتة فقط",
      "C": "طلب الحذر فقط"
    }
  },
  {
    "id": "q17",
    "text": "أي ضابط في قمة التسلسل الهرمي؟",
    "correct": "C",
    "options": {
      "A": "معدات الوقاية",
      "B": "الضوابط الإدارية",
      "C": "إزالة الخطر"
    }
  },
  {
    "id": "q18",
    "text": "متى نراجع تقييم المخاطر؟",
    "correct": "A",
    "options": {
      "A": "عند تغيّر الظروف",
      "B": "لا نراجعه أبدًا",
      "C": "كل عشر سنوات فقط"
    }
  },
  {
    "id": "q19",
    "text": "في تحليل السيناريو نبدأ بـ:",
    "correct": "B",
    "options": {
      "A": "حفظ الإجابات",
      "B": "تحديد الوقائع وفهم المطلوب",
      "C": "تجاهل التفاصيل"
    }
  },
  {
    "id": "q20",
    "text": "ما أفضل استعداد للتقييم العملي؟",
    "correct": "A",
    "options": {
      "A": "التدرب على تقييم أخطار وضوابط جديدة",
      "B": "نسخ نموذج قديم",
      "C": "حفظ العناوين فقط"
    }
  }
];

  const form = document.getElementById("certificateTrainingForm");
  const questionsContainer = document.getElementById("certificateQuestions");
  const submitButton = document.getElementById("certificateSubmitBtn");
  const resetButton = document.getElementById("certificateResetBtn");
  const statusBox = document.getElementById("certificateStatus");
  const resultActions = document.getElementById("certificateResultActions");

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
      return `<article class="certificate-question"><h3>السؤال ${index + 1}: ${escapeHtml(question.text)}</h3><div class="certificate-options">${optionsHtml}</div></article>`;
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
    if (!retryButton) { retryButton = document.createElement("button"); retryButton.type = "button"; retryButton.className = "btn btn-secondary"; retryButton.dataset.pendingRetry = "true"; retryButton.textContent = "إعادة المحاولة الآن"; resultActions.appendChild(retryButton); }
    if (!discardButton) { discardButton = document.createElement("button"); discardButton.type = "button"; discardButton.className = "btn btn-secondary"; discardButton.dataset.pendingDiscard = "true"; discardButton.textContent = "حذف الطلب المعلّق"; resultActions.appendChild(discardButton); }
    return { retryButton: retryButton, discardButton: discardButton };
  }
  function refreshPendingUI() {
    const controls = ensurePendingControls(); const hasPending = getPendingQueue().some(isCurrentPendingEntry);
    controls.retryButton.hidden = !hasPending; controls.discardButton.hidden = !hasPending;
    if (hasPending) { setStatus("يوجد طلب شهادة سابق محفوظ مؤقتًا في هذا المتصفح لمدة تصل إلى 24 ساعة. لن يُعاد إرساله تلقائيًا؛ يمكنك إعادة المحاولة الآن أو حذفه.", "warning"); resultActions.hidden = false; }
  }
  async function retryPendingSubmissions() {
    if (isRetryingPendingSubmissions) return;
    const queue = getPendingQueue(); const matching = queue.filter(isCurrentPendingEntry); if (!matching.length) { refreshPendingUI(); return; }
    isRetryingPendingSubmissions = true; const controls = ensurePendingControls(); controls.retryButton.disabled = true; const failed = []; let lastResult = null;
    for (const entry of matching) { try { const result = await submitPayload(entry.payload); if (isTerminalBackendResult(result)) lastResult = result; else failed.push(entry); } catch (error) { failed.push(entry); } }
    const matchingSet = new Set(matching); savePendingQueue(queue.filter(function (entry) { return !matchingSet.has(entry); }).concat(failed));
    isRetryingPendingSubmissions = false; controls.retryButton.disabled = false;
    refreshPendingUI(); if (failed.length) setStatus("تعذرت إعادة إرسال بعض الطلبات أو تأكيد نتيجتها. ستبقى محفوظة مؤقتًا حتى انتهاء المدة أو حذفها.", "error"); else showBackendResult(lastResult, "تم إرسال الطلبات المعلقة بنجاح.");
  }
  function discardPendingSubmissions() { savePendingQueue(getPendingQueue().filter(function (entry) { return !isCurrentPendingEntry(entry); })); setStatus("تم حذف الطلب المعلّق من هذا المتصفح.", "info"); refreshPendingUI(); }
  const TERMINAL_BACKEND_STATUSES = new Set(["accepted", "issued", "duplicate", "validation_failed", "assessment_failed", "delivery_failed", "configuration_error", "success"]);
  function getBackendStatus(result) { return result && typeof result === "object" && typeof result.status === "string" ? result.status.trim().toLowerCase() : ""; }
  function isTerminalBackendResult(result) { return TERMINAL_BACKEND_STATUSES.has(getBackendStatus(result)); }
  function getSafeBackendMessage(result, fallback) { const message = result && typeof result.message === "string" ? result.message.trim() : ""; return !message || message.length > 300 || /[\r\n]|https?:\/\/|file:\/\/|[a-zA-Z]:\\|(?:^|\s)\/(?:home|tmp|var|usr|opt|root|Users)\/|\bn8n\b|\bat\s+\S+\s*\(/i.test(message) ? fallback : message; }
  function showBackendResult(result, successMessage) {
    const status = getBackendStatus(result);
    if (status === "accepted") { setStatus("تم استلام طلبك وحفظه. ستُرسل الشهادة إلى بريدك الإلكتروني بعد اكتمال المعالجة.", "success"); return true; }
    if (status === "issued") { setStatus("تم إصدار الشهادة وإرسالها إلى بريدك الإلكتروني.", "success"); return true; }
    if (status === "success") { // LEGACY C2 TRANSITION
      setStatus(successMessage, "success"); return true;
    }
    if (status === "duplicate") { setStatus(getSafeBackendMessage(result, "يوجد طلب سابق لهذا البريد في هذا التدريب."), "info"); return true; }
    if (status === "validation_failed") { setStatus(getSafeBackendMessage(result, "تعذر التحقق من الطلب. راجع بياناتك أو تواصل مع الدعم."), "error"); return true; }
    if (status === "assessment_failed") { setStatus(getSafeBackendMessage(result, "لم تحقق النتيجة المعتمدة درجة النجاح المطلوبة."), "error"); return true; }
    if (status === "delivery_failed") { setStatus(getSafeBackendMessage(result, "تمت معالجة الطلب، لكن تعذر تسليم الشهادة. يرجى التواصل مع الدعم."), "error"); return true; }
    if (status === "configuration_error") { setStatus(getSafeBackendMessage(result, "تعذر إكمال الطلب بسبب مشكلة مؤقتة في الخدمة. يرجى التواصل مع الدعم."), "error"); return true; }
    setStatus("تعذر تأكيد نتيجة الطلب من الخدمة. يرجى المحاولة لاحقًا أو التواصل مع الدعم.", "error"); return false;
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
      language: "ar",
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
    if (!CERTIFICATE_ENABLED) { setStatus("هذه نسخة مراجعة؛ إرسال طلبات الشهادات غير مفعل حتى اكتمال الاختبارات والاعتماد.", "warning"); return; }
    clearStatus();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const answers = getAnswers();
    const score = calculateScore(answers);
    const percentage = Math.round((score / TOTAL_QUESTIONS) * 100);

    if (score < PASSING_SCORE) {
      setStatus(`لم تحقق نسبة النجاح بعد. نتيجتك ${score} من ${TOTAL_QUESTIONS} (${percentage}%). يمكنك مراجعة الدروس وإعادة المحاولة.`, "error");
      resultActions.hidden = true;
      return;
    }

    const payload = buildPayload(score, answers);
    submitButton.disabled = true;
    submitButton.textContent = "جار إرسال طلب الشهادة...";

    try {
      const result = await submitPayload(payload);
      showBackendResult(result, `تم اجتياز الاختبار بنجاح. نتيجتك ${score} من ${TOTAL_QUESTIONS} (${percentage}%). تم إرسال طلب الشهادة.`);
      resultActions.hidden = false;
    } catch (error) {
      savePendingSubmission(payload);
      setStatus(`تم اجتياز الاختبار، لكن تعذر إرسال الطلب الآن. تم حفظه محليًا لإعادة المحاولة لاحقًا. نتيجتك ${score} من ${TOTAL_QUESTIONS} (${percentage}%).`, "warning");
      resultActions.hidden = false;
      refreshPendingUI();
      console.error("Certificate submission failed:", error);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "إرسال طلب الشهادة";
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
  if (!CERTIFICATE_ENABLED) { submitButton.disabled = true; submitButton.textContent = "إصدار الشهادة غير مفعل في نسخة المراجعة"; setStatus("يمكنك مراجعة الأسئلة لكن لا ترسل هذه الصفحة أي طلب شهادة حتى اعتماد الدورة.", "warning"); } else { refreshPendingUI(); }
}());

