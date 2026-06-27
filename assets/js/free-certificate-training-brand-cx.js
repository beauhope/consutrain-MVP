(function () {
  "use strict";

  const WEBHOOK_URL = "https://hooks.consutrain.com/webhook/consutrain-certificate-submission";
  const TRAINING_ID = "brand-customer-experience-basics";
  const TRAINING_TITLE = "أساسيات العلامة التجارية وتجربة العميل للمشاريع الصغيرة";
  const TOTAL_QUESTIONS = 20;
  const PASSING_SCORE = 14;
  const PENDING_SUBMISSIONS_KEY = "consutrain_pending_certificate_submissions";

  const questions = [
    { id: "q1", text: "ما أفضل وصف للعلامة التجارية؟", correct: "B", options: { A: "الشعار فقط", B: "الانطباع والوعد والتجربة التي يربطها العميل بالمشروع", C: "اسم الشركة القانوني", D: "الألوان المستخدمة في التصميم" } },
    { id: "q2", text: "لماذا لا يكفي الشعار وحده لبناء علامة قوية؟", correct: "A", options: { A: "لأن العميل يحكم أيضًا من التجربة والتواصل والسلوك", B: "لأن الشعار لا يظهر على الإنترنت", C: "لأن الألوان غير مهمة", D: "لأن كل المشاريع تحتاج شعارًا معقدًا" } },
    { id: "q3", text: "ما المقصود بوعد العلامة؟", correct: "B", options: { A: "تخفيض السعر دائمًا", B: "ما يتوقع العميل الحصول عليه باستمرار من الخدمة أو المنتج", C: "تغيير الاسم كل فترة", D: "استخدام إعلان واحد لكل العملاء" } },
    { id: "q4", text: "أي مثال يعكس تجربة عميل جيدة في خدمة رقمية؟", correct: "C", options: { A: "نموذج طويل بلا توضيح", B: "رد متأخر وغير واضح", C: "خطوات بسيطة ورسائل متابعة واضحة", D: "طلب بيانات لا علاقة لها بالخدمة" } },
    { id: "q5", text: "ما أول خطوة قبل صياغة رسالة تسويقية؟", correct: "B", options: { A: "اختيار الخطوط", B: "فهم العميل واحتياجاته", C: "نشر إعلان عشوائي", D: "تقليد المنافسين" } },
    { id: "q6", text: "ما المقصود بنقطة اتصال مع العميل؟", correct: "A", options: { A: "أي لحظة يتفاعل فيها العميل مع المشروع أو الخدمة", B: "موظف المبيعات فقط", C: "شعار الشركة فقط", D: "الفاتورة فقط" } },
    { id: "q7", text: "أي خيار يساعد مشروعًا صغيرًا على بناء الثقة؟", correct: "B", options: { A: "وعود كبيرة غير قابلة للتنفيذ", B: "ردود واضحة ومواعيد واقعية ومتابعة بعد الخدمة", C: "تغيير الرسائل يوميًا", D: "إخفاء الأسعار دائمًا" } },
    { id: "q8", text: "ما أفضل طريقة لتمييز خدمة صغيرة؟", correct: "B", options: { A: "استخدام كلمات عامة مثل الأفضل دائمًا", B: "تحديد قيمة واضحة ومفيدة للعميل", C: "تجاهل المنافسين والعملاء", D: "تقليل جودة التواصل" } },
    { id: "q9", text: "ماذا يعني الاتساق في العلامة؟", correct: "B", options: { A: "تكرار الشعار فقط", B: "أن تكون الرسائل والتصميم والسلوك متقاربة في كل القنوات", C: "استخدام لون واحد في كل شيء", D: "عدم تغيير أي خدمة أبدًا" } },
    { id: "q10", text: "أي مؤشر يفيد في قياس تجربة العميل؟", correct: "B", options: { A: "عدد الملفات الداخلية فقط", B: "سرعة الرد ورضا العميل وتكرار الشراء", C: "عدد الاجتماعات الداخلية", D: "عدد الشعارات المقترحة" } },
    { id: "q11", text: "ما الخطر في المبالغة بوعد العلامة؟", correct: "B", options: { A: "رفع الثقة دائمًا", B: "خلق توقعات لا تستطيع الخدمة تلبيتها", C: "تحسين تجربة العميل تلقائيًا", D: "تقليل الشكاوى دائمًا" } },
    { id: "q12", text: "في التواصل مع عميل غاضب، ما التصرف الأنسب؟", correct: "B", options: { A: "تجاهل الرسالة", B: "الاعتراف بالمشكلة وتوضيح الخطوة التالية", C: "إرسال إعلان جديد", D: "حذف التعليق فورًا دائمًا" } },
    { id: "q13", text: "ما فائدة رسم رحلة العميل؟", correct: "A", options: { A: "معرفة نقاط الاحتكاك وفرص التحسين", B: "استبدال الخدمة بتصميم جديد فقط", C: "إلغاء التواصل مع العميل", D: "زيادة عدد القنوات بلا هدف" } },
    { id: "q14", text: "أي مثال يعبر عن نبرة علامة مهنية؟", correct: "B", options: { A: "رسائل غامضة ومتناقضة", B: "لغة واضحة ومحترمة ومناسبة للعميل", C: "مبالغة مستمرة في الوعود", D: "ردود عشوائية حسب المزاج" } },
    { id: "q15", text: "ما العلاقة بين العلامة وتجربة العميل؟", correct: "B", options: { A: "لا توجد علاقة", B: "التجربة اليومية إما تقوّي وعد العلامة أو تضعفه", C: "العلامة تنتهي عند تصميم الشعار", D: "تجربة العميل تخص الشركات الكبيرة فقط" } },
    { id: "q16", text: "ما أفضل إجراء لتحسين تجربة طلب خدمة عبر الإنترنت؟", correct: "B", options: { A: "تقليل وضوح الخطوات", B: "توضيح الخطوات والمدة ورسالة التأكيد", C: "إزالة معلومات التواصل", D: "طلب إعادة إدخال البيانات عدة مرات" } },
    { id: "q17", text: "ما المقصود بتمييز العلامة؟", correct: "B", options: { A: "أن تكون مختلفة بصريًا فقط", B: "أن يعرف العميل لماذا يختارك بدل بدائل أخرى", C: "أن تستخدم كلمات أجنبية كثيرة", D: "أن تتجنب شرح الخدمة" } },
    { id: "q18", text: "أي عنصر يجب أن يظهر في عرض خدمة واضح؟", correct: "A", options: { A: "النتيجة المتوقعة والنطاق والسعر أو طريقة التسعير والخطوات التالية", B: "صور كثيرة بلا شرح", C: "وعود عامة فقط", D: "شروط مخفية" } },
    { id: "q19", text: "كيف يمكن لفريق صغير الحفاظ على الاتساق؟", correct: "B", options: { A: "ترك كل شخص يرد بطريقته", B: "استخدام قوالب ورسائل إرشادية وقائمة تحقق بسيطة", C: "تغيير القنوات كل أسبوع", D: "حذف كل الردود السابقة" } },
    { id: "q20", text: "ما أفضل نتيجة عملية لهذا التدريب؟", correct: "B", options: { A: "حفظ تعريفات نظرية فقط", B: "بناء وعد علامة واضح وخريطة تجربة عميل قابلة للتحسين", C: "تصميم شعار فقط", D: "إطلاق إعلان دون فهم العميل" } }
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

  function buildPayload(score, answers) {
    const percentage = Math.round((score / TOTAL_QUESTIONS) * 100);
    const email = getTextValue("email").toLowerCase();
    return {
      timestamp: new Date().toISOString(),
      submissionId: `${TRAINING_ID}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      certificateKey: `${TRAINING_ID}-${email}`,
      trainingId: "brand-customer-experience-basics",
      trainingTitle: TRAINING_TITLE,
      certificateType: "free_test",
      learningType: "free_training",
      trainingCategory: "branding_customer_experience",
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
      setStatus(`لم تحقق نسبة النجاح بعد. نتيجتك ${score} من ${TOTAL_QUESTIONS} (${percentage}%). يمكنك مراجعة الدروس وإعادة المحاولة.`, "error");
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
      setStatus(`تم اجتياز الاختبار، لكن تعذر إرسال الطلب الآن. تم حفظه محليًا لإعادة المحاولة لاحقًا. نتيجتك ${score} من ${TOTAL_QUESTIONS} (${percentage}%).`, "warning");
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
