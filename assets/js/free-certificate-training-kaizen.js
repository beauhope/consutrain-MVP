(function () {
  "use strict";

  const WEBHOOK_URL = "https://hooks.consutrain.com/webhook/consutrain-certificate-submission";
  const TRAINING_ID = "kaizen-continuous-improvement";
  const TRAINING_TITLE = "كايزن: التحسين المستمر في بيئة العمل";
  const CERTIFICATE_TYPE = "free_test";
  const LEARNING_TYPE = "free_training";
  const TRAINING_CATEGORY = "الجودة والتحسين المستمر";
  const LANGUAGE = "ar";
  const TOTAL_QUESTIONS = 20;
  const PASSING_SCORE = 14;
  const PENDING_SUBMISSIONS_KEY = "consutrain_pending_certificate_submissions";
  const PENDING_TTL_MS = 24 * 60 * 60 * 1000;
  let isRetryingPendingSubmissions = false;

  const questions = [
    {
      id: "q1",
      text: "ما المعنى العملي الأقرب لكايزن في بيئة العمل؟",
      correct: "B",
      options: {
        A: "تنفيذ تغيير كبير مرة واحدة دون مراجعة",
        B: "تحسينات صغيرة ومنظمة ومستمرة يشارك فيها العاملون",
        C: "استبدال جميع الإجراءات القديمة فورًا",
        D: "زيادة عدد التقارير دون تغيير طريقة العمل"
      }
    },
    {
      id: "q2",
      text: "لماذا يعد التحسين المستمر مهمًا في الإدارات والخدمات؟",
      correct: "C",
      options: {
        A: "لأنه يلغي الحاجة إلى المتابعة",
        B: "لأنه يركز فقط على شراء أدوات جديدة",
        C: "لأنه يقلل الهدر والأخطاء والانتظار تدريجيًا",
        D: "لأنه يمنع الموظفين من اقتراح الأفكار"
      }
    },
    {
      id: "q3",
      text: "ما الفرق بين التحسين التدريجي والتحسين الكبير؟",
      correct: "A",
      options: {
        A: "التحسين التدريجي صغير ومتكرر، والتحسين الكبير أوسع وأقل تكرارًا",
        B: "التحسين التدريجي لا يحتاج إلى قياس",
        C: "التحسين الكبير يحدث يوميًا في كل عملية",
        D: "لا يوجد فرق بينهما"
      }
    },
    {
      id: "q4",
      text: "ماذا تعني Muda في إطار 3M؟",
      correct: "B",
      options: {
        A: "التذبذب في حجم الطلبات",
        B: "الهدر أو العمل الذي لا يضيف قيمة",
        C: "إجهاد الموظفين بسبب الحمل الزائد",
        D: "توثيق العمل المعياري"
      }
    },
    {
      id: "q5",
      text: "ماذا تعني Mura؟",
      correct: "C",
      options: {
        A: "الأخطاء المتكررة",
        B: "ترتيب الملفات",
        C: "عدم الانسجام أو التذبذب في تدفق العمل",
        D: "إيقاف العملية عند ظهور خلل"
      }
    },
    {
      id: "q6",
      text: "ماذا تعني Muri؟",
      correct: "A",
      options: {
        A: "الإجهاد أو التحميل الزائد على الأشخاص أو النظام",
        B: "العمل الذي لا يضيف قيمة",
        C: "توحيد طريقة العمل",
        D: "اختبار حل صغير"
      }
    },
    {
      id: "q7",
      text: "إعادة إدخال بيانات العميل في ثلاثة نماذج مختلفة تمثل غالبًا أي نوع من 3M؟",
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
      text: "تراكم الطلبات في نهاية الأسبوع بسبب توزيع غير منتظم للعمل يمثل غالبًا:",
      correct: "B",
      options: {
        A: "Muda",
        B: "Mura",
        C: "Poka-Yoke",
        D: "العمل المعياري"
      }
    },
    {
      id: "q9",
      text: "تحميل موظف واحد بكل الموافقات العاجلة طوال اليوم يمثل غالبًا:",
      correct: "C",
      options: {
        A: "الفرز",
        B: "Muda",
        C: "Muri",
        D: "Pareto"
      }
    },
    {
      id: "q10",
      text: "ما الهدف من خطوة الفرز في 5S؟",
      correct: "A",
      options: {
        A: "إزالة ما لا يلزم للعمل اليومي",
        B: "تغيير كل الإجراءات دفعة واحدة",
        C: "إضافة ملفات احتياطية بلا تصنيف",
        D: "زيادة الاجتماعات"
      }
    },
    {
      id: "q11",
      text: "ما معنى الترتيب في 5S داخل مكتب أو خدمة؟",
      correct: "B",
      options: {
        A: "حفظ كل شيء في مكان عشوائي",
        B: "وضع الملفات والأدوات بحيث يسهل العثور عليها واستخدامها",
        C: "حذف كل النماذج",
        D: "منع مشاركة المعلومات"
      }
    },
    {
      id: "q12",
      text: "ما المقصود بالتوحيد في 5S؟",
      correct: "D",
      options: {
        A: "ترك كل فريق يعمل بطريقة مختلفة",
        B: "تنظيف المكان مرة واحدة فقط",
        C: "إلغاء مسؤوليات المتابعة",
        D: "الاتفاق على طريقة واضحة ومتكررة للحفاظ على التنظيم"
      }
    },
    {
      id: "q13",
      text: "ما الترتيب الصحيح لدورة PDCA؟",
      correct: "A",
      options: {
        A: "خطط، نفذ، تحقق، صحح أو عمم",
        B: "نفذ، صحح، خطط، تجاهل القياس",
        C: "تحقق، نفذ، خطط، ألغ العملية",
        D: "خطط، اشتر الأداة، توقف"
      }
    },
    {
      id: "q14",
      text: "ما الهدف من تحليل السبب الجذري؟",
      correct: "C",
      options: {
        A: "تحديد شخص لإلقاء اللوم عليه",
        B: "زيادة عدد المؤشرات دون قرار",
        C: "فهم السبب الحقيقي وراء المشكلة لا الاكتفاء بالعرض الظاهر",
        D: "تجنب الحديث مع أصحاب العملية"
      }
    },
    {
      id: "q15",
      text: "كيف يساعد مخطط عظمة السمكة؟",
      correct: "B",
      options: {
        A: "يعطي حلًا جاهزًا دون نقاش",
        B: "ينظم الأسباب المحتملة للمشكلة في فئات واضحة",
        C: "يستبدل كل البيانات بالانطباع الشخصي",
        D: "يلغي الحاجة إلى التجربة"
      }
    },
    {
      id: "q16",
      text: "ما فائدة تحليل باريتو في التحسين العملي؟",
      correct: "A",
      options: {
        A: "التركيز على الأسباب القليلة ذات الأثر الأكبر",
        B: "معالجة كل الأسباب بنفس الجهد مهما كان أثرها",
        C: "اختيار الحل الأغلى دائمًا",
        D: "منع قياس النتائج"
      }
    },
    {
      id: "q17",
      text: "عند اختيار حل أولي في كايزن، ما الخيار الأنسب غالبًا؟",
      correct: "D",
      options: {
        A: "حل مكلف يحتاج أشهرًا دون تجربة",
        B: "حل لا يمكن قياس أثره",
        C: "حل يضيف خطوات جديدة بلا قيمة",
        D: "حل بسيط، منخفض التكلفة، سريع التجربة، وقابل للقياس"
      }
    },
    {
      id: "q18",
      text: "ما المقصود بـ Poka-Yoke؟",
      correct: "C",
      options: {
        A: "إخفاء الأخطاء بعد حدوثها",
        B: "زيادة الاعتماد على الذاكرة فقط",
        C: "تصميم يمنع الخطأ أو يكشفه قبل انتقاله",
        D: "تأجيل التحقق إلى نهاية الشهر"
      }
    },
    {
      id: "q19",
      text: "ما الفكرة العملية وراء Jidoka؟",
      correct: "B",
      options: {
        A: "تمرير الخلل للمرحلة التالية",
        B: "إيقاف أو تنبيه العملية عند ظهور خلل حتى لا يتكرر",
        C: "إلغاء دور الموظفين في التحسين",
        D: "قياس النتائج مرة واحدة فقط"
      }
    },
    {
      id: "q20",
      text: "في خدمة تتأخر بسبب ملفات متفرقة وموافقات غير واضحة، ما أفضل بداية كايزن؟",
      correct: "A",
      options: {
        A: "رسم العملية، تحديد الهدر، ثم تجربة تحسين صغير باستخدام 5S أو PDCA",
        B: "شراء نظام جديد دون فهم طريقة العمل الحالية",
        C: "إضافة موافقة جديدة لكل طلب",
        D: "الانتظار حتى تتراكم الشكاوى ثم البحث عن حل شامل"
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
          <h3>السؤال ${index + 1}: ${escapeHtml(question.text)}</h3>
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

  function calculateScore(answers) {
    return questions.reduce(function (score, question) {
      return answers[question.id] === question.correct ? score + 1 : score;
    }, 0);
  }

  function getTextValue(name) {
    const field = form.elements[name];
    return field && typeof field.value === "string" ? field.value.trim() : "";
  }

  function savePendingQueue(queue) {
    try {
      if (queue.length) window.localStorage.setItem(PENDING_SUBMISSIONS_KEY, JSON.stringify(queue));
      else window.localStorage.removeItem(PENDING_SUBMISSIONS_KEY);
    } catch (error) {
      console.error("Could not update pending certificate submissions:", error);
    }
  }
  function getPendingSubmissions() {
    let parsed;
    try {
      const storedValue = window.localStorage.getItem(PENDING_SUBMISSIONS_KEY);
      if (!storedValue) return [];
      parsed = JSON.parse(storedValue);
    } catch (error) { savePendingQueue([]); return []; }
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
    const queue = getPendingSubmissions();
    const stableId = payload.submissionId || payload.certificateKey;
    if (stableId && queue.some(function (entry) { return isCurrentPendingEntry(entry) && (entry.payload.submissionId || entry.payload.certificateKey) === stableId; })) return;
    queue.push({ queuedAt: Date.now(), payload: payload });
    savePendingQueue(queue);
  }
  function ensurePendingControls() {
    let retryButton = resultActions.querySelector("[data-pending-retry]"); let discardButton = resultActions.querySelector("[data-pending-discard]");
    if (!retryButton) { retryButton = document.createElement("button"); retryButton.type = "button"; retryButton.className = "btn btn-secondary"; retryButton.dataset.pendingRetry = "true"; retryButton.textContent = "إعادة المحاولة الآن"; resultActions.appendChild(retryButton); }
    if (!discardButton) { discardButton = document.createElement("button"); discardButton.type = "button"; discardButton.className = "btn btn-secondary"; discardButton.dataset.pendingDiscard = "true"; discardButton.textContent = "حذف الطلب المعلّق"; resultActions.appendChild(discardButton); }
    return { retryButton: retryButton, discardButton: discardButton };
  }
  function refreshPendingUI() {
    const controls = ensurePendingControls(); const hasPending = getPendingSubmissions().some(isCurrentPendingEntry);
    controls.retryButton.hidden = !hasPending; controls.discardButton.hidden = !hasPending;
    if (hasPending) { setStatus("يوجد طلب شهادة سابق محفوظ مؤقتًا في هذا المتصفح لمدة تصل إلى 24 ساعة. لن يُعاد إرساله تلقائيًا؛ يمكنك إعادة المحاولة الآن أو حذفه.", "warning"); resultActions.hidden = false; }
  }
  async function retryPendingSubmissions() {
    if (isRetryingPendingSubmissions) return;
    const queue = getPendingSubmissions(); const matching = queue.filter(isCurrentPendingEntry); if (!matching.length) { refreshPendingUI(); return; }
    isRetryingPendingSubmissions = true; const controls = ensurePendingControls(); controls.retryButton.disabled = true; const failed = [];
    for (const entry of matching) { try { await submitPayload(entry.payload); } catch (error) { failed.push(entry); } }
    const matchingSet = new Set(matching); savePendingQueue(queue.filter(function (entry) { return !matchingSet.has(entry); }).concat(failed));
    isRetryingPendingSubmissions = false; controls.retryButton.disabled = false;
    refreshPendingUI(); setStatus(failed.length ? "تعذرت إعادة إرسال بعض الطلبات. ستبقى محفوظة مؤقتًا حتى انتهاء المدة أو حذفها." : "تم إرسال الطلبات المعلقة بنجاح.", failed.length ? "error" : "success");
  }
  function discardPendingSubmissions() { savePendingQueue(getPendingSubmissions().filter(function (entry) { return !isCurrentPendingEntry(entry); })); setStatus("تم حذف الطلب المعلّق من هذا المتصفح.", "info"); refreshPendingUI(); }

  function buildPayload(score, answers) {
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
      setStatus(`لم تحقق نسبة النجاح بعد. نتيجتك ${score} من ${TOTAL_QUESTIONS} (${percentage}%). يمكنك إعادة المحاولة.`, "error");
      resultActions.hidden = true;
      return;
    }

    const payload = buildPayload(score, answers);
    submitButton.disabled = true;
    submitButton.textContent = "جار إرسال طلب الشهادة...";

    try {
      await submitPayload(payload);
      setStatus(`تم اجتياز الاختبار بنجاح. نتيجتك ${score} من ${TOTAL_QUESTIONS} (${percentage}%). تم إرسال طلب الشهادة.`, "success");
      resultActions.hidden = false;
    } catch (error) {
      savePendingSubmission(payload);
      setStatus(`تم اجتياز الاختبار بنجاح، لكن تعذر إرسال الطلب الآن. تم حفظه محليًا للمحاولة لاحقًا. نتيجتك ${score} من ${TOTAL_QUESTIONS} (${percentage}%).`, "warning");
      resultActions.hidden = false;
      refreshPendingUI();
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "إرسال طلب الشهادة";
    }
  });

  if (resetButton) {
    resetButton.addEventListener("click", function () {
      form.reset();
      clearStatus();
      resultActions.hidden = true;
    });
  }

  resultActions.addEventListener("click", function (event) {
    if (event.target.matches("[data-pending-retry]")) retryPendingSubmissions();
    if (event.target.matches("[data-pending-discard]")) discardPendingSubmissions();
  });

  renderQuestions();
  refreshPendingUI();
}());
