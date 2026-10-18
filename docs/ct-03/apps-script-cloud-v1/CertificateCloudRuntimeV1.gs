/** ConsuTrain cloud runtime v1. Staged; public intake remains disabled. */
const CT_CLOUD_V1 = Object.freeze({registry:'Training_Registry', headers:['trainingId','language','trainingTitle','trainingCategory','learningType','certificateType','isActive']});
function ctCloudRegistryV1_() {
 const sh=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CT_CLOUD_V1.registry);
 if(!sh) throw new Error('REGISTRY_MISSING');
 const rows=sh.getDataRange().getValues(), h=rows.shift().map(String);
 if(CT_CLOUD_V1.headers.some((v,i)=>h[i]!==v)) throw new Error('REGISTRY_HEADERS_INVALID');
 const result=new Map();
 rows.forEach(r=>{if(!r[0])return; const o={}; h.forEach((k,i)=>o[k]=String(r[i]||'').trim());
 const id=o.trainingId+'|'+o.language;if(result.has(id))throw new Error('REGISTRY_DUPLICATE');result.set(id,o);});
 return result;
}
function ctCloudAcceptV1_(data) {
 if(PropertiesService.getScriptProperties().getProperty('CT_CLOUD_INTAKE_ENABLED')!=='true') return jsonResponse({ok:false,status:'unavailable'});
 try {
 const text=(v,max)=>{if(typeof v!=='string'||v.length>max||/[\u0000-\u001f]/.test(v))throw new Error('INVALID_FIELD');return v.trim();};
 const id=text(data.submissionId,180), trainingId=text(data.trainingId,100), lang=text(data.language,2);
 if(!/^[A-Za-z0-9_-]{8,180}$/.test(id)||!['ar','fr'].includes(lang))throw new Error('INVALID_ID');
 const name=text(data.name||data.fullName,120), email=text(data.email,160).toLowerCase();
 if(name.length<2||!isValidEmail(email)||data.legalAcknowledgment!==true)throw new Error('INVALID_IDENTITY');
 const meta=ctCloudRegistryV1_().get(trainingId+'|'+lang), training=ctV2LoadTrainingConfigurations().get(trainingId);
 if(!meta||meta.isActive.toLowerCase()!=='true'||!training||!training.active) return jsonResponse({ok:false,status:'configuration_error'});
 const raw=text(data.answersJson,12000), answers=JSON.parse(raw);
 if(!answers||Array.isArray(answers)||typeof answers!=='object'||Object.keys(answers).length!==training.total)throw new Error('INVALID_ANSWERS');
 const assessment=ctV2EvaluateSubmission({submissionId:id,name,email,answersJson:raw,legalAcknowledgment:'yes',processingStatus:'Pending',certificateId:''},training);
 if(!assessment.accepted)throw new Error('ASSESSMENT_REJECTED');
 const ss=SpreadsheetApp.getActiveSpreadsheet(), sh=ss.getSheetByName('certificate-submissions');
 const values=sh.getDataRange().getValues(), h=values[0].map(String), get=(r,k)=>String(r[h.indexOf(k)]||'').trim();
 const required=['submissionId','trainingId','language','name','email','answersJson','certificateKey','result','processingStatus'];
 if(required.some(k=>h.filter(v=>v===k).length!==1))throw new Error('SUBMISSION_HEADERS_INVALID');
 const entitlement=trainingId+'-'+email;
 for(let i=1;i<values.length;i++) {
 const r=values[i];
 if(get(r,'submissionId')===id) {
 if(get(r,'email').toLowerCase()!==email||get(r,'trainingId')!==trainingId||get(r,'language')!==lang||get(r,'answersJson')!==raw)throw new Error('SUBMISSION_CONFLICT');
 return jsonResponse({ok:true,status:get(r,'result').toLowerCase()==='failed'?'assessment_failed':'accepted',submissionId:id});
 }
 if(get(r,'certificateKey')===entitlement&&get(r,'result').toLowerCase()!=='failed')return jsonResponse({ok:true,status:'duplicate'});
 }
 const rec={submittedAt:new Date(),submissionId:id,name,email,trainingId,language:lang,trainingTitle:meta.trainingTitle,answersJson:raw,
 score:assessment.score,totalQuestions:assessment.totalQuestions,percentage:assessment.percentage,result:assessment.assessmentResult,
 certificateKey:entitlement,processingStatus:assessment.passed?'Pending':'Completed',legalAcknowledgment:'yes',marketingConsent:data.marketingConsent===true?'yes':'no',
 learningType:meta.learningType,trainingCategory:meta.trainingCategory,certificateType:meta.certificateType,emailStatus:assessment.passed?'Pending':'NotRequired',
 country:text(data.country||'',120),organization:text(data.organization||'',160),jobTitle:text(data.jobTitle||'',160)};
 appendRecordByHeaders(sh,rec);SpreadsheetApp.flush();
 return jsonResponse({ok:true,status:assessment.passed?'accepted':'assessment_failed',submissionId:id});
 } catch(e) {console.warn('CLOUD_INTAKE_REJECTED');return jsonResponse({ok:false,status:'validation_failed'});}
}
function doGet(e) {
 if(PropertiesService.getScriptProperties().getProperty('CT_CLOUD_VERIFICATION_ENABLED')!=='true')return jsonResponse({valid:false,status:'api_error'});
 const code=String(e&&e.parameter&&e.parameter.code||'').trim().toUpperCase();
 if(!/^CT-\d{2}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code))return jsonResponse({valid:false,status:'invalid_code'});
 try {
 const sh=SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Certificate_Verifications'), rows=sh.getDataRange().getValues(),h=rows.shift().map(String);
 const required=['verificationCode','certificateId','verificationStatus','holderName','trainingTitle','language','issuedAt'];
 if(required.some(k=>h.filter(v=>v===k).length!==1))throw new Error('INVALID_HEADERS');
 const get=(r,k)=>r[h.indexOf(k)], matches=rows.filter(r=>String(get(r,'verificationCode')).trim().toUpperCase()===code);
 if(matches.length===0)return jsonResponse({valid:false,status:'not_found'});
 if(matches.length!==1)throw new Error('REGISTRY_CONFLICT');
 const r=matches[0],state=String(get(r,'verificationStatus')).trim().toLowerCase();
 if(state!=='valid')return jsonResponse({valid:false,status:state==='revoked'?'revoked':'not_found'});
 return jsonResponse({valid:true,status:'valid',verificationCode:code,certificateId:get(r,'certificateId'),holderName:get(r,'holderName'),trainingTitle:get(r,'trainingTitle'),language:get(r,'language'),issuedAt:get(r,'issuedAt')});
 } catch(e) {return jsonResponse({valid:false,status:'api_error'});}
}
/** Read-only readiness; does not reveal credentials or learner data. */
function ctCloudAuditV1() {
 const ss=SpreadsheetApp.getActiveSpreadsheet(),p=PropertiesService.getScriptProperties(),configs=ctV2LoadTrainingConfigurations();
 const active=[];configs.forEach((v,k)=>{if(v.active)active.push({trainingId:k,total:v.total,threshold:v.threshold});});
 const q=ss.getSheetByName('Certificate_Delivery_Queue'),rows=q.getDataRange().getValues(),h=rows.shift().map(String),statuses={};
 rows.forEach(r=>{const s=String(r[h.indexOf('status')]||'');if(s)statuses[s]=(statuses[s]||0)+1;});
 console.log(JSON.stringify({spreadsheetId:ss.getId(),activeTrainings:active,queueStatuses:statuses,
 baseline:p.getProperty('CT_AUTO_START_ROW'),issuanceEnabled:p.getProperty('CT_AUTO_ISSUANCE_ENABLED')==='true',deliveryEnabled:p.getProperty('CT_CERT_DELIVERY_ENABLED')==='true',
 pdfCredentialPresent:!!p.getProperty('CLOUDFLARE_CERTIFICATE_POC_KEY'),emailCredentialPresent:!!p.getProperty('RESEND_CERTIFICATES_API_KEY'),
 registryPresent:!!ss.getSheetByName(CT_CLOUD_V1.registry),intakeEnabled:p.getProperty('CT_CLOUD_INTAKE_ENABLED')==='true',verificationEnabled:p.getProperty('CT_CLOUD_VERIFICATION_ENABLED')==='true'}));
}

/** One-time registry seed copied from current website metadata; never overwrites an existing registry. */
function ctCloudSetupRegistryV1() {
 const ss=SpreadsheetApp.getActiveSpreadsheet();
 if(ss.getSheetByName(CT_CLOUD_V1.registry))throw new Error("REGISTRY_ALREADY_EXISTS_NO_CHANGE");
 const seed=[["digital-transformation-intro","ar","مدخل إلى الرقمنة والتحول الرقمي","digital_transformation"],["digital-transformation-intro","fr","Introduction à la digitalisation et à la transformation numérique","digital_transformation"],["kaizen-continuous-improvement","ar","كايزن: التحسين المستمر في بيئة العمل","الجودة والتحسين المستمر"],["kaizen-continuous-improvement","fr","Kaizen : l’amélioration continue au travail","Qualité et amélioration continue"],["brand-customer-experience-basics","ar","أساسيات العلامة التجارية وتجربة العميل للمشاريع الصغيرة","branding_customer_experience"],["brand-customer-experience-basics","fr","Les fondamentaux de la marque et de l’expérience client pour les petites entreprises","branding_customer_experience"],["blue-ocean-strategy-fundamentals-ar","ar","استراتيجية المحيط الأزرق: ابتكار القيمة وخلق أسواق جديدة","strategic_management_and_innovation"],["blue-ocean-strategy-fundamentals-fr","fr","Stratégie Océan Bleu : innover par la valeur et créer de nouveaux marchés","strategic_management_and_innovation"]];
 const configs=ctV2LoadTrainingConfigurations();
 seed.forEach(r=>{if(!configs.has(r[0])||!configs.get(r[0]).active)throw new Error("TRAINING_NOT_ACTIVE");});
 const sh=ss.insertSheet(CT_CLOUD_V1.registry);
 sh.getRange(1,1,seed.length+1,7).setValues([CT_CLOUD_V1.headers].concat(seed.map(r=>r.concat(["free_training","free_test","true"]))));
 sh.setFrozenRows(1); SpreadsheetApp.flush();
 console.log("REGISTRY_CREATED variants="+ctCloudRegistryV1_().size);
}

/** Synthetic boundary and retry tests: no writes, PDFs, external requests or emails. */
function ctCloudTestsV1() {
 ctV2TestProcessingEngine();
 const registry=ctCloudRegistryV1_(),configs=ctV2LoadTrainingConfigurations();
 registry.forEach((r,k)=>{if(!r.trainingTitle||!['ar','fr'].includes(r.language)||!configs.has(r.trainingId))throw new Error('REGISTRY_TEST_FAILED');});
 const fields=['submissionId','certificateKey','certificateId','verificationCode','result','processingStatus'];
 const s={columns:{},data:[fields,['retry-new','same-key','','','passed','Pending'],['prior-fail','same-key','','','failed','Completed']]};
 fields.forEach((k,i)=>s.columns[k]=i+1);
 const vf=['submissionId','certificateId','verificationCode'];const v={columns:{submissionId:1,certificateId:2,verificationCode:3},data:[vf]};
 ctV2EngineCheckUniqueness_({s,v},2,'same-key','CERT-NEW','CODE-NEW');
 s.data[2][4]='passed';let blocked=false;
 try {ctV2EngineCheckUniqueness_({s,v},2,'same-key','CERT-NEW','CODE-NEW');}catch(e){blocked=e.message==='DUPLICATE_ENTITLEMENT';}
 if(!blocked)throw new Error('DUPLICATE_ENTITLEMENT_TEST_FAILED');
 s.data[2][4]='failed';s.data[2][2]='CERT-OLD';blocked=false;
 try {ctV2EngineCheckUniqueness_({s,v},2,'same-key','CERT-NEW','CODE-NEW');}catch(e){blocked=e.message==='DUPLICATE_ENTITLEMENT';}
 if(!blocked)throw new Error('FAILED_RECORD_WITH_CERTIFICATE_TEST_FAILED');
 console.log('CLOUD_TESTS_OK variants='+registry.size+'; failed retry allowed; existing entitlement blocked; certificate conflict blocked');
}

/** Enables only intake and verification for validation; issuance/delivery stay disabled. */
function ctCloudValidateDeployedV1() {
 const p=PropertiesService.getScriptProperties();
 if(p.getProperty('CT_AUTO_ISSUANCE_ENABLED')==='true'||p.getProperty('CT_CERT_DELIVERY_ENABLED')==='true')throw new Error('PROCESSING_MUST_STAY_DISABLED_FOR_VALIDATION');
 ctCloudRegistryV1_();
 p.setProperties({CT_CLOUD_INTAKE_ENABLED:'true',CT_CLOUD_VERIFICATION_ENABLED:'true'},false);
 const endpoint="https://script.google.com/macros/s/AKfycbwqXE2__bb_XIx07-TTiAz_vYzpG-FAYUnE7I7IarGLPEhDOuCoKHq5DjydVHHKckq9/exec";
 const trainingId='digital-transformation-intro', t=ctV2LoadTrainingConfigurations().get(trainingId),answers={};
 Object.keys(t.key).forEach(k=>answers[k]=['A','B','C','D'].find(v=>v!==String(t.key[k]).toUpperCase()));
 const id='CT-CLOUD-VALIDATION-'+Utilities.getUuid();
 const payload={form_type:'certificate_submission',submissionId:id,trainingId,language:'ar',name:'Cloud Validation Test',email:'cloud-validation@example.com',answersJson:JSON.stringify(answers),legalAcknowledgment:true,country:'Test',marketingConsent:false};
 const post=body=>{const r=UrlFetchApp.fetch(endpoint,{method:'post',contentType:'text/plain',payload:JSON.stringify(body),muteHttpExceptions:true});if(r.getResponseCode()!==200)throw new Error('INTAKE_HTTP_'+r.getResponseCode());return JSON.parse(r.getContentText());};
 const first=post(payload), second=post(payload);
 if(first.ok!==true||first.status!=='assessment_failed'||second.ok!==true||second.submissionId!==id)throw new Error('DURABLE_INTAKE_TEST_FAILED');
 const sh=SpreadsheetApp.getActiveSpreadsheet().getSheetByName('certificate-submissions'),rows=sh.getDataRange().getValues(),h=rows.shift().map(String);
 const matches=rows.filter(r=>r[h.indexOf('submissionId')]===id);
 if(matches.length!==1||String(matches[0][h.indexOf('processingStatus')])!=='Completed')throw new Error('DURABILITY_OR_DEDUPE_FAILED');
 const bad=post({...payload,email:'conflicting@example.com'});
 if(bad.ok!==false)throw new Error('CONFLICT_ACCEPTED');
 const response=UrlFetchApp.fetch(endpoint+'?code=INVALID',{muteHttpExceptions:true});const check=JSON.parse(response.getContentText());
 if(check.status!=='invalid_code')throw new Error('VERIFICATION_ROUTE_FAILED');
 console.log('CLOUD_DEPLOYED_TEST_OK: persisted once; duplicate safe; conflict rejected; failed assessment completed; verification validation works; no PDF or email');
 console.log('VALIDATION_SUBMISSION_ID '+id);
}

/** Generates fresh marked test PDFs in both languages; no learner records or email. */
function ctCloudTestPdfStorageV1() {
 const p=PropertiesService.getScriptProperties();
 const run=p.getProperty('CT_CLOUD_PDF_TEST_RUN')||Utilities.getUuid();
 p.setProperty('CT_CLOUD_PDF_TEST_RUN',run);
 for(const language of ['ar','fr']) {
 const filename='CT-CLOUD-TEST-'+language.toUpperCase()+'-'+run+'.pdf';
 let id=ctV2EngineFindPdf_(CT_ISSUANCE_V2.folderId,filename);
 if(!id){
 const blob=ctV2EngineGeneratePdf_({language,fullName:language==='ar'?'اختبار تقني — شهادة غير صالحة':'TEST TECHNIQUE — ATTESTATION NON VALABLE',trainingTitle:language==='ar'?'اختبار المنظومة السحابية':'Test du système cloud',issueDate:Utilities.formatDate(new Date(),'Africa/Casablanca','dd/MM/yyyy'),certificateId:'TEST-'+language.toUpperCase()+'-'+run.slice(0,8),verificationCode:'TEST-NOT-VALID',verificationUrl:'https://consutrain.com/certificate-verification.html?code=TEST-NOT-VALID'},filename);
 const created=Drive.Files.create({name:filename,mimeType:'application/pdf',parents:[CT_ISSUANCE_V2.folderId]},blob,{fields:'id'});id=created.id;
 }
 const file=Drive.Files.get(id,{fields:'id,name,mimeType,size,parents,trashed'});
 if(!id||file.trashed||file.name!==filename||file.mimeType!=='application/pdf'||Number(file.size)<=5||!(file.parents||[]).includes(CT_ISSUANCE_V2.folderId))throw new Error('PDF_STORAGE_TEST_FAILED');
 p.setProperty('CT_CLOUD_PDF_TEST_'+language.toUpperCase(),id);
 console.log('CLOUD_PDF_STORAGE_OK language='+language+' bytes='+file.size+' testOnly=true');
 }
 console.log('CLOUD_PDF_STORAGE_TEST_OK; NO_EMAIL_SENT; NO_VALID_CERTIFICATE_REGISTERED');
}

/** Single controlled end-to-end cloud test. Automatically closes both production gates. */
function ctCloudEndToEndV1() {
 const p=PropertiesService.getScriptProperties();
 const id=p.getProperty('CT_CLOUD_E2E_SUBMISSION_ID')||'CT-CLOUD-E2E-'+Utilities.getUuid();
 p.setProperties({CT_CLOUD_E2E_SUBMISSION_ID:id,CT_CLOUD_TEST_ONLY_SUBMISSION_ID:id},false);
 const endpoint="https://script.google.com/macros/s/AKfycbwqXE2__bb_XIx07-TTiAz_vYzpG-FAYUnE7I7IarGLPEhDOuCoKHq5DjydVHHKckq9/exec";
 const trainingId='digital-transformation-intro',training=ctV2LoadTrainingConfigurations().get(trainingId);
 const payload={form_type:'certificate_submission',submissionId:id,trainingId,language:'ar',name:'اختبار تقني للمنظومة السحابية',email:'consutrain@gmail.com',answersJson:JSON.stringify(training.key),legalAcknowledgment:true,country:'Test',marketingConsent:false};
 const response=UrlFetchApp.fetch(endpoint,{method:'post',contentType:'text/plain',payload:JSON.stringify(payload),muteHttpExceptions:true});
 const result=JSON.parse(response.getContentText());
 if(result.ok!==true||!['accepted','duplicate'].includes(result.status))throw new Error('E2E_INTAKE_FAILED');
 let tables=ctV2EngineTables_(),row=ctV2EngineFindSubmission_(tables.s,id);
 if(ctV2EngineText_(tables.s,row,'email')!==payload.email)throw new Error('E2E_RECIPIENT_MISMATCH');
 try {
 p.setProperties({CT_AUTO_ISSUANCE_ENABLED:'true',CT_CERT_DELIVERY_ENABLED:'true'},false);
 ctAutoRunNewSubmissionsV1();
 tables=ctV2EngineTables_();row=ctV2EngineFindSubmission_(tables.s,id);
 if(ctV2EngineText_(tables.s,row,'processingStatus').toLowerCase()!=='issued')throw new Error('E2E_ISSUANCE_NOT_COMPLETE');
 const code=ctV2EngineText_(tables.s,row,'verificationCode');
 const verify=JSON.parse(UrlFetchApp.fetch(endpoint+'?code='+encodeURIComponent(code)).getContentText());
 if(verify.valid!==true||verify.certificateId!==ctV2EngineText_(tables.s,row,'certificateId'))throw new Error('E2E_VERIFICATION_FAILED');
 console.log('E2E_PDF_AND_VERIFICATION_OK');
 ctDeliveryProcessNextV1();
 const q=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CT_DELIVERY_V1.queueSheet),qr=ctDeliveryFindRow_(q,id),values=q.getRange(qr,1,1,CT_DELIVERY_V1.headers.length).getValues()[0];
 const status=String(values[CT_DELIVERY_V1.headers.indexOf('status')]);
 const messageId=String(values[CT_DELIVERY_V1.headers.indexOf('resendEmailId')]||'');
 if(status!=='Accepted'||!messageId)throw new Error('E2E_DELIVERY_NOT_ACCEPTED_'+status);
 console.log('E2E_RESEND_ACCEPTED recipient=consutrain@gmail.com messageId='+messageId);
 console.log('E2E_CLOUD_TEST_OK; DELIVERY_ACCEPTED_NOT_CONFIRMED_DELIVERED');
 } finally {p.setProperties({CT_AUTO_ISSUANCE_ENABLED:'false',CT_CERT_DELIVERY_ENABLED:'false'},false);console.log('PRODUCTION_ISSUANCE_AND_DELIVERY_GATES_CLOSED');}
}

function ctCloudCheckTestDeliveryV1() {
 const p=PropertiesService.getScriptProperties(),id=p.getProperty('CT_CLOUD_E2E_SUBMISSION_ID');
 const q=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CT_DELIVERY_V1.queueSheet),r=ctDeliveryFindRow_(q,id);
 if(r<2)throw new Error('TEST_QUEUE_RECORD_MISSING');
 const values=q.getRange(r,1,1,CT_DELIVERY_V1.headers.length).getValues()[0],emailId=String(values[CT_DELIVERY_V1.headers.indexOf('resendEmailId')]||'');
 if(!emailId)throw new Error('RESEND_MESSAGE_ID_MISSING');
 const response=UrlFetchApp.fetch('https://api.resend.com/emails/'+encodeURIComponent(emailId),{headers:{Authorization:'Bearer '+p.getProperty(CT_DELIVERY_V1.apiKeyProperty)},muteHttpExceptions:true});
 if(response.getResponseCode()!==200){console.log('DELIVERY_LOOKUP_UNAVAILABLE_HTTP_'+response.getResponseCode());return;}
 const result=JSON.parse(response.getContentText());console.log('TEST_EMAIL_LAST_EVENT '+String(result.last_event||'unknown'));
}

function ctCloudCutoverAuditV1() {
 ctCloudCheckTestDeliveryV1();
 const p=PropertiesService.getScriptProperties(),baseline=Number(p.getProperty('CT_AUTO_START_ROW')),tables=ctV2EngineTables_(),s=tables.s;
 const counts={},candidates=[];for(let row=baseline+1;row<=s.data.length;row++){
 const status=ctV2EngineText_(s,row,'processingStatus'),id=ctV2EngineText_(s,row,'submissionId');counts[status]=(counts[status]||0)+1;
 if(['pending','processing','issued'].includes(status.toLowerCase()))candidates.push({row,submissionId:id,status,result:ctV2EngineText_(s,row,'result'),hasCertificate:!!ctV2EngineText_(s,row,'certificateId')});
 }
 console.log(JSON.stringify({baseline,statusCounts:counts,candidates}));
}

function ctCloudCheckWebsiteKeysV1(){
 const expected=[{"path":"assets/js/free-certificate-training-blue-ocean-fr.js","trainingId":"blue-ocean-strategy-fundamentals-fr","answers":{"q1":"A","q2":"C","q3":"B","q4":"D","q5":"B","q6":"C","q7":"A","q8":"D","q9":"B","q10":"C","q11":"A","q12":"B","q13":"D","q14":"C","q15":"A","q16":"B","q17":"D","q18":"C","q19":"B","q20":"A"}},{"path":"assets/js/free-certificate-training-blue-ocean.js","trainingId":"blue-ocean-strategy-fundamentals-ar","answers":{"q1":"A","q2":"C","q3":"B","q4":"D","q5":"B","q6":"C","q7":"A","q8":"D","q9":"B","q10":"C","q11":"A","q12":"B","q13":"D","q14":"C","q15":"A","q16":"B","q17":"D","q18":"C","q19":"B","q20":"A"}},{"path":"assets/js/free-certificate-training-brand-cx-fr.js","trainingId":"brand-customer-experience-basics","answers":{"q1":"B","q2":"A","q3":"B","q4":"C","q5":"B","q6":"A","q7":"B","q8":"B","q9":"B","q10":"B","q11":"B","q12":"B","q13":"A","q14":"B","q15":"B","q16":"B","q17":"B","q18":"A","q19":"B","q20":"B"}},{"path":"assets/js/free-certificate-training-brand-cx.js","trainingId":"brand-customer-experience-basics","answers":{"q1":"B","q2":"A","q3":"B","q4":"C","q5":"B","q6":"A","q7":"B","q8":"B","q9":"B","q10":"B","q11":"B","q12":"B","q13":"A","q14":"B","q15":"B","q16":"B","q17":"B","q18":"A","q19":"B","q20":"B"}},{"path":"assets/js/free-certificate-training-fr.js","trainingId":"digital-transformation-intro","answers":{"q1":"B","q2":"B","q3":"A","q4":"C","q5":"A","q6":"D","q7":"B","q8":"C","q9":"A","q10":"B","q11":"D","q12":"C"}},{"path":"assets/js/free-certificate-training-kaizen-fr.js","trainingId":"kaizen-continuous-improvement","answers":{"q1":"B","q2":"C","q3":"A","q4":"B","q5":"C","q6":"A","q7":"D","q8":"B","q9":"C","q10":"A","q11":"B","q12":"D","q13":"A","q14":"C","q15":"B","q16":"A","q17":"D","q18":"C","q19":"B","q20":"A"}},{"path":"assets/js/free-certificate-training-kaizen.js","trainingId":"kaizen-continuous-improvement","answers":{"q1":"B","q2":"C","q3":"A","q4":"B","q5":"C","q6":"A","q7":"D","q8":"B","q9":"C","q10":"A","q11":"B","q12":"D","q13":"A","q14":"C","q15":"B","q16":"A","q17":"D","q18":"C","q19":"B","q20":"A"}},{"path":"assets/js/free-certificate-training.js","trainingId":"digital-transformation-intro","answers":{"q1":"B","q2":"B","q3":"A","q4":"C","q5":"A","q6":"D","q7":"B","q8":"C","q9":"A","q10":"B","q11":"D","q12":"C"}}];
 const configs=ctV2LoadTrainingConfigurations();
 for(const item of expected){const t=configs.get(item.trainingId);if(!t||!t.active||Object.keys(item.answers).length!==t.total||Object.keys(item.answers).some(k=>String(t.key[k]).toUpperCase()!==item.answers[k]))throw new Error("WEBSITE_KEY_MISMATCH "+item.path);}
 console.log("WEBSITE_ANSWER_KEYS_MATCH_OK variants="+expected.length);
}

/** Production cutover after the user confirmed local Queue Processor v2 unpublished. */
function ctCloudGoLiveV1() {
 const p=PropertiesService.getScriptProperties(),id=p.getProperty('CT_CLOUD_E2E_SUBMISSION_ID');
 if(!id)throw new Error('CONTROLLED_E2E_REQUIRED');
 const q=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CT_DELIVERY_V1.queueSheet),r=ctDeliveryFindRow_(q,id);
 if(r<2)throw new Error('CONTROLLED_DELIVERY_RECORD_REQUIRED');
 const data=q.getRange(r,1,1,CT_DELIVERY_V1.headers.length).getValues()[0];
 if(data[CT_DELIVERY_V1.headers.indexOf('status')]!=='Accepted'||!data[CT_DELIVERY_V1.headers.indexOf('resendEmailId')])throw new Error('CONTROLLED_DELIVERY_ACCEPTANCE_REQUIRED');
 const registry=ctCloudRegistryV1_();if(registry.size<8)throw new Error('REGISTRY_INCOMPLETE');
 if(!Number.isInteger(Number(p.getProperty('CT_AUTO_START_ROW'))))throw new Error('BASELINE_REQUIRED');
 p.setProperties({CT_CLOUD_LOCAL_PROCESSOR_DISABLED_CONFIRMED:'2026-10-18 user confirmed unpublished',CT_CLOUD_TEST_ONLY_SUBMISSION_ID:'',CT_CLOUD_INTAKE_ENABLED:'true',CT_CLOUD_VERIFICATION_ENABLED:'true',CT_AUTO_ISSUANCE_ENABLED:'true',CT_CERT_DELIVERY_ENABLED:'true'},false);
 console.log('CLOUD_PRODUCTION_GATES_ENABLED; EXISTING_TIME_TRIGGERS_ACTIVE; HISTORICAL_BASELINE_PRESERVED');
}
