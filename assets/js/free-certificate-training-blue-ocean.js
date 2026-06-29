(function () {
  "use strict";

  const WEBHOOK_URL = "https://hooks.consutrain.com/webhook/consutrain-certificate-submission";
  const TRAINING_ID = "blue-ocean-strategy-fundamentals-ar";
  const TRAINING_TITLE = "استراتيجية المحيط الأزرق: ابتكار القيمة وخلق أسواق جديدة";
  const CERTIFICATE_TYPE = "free_test";
  const LEARNING_TYPE = "free_training";
  const TRAINING_CATEGORY = "strategic_management_and_innovation";
  const LANGUAGE = "ar";
  const TOTAL_QUESTIONS = 20;
  const PASSING_SCORE = 14;
  const PENDING_SUBMISSIONS_KEY = "consutrain_pending_certificate_submissions";

  const questions = [
    { id: "q1", text: "ما المقصود بالمحيط الأحمر في سياق الاستراتيجية؟", correct: "A", options: { A: "سوق مزدحم تتنافس فيه المؤسسات على نفس العملاء وعوامل المقارنة", B: "سوق لا توجد فيه أي منافسة أو بدائل", C: "مرحلة خاصة بالإنتاج الداخلي فقط", D: "خطة تسعير منخفضة لا علاقة لها بالقيمة" } },
    { id: "q2", text: "ما الفكرة الأساسية في المحيط الأزرق؟", correct: "C", options: { A: "تقليد المنافس الأفضل في كل عنصر", B: "خفض السعر دائمًا دون تغيير العرض", C: "خلق مساحة قيمة جديدة تجعل المقارنة التقليدية أقل أهمية", D: "تجنب دراسة العميل والتركيز على المنتج فقط" } },
    { id: "q3", text: "لماذا قد تكون المنافسة المباشرة محدودة الأثر في الأسواق المزدحمة؟", correct: "B", options: { A: "لأن العملاء لا يقارنون بين البدائل إطلاقًا", B: "لأنها قد تقود إلى ضغط أسعار وتشابه خدمات وتكرار وعود", C: "لأنها تلغي الحاجة إلى الجودة", D: "لأنها تمنع المؤسسة من معرفة السوق" } },
    { id: "q4", text: "متى تكون المنافسة التقليدية ضرورية؟", correct: "D", options: { A: "عندما تريد المؤسسة تجاهل جودة الخدمة", B: "عندما لا توجد أي معايير أساسية في السوق", C: "عندما يكون الهدف إلغاء كل العروض الحالية", D: "عندما تحتاج المؤسسة إلى تحسين أساسيات الجودة والثقة والسعر المقبول" } },
    { id: "q5", text: "ما معنى ابتكار القيمة؟", correct: "B", options: { A: "إضافة أكبر عدد من الخصائص مهما كانت التكلفة", B: "رفع منفعة العميل مع إعادة ترتيب التكلفة والجهد بذكاء", C: "استخدام تقنية جديدة حتى لو لم تحل مشكلة", D: "تغيير الشعار والهوية البصرية فقط" } },
    { id: "q6", text: "أي مثال يعبر عن ابتكار قيمة؟", correct: "C", options: { A: "إطالة النموذج لأن المنافس يستخدم نموذجًا طويلًا", B: "إضافة تقرير طويل لا يقرأه العميل", C: "تبسيط رحلة الطلب وتوضيح المدة والنتيجة المتوقعة", D: "إخفاء السعر حتى يتواصل العميل أكثر" } },
    { id: "q7", text: "ما الفرق بين الابتكار التقني وحده وابتكار القيمة؟", correct: "A", options: { A: "ابتكار القيمة يركز على منفعة العميل وتكلفة التنفيذ، لا التقنية وحدها", B: "الابتكار التقني دائمًا يكفي حتى لو لم يفهمه العميل", C: "ابتكار القيمة يعني شراء برامج أكثر", D: "لا يوجد فرق عملي بينهما" } },
    { id: "q8", text: "ما الهدف من لوحة الاستراتيجية؟", correct: "D", options: { A: "كتابة قائمة بالمهام اليومية فقط", B: "إلغاء كل المنافسين من السوق", C: "تحديد أسماء العملاء الحاليين", D: "تصوير عوامل المنافسة ومنحنى القيمة لاكتشاف فرص الاختلاف" } },
    { id: "q9", text: "ما المقصود بعوامل المنافسة؟", correct: "B", options: { A: "أسماء الشركات الموجودة في السوق فقط", B: "العناصر التي يقارن العملاء من خلالها بين العروض مثل السعر والسرعة والدعم", C: "الأقسام الداخلية في المؤسسة", D: "النتائج المالية السنوية فقط" } },
    { id: "q10", text: "ما المقصود بمنحنى القيمة؟", correct: "C", options: { A: "رسم يوضح عدد الموظفين", B: "جدول لحساب الرواتب", C: "تمثيل يوضح مستوى تركيز العرض على عوامل المنافسة المختلفة", D: "قائمة بالإعلانات المنشورة" } },
    { id: "q11", text: "ما عناصر إطار الإجراءات الأربعة؟", correct: "A", options: { A: "الإلغاء، التخفيض، الرفع، الإنشاء", B: "التخطيط، التنظيم، التوجيه، الرقابة", C: "السعر، المكان، المنتج، الترويج", D: "الشراء، التخزين، البيع، التحصيل" } },
    { id: "q12", text: "أي خيار يمثل إجراء الإلغاء؟", correct: "B", options: { A: "زيادة عدد الخطوات غير الضرورية", B: "حذف محتوى أو إجراء لا يضيف قيمة واضحة للعميل", C: "رفع السعر دون تغيير القيمة", D: "إضافة خدمة لا يحتاجها العميل" } },
    { id: "q13", text: "أي خيار يمثل إجراء التخفيض؟", correct: "D", options: { A: "إنشاء سوق جديد بالكامل دون اختبار", B: "إلغاء كل عناصر الخدمة الأساسية", C: "رفع التعقيد في رحلة العميل", D: "تقليل مستوى عنصر مكلف لا يغير رضا العميل كثيرًا" } },
    { id: "q14", text: "أي خيار يمثل إجراء الرفع؟", correct: "C", options: { A: "تقليل وضوح حالة الطلب", B: "إلغاء المتابعة بعد الخدمة", C: "تحسين عنصر مهم مثل الدعم أو سرعة الرد أو وضوح النتيجة", D: "إخفاء معلومات القرار عن العميل" } },
    { id: "q15", text: "أي خيار يمثل إجراء الإنشاء؟", correct: "A", options: { A: "إضافة قيمة جديدة لم تكن معتادة في السوق مثل تشخيص أولي سريع", B: "نسخ خدمة المنافس كما هي", C: "تقليل جودة الخدمة الأساسية", D: "حذف كل نقاط التواصل" } },
    { id: "q16", text: "من هم غير العملاء؟", correct: "B", options: { A: "العملاء الأكثر ولاء فقط", B: "فئات لا تستخدم العرض الحالي أو تستخدمه مضطرة أو ترفض الفئة كلها", C: "الموظفون داخل المؤسسة فقط", D: "المنافسون المباشرون فقط" } },
    { id: "q17", text: "لماذا قد تكون الفرص الكبرى خارج قاعدة العملاء الحالية؟", correct: "D", options: { A: "لأن العملاء الحاليين لا يقدمون أي معلومات", B: "لأن غير العملاء يشترون دائمًا دون عوائق", C: "لأن السوق الحالي يجب تجاهله بالكامل", D: "لأن غير العملاء يكشفون حواجز واحتياجات غير ملباة" } },
    { id: "q18", text: "ما الذي يجعل فرصة المحيط الأزرق قابلة للتطبيق؟", correct: "C", options: { A: "أن تكون فكرة غريبة فقط", B: "أن تحتاج تكلفة عالية دائمًا", C: "وجود حاجة حقيقية وقدرة تنفيذ ونموذج تكلفة منطقي ورسالة قيمة واضحة", D: "أن لا يستطيع الفريق اختبارها" } },
    { id: "q19", text: "في حالة خدمة إدارية رقمية مع نموذج طويل، ما بداية جيدة لابتكار القيمة؟", correct: "B", options: { A: "إضافة حقول أكثر دون سبب", B: "تقليل الحقول غير الضرورية وإنشاء تشخيص أولي واضح", C: "إيقاف المتابعة مع العميل", D: "نسخ نموذج المنافس حرفيًا" } },
    { id: "q20", text: "ما أفضل نتيجة عملية لهذا التدريب؟", correct: "A", options: { A: "صياغة مقترح قيمة جديد باستخدام عوامل المنافسة والإجراءات الأربعة", B: "حفظ تعريفات نظرية فقط", C: "إلغاء دراسة العميل", D: "الاعتماد على الخصومات وحدها" } }
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
      setStatus(`لم تحقق نسبة النجاح بعد. نتيجتك ${score} من ${TOTAL_QUESTIONS} (${percentage}%). يمكنك مراجعة التدريب وإعادة المحاولة.`, "error");
      resultActions.hidden = true;
      return;
    }
    const payload = buildPayload(score, answers);
    submitButton.disabled = true;
    submitButton.textContent = "جار إرسال طلب الشهادة...";
    try {
      const result = await submitPayload(payload);
      if (result && result.status === "duplicate") {
        setStatus(result.message || "يوجد طلب شهادة سابق لهذا البريد في هذا التدريب.", "success");
      } else {
        setStatus(`تم اجتياز الاختبار بنجاح. نتيجتك ${score} من ${TOTAL_QUESTIONS} (${percentage}%). تم إرسال طلب الشهادة.`, "success");
      }
      resultActions.hidden = false;
    } catch (error) {
      savePendingSubmission(payload);
      setStatus(`تم اجتياز الاختبار، لكن تعذر إرسال الطلب الآن. تم حفظه محليًا للمحاولة لاحقًا. نتيجتك ${score} من ${TOTAL_QUESTIONS} (${percentage}%).`, "warning");
      resultActions.hidden = false;
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
  renderQuestions();
}());
