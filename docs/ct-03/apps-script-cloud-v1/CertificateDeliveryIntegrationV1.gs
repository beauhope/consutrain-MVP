/**
 * ConsuTrain — Certificate Delivery Integration V1
 * Add as NEW Apps Script file. Does NOT alter the existing issuance engine.
 * Queue is explicit: only a caller with a newly issued submissionId enqueues.
 * No historical scans; no automatic retries; no delivery until enabled.
 * Requires the existing functions ctV2EngineTables_, ctV2EngineFindSubmission_,
 * ctV2EngineText_ and valid Certificate_Verifications data.
 */
const CT_DELIVERY_V1 = Object.freeze({
  queueSheet: 'Certificate_Delivery_Queue',
  from: 'ConsuTrain Training <training@consutrain.com>',
  verificationPage: 'https://consutrain.com/certificate-verification.html',
  enabledProperty: 'CT_CERT_DELIVERY_ENABLED',
  apiKeyProperty: 'RESEND_CERTIFICATES_API_KEY',
  headers: [
    'submissionId','certificateId','verificationCode','recipient','language',
    'certificateFileId','status','queuedAt','attemptedAt','resendEmailId',
    'lastHttpStatus','lastError','updatedAt'
  ]
});

function ctDeliverySetupQueueV1() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('BOUND_SPREADSHEET_REQUIRED');
  let sh = ss.getSheetByName(CT_DELIVERY_V1.queueSheet);
  if (!sh) {
    sh = ss.insertSheet(CT_DELIVERY_V1.queueSheet);
    sh.appendRow(CT_DELIVERY_V1.headers);
    sh.setFrozenRows(1);
  } else {
    const existing = sh.getRange(1,1,1,CT_DELIVERY_V1.headers.length).getValues()[0];
    if (existing.some((v,i) => v !== CT_DELIVERY_V1.headers[i])) {
      throw new Error('QUEUE_HEADER_MISMATCH_NO_CHANGES_MADE');
    }
  }
  // Keep sending OFF; only an explicit later approval can change this property.
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty(CT_DELIVERY_V1.enabledProperty)) {
    props.setProperty(CT_DELIVERY_V1.enabledProperty, 'false');
  }
  console.log('DELIVERY_QUEUE_READY; SENDING_DISABLED_BY_DEFAULT');
}

function ctDeliveryFindRow_(sheet, submissionId) {
  const values = sheet.getDataRange().getValues();
  let found = -1;
  for (let i=1; i<values.length; i++) {
    if (String(values[i][0]).trim() === submissionId) {
      if (found !== -1) throw new Error('DUPLICATE_DELIVERY_QUEUE_KEY');
      found = i+1;
    }
  }
  return found;
}

function ctDeliveryParseDriveFileId_(url) {
  const m = /^https:\/\/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)\/view(?:[?#].*)?$/.exec(String(url).trim());
  if (!m) throw new Error('INVALID_PRIVATE_DRIVE_CERTIFICATE_URL');
  return m[1];
}

function ctDeliveryHtmlEscape_(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/**
 * Called ONLY after a newly issued certificate is fully saved and registered.
 * This is an explicit enqueue, not a scan of old submissions.
 * Never call inside the issuance engine's held ScriptLock (non-reentrant).
 */
function ctDeliveryQueueIssuedV1(submissionId) {
  const id = String(submissionId || '').trim();
  if (!id) throw new Error('SUBMISSION_ID_REQUIRED');
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) throw new Error('QUEUE_LOCK_UNAVAILABLE');
  try {
    const tables = ctV2EngineTables_();
    const s = tables.s, v = tables.v;
    const row = ctV2EngineFindSubmission_(s, id);
    const status = ctV2EngineText_(s,row,'processingStatus').toLowerCase();
    if (!['issued','sent'].includes(status)) throw new Error('NOT_ISSUED_NO_QUEUE');
    if (ctV2EngineText_(s,row,'result').toLowerCase() !== 'passed') {
      throw new Error('NOT_PASSED_NO_QUEUE');
    }
    const certId = ctV2EngineText_(s,row,'certificateId');
    const code = ctV2EngineText_(s,row,'verificationCode');
    const email = ctV2EngineText_(s,row,'email');
    const lang = ctV2EngineText_(s,row,'language').toLowerCase();
    if (!certId || !code || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !['ar','fr'].includes(lang)) {
      throw new Error('INVALID_ISSUED_CERTIFICATE_FIELDS');
    }
    const fileId = ctDeliveryParseDriveFileId_(ctV2EngineText_(s,row,'certificateFileUrl'));
    let matches = 0;
    for (let r=2;r<=v.data.length;r++) {
      if (ctV2EngineText_(v,r,'submissionId') !== id) continue;
      matches++;
      if (ctV2EngineText_(v,r,'certificateId') !== certId ||
          ctV2EngineText_(v,r,'verificationCode') !== code ||
          ctV2EngineText_(v,r,'verificationStatus').toLowerCase() !== 'valid') {
        throw new Error('VERIFICATION_ENTRY_NOT_VALID');
      }
    }
    if (matches !== 1) throw new Error('VERIFICATION_ENTRY_COUNT_INVALID');
    const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CT_DELIVERY_V1.queueSheet);
    if (!sh) throw new Error('RUN_ctDeliverySetupQueueV1_FIRST');
    const old = ctDeliveryFindRow_(sh,id);
    if (old > 0) { console.log('ALREADY_QUEUED_NO_ACTION: '+id); return; }
    const now = new Date();
    sh.appendRow([id,certId,code,email,lang,fileId,'Queued',now,'','','','',now]);
    console.log('QUEUED: '+id);
  } finally { lock.releaseLock(); }
}

function ctDeliveryBuildMessage_(record, pdfBytes) {
  const code = ctDeliveryHtmlEscape_(record.code);
  const certId = ctDeliveryHtmlEscape_(record.certId);
  const link = CT_DELIVERY_V1.verificationPage;
  const ar = record.lang === 'ar';
  const html = ar ? `
    <div dir="rtl" lang="ar" style="font-family:Arial,Tahoma,sans-serif;line-height:1.9;max-width:650px">
      <p>السلام عليكم ورحمة الله وبركاته،</p>
      <p>يسر منصة <strong>ConsuTrain</strong> تهنئتكم بإتمام متطلبات التدريب بنجاح.</p>
      <p>نرفق لكم شهادة التدريب بصيغة PDF، ويمكنكم التحقق من صحتها في أي وقت بالضغط على رابط التحقق المدرج داخل الشهادة.</p>
      <p><strong>رقم الشهادة:</strong> <span dir="ltr">${certId}</span></p>
      <p><strong>رمز التحقق:</strong> <span dir="ltr">${code}</span></p>
      <p>إذا وصلتك الشهادة كصورة أو نسخة مطبوعة، يمكنك <a href="${link}">التحقق من صحة الشهادة</a> بإدخال رمز التحقق.</p>
      <p>نتمنى لكم دوام التوفيق والنجاح في مسيرتكم المهنية.</p>
      <p>مع خالص التحية والتقدير،<br><strong>فريق التدريب — ConsuTrain</strong></p>
    </div>` : `
    <div lang="fr" style="font-family:Arial,sans-serif;line-height:1.7;max-width:650px">
      <p>Bonjour,</p>
      <p>L’équipe <strong>ConsuTrain</strong> vous félicite pour la réussite de votre formation.</p>
      <p>Vous trouverez en pièce jointe votre attestation de formation au format PDF. Vous pouvez en vérifier l’authenticité à tout moment en cliquant sur le lien de vérification intégré à l’attestation.</p>
      <p><strong>Référence :</strong> ${certId}<br><strong>Code de vérification :</strong> ${code}</p>
      <p>Si vous recevez une image ou une version imprimée, rendez-vous sur <a href="${link}">la page de vérification</a> et saisissez le code.</p>
      <p>Nous vous souhaitons pleine réussite dans vos projets professionnels.</p>
      <p>Cordialement,<br><strong>L’équipe formation — ConsuTrain</strong></p>
    </div>`;
  return {
    from: CT_DELIVERY_V1.from,
    to: [record.email],
    subject: ar ? 'ConsuTrain — شهادتك التدريبية' : 'ConsuTrain — Votre attestation de formation',
    html,
    attachments: [{filename:record.certId+'.pdf',content:Utilities.base64Encode(pdfBytes)}]
  };
}

function ctDeliveryUpdateRow_(sh,row,updates) {
  const fields = CT_DELIVERY_V1.headers;
  Object.keys(updates).forEach(name => {
    const col=fields.indexOf(name)+1;
    if (col<1) throw new Error('UNKNOWN_QUEUE_FIELD_'+name);
    sh.getRange(row,col).setValue(updates[name]);
  });
  sh.getRange(row,fields.indexOf('updatedAt')+1).setValue(new Date());
  SpreadsheetApp.flush();
}

/** Manual invocation or future time trigger; max one queued message per execution. */
function ctDeliveryProcessNextV1() {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty(CT_DELIVERY_V1.enabledProperty) !== 'true') {
    console.log('DELIVERY_DISABLED; NO_EMAIL_SENT');
    return;
  }
  const key=props.getProperty(CT_DELIVERY_V1.apiKeyProperty);
  if (!key) throw new Error('RESEND_CERTIFICATES_API_KEY_MISSING');
  const lock=LockService.getScriptLock();
  if (!lock.tryLock(30000)) throw new Error('DELIVERY_LOCK_UNAVAILABLE');
  try {
    const sh=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CT_DELIVERY_V1.queueSheet);
    if (!sh) throw new Error('DELIVERY_QUEUE_MISSING');
    const data=sh.getDataRange().getValues();
    const H=CT_DELIVERY_V1.headers;
    if (H.some((v,i)=>data[0][i]!==v)) throw new Error('DELIVERY_QUEUE_HEADERS_CHANGED');
    for(let i=1;i<data.length;i++) {
      const testOnly=props.getProperty('CT_CLOUD_TEST_ONLY_SUBMISSION_ID');
      if(testOnly && String(data[i][H.indexOf('submissionId')]).trim()!==testOnly) continue;
      if(String(data[i][H.indexOf('status')]).trim()!=='Queued') continue;
      const row=i+1;
      const record={
        submissionId:String(data[i][H.indexOf('submissionId')]).trim(),
        certId:String(data[i][H.indexOf('certificateId')]).trim(),
        code:String(data[i][H.indexOf('verificationCode')]).trim(),
        email:String(data[i][H.indexOf('recipient')]).trim(),
        lang:String(data[i][H.indexOf('language')]).trim(),
        fileId:String(data[i][H.indexOf('certificateFileId')]).trim()
      };
      // Reconfirm that issued certificate and registry still match before sending.
      const tables=ctV2EngineTables_();
      const sr=ctV2EngineFindSubmission_(tables.s,record.submissionId);
      if(ctV2EngineText_(tables.s,sr,'certificateId')!==record.certId ||
         ctV2EngineText_(tables.s,sr,'verificationCode')!==record.code ||
         ctV2EngineText_(tables.s,sr,'email')!==record.email ||
         ctV2EngineText_(tables.s,sr,'result').toLowerCase()!=='passed' ||
         !['issued','sent'].includes(ctV2EngineText_(tables.s,sr,'processingStatus').toLowerCase()) ||
         ctDeliveryParseDriveFileId_(ctV2EngineText_(tables.s,sr,'certificateFileUrl'))!==record.fileId) {
        throw new Error('QUEUE_ISSUANCE_MISMATCH_NO_SEND');
      }
      const url='https://www.googleapis.com/drive/v3/files/'+encodeURIComponent(record.fileId)+'?alt=media';
      const drive=UrlFetchApp.fetch(url,{headers:{Authorization:'Bearer '+ScriptApp.getOAuthToken()},muteHttpExceptions:true});
      if(drive.getResponseCode()!==200) throw new Error('DRIVE_READ_FAILED_'+drive.getResponseCode());
      const bytes=drive.getContent();
      if(bytes.length<5 || [37,80,68,70,45].some((v,j)=>(bytes[j]&255)!==v)) throw new Error('INVALID_PDF_CONTENT');
      const payload=ctDeliveryBuildMessage_(record,bytes);
      // Durable attempt marker BEFORE external send. Any uncertainty -> manual reconciliation.
      ctDeliveryUpdateRow_(sh,row,{status:'Attempting',attemptedAt:new Date()});
      let response;
      try {
        response=UrlFetchApp.fetch('https://api.resend.com/emails',{
          method:'post',contentType:'application/json',
          headers:{Authorization:'Bearer '+key},
          payload:JSON.stringify(payload),muteHttpExceptions:true
        });
      } catch(e) {
        ctDeliveryUpdateRow_(sh,row,{status:'Unknown',lastError:'TRANSPORT_ERROR_RECONCILE_IN_RESEND'});
        throw new Error('DELIVERY_OUTCOME_UNKNOWN_CHECK_RESEND_BEFORE_RETRY');
      }
      const code=response.getResponseCode();
      let result={};
      try {result=JSON.parse(response.getContentText());} catch(e) {}
      if(code>=200 && code<300 && result.id) {
        ctDeliveryUpdateRow_(sh,row,{status:'Accepted',resendEmailId:result.id,lastHttpStatus:code,lastError:''});
        console.log('RESEND_ACCEPTED '+record.submissionId+' '+result.id);
      } else {
        ctDeliveryUpdateRow_(sh,row,{status:'Hold',lastHttpStatus:code,lastError:'REVIEW_RESEND_LOGS_NO_AUTO_RETRY'});
        throw new Error('RESEND_NOT_CONFIRMED_HTTP_'+code);
      }
      return;
    }
    console.log('NO_QUEUED_CERTIFICATES');
  } finally {lock.releaseLock();}
}
