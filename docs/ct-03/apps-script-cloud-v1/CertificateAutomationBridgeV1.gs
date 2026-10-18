/**
 * ConsuTrain — Certificate Automation Bridge V1
 * For NEW rows only; no change to existing POC engine.
 * Starts DISABLED. Uses end-of-sheet baseline so old records are skipped.
 * Dependencies: CertificateIssuanceEngineV2.gs and CertificateDeliveryIntegrationV1.gs
 * IMPORTANT: Existing issue-generation code is reused below with separate gates.
 * Intentional: does not auto-run delivery; sender remains independently disabled.
 */
const CT_AUTO_V1 = Object.freeze({
  startProperty: 'CT_AUTO_START_ROW',
  enabledProperty: 'CT_AUTO_ISSUANCE_ENABLED',
  deliveryEnabledProperty: 'CT_CERT_DELIVERY_ENABLED',
  maxRowsPerRun: 15
});

// Establish a historical baseline. Run once BEFORE creating any fresh learner submission.
function ctAutoInitializeBaselineV1() {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty(CT_AUTO_V1.startProperty)) {
    throw new Error('BASELINE_ALREADY_ESTABLISHED; NO_RESET');
  }
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss && ss.getSheetByName('certificate-submissions');
  if (!sh) throw new Error('SUBMISSIONS_SHEET_MISSING');
  const lastRow = sh.getLastRow();
  props.setProperties({
    [CT_AUTO_V1.startProperty]: String(lastRow),
    [CT_AUTO_V1.enabledProperty]: 'false'
  }, false);
  console.log('BASELINE_READY lastHistoricalRow=' + lastRow + ' AUTO_ISSUANCE_DISABLED');
}

// Conservative manual preflight. No writes, emails, PDF generation.
function ctAutoPreflightV1() {
  const props = PropertiesService.getScriptProperties();
  const baseline = Number(props.getProperty(CT_AUTO_V1.startProperty));
  if (!Number.isInteger(baseline) || baseline < 1) throw new Error('BASELINE_NOT_SET');
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('certificate-submissions');
  if (!sh) throw new Error('SUBMISSIONS_SHEET_MISSING');
  if (typeof ctV2LoadTrainingConfigurations !== 'function' ||
      typeof ctV2EvaluateSubmission !== 'function' ||
      typeof ctDeliveryQueueIssuedV1 !== 'function') {
    throw new Error('REQUIRED_DEPENDENCIES_NOT_FOUND');
  }
  const q = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Certificate_Delivery_Queue');
  if (!q) throw new Error('DELIVERY_QUEUE_MISSING');
  console.log(JSON.stringify({baseline, currentLastRow: sh.getLastRow(),
    newRows: Math.max(0, sh.getLastRow() - baseline),
    issuanceEnabled: props.getProperty(CT_AUTO_V1.enabledProperty) === 'true',
    deliveryEnabled: props.getProperty(CT_AUTO_V1.deliveryEnabledProperty) === 'true',
    readyForApproval: true}));
}

/**
 * After a separate production approval: processes appended rows only.
 * Called by a time trigger (or manually). No historical scan.
 * Requires CT_AUTO_ISSUANCE_ENABLED=true; email gate remains independent.
 */
function ctAutoRunNewSubmissionsV1() {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty(CT_AUTO_V1.enabledProperty) !== 'true') {
    console.log('AUTO_ISSUANCE_DISABLED; NO_ACTION');
    return;
  }
  const baseline = Number(props.getProperty(CT_AUTO_V1.startProperty));
  if (!Number.isInteger(baseline) || baseline < 1) throw new Error('BASELINE_INVALID');
  const tables = ctV2EngineTables_();
  const s = tables.s;
  const total = s.data.length;
  const queueSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Certificate_Delivery_Queue');
  if (!queueSheet) throw new Error('DELIVERY_QUEUE_MISSING');
  let processed = 0;
  for (let row = baseline + 1; row <= total && processed < CT_AUTO_V1.maxRowsPerRun; row++) {
    const id = ctV2EngineText_(s, row, 'submissionId');
    const testOnly = props.getProperty('CT_CLOUD_TEST_ONLY_SUBMISSION_ID');
    if (testOnly && id !== testOnly) continue;
    const status = ctV2EngineText_(s, row, 'processingStatus').toLowerCase();
    if (!id || !['pending', 'processing', 'issued'].includes(status)) continue;
    // Do not consume capacity for already queued certificates.
    if (status === 'issued' && ctDeliveryFindRow_(queueSheet, id) > 0) continue;
    // Check academic eligibility before attempting issuance. Failed scores are NOT overwritten.
    if (status === 'pending') {
      const trainings = ctV2LoadTrainingConfigurations();
      const training = trainings.get(ctV2EngineText_(s, row, 'trainingId'));
      const check = ctV2EvaluateSubmission({
        submissionId: id,
        name: ctV2EngineText_(s, row, 'name'),
        email: ctV2EngineText_(s, row, 'email'),
        answersJson: ctV2EngineValue_(s, row, 'answersJson'),
        legalAcknowledgment: ctV2EngineText_(s, row, 'legalAcknowledgment'),
        processingStatus: 'Pending', certificateId: ''
      }, training);
      if (!check.accepted || !check.certificateEligible) continue;
    }
    processed++;
    try {
      if (status !== 'issued') ctAutoIssueNewSubmission_(id);
      ctDeliveryQueueIssuedV1(id);
      console.log('AUTO_ISSUED_AND_QUEUED ' + id);
    } catch (e) {
      console.error('AUTO_ITEM_REQUIRES_REVIEW ' + id + ' ' + String(e.message || e));
    }
  }
  console.log('AUTO_SCAN_DONE processedCandidates=' + processed);
}

function ctAutoIssueNewSubmission_(submissionId) {
  if (PropertiesService.getScriptProperties().getProperty("CT_AUTO_ISSUANCE_ENABLED") !== "true") {
    throw new Error("AUTO_ISSUANCE_DISABLED");
  }

  const lock = LockService.getScriptLock();

  if (!lock.tryLock(30000)) {
    throw new Error("ISSUANCE_LOCK_UNAVAILABLE");
  }

  try {
    const tables = ctV2EngineTables_();
    const s = tables.s;

    const id = String(submissionId || "").trim();

    if (!id) throw new Error("SUBMISSION_ID_REQUIRED");

    const row = ctV2EngineFindSubmission_(s, id);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ctV2EngineText_(s, row, "email"))) {
      throw new Error("INVALID_RECIPIENT_EMAIL");
    }

    const status = ctV2EngineText_(
      s, row, "processingStatus"
    ).toLowerCase();

    if (status === "issued" || status === "sent") {
      console.log("ALREADY_ISSUED");
      return id;
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
    console.log("CERTIFICATE_AUTO_ISSUED_OK");
    return id;

  } finally {
    lock.releaseLock();
  }
}
