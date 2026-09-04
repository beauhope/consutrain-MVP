(function () {
  "use strict";

  const WEBHOOK_URL = "https://hooks.consutrain.com/webhook/consutrain-certificate-submission";
  const TRAINING_ID = "digital-transformation-intro";
  const TRAINING_TITLE = "مدخل إلى الرقمنة والتحول الرقمي";
  const TOTAL_QUESTIONS = 12;
  const PASSING_SCORE = 9;
  const PENDING_SUBMISSIONS_KEY = "consutrain_pending_certificate_submissions";
  const LANGUAGE = "ar";
  const PENDING_TTL_MS = 24 * 60 * 60 * 1000;

  const questions = [
    {
      id: "q1",
      text: "ما المعنى الأدق لرقمنة المؤسسة؟",
      correct: "B",
      options: {
        A: "تحويل كل الملفات الورقية إلى PDF فقط",
        B: "تنظيم العمل والبيانات والإجراءات باستخدام التقنية",
        C: "شراء أكبر عدد ممكن من البرامج",
        D: "استبدال جميع الموظفين بأنظمة إلكترونية"
      }
    },
    {
      id: "q2",
      text: "ما أول خطوة قبل رقمنة أي عملية داخل المؤسسة؟",
      correct: "B",
      options: {
        A: "اختيار برنامج جاهز",
        B: "فهم طريقة العمل الحالية",
        C: "إلغاء جميع الإجراءات",
        D: "إطلاق حملة تسويقية"
      }
    },
    {
      id: "q3",
      text: "لماذا يجب تبسيط الإجراء قبل رقمنته؟",
      correct: "A",
      options: {
        A: "حتى لا ننقل التعقيد إلى النظام الرقمي",
        B: "حتى يصبح الإجراء أطول وأكثر تفصيلًا",
        C: "حتى نمنع استخدام البيانات",
        D: "حتى يتم العمل بدون مسؤوليات واضحة"
      }
    },
    {
      id: "q4",
      text: "ما الفرق الجوهري بين الرقمنة والتحول الرقمي؟",
      correct: "C",
      options: {
        A: "لا يوجد أي فرق بينهما",
        B: "الرقمنة تلغي الحاجة إلى الإدارة",
        C: "الرقمنة تحول العمل إلى شكل رقمي، والتحول الرقمي يحسن طريقة العمل",
        D: "التحول الرقمي يعني حفظ الملفات فقط"
      }
    },
    {
      id: "q5",
      text: "متى تكون الرقمنة محدودة الأثر؟",
      correct: "A",
      options: {
        A: "عند نقل الإجراء إلى شاشة دون تحسين طريقة العمل",
        B: "عند ربط البيانات بلوحة متابعة",
        C: "عند تقليل الخطوات غير الضرورية",
        D: "عند قياس زمن الإنجاز"
      }
    },
    {
      id: "q6",
      text: "أي مما يلي يعد علامة على الحاجة إلى الانتقال من الرقمنة إلى التحول الرقمي؟",
      correct: "D",
      options: {
        A: "وجود نموذج إلكتروني واضح ومتابعة آلية",
        B: "انخفاض الأخطاء وتحسن التقارير",
        C: "وجود مؤشرات أداء واضحة",
        D: "وجود نماذج إلكترونية مع متابعة يدوية وتكرار إدخال البيانات"
      }
    },
    {
      id: "q7",
      text: "ما الهدف من تحديد مراحل رقمنة المؤسسة؟",
      correct: "B",
      options: {
        A: "تنفيذ كل شيء دفعة واحدة",
        B: "تحديد الأولويات والانتقال التدريجي بطريقة منظمة",
        C: "تجنب قياس النتائج",
        D: "الاعتماد على أداة واحدة لكل الأعمال"
      }
    },
    {
      id: "q8",
      text: "ما الاختيار الأفضل كبداية لمشروع رقمنة صغير؟",
      correct: "C",
      options: {
        A: "عملية نادرة ولا تسبب أثرًا واضحًا",
        B: "نظام ضخم يشمل كل الإدارات فورًا",
        C: "عملية متكررة تسبب تأخيرًا أو أخطاء ولها أثر واضح",
        D: "صفحة تعريفية لا تجمع بيانات"
      }
    },
    {
      id: "q9",
      text: "عند تحويل خدمة ورقية إلى خدمة ذكية، ما العنصر الأهم؟",
      correct: "A",
      options: {
        A: "تحسين التجربة والمتابعة وتقليل الخطوات غير الضرورية",
        B: "نسخ النموذج الورقي كما هو إلى شاشة",
        C: "طلب بيانات أكثر من المستخدم",
        D: "جعل المتابعة شفوية بعد الإرسال"
      }
    },
    {
      id: "q10",
      text: "لماذا تعد البيانات المنظمة أساسًا مهمًا للرقمنة؟",
      correct: "B",
      options: {
        A: "لأنها تمنع المؤسسة من اتخاذ القرار",
        B: "لأنها تسهل الحفظ والمتابعة والتحليل واستخراج التقارير",
        C: "لأنها تجعل البحث أصعب",
        D: "لأنها تغني عن وضوح المسؤوليات"
      }
    },
    {
      id: "q11",
      text: "أي مثال يمثل تحولًا رقميًا أكثر من كونه رقمنة شكلية؟",
      correct: "D",
      options: {
        A: "تحويل النموذج الورقي إلى PDF فقط",
        B: "حفظ الملفات في مجلدات دون تصنيف",
        C: "استقبال الطلب إلكترونيًا ثم متابعته شفويًا",
        D: "نموذج موحد، رقم تتبع، لوحة متابعة، وتنبيهات تلقائية"
      }
    },
    {
      id: "q12",
      text: "كيف ينبغي قياس نجاح الرقمنة داخل المؤسسة؟",
      correct: "C",
      options: {
        A: "بعدد البرامج التي تم شراؤها فقط",
        B: "بعدد الملفات التي تم رفعها فقط",
        C: "بتحسن الوقت والجودة والمتابعة ورضا المستفيد",
        D: "بعدد الاجتماعات التي عقدت حول المشروع"
      }
    }
  ];

  const form = document.getElementById("certificateTrainingForm");
  const questionsContainer = document.getElementById("certificateQuestions");
  const submitButton = document.getElementById("certificateSubmitBtn");
  const resetButton = document.getElementById("certificateResetBtn");
  const statusBox = document.getElementById("certificateStatus");
  const resultActions = document.getElementById("certificateResultActions");

  if (!form || !questionsContainer || !submitButton || !statusBox || !resultActions) {
    return;
  }

  let isRetryingPendingSubmissions = false;

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
        <div class="certificate-question">
          <h3>السؤال ${index + 1}: ${escapeHtml(question.text)}</h3>
          <div class="certificate-options">${optionsHtml}</div>
        </div>
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

  function getPendingSubmissions() {
    let parsedValue;
    try {
      const storedValue = window.localStorage.getItem(PENDING_SUBMISSIONS_KEY);
      if (!storedValue) return [];
      parsedValue = JSON.parse(storedValue);
    } catch (error) {
      console.error("Could not read pending certificate submissions:", error);
      savePendingSubmissions([]);
      return [];
    }
    if (!Array.isArray(parsedValue)) {
      savePendingSubmissions([]);
      return [];
    }
    const now = Date.now();
    const validSubmissions = parsedValue.reduce(function (submissions, entry) {
      if (!entry || typeof entry !== "object" || !entry.payload || typeof entry.payload !== "object") return submissions;
      const queuedAt = typeof entry.queuedAt === "number" ? entry.queuedAt : Date.parse(entry.queuedAt);
      if (!Number.isFinite(queuedAt) || queuedAt <= 0 || queuedAt > now || now - queuedAt > PENDING_TTL_MS) return submissions;
      if (typeof entry.payload.trainingId !== "string" || typeof entry.payload.language !== "string") return submissions;
      submissions.push({ queuedAt: queuedAt, payload: entry.payload });
      return submissions;
    }, []);
    if (JSON.stringify(validSubmissions) !== JSON.stringify(parsedValue)) savePendingSubmissions(validSubmissions);
    return validSubmissions;
  }

  function savePendingSubmissions(submissions) {
    try {
      if (!submissions.length) {
        window.localStorage.removeItem(PENDING_SUBMISSIONS_KEY);
        return;
      }

      window.localStorage.setItem(PENDING_SUBMISSIONS_KEY, JSON.stringify(submissions));
    } catch (error) {
      console.error("Could not save pending certificate submissions:", error);
    }
  }

  function queuePendingSubmission(payload) {
    const pendingSubmissions = getPendingSubmissions();
    const stableId = payload.submissionId || payload.certificateKey;
    if (stableId && pendingSubmissions.some(function (entry) {
      const candidate = entry.payload.submissionId || entry.payload.certificateKey;
      return isCurrentPendingSubmission(entry) && candidate === stableId;
    })) return;
    pendingSubmissions.push({
      queuedAt: Date.now(),
      payload: payload
    });
    savePendingSubmissions(pendingSubmissions);
  }

  function isCurrentPendingSubmission(submission) {
    return submission.payload.trainingId === TRAINING_ID && submission.payload.language === LANGUAGE;
  }

  function ensureRetryButton() {
    let retryButton = resultActions.querySelector("[data-certificate-retry-save]");

    if (retryButton) {
      return retryButton;
    }

    retryButton = document.createElement("button");
    retryButton.className = "btn btn-secondary";
    retryButton.type = "button";
    retryButton.dataset.certificateRetrySave = "true";
    retryButton.textContent = "إعادة المحاولة الآن";
    resultActions.appendChild(retryButton);

    return retryButton;
  }

  function ensureDiscardButton() {
    let discardButton = resultActions.querySelector("[data-certificate-discard-save]");
    if (discardButton) return discardButton;
    discardButton = document.createElement("button");
    discardButton.className = "btn btn-secondary";
    discardButton.type = "button";
    discardButton.dataset.certificateDiscardSave = "true";
    discardButton.textContent = "حذف الطلب المعلّق";
    resultActions.appendChild(discardButton);
    return discardButton;
  }

  function showPendingSubmissionsNotice() {
    const hasPending = getPendingSubmissions().some(isCurrentPendingSubmission);
    const retryButton = ensureRetryButton();
    const discardButton = ensureDiscardButton();
    retryButton.hidden = !hasPending;
    discardButton.hidden = !hasPending;
    if (hasPending) {
      setStatus("يوجد طلب شهادة سابق محفوظ مؤقتًا في هذا المتصفح لمدة تصل إلى 24 ساعة. لن يُعاد إرساله تلقائيًا؛ يمكنك إعادة المحاولة الآن أو حذفه.", "info");
      resultActions.hidden = false;
    }
  }

  function getRequiredTextValue(name) {
    const field = form.elements[name];
    return field ? field.value.trim() : "";
  }

  function getAnswers() {
    return questions.reduce(function (answers, question) {
      const checked = form.querySelector(`input[name="${question.id}"]:checked`);
      answers[question.id] = checked ? checked.value : "";
      return answers;
    }, {});
  }

  function getMissingQuestionNumber(answers) {
    const missingIndex = questions.findIndex(function (question) {
      return !answers[question.id];
    });

    return missingIndex === -1 ? 0 : missingIndex + 1;
  }

  function calculateScore(answers) {
    return questions.reduce(function (score, question) {
      return score + (answers[question.id] === question.correct ? 1 : 0);
    }, 0);
  }

  function validateForm(answers) {
    if (!getRequiredTextValue("fullName") || !getRequiredTextValue("email") || !getRequiredTextValue("country")) {
      form.reportValidity();
      setStatus("يرجى إكمال الحقول المطلوبة قبل إرسال الاختبار.", "error");
      return false;
    }

    if (!form.elements.email.checkValidity()) {
      form.reportValidity();
      setStatus("يرجى إدخال بريد إلكتروني صحيح.", "error");
      return false;
    }

    if (!form.elements.legalAcknowledgment.checked) {
      form.reportValidity();
      setStatus("يجب تفعيل الإقرار الإجباري قبل إرسال الاختبار.", "error");
      return false;
    }

    const missingQuestionNumber = getMissingQuestionNumber(answers);

    if (missingQuestionNumber) {
      const missingQuestion = form.querySelector(`input[name="q${missingQuestionNumber}"]`);
      if (missingQuestion) {
        missingQuestion.focus();
      }
      setStatus(`يرجى الإجابة عن السؤال ${missingQuestionNumber} قبل إرسال الاختبار.`, "error");
      return false;
    }

    return true;
  }
    function createSubmissionId() {
  return `${TRAINING_ID}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
  function createCertificateKey() {
  const email = getRequiredTextValue("email").toLowerCase().trim();
  return `${TRAINING_ID}-${email}`;
}
  function buildPayload(score, percentage, passed, answers) {
    return {
      timestamp: new Date().toISOString(),
      submissionId: createSubmissionId(),
      certificateKey: createCertificateKey(),
      trainingId: "digital-transformation-intro",
      trainingTitle: TRAINING_TITLE,
      certificateType: "free_test",
      learningType: "free_training",
      trainingCategory: "digital_transformation",
      language: "ar",
      name: getRequiredTextValue("fullName"),
      fullName: getRequiredTextValue("fullName"),
      email: getRequiredTextValue("email"),
      country: getRequiredTextValue("country"),
      organization: getRequiredTextValue("organization"),
      jobTitle: getRequiredTextValue("jobTitle"),
      score: score,
      totalQuestions: TOTAL_QUESTIONS,
      percentage: percentage,
      result: passed ? "passed" : "failed",
      passed: passed,
      answersJson: JSON.stringify(answers),
      legalAcknowledgment: form.elements.legalAcknowledgment.checked,
      marketingConsent: form.elements.marketingConsent.checked,
      certificateStatus: "Pending",
      notes: ""
    };
  }

  async function sendToWebhook(payload) {
  const payloadToSend = {
    ...payload,
    submissionId: payload.submissionId || createSubmissionId()
  };

  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payloadToSend)
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

  const TERMINAL_BACKEND_STATUSES = new Set([
    "issued",
    "duplicate",
    "validation_failed",
    "assessment_failed",
    "delivery_failed",
    "configuration_error",
    "success" // LEGACY C2 TRANSITION: remove after the C2 backend migration is complete.
  ]);

  function getBackendStatus(result) {
    if (!result || typeof result !== "object" || typeof result.status !== "string") return "";
    return result.status.trim().toLowerCase();
  }

  function isTerminalBackendResult(result) {
    return TERMINAL_BACKEND_STATUSES.has(getBackendStatus(result));
  }

  function getSafeBackendMessage(result, fallback) {
    const message = result && typeof result.message === "string" ? result.message.trim() : "";
    if (!message || message.length > 300 || /[\r\n]|https?:\/\/|file:\/\/|[a-zA-Z]:\\|(?:^|\s)\/(?:home|tmp|var|usr|opt|root|Users)\/|\bn8n\b|\bat\s+\S+\s*\(/i.test(message)) return fallback;
    return message;
  }

  function showBackendResult(result, score, passed) {
    const status = getBackendStatus(result);
    if (status === "issued") {
      setStatus("تم إصدار الشهادة وإرسالها إلى بريدك الإلكتروني.", "success");
      return true;
    }
    if (status === "success") {
      // LEGACY C2 TRANSITION: keep the current success behavior until C2 is published.
      showResult(score, passed);
      return true;
    }
    if (status === "duplicate") {
      setStatus(getSafeBackendMessage(result, "يوجد طلب سابق لهذا البريد في هذا التدريب. يرجى مراجعة بريدك أو التواصل مع الدعم عند الحاجة."), "info");
      return true;
    }
    if (status === "validation_failed") {
      setStatus(getSafeBackendMessage(result, "تعذر التحقق من الطلب. راجع بياناتك أو تواصل مع الدعم."), "error");
      return true;
    }
    if (status === "assessment_failed") {
      setStatus(getSafeBackendMessage(result, "لم تحقق النتيجة المعتمدة درجة النجاح المطلوبة."), "fail");
      return true;
    }
    if (status === "delivery_failed") {
      setStatus(getSafeBackendMessage(result, "تمت معالجة الطلب، لكن تعذر تسليم الشهادة. يرجى التواصل مع الدعم."), "error");
      return true;
    }
    if (status === "configuration_error") {
      setStatus(getSafeBackendMessage(result, "تعذر إكمال الطلب بسبب مشكلة مؤقتة في الخدمة. يرجى التواصل مع الدعم."), "error");
      return true;
    }
    setStatus("تعذر تأكيد نتيجة الطلب من الخدمة. يرجى المحاولة لاحقًا أو التواصل مع الدعم.", "error");
    return false;
  }

  async function retryPendingSubmissions() {
    if (isRetryingPendingSubmissions) {
      return;
    }

    const retryButton = ensureRetryButton();
    const allPendingSubmissions = getPendingSubmissions();
    const pendingSubmissions = allPendingSubmissions.filter(isCurrentPendingSubmission);

    if (!pendingSubmissions.length) {
      setStatus("لا توجد طلبات معلقة لهذه الدورة واللغة.", "info");
      showPendingSubmissionsNotice();
      return;
    }

    isRetryingPendingSubmissions = true;
    retryButton.disabled = true;
    retryButton.textContent = "جاري إعادة المحاولة...";

    const failedSubmissions = [];
    let lastTerminalResult = null;
    let lastTerminalSubmission = null;

    for (const submission of pendingSubmissions) {
      try {
        const result = await sendToWebhook(submission.payload);
        if (isTerminalBackendResult(result)) {
          lastTerminalResult = result;
          lastTerminalSubmission = submission;
        } else {
          failedSubmissions.push(submission);
        }
      } catch (error) {
        failedSubmissions.push(submission);
        console.error("Pending certificate submission retry failed:", error);
      }
    }

    const matchingSet = new Set(pendingSubmissions);
    savePendingSubmissions(allPendingSubmissions.filter(function (submission) {
      return !matchingSet.has(submission);
    }).concat(failedSubmissions));

    showPendingSubmissionsNotice();
    if (failedSubmissions.length) {
      setStatus("تعذر إرسال بعض الطلبات المعلقة. ستبقى محفوظة مؤقتًا حتى انتهاء المدة أو حذفها.", "error");
      resultActions.hidden = false;
    } else {
      showBackendResult(lastTerminalResult, lastTerminalSubmission.payload.score, lastTerminalSubmission.payload.passed);
      resultActions.hidden = false;
    }

    retryButton.disabled = false;
    retryButton.textContent = "إعادة المحاولة الآن";
    isRetryingPendingSubmissions = false;
  }

  function discardPendingSubmissions() {
    savePendingSubmissions(getPendingSubmissions().filter(function (submission) {
      return !isCurrentPendingSubmission(submission);
    }));
    setStatus("تم حذف الطلب المعلّق من هذا المتصفح.", "info");
    showPendingSubmissionsNotice();
  }

  function showResult(score, passed) {
    const resultMessage = passed
      ? "تهانينا، لقد اجتزت الاختبار. سيتم استخدام البيانات التي أدخلتها لإعداد شهادة الإتمام الرقمية من ConsuTrain بعد مراجعة البيانات، ثم إرسالها إلى بريدك الإلكتروني."
      : "لم تحقق درجة النجاح المطلوبة هذه المرة. درجة النجاح هي 9 من 12. ننصحك بمراجعة الدروس ثم إعادة الاختبار عندما تكون مستعدًا.";

    setStatus(`${resultMessage} درجتك: ${score} من ${TOTAL_QUESTIONS}.`, passed ? "success" : "fail");
    resultActions.hidden = false;
  }

  function resetForm() {
    form.reset();
    clearStatus();
    resultActions.hidden = true;
    submitButton.disabled = false;
    submitButton.textContent = "إرسال طلب الشهادة";
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const answers = getAnswers();

    if (!validateForm(answers)) {
      resultActions.hidden = true;
      return;
    }

    const score = calculateScore(answers);
    const percentage = Number(((score / TOTAL_QUESTIONS) * 100).toFixed(2));
    const passed = score >= PASSING_SCORE;

    if (!passed) {
      showResult(score, passed);
      return;
    }

    const payload = buildPayload(score, percentage, passed, answers);

    ensureRetryButton();
    submitButton.disabled = true;
    submitButton.textContent = "جاري إرسال طلب الشهادة...";

    try {
  const webhookResult = await sendToWebhook(payload);

  showBackendResult(webhookResult, score, passed);

  resultActions.hidden = false;
} catch (error) {
  queuePendingSubmission(payload);
  setStatus("تم احتساب نتيجتك، لكن تعذر إرسال طلب الشهادة الآن. تم حفظ الطلب مؤقتًا على هذا الجهاز، ويمكنك إعادة المحاولة عند توفر الاتصال.", "error");
  resultActions.hidden = false;
  showPendingSubmissionsNotice();
  console.error("Certificate submission failed:", error);
} finally {
  submitButton.disabled = false;
  submitButton.textContent = "إرسال طلب الشهادة";
}
  });

  resetButton.addEventListener("click", resetForm);
  resultActions.addEventListener("click", function (event) {
    if (event.target.matches("[data-certificate-reset]")) {
      resetForm();
    }

    if (event.target.matches("[data-certificate-retry-save]")) {
      retryPendingSubmissions();
    }
    if (event.target.matches("[data-certificate-discard-save]")) {
      discardPendingSubmissions();
    }
  });

  renderQuestions();
  ensureRetryButton();
  ensureDiscardButton();
  showPendingSubmissionsNotice();
})();
