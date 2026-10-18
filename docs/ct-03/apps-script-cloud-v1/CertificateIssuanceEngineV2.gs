
/**
 * ConsuTrain — Certificate Issuance Engine V2
 * Controlled POC Execution
 *
 * Dependencies:
 * - ctV2LoadTrainingConfigurations()
 * - ctV2EvaluateSubmission()
 * - Advanced Drive API v3
 * - Script Property: CLOUDFLARE_CERTIFICATE_POC_KEY
 *
 * Never sends email.
 * Never processes historical rows.
 */

const CT_ISSUANCE_V2 = {
  folderId: "1ObSZ6Qe4RIiVKPpKHXEFlhynSzj2D_D2",
  endpoint:
    "https://consutrain-certificate-poc.beauhope2021.workers.dev/generate.pdf",

  // Must remain false until the controlled test is approved.
  allowPocWrites: false,

  // Only specially prepared synthetic submissions.
  testPrefix: "CT-POC-",
  testEmail: "test@example.com"
};

function ctV2EngineTable_(sheet, required) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0].map(x => String(x).trim());
  const columns = {};

  required.forEach(name => {
    if (headers.filter(h => h === name).length !== 1) {
      throw new Error("INVALID_HEADER_" + name);
    }
    columns[name] = headers.indexOf(name) + 1;
  });

  return { sheet, data, columns };
}

function ctV2EngineValue_(table, row, field) {
  return table.data[row - 1][table.columns[field] - 1];
}

function ctV2EngineText_(table, row, field) {
  return String(
    ctV2EngineValue_(table, row, field) || ""
  ).trim();
}

function ctV2EngineSet_(table, row, field, value) {
  table.sheet.getRange(
    row, table.columns[field]
  ).setValue(value);

  table.data[row - 1][
    table.columns[field] - 1
  ] = value;
}

function ctV2EngineHash_(input) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    input,
    Utilities.Charset.UTF_8
  );

  return bytes.map(x =>
    ("0" + (x & 255).toString(16))
      .slice(-2)
  ).join("").toUpperCase();
}

function ctV2EngineIdentifiers_(submissionId, key, lang) {
  const hash = ctV2EngineHash_(
    submissionId + "|" + key
  );

  const code =
    "CT-" + new Date().getFullYear().toString().slice(-2) +
    "-" + hash.slice(0, 4) +
    "-" + hash.slice(4, 8) +
    "-" + hash.slice(8, 12);

  return {
    certificateId:
      "CT-" + lang.toUpperCase() +
      "-" + hash.slice(0, 20),
    verificationCode: code
  };
}

function ctV2EngineTables_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (!ss) {
    throw new Error("BOUND_SPREADSHEET_NOT_FOUND");
  }

  const submissions = ss.getSheetByName(
    "certificate-submissions"
  );

  const verifications = ss.getSheetByName(
    "Certificate_Verifications"
  );

  if (!submissions || !verifications) {
    throw new Error("REQUIRED_SHEETS_MISSING");
  }

  const s = ctV2EngineTable_(submissions, [
    "submissionId", "trainingId", "name", "email",
    "answersJson", "legalAcknowledgment",
    "processingStatus", "certificateKey",
    "certificateId", "certificateIssuedAt",
    "certificateFileUrl", "verificationCode",
    "verificationUrl", "score", "totalQuestions",
    "percentage", "result", "language",
    "trainingTitle"
  ]);

  const v = ctV2EngineTable_(verifications, [
    "verificationCode", "certificateId",
    "verificationStatus", "holderName",
    "trainingId", "trainingTitle",
    "language", "issuedAt",
    "submissionId", "createdAt"
  ]);

  return { s, v };
}

function ctV2EngineFindSubmission_(table, id) {
  let match = 0;

  for (let row = 2; row <= table.data.length; row++) {
    if (
      ctV2EngineText_(
        table, row, "submissionId"
      ) === id
    ) {
      if (match) {
        throw new Error("DUPLICATE_SUBMISSION_ID");
      }
      match = row;
    }
  }

  if (!match) {
    throw new Error("TEST_SUBMISSION_NOT_FOUND");
  }

  return match;
}

function ctV2EngineCheckUniqueness_(
  tables, row, key, certificateId, verificationCode
) {
  const s = tables.s;
  const v = tables.v;
  const submissionId =
    ctV2EngineText_(s, row, "submissionId");

  for (let r = 2; r <= s.data.length; r++) {
    if (r === row) continue;

    if (ctV2EngineText_(s, r, "certificateKey") === key) {
      const failedWithoutCertificate = ctV2EngineText_(s, r, "result").toLowerCase() === "failed" &&
        !ctV2EngineText_(s, r, "certificateId") &&
        !["issued", "sent", "processing"].includes(ctV2EngineText_(s, r, "processingStatus").toLowerCase());
      if (!failedWithoutCertificate) throw new Error("DUPLICATE_ENTITLEMENT");
    }

    if (
      certificateId &&
      ctV2EngineText_(s, r, "certificateId") ===
        certificateId
    ) {
      throw new Error("DUPLICATE_CERTIFICATE_ID");
    }

    if (
      verificationCode &&
      ctV2EngineText_(s, r, "verificationCode") ===
        verificationCode
    ) {
      throw new Error("DUPLICATE_VERIFICATION_CODE");
    }
  }

  let matchingRegistrations = 0;

  for (let r = 2; r <= v.data.length; r++) {
    const owner = ctV2EngineText_(
      v, r, "submissionId"
    );

    const id = ctV2EngineText_(
      v, r, "certificateId"
    );

    const code = ctV2EngineText_(
      v, r, "verificationCode"
    );

    const touchesRequest =
      owner === submissionId ||
      id === certificateId ||
      code === verificationCode;

    if (!touchesRequest) continue;

    const identical =
      owner === submissionId &&
      id === certificateId &&
      code === verificationCode;

    if (!identical) {
      throw new Error("VERIFICATION_REGISTRY_CONFLICT");
    }

    matchingRegistrations++;
  }

  if (matchingRegistrations > 1) {
    throw new Error("DUPLICATE_REGISTRY_ENTRIES");
  }
}

function ctV2EngineFindPdf_(folderId, filename) {
  const escaped = filename.replace(/'/g, "\\'");

  const found = Drive.Files.list({
    q:
      "'" + folderId + "' in parents" +
      " and name = '" + escaped + "'" +
      " and trashed = false",
    fields: "nextPageToken,files(id,name,mimeType,size)",
    pageSize: 100
  });

  if (found.nextPageToken ||
      (found.files || []).length > 1) {
    throw new Error("DUPLICATE_OR_INCOMPLETE_PDF_SEARCH");
  }

  const file = (found.files || [])[0];

  if (!file) return null;

  if (file.mimeType !== "application/pdf" ||
      Number(file.size || 0) <= 0) {
    throw new Error("INVALID_EXISTING_PDF");
  }

  return file.id;
}

function ctV2EngineGeneratePdf_(data, filename) {
  const key = PropertiesService
    .getScriptProperties()
    .getProperty("CLOUDFLARE_CERTIFICATE_POC_KEY");

  if (!key) {
    throw new Error("CLOUDFLARE_KEY_MISSING");
  }

  const response = UrlFetchApp.fetch(
    CT_ISSUANCE_V2.endpoint,
    {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(data),
      headers: { "X-POC-Key": key },
      muteHttpExceptions: true,
      followRedirects: false
    }
  );

  if (response.getResponseCode() !== 200) {
    throw new Error(
      "CLOUDFLARE_HTTP_" + response.getResponseCode()
    );
  }

  const bytes = response.getContent();

  const type = String(
    response.getHeaders()["Content-Type"] ||
    response.getHeaders()["content-type"] ||
    ""
  ).toLowerCase();

  const magic = [37, 80, 68, 70, 45];

  if (
    !type.includes("application/pdf") ||
    bytes.length <= 5 ||
    !magic.every(
      (n, i) => (bytes[i] & 255) === n
    )
  ) {
    throw new Error("INVALID_PDF_RESPONSE");
  }

  return Utilities.newBlob(
    bytes, "application/pdf", filename
  );
}

function ctV2EngineRegister_(tables, row, record) {
  const v = tables.v;
  const s = tables.s;

  const submissionId =
    ctV2EngineText_(s, row, "submissionId");

  let registryRow = 0;

  for (let r = 2; r <= v.data.length; r++) {
    if (
      ctV2EngineText_(v, r, "submissionId") ===
      submissionId
    ) {
      if (registryRow) {
        throw new Error("DUPLICATE_REGISTRY_ENTRY");
      }
      registryRow = r;
    }
  }

  if (!registryRow) {
    const entry = Array(
      v.sheet.getLastColumn()
    ).fill("");

    function put(field, value) {
      entry[v.columns[field] - 1] = value;
    }

    put("verificationCode", record.verificationCode);
    put("certificateId", record.certificateId);
    put("verificationStatus", "Pending");
    put("holderName", record.fullName);
    put("trainingId", record.trainingId);
    put("trainingTitle", record.trainingTitle);
    put("language", record.language);
    put("issuedAt", record.issuedAt);
    put("submissionId", submissionId);
    put("createdAt", new Date());

    v.sheet.appendRow(entry);
    registryRow = v.sheet.getLastRow();
  }

  return registryRow;
}

/**
 * Safe preview for one synthetic submission.
 * Absolutely no writes or external PDF generation.
 */
function ctCertificateV2Preview(submissionId) {
  const tables = ctV2EngineTables_();
  const s = tables.s;

  const id = String(submissionId || "").trim();

  if (!id.startsWith(CT_ISSUANCE_V2.testPrefix)) {
    throw new Error("POC_SUBMISSION_ID_REQUIRED");
  }

  const row = ctV2EngineFindSubmission_(s, id);

  if (
    ctV2EngineText_(s, row, "email").toLowerCase() !==
    CT_ISSUANCE_V2.testEmail
  ) {
    throw new Error("POC_TEST_EMAIL_REQUIRED");
  }

  const trainingId =
    ctV2EngineText_(s, row, "trainingId");

  const training = ctV2LoadTrainingConfigurations()
    .get(trainingId);

  const assessment = ctV2EvaluateSubmission({
    submissionId: id,
    name: ctV2EngineText_(s, row, "name"),
    email: ctV2EngineText_(s, row, "email"),
    answersJson: ctV2EngineValue_(
      s, row, "answersJson"
    ),
    legalAcknowledgment: ctV2EngineText_(
      s, row, "legalAcknowledgment"
    ),
    processingStatus: ctV2EngineText_(
      s, row, "processingStatus"
    ),
    certificateId: ctV2EngineText_(
      s, row, "certificateId"
    )
  }, training);

  if (!assessment.accepted) {
    throw new Error(
      "ASSESSMENT_REJECTED: " +
      assessment.errors.join(",")
    );
  }

  if (!assessment.certificateEligible) {
    throw new Error("TRAINING_NOT_PASSED");
  }

  const key =
    ctV2EngineText_(s, row, "certificateKey");

  if (!key) {
    throw new Error("CERTIFICATE_KEY_MISSING");
  }

  const language =
    ctV2EngineText_(s, row, "language").toLowerCase();

  if (!["ar", "fr"].includes(language)) {
    throw new Error("INVALID_CERTIFICATE_LANGUAGE");
  }

  const ids = ctV2EngineIdentifiers_(
    id, key, language
  );

  ctV2EngineCheckUniqueness_(
    tables, row, key,
    ids.certificateId,
    ids.verificationCode
  );

  console.log("POC_SUBMISSION_FOUND");
  console.log("ASSESSMENT_ACCEPTED");
  console.log("CERTIFICATE_ELIGIBLE");
  console.log("UNIQUENESS_CHECK_OK");
  console.log("LANGUAGE: " + language);
  console.log("SCORE: " + assessment.score);
  console.log("CERTIFICATE_V2_PREVIEW_OK");

  return {
    id, row, key, ids,
    assessment, language
  };
}

/**
 * Controlled execution for one POC request only.
 *
 * Does not send email.
 * Does not process previous real submissions.
 */
function ctCertificateV2ExecutePoc(submissionId) {
  if (!CT_ISSUANCE_V2.allowPocWrites) {
    throw new Error("POC_WRITES_DISABLED");
  }

  const lock = LockService.getScriptLock();

  if (!lock.tryLock(30000)) {
    throw new Error("ISSUANCE_LOCK_UNAVAILABLE");
  }

  try {
    const tables = ctV2EngineTables_();
    const s = tables.s;

    const id = String(submissionId || "").trim();

    if (!id.startsWith(CT_ISSUANCE_V2.testPrefix)) {
      throw new Error("POC_ONLY");
    }

    const row = ctV2EngineFindSubmission_(s, id);

    if (
      ctV2EngineText_(s, row, "email").toLowerCase() !==
      CT_ISSUANCE_V2.testEmail
    ) {
      throw new Error("POC_EMAIL_ONLY");
    }

    const status = ctV2EngineText_(
      s, row, "processingStatus"
    ).toLowerCase();

    if (status === "issued" || status === "sent") {
      console.log("ALREADY_ISSUED");
      return;
    }

    if (!["pending", "processing"].includes(status)) {
      throw new Error("INVALID_PROCESSING_STATUS");
    }

    const trainingId =
      ctV2EngineText_(s, row, "trainingId");

    const training = ctV2LoadTrainingConfigurations()
      .get(trainingId);

    // Recheck eligibility, including recovery attempts.
    const assessment = ctV2EvaluateSubmission({
      submissionId: id,
      name: ctV2EngineText_(s, row, "name"),
      email: ctV2EngineText_(s, row, "email"),
      answersJson: ctV2EngineValue_(
        s, row, "answersJson"
      ),
      legalAcknowledgment: ctV2EngineText_(
        s, row, "legalAcknowledgment"
      ),
      processingStatus: "Pending",
      certificateId: ""
    }, training);

    if (
      !assessment.accepted ||
      !assessment.certificateEligible
    ) {
      throw new Error("CERTIFICATE_NOT_ELIGIBLE");
    }

    const certificateKey =
      ctV2EngineText_(s, row, "certificateKey");

    if (!certificateKey) {
      throw new Error("CERTIFICATE_KEY_MISSING");
    }

    const language =
      ctV2EngineText_(s, row, "language").toLowerCase();

    if (!["ar", "fr"].includes(language)) {
      throw new Error("INVALID_LANGUAGE");
    }

    const ids = ctV2EngineIdentifiers_(
      id, certificateKey, language
    );

    const priorCertificateId =
      ctV2EngineText_(s, row, "certificateId");

    const priorVerificationCode =
      ctV2EngineText_(s, row, "verificationCode");

    if (
      (priorCertificateId &&
       priorCertificateId !== ids.certificateId) ||
      (priorVerificationCode &&
       priorVerificationCode !== ids.verificationCode)
    ) {
      throw new Error("EXISTING_IDENTIFIERS_CONFLICT");
    }

    ctV2EngineCheckUniqueness_(
      tables, row, certificateKey,
      ids.certificateId,
      ids.verificationCode
    );

    let issuedAt = ctV2EngineValue_(
      s, row, "certificateIssuedAt"
    );

    if (issuedAt) {
      issuedAt = new Date(issuedAt);

      if (isNaN(issuedAt.getTime())) {
        throw new Error("INVALID_STORED_ISSUE_DATE");
      }
    } else {
      issuedAt = new Date();
      ctV2EngineSet_(
        s, row, "certificateIssuedAt", issuedAt
      );
    }

    ctV2EngineSet_(
      s, row, "certificateId", ids.certificateId
    );

    ctV2EngineSet_(
      s, row, "verificationCode", ids.verificationCode
    );

    const verificationUrl =
      "https://consutrain.com/certificate-verification.html?code=" +
      encodeURIComponent(ids.verificationCode);

    ctV2EngineSet_(
      s, row, "verificationUrl", verificationUrl
    );

    ctV2EngineSet_(
      s, row, "processingStatus", "Processing"
    );

    SpreadsheetApp.flush();

    const filename = ids.certificateId + ".pdf";

    let fileId = ctV2EngineFindPdf_(
      CT_ISSUANCE_V2.folderId,
      filename
    );

    if (!fileId) {
      const payload = {
        language,
        fullName: ctV2EngineText_(s, row, "name"),
        trainingTitle:
          ctV2EngineText_(s, row, "trainingTitle") ||
          trainingId,
        issueDate: Utilities.formatDate(
          issuedAt, "Africa/Casablanca", "dd/MM/yyyy"
        ),
        certificateId: ids.certificateId,
        verificationCode: ids.verificationCode,
        verificationUrl
      };

      const blob = ctV2EngineGeneratePdf_(
        payload, filename
      );

      const created = Drive.Files.create(
        {
          name: filename,
          mimeType: "application/pdf",
          parents: [CT_ISSUANCE_V2.folderId]
        },
        blob,
        { fields: "id" }
      );

      if (!created.id) {
        throw new Error("PDF_STORAGE_FAILED");
      }

      fileId = created.id;
    }

    const verified = Drive.Files.get(fileId, {
      fields: "id,name,mimeType,size,parents,trashed"
    });

    if (
      verified.trashed ||
      verified.name !== filename ||
      verified.mimeType !== "application/pdf" ||
      Number(verified.size || 0) <= 0 ||
      !(verified.parents || []).includes(
        CT_ISSUANCE_V2.folderId
      )
    ) {
      throw new Error("STORED_PDF_INVALID");
    }

    const fileUrl =
      "https://drive.google.com/file/d/" +
      encodeURIComponent(fileId) + "/view";

    // Record stays Pending until submission is complete.
    const registryRow = ctV2EngineRegister_(
      tables, row, {
        ...ids,
        fullName: ctV2EngineText_(s, row, "name"),
        trainingId,
        trainingTitle:
          ctV2EngineText_(s, row, "trainingTitle") ||
          trainingId,
        language,
        issuedAt
      }
    );

    ctV2EngineSet_(
      s, row, "score", assessment.score
    );

    ctV2EngineSet_(
      s, row, "totalQuestions",
      assessment.totalQuestions
    );

    ctV2EngineSet_(
      s, row, "percentage",
      assessment.percentage
    );

    ctV2EngineSet_(
      s, row, "result", "passed"
    );

    ctV2EngineSet_(
      s, row, "certificateFileUrl", fileUrl
    );

    ctV2EngineSet_(
      s, row, "processingStatus", "Issued"
    );

    SpreadsheetApp.flush();

    vSetStatus_(tables.v, registryRow, "Valid");

    console.log("PDF_GENERATED_OR_REUSED_OK");
    console.log("DRIVE_STORAGE_VERIFIED_OK");
    console.log("CERTIFICATE_REGISTERED_OK");
    console.log("ISSUANCE_RECORDED_OK");
    console.log("EMAIL_NOT_SENT");
    console.log("CERTIFICATE_V2_POC_ISSUED_OK");

  } finally {
    lock.releaseLock();
  }
}

function vSetStatus_(table, row, status) {
  table.sheet.getRange(
    row, table.columns.verificationStatus
  ).setValue(status);
}

function ctRunCertificateV2PocPreview() {
  ctCertificateV2Preview("CT-POC-ISSUANCE-001");
}

function ctRunCertificateV2PocIssue() {
  ctCertificateV2ExecutePoc("CT-POC-ISSUANCE-001");
}

