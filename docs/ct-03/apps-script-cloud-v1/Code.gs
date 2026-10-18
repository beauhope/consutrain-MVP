const REQUESTS_SHEET_NAME = "requests";
const FEEDBACK_SHEET_NAME = "feedback";
const CERTIFICATE_SUBMISSIONS_SHEET_NAME = "certificate-submissions";

const CERTIFICATE_TRAININGS = {
  "digital-transformation-intro-fr": {
    language: "fr",
    title: "Introduction à la digitalisation et à la transformation numérique",
    certificateType: "free_test",
    learningType: "free_training",
    trainingCategory: "transformation_numerique"
  }
};
const NOTIFICATION_EMAIL = "consutrain@gmail.com";

// TECH-09: Only the consultation route is hardened here. Other routes are unchanged.
function doPost(e) {
  const lock = LockService.getScriptLock();
  let consultation = false;
  try {
    const raw = e && e.postData && e.postData.contents;
    if (typeof raw !== "string") {
      return jsonResponse({ ok: false, message: "Invalid request." });
    }
    // Do not impose consultation-specific limits on certificate or feedback intake.
    const data = JSON.parse(raw);
    if (!data || Array.isArray(data) || typeof data !== "object") {
      return jsonResponse({ ok: false, message: "Invalid request." });
    }
    consultation = data.form_type === undefined || data.form_type === "consultation";
    if (!consultation && data.form_type !== "feedback" &&
        data.form_type !== "certificate_submission") {
      return jsonResponse({ ok: false, message: "Unsupported request type." });
    }
    if (consultation && raw.length > 12000) {
      return jsonResponse({ ok: false, message: "Invalid request." });
    }
    lock.waitLock(10000);
    if (data.form_type === "feedback") return handleFeedback(data);
    if (data.form_type === "certificate_submission") return handleCertificateSubmission(data);
    return handleConsultation(data);
  } catch (error) {
    if (consultation) {
      return jsonResponse({ ok: false, message: "Request could not be processed." });
    }
    // Preserve existing behavior for the other workflows until separately reviewed.
    return jsonResponse({ ok: false, message: error.message });
  } finally {
    try { lock.releaseLock(); } catch (err) {}
  }
}

const CONSULTATION_FIELDS = {
  form_type: 32, language: 2, source_page: 80, full_name: 120,
  email: 160, phone: 40, country_city: 120, request_type: 120,
  organization: 160, subject: 180, description: 1500,
  timeline: 140, preferred_contact: 40, website: 0
};

function validateConsultation(data) {
  const keys = Object.keys(data);
  const allowed = Object.assign({ consent: true }, CONSULTATION_FIELDS);
  if (keys.some(key => !Object.prototype.hasOwnProperty.call(allowed, key))) {
    throw new Error("Unexpected consultation field.");
  }
  if (data.consent !== true) throw new Error("Consent is required.");
  if (data.form_type !== undefined && data.form_type !== "consultation") {
    throw new Error("Unexpected form type.");
  }
  if (data.website !== undefined && (typeof data.website !== "string" || data.website.trim())) {
    throw new Error("Spam rejected.");
  }
  const clean = {};
  Object.keys(CONSULTATION_FIELDS).forEach(function (key) {
    if (key === "website" || key === "form_type") return;
    const v = data[key];
    if (v !== undefined && typeof v !== "string") throw new Error("Invalid field type.");
    clean[key] = (v || "").trim();
    if (clean[key].length > CONSULTATION_FIELDS[key]) throw new Error("Field too long.");
    if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(clean[key])) {
      throw new Error("Invalid control character.");
    }
  });
  if (!["ar", "fr"].includes(clean.language)) throw new Error("Invalid language.");
  if (clean.source_page !== (clean.language === "ar"
      ? "services/consultation-form.html"
      : "fr/services/consultation-form.html")) throw new Error("Invalid source.");
  if (clean.full_name.length < 2 || !clean.subject || !clean.description ||
      !clean.request_type || !clean.preferred_contact) {
    throw new Error("Missing required fields.");
  }
  clean.email = clean.email.toLowerCase();
  if (!isValidEmail(clean.email) || clean.email.length > 160) {
    throw new Error("Invalid email.");
  }
  const digits = clean.phone.replace(/\D/g, "");
  if (!/^[+\d\s().-]+$/.test(clean.phone) || digits.length < 7 || digits.length > 15) {
    throw new Error("Invalid phone.");
  }
  const allowedContacts = clean.language === "ar"
    ? ["البريد الإلكتروني", "الهاتف", "واتساب"]
    : ["Email", "Téléphone", "WhatsApp"];
  if (!allowedContacts.includes(clean.preferred_contact)) {
    throw new Error("Invalid contact preference.");
  }
  return clean;
}

function consultationDedupeKey(data) {
  const value = [data.email, data.subject.toLowerCase(), data.description.toLowerCase()].join("|");
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value);
  const hex = bytes.map(b => ("0" + (b & 255).toString(16)).slice(-2)).join("");
  return "ct09:" + hex;
}

function handleConsultation(data) {
  // Validation occurs before touching the sheet or sending any notification.
  const clean = validateConsultation(data);
  const cache = CacheService.getScriptCache();
  const key = consultationDedupeKey(clean);
  // A separate short window limits rapid variants using the same contact email.
  // Store only keyed digests (no plain email, IP address, or debug payload).
  const emailDigest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256, clean.email
  ).map(b => ("0" + (b & 255).toString(16)).slice(-2)).join("");
  const rateKey = "ct09rate:" + emailDigest;
  if (cache.get(key) || cache.get(rateKey)) {
    return jsonResponse({ ok: false, message: "Please wait before resubmitting." });
  }
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(REQUESTS_SHEET_NAME);
  if (!sheet) throw new Error("Consultation sheet unavailable.");
  const row = [
    new Date(), clean.language, clean.source_page, clean.full_name,
    clean.email, clean.phone, clean.country_city, clean.request_type,
    clean.organization, clean.subject, clean.description, clean.timeline,
    clean.preferred_contact, "yes", "new", ""
  ].map(safeSheetValue);
  sheet.appendRow(row);
  // 90-second exact-duplicate suppression; hashed key, no extra personal-data logs.
  cache.put(key, "1", 300);
  cache.put(rateKey, "1", 60);
  const subject = "طلب استشارة جديد من موقع ConsuTrain - " + clean.full_name;
  const htmlBody = `
    <h2>طلب استشارة جديد من موقع ConsuTrain</h2>
    <p>تم استلام طلب استشارة جديد عبر نموذج الموقع.</p>
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
      <tr><td><strong>اللغة</strong></td><td>${escapeHtml(clean.language)}</td></tr>
      <tr><td><strong>الصفحة المصدر</strong></td><td>${escapeHtml(clean.source_page)}</td></tr>
      <tr><td><strong>الاسم</strong></td><td>${escapeHtml(clean.full_name)}</td></tr>
      <tr><td><strong>البريد الإلكتروني</strong></td><td>${escapeHtml(clean.email)}</td></tr>
      <tr><td><strong>الهاتف</strong></td><td>${escapeHtml(clean.phone)}</td></tr>
      <tr><td><strong>الدولة / المدينة</strong></td><td>${escapeHtml(clean.country_city)}</td></tr>
      <tr><td><strong>نوع الطلب</strong></td><td>${escapeHtml(clean.request_type)}</td></tr>
      <tr><td><strong>الجهة / المؤسسة</strong></td><td>${escapeHtml(clean.organization)}</td></tr>
      <tr><td><strong>الموضوع</strong></td><td>${escapeHtml(clean.subject)}</td></tr>
      <tr><td><strong>الوصف</strong></td><td>${escapeHtml(clean.description)}</td></tr>
      <tr><td><strong>الإطار الزمني</strong></td><td>${escapeHtml(clean.timeline)}</td></tr>
      <tr><td><strong>طريقة التواصل المفضلة</strong></td><td>${escapeHtml(clean.preferred_contact)}</td></tr>
      <tr><td><strong>الموافقة</strong></td><td>yes</td></tr>
    </table>`;
  try {
    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL, subject: subject, htmlBody: htmlBody,
      replyTo: clean.email
    });
  } catch (error) {
    // Sheet persistence succeeded; don't trick the visitor into re-submitting.
    console.warn("Consultation notification email failed.");
  }
  return jsonResponse({ ok: true, message: "Consultation request recorded." });
}

function handleFeedback(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(FEEDBACK_SHEET_NAME);

  if (!sheet) {
    throw new Error("Sheet not found: " + FEEDBACK_SHEET_NAME);
  }

  const row = [
    new Date(),
    data.language || "",
    data.source_page || "",
    data.full_name || "",
    data.email || "",
    data.feedback_type || "",
    data.subject || "",
    data.message || "",
    "new",
    ""
  ];

  sheet.appendRow(row);

  const subject =
    "مشاركة جديدة لتطوير ConsuTrain - " + (data.subject || data.feedback_type || "ملاحظة زائر");

  const htmlBody = `
    <h2>مشاركة جديدة من صفحة شاركنا رأيك</h2>
    <p>تم استلام مشاركة أو ملاحظة جديدة من أحد زوار الموقع.</p>
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
      <tr><td><strong>اللغة</strong></td><td>${escapeHtml(data.language)}</td></tr>
      <tr><td><strong>الصفحة المصدر</strong></td><td>${escapeHtml(data.source_page)}</td></tr>
      <tr><td><strong>الاسم</strong></td><td>${escapeHtml(data.full_name)}</td></tr>
      <tr><td><strong>البريد الإلكتروني</strong></td><td>${escapeHtml(data.email)}</td></tr>
      <tr><td><strong>نوع المشاركة</strong></td><td>${escapeHtml(data.feedback_type)}</td></tr>
      <tr><td><strong>الموضوع</strong></td><td>${escapeHtml(data.subject)}</td></tr>
      <tr><td><strong>الرسالة</strong></td><td>${escapeHtml(data.message)}</td></tr>
    </table>
  `;

  MailApp.sendEmail({
    to: NOTIFICATION_EMAIL,
    subject: subject,
    htmlBody: htmlBody,
    replyTo: data.email || ""
  });

  return jsonResponse({
    ok: true,
    message: "Feedback received successfully."
  });
}
function handleCertificateSubmission(data) {
  return ctCloudAcceptV1_(data);
}

function findExistingCertificateSubmission(sheet, certificateKey) {
  const values = sheet.getDataRange().getValues();

  if (values.length < 2) {
    return null;
  }

  const headers = values[0];
  const keyIndex = headers.indexOf("certificateKey");
  const resultIndex = headers.indexOf("result");
  const processingIndex = headers.indexOf("processingStatus");
  const certificateIdIndex = headers.indexOf("certificateId");

  if (keyIndex === -1) {
    throw new Error("Missing certificateKey column.");
  }

  // البحث من آخر صف إلى أول صف للحصول على أحدث محاولة لهذا البريد والتدريب.
  for (let i = values.length - 1; i >= 1; i--) {
    const row = values[i];

    if (String(row[keyIndex] || "").trim() === certificateKey) {
      return {
        result: resultIndex >= 0
          ? String(row[resultIndex] || "").trim().toLowerCase()
          : "",
        processingStatus: processingIndex >= 0
          ? String(row[processingIndex] || "").trim()
          : "",
        certificateId: certificateIdIndex >= 0
          ? String(row[certificateIdIndex] || "").trim()
          : ""
      };
    }
  }

  return null;
}

function appendRecordByHeaders(sheet, record) {
  const headers = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0];

  const row = headers.map(function (header) {
    const value = Object.prototype.hasOwnProperty.call(record, header)
      ? record[header]
      : "";

    return safeSheetValue(value);
  });

  sheet.appendRow(row);
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function safeSheetValue(value) {
  if (value instanceof Date) {
    return value;
  }

  const text = String(value == null ? "" : value);

  // يمنع تفسير أي إدخال خارجي كصيغة داخل Google Sheets.
  if (/^[=+\-@]/.test(text)) {
    return "'" + text;
  }

  return text;
}


function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}