# ConsuTrain — SOP الدورات المجانية وإصدار الشهادات والتحقق منها
**Standard Operating Procedure (SOP) | CT-03 — Courses & Training**

| عنصر ضبط الوثيقة | القيمة |
|---|---|
| رمز الوثيقة | CT-03-SOP-CERT-001 |
| الإصدار | **v1.1 — تحديث نتائج التشغيل الموثّق (18 أكتوبر 2026)** |
| تاريخ الإصدار | 18 أكتوبر 2026 |
| المالك الوظيفي | CT-03 — Courses & Training |
| الشركاء | CT-05 — Automation Systems؛ CT-01 — Platform & Website |
| النطاق | الدورات المجانية المؤهلة لشهادة، بالعربية والفرنسية، والدورات التي ستُضاف لاحقًا |
| الحالة | **مسار n8n الثلاثي منشور ومجرّب عمليًا للإصدار والتسليم؛ التأكد من 24/24، وDelivered، وحوكمة الاسترجاع والتوسع ما زال مفتوحًا** |
| المستودع المرجعي | beauhope/consutrain-MVP — docs/ct-03 |
| سياسة الاعتماد | تعديلات SOP بمراجعة ونسخة جديدة؛ لا يمثل حفظ هذه الوثيقة أمرًا بتفعيل التشغيل |

> **قاعدة تأسيسية:** النظام واحد لجميع الدورات المؤهلة، ولا يجوز إضافة معالج أو Workflow أو جدول استقبال منفصل لكل دورة. تسجيل دورة جديدة هو إجراء إعداد بيانات وتحقق من المحتوى، وليس تعديلًا برمجيًا خاصًا بها.
>
> **تفسير الحالات داخل الوثيقة:** **[متحقق]** مثبت باختبار أو قراءة فعلية؛ **[موجود/معطل]** منشأ لكن خلف مفتاح منع الإنتاج؛ **[قديم/يحتاج مطابقة]** من مسار n8n التاريخي ويحتاج قرار قطع انتقال؛ **[مطلوب]** ضابط أو تحسين غير مكتمل. لا يجوز تحويل «مطلوب» إلى «منفذ» بمجرد توثيقه.

## 1. النظرة التنفيذية

الغرض هو إدارة دورة حياة المتدرب بدءًا من إرسال إجابات اختبار دورة مجانية مؤهلة، مرورًا بالتقييم الموضوعي وتحديد الاستحقاق، ثم إصدار شهادة PDF موحدة، حفظها، تسجيلها، إرسالها من training@consutrain.com، وتمكين أي جهة من التحقق من أصالتها إلكترونيًا أو من خلال رمز مكتوب في نسخة مصورة/مطبوعة. التدخل البشري استثنائي: اعتماد دورة جديدة، حل تعارض أو فشل غير مؤكد، إبطال شهادة وفق تفويض، واعتماد تغييرات الإنتاج.

السلسلة المستهدفة: **صفحة الدورة → نقطة استقبال واحدة → سجل الطلبات → محرك تقييم موحد → إصدار PDF وتسجيله → قائمة التسليم → Resend → متابعة التسليم → التحقق العام**.

**حد فاصل مهم:** الواجهة الحالية للصفحات المجانية في GitHub ترسل إلى n8n Webhook؛ كما توجد بنية Apps Script جديدة قيد التهيئة. وجود مسارين لا يعني جواز تشغيل معالجَي إصدار متوازيين على السجل نفسه.

## 2. تاريخ الوثيقة والتغييرات

| الإصدار | التاريخ | الوصف | الحالة |
|---|---|---|---|
| v1.0 | 2026-10-18 | تأسيس المرجع التشغيلي من مراجعة Tech Radar SOP v2.1، سجلات Google Sheets الحية، GitHub، أكواد Apps Script المقدمة، ومسار n8n التاريخي المتداول | النسخة المرجعية الأولى |
| v1.1 | 2026-10-18 | اعتماد شواهد استقبال وتقييم وإصدار PDF وتسجيل تحقق وتسليم SMTP في n8n، واسترجاع 3 حالات ناجحة قديمة؛ تحديث واقع المصدر وحالات الإخفاق | تحقق وظيفي جزئي؛ ليس اعتمادًا شاملاً 24/24 |

**قاعدة التطوير:** تعديل SOP الحالي في المستودع بوصفه الوثيقة الجارية، وإضافة بند مؤرخ في سجل التغييرات؛ عند تغيير جوهري يرفع رقم الإصدار، ولا يُستبدل الدليل بنسخة مجهولة المصدر.

## 3. الغرض ومجال التطبيق

يشمل: تعريف الدورات المؤهلة، إعداد أسئلة الإجابة، استقبال الطلبات، التحقق من الموافقة، منع التكرار، التقييم، الرسوب والمحاولات اللاحقة، إصدار الشهادات، التخزين الآمن، التوثيق والتحقق، تسليم AR/FR، إدارة الأعطال والاسترجاع، مراقبة التشغيل، الأمن والخصوصية، إضافة الدورات الجديدة، وضبط التغييرات.

لا يشمل: الادعاء باعتماد أكاديمي خارجي، منح شهادة دون نجاح، الاشتراكات التسويقية العامة، الدورات المدفوعة مستقبلًا إلا بإلحاق معتمد، أو فتح ملفات PDF الخاصة للعامة.

## 4. المصطلحات

| المصطلح | المعنى التشغيلي |
|---|---|
| Training Registry | السجل المركزي المعتمد لهوية الدورة وبياناتها الأساسية |
| trainingId | معرّف منطقي ثابت للدورة؛ أساس الربط بين الموقع والتقييم والشهادة |
| Assessment Configuration | عدد الأسئلة، مفتاح الإجابات، حد النجاح، وتفعيل الاختبار |
| submissionId | معرّف فريد لكل محاولة تسليم؛ يمنع إعادة معالجة الطلب ذاته |
| certificateKey | مفتاح استحقاق مرتبط بالدورة وبريد المتدرب المطبّع؛ لا يجوز معاملته كمرادف دائم لمعرّف المحاولة |
| certificateId | المعرّف الداخلي الفريد للشهادة |
| verificationCode | رمز قابل للقراءة لإثبات صحة الشهادة دون كشف البيانات الخاصة |
| Issuance | إصدار شهادة ناجحة وتسجيلها وحفظ ملفها |
| Delivery | إرسال نسخة الشهادة؛ حالته مستقلة عن قرار النجاح والإصدار |
| Idempotency | تكرار تنفيذ الطلب ذاته لا ينتج شهادة إضافية أو إرسالًا إضافيًا |
| Recovery | استئناف من أول مرحلة لم تكتمل مع الحفاظ على أدلة المرحلة المنجزة |
| Baseline | الصف التاريخي الأخير المستبعد من مسار Apps Script الجديد قبل القطع الانتقالي |

## 5. المبادئ الحاكمة

1. **تعدد الدورات، محرك واحد:** لا ثوابت hard-coded مستقلة لكل دورة في خادم الاستقبال.
2. **مصدر معتمد لكل حقل:** تدريبId وبيانات الدورة من السجل المركزي؛ الإجابات وحد النجاح من إعداد التقييم؛ بيانات المتدرب من محاولته؛ رمز الشهادة من محرك الإصدار.
3. **الفصل بين النتيجة والبريد:** نجاح التقييم لا يتحول إلى رسوب إذا فشل PDF أو البريد.
4. **تقييم الخادم هو المرجع:** إجابات المتدرب هي المدخل؛ لا تُقبل درجة محسوبة في JavaScript المتصفح بوصفها دليل استحقاق.
5. **لا شهادة مزدوجة:** لكل استحقاق صالح شهادة واحدة فعالة، مع سياسة محاولات واضحة.
6. **الإرسال لا يعاد تخمينًا:** حالة النقل المجهولة تُراجع في Resend قبل إعادة الإرسال.
7. **المصادقة والتحقق العام لا يكشفان معلومات شخصية:** لا نشر للبريد أو الإجابات أو روابط Drive الداخلية.
8. **لا تعديل إنتاجي بلا اعتماد:** فصل وضعية التخطيط والاختبار عن تشغيل المتدربين الحقيقيين.

## 6. خريطة النظام A-to-Z

| الطبقة | المكوّن الحالي | المسؤولية | حالة التحقق |
|---|---|---|---|
| واجهة المتدرب | صفحات الاختبارات على consutrain.com، ملفات assets/js/free-certificate-training*.js | جمع بيانات المتدرب والإجابات وإرسالها | [متحقق] مراجعة GitHub |
| استقبال الإنتاج | n8n: ConsuTrain – Certificate Submission Collector | التطبيع، التحقق، منع التكرار الأولي، التسجيل في ConsuTrain Certificates Management | [متحقق] طلب 18 أكتوبر |
| معالجة الإصدار | n8n: ConsuTrain Certificate Queue Processor v2 | تقييم على الخادم، إصدار وتحديث سجل الشهادة | [متحقق] نجاح وإعادة معالجة 3 حالات |
| توليد وتسليم | n8n: ConsuTrain – Unified Certificate Delivery | HTML/PDF/Drive/Resend SMTP من training@consutrain.com | [متحقق] SMTP مقبول ومسجل؛ Delivered غير محسوم |
| تقييم Apps Script | CertificateProcessingEngineV2.gs | قراءة training-answer-keys وتقييم المحاولة | [متحقق] تجريبيًا |
| إصدار Apps Script | CertificateIssuanceEngineV2.gs | PDF عبر Cloudflare + Drive + سجلات | [متحقق] POC فقط؛ allowPocWrites=false |
| جسر التشغيل الجديد | CertificateAutomationBridgeV1.gs | فحص الطلبات الجديدة ثم الإصدار وقائمة الانتظار | [موجود/معطل] |
| قائمة إرسال جديدة | CertificateDeliveryIntegrationV1.gs | Queued → Attempting → Accepted/Hold/Unknown | [موجود/معطل] |
| إنشاء PDF الجديد | Worker consutrain-certificate-poc /generate.pdf | توليد PDF ثنائي اللغة بمفتاح خاص | [متحقق] في POC |
| الإرسال | Resend SMTP؛ from training@consutrain.com | بريد AR/FR بمرفق PDF | [متحقق] إرسال عملي AR/FR؛ إثبات الوصول للمستلمين الثلاثة غير متاح |
| سجل التحقق | Certificate_Verifications | سجل الشهادات Valid وغيرها | [متحقق] |
| واجهة التحقق | /certificate-verification.html + n8n Certificate Verification Lookup | إدخال رمز أو ?code=… | [متحقق] على الموقع |

**قرار معماري محدث v1.1:** المعالج الجاري اعتماده للشهادات الحقيقية هو n8n (Collector → Queue Processor v2 → Unified Certificate Delivery). تبقى إعدادات Apps Script الجديدة للإصدار والإرسال `false` ولا تُفعّل بالتوازي. يلزم إثبات استمرار الاستضافة 24/24 وسياسة الاسترجاع قبل منح اعتماد تشغيلي شامل.

## 7. سجل الدورات والإعدادات

**البيانات الحية في 18-10-2026:** ورقة training-answer-keys تحتوي خمسة معرّفات فعالة، تخدم ثماني نسخ لغوية بحسب ملفات الاختبار بالموقع:

| trainingId | اللغات المعروضة | الأسئلة | حد النجاح |
|---|---|---:|---:|
| kaizen-continuous-improvement | AR / FR | 20 | 14 |
| digital-transformation-intro | AR / FR | 12 | 9 |
| brand-customer-experience-basics | AR / FR | 20 | 14 |
| blue-ocean-strategy-fundamentals-ar | AR | 20 | 14 |
| blue-ocean-strategy-fundamentals-fr | FR | 20 | 14 |

الحقول الحالية في training-answer-keys: **trainingId, totalQuestions, passThreshold, answerKeyJson, isActive, notes**.

**[مطلوب] نموذج قابل للتوسع:** تعريف Training Registry منطقي واحد ببيانات: trainingId، العنوان AR/FR، اللغة/اللغات المسموحة، trainingCategory، learningType، certificateType، certificateEnabled، active، version، روابط الدرس/الاختبار، وقالب الشهادة. تبقى answerKeyJson وpassThreshold في جدول التقييم التابع؛ يمنع نسخ قيمها غير المتوافقة إلى شروط برمجية أخرى. لا ننشئ جدولًا جديدًا قبل قرار تصميم الحقول واعتماد الربط.

**ملاحظة:** Code.gs يحتوي قائمة CERTIFICATE_TRAININGS مقتصرة على معرّف قديم مختلف؛ لكن ملفات الموقع التي فُحصت ترسل إلى n8n webhook، وليس إلى doPost في Code.gs. لذلك لا يُعد تعديل Code.gs وحده حلًا لمسار الإنتاج الفعلي.

## 8. الخطوات القياسية لإضافة دورة جديدة

| # | الإجراء | المسؤول | دليل الإتمام |
|---|---|---|---|
| 1 | اعتماد عنوان الدورة واللغة والجمهور ووصفها ونوع الشهادة | CT-03 | موافقة المحتوى |
| 2 | تخصيص trainingId ثابت وغير مكرر | CT-03 / CT-05 | سجل الدورة |
| 3 | تسجيل Metadata للدورة دون منطق مخصص | CT-03 | Registry |
| 4 | تجهيز الأسئلة والإجابات الصحيحة واختبار عددها | CT-03 | answerKeyJson صالح |
| 5 | تسجيل totalQuestions وpassThreshold وisActive | CT-03 | Assessment Configuration |
| 6 | ربط الصفحة بنفس نقطة استقبال الشهادات الموحدة | CT-01 | payload مطابق للعقد |
| 7 | اختبار عقد البيانات ودرجة النجاح/الرسوب ومطابقة اللغة | CT-05 | اختبار قبول دورة جديدة |
| 8 | تفعيل الدورة وإثبات قابلية إصدار الشهادة والتحقق منها | CT-03 | سجل اعتماد |

**القاعدة:** إضافة دورة يجب ألا تستلزم إنشاء Workflow ن8ن جديد أو نسخة Apps Script جديدة أو مفتاح API جديد.

## 9. عقد بيانات طلب المتدرب

الحد الأدنى: **form_type (إذا كان المستقبل يتطلبه)، submissionId، trainingId، trainingTitle، language، name، email، answersJson، legalAcknowledgment**. حقول إضافية ممكنة: certificateKey، learningType، trainingCategory، country، organization، jobTitle، marketingConsent، submittedAt.

تحدد **نقطة الاستقبال المعتمدة** العقد النهائي؛ لا يُفرض form_type الخاص بـGoogle Apps Script Web App على صفحات تستخدم n8n ما لم يتقرر ترحيلها. يُطبّع email (trim/lowercase)، وتُتحقق صيغة JSON وعدد الإجابات والمعرّف واللغة وموافقة الشروط. marketingConsent منفصل تمامًا عن الإقرار القانوني؛ عدم الموافقة التسويقية لا يمنع إكمال التدريب.

## 10. سجل Google Sheets الرسمي

الملف التشغيلي الذي تمت قراءته مباشرة: **ConsuTrain Certificates Management**؛ المعرّف **1YB2yqAAMtIwrbfT9y3LJVoE5JATxcKZ1L_MnPGpAU0M**.

| التبويب | دوره | وضعه في 18-10-2026 |
|---|---|---|
| certificate-submissions | سجل المحاولات والنتائج والإصدار | 5 صفوف بيانات قديمة/POC قبل الصف 6 |
| training-answer-keys | إعدادات التقييم النشطة | 5 معرّفات فعالة |
| Certificate_Verifications | سجل التحقق الرسمي | يحوي شهادات تاريخية وشهادة POC |
| Certificate_Delivery_Queue | انتظار ومتابعة إرسال Resend الجديد | موجود وفارغ بعد إنشاء العناوين |

أعمدة certificate-submissions المحورية: submittedAt، name، email، trainingId، language، trainingTitle، answersJson، score، totalQuestions، percentage، result، submissionId، certificateKey، processingStatus، legalAcknowledgment، certificateId، certificateIssuedAt، certificateFileUrl، emailStatus، gmailMessageId (تاريخي)، emailSentAt، errorMessage، verificationCode، verificationUrl.

أعمدة Certificate_Verifications: verificationCode، certificateId، verificationStatus، holderName، trainingId، trainingTitle، language، issuedAt، submissionId، createdAt.

أعمدة Certificate_Delivery_Queue الحالية: submissionId، certificateId، verificationCode، recipient، language، certificateFileId، status، queuedAt، attemptedAt، resendEmailId، lastHttpStatus، lastError، updatedAt.

**تنبيه تعارض تاريخي:** وثيقة CERTIFICATE-SYSTEM.md في GitHub (5 سبتمبر 2026) تذكر ملفًا آخر باسم ConsuTrain Consultation Requests. جرى لاحقًا تصحيح ربط Workflow التحقق إلى ConsuTrain Certificates Management. يجب فحص مصادر القراءة/الكتابة لمساري Collector وQueue Processor قبل القطع، ولا تُعتبر الوثيقة القديمة مصدرًا أدق من الإعداد الفعلي الحالي.

## 11. سياسة معرفات الشهادات ومفاتيح المنع

- submissionId: معرف فريد لكل محاولة، ثابت خلال إعادة إرسال الطلب نفسه.
- certificateKey: حارس الاستحقاق، حاليًا غالبًا trainingId + '-' + normalized email. **[مطلوب]** تحديد سياسة واضحة لإعادة المحاولة بعد الرسوب دون اعتبار جميع المحاولات «شهادات مكررة».
- certificateId: يُولَّد مرة واحدة ولا يُستبدل بعد الإصدار.
- verificationCode: رمز فريد مستقل، صيغة CT-YY-XXXX-XXXX-XXXX في السجلات السابقة؛ يُحفظ مرة واحدة في سجل التحقق.
- resendEmailId: دليل قبول محاولة البريد من Resend، وليس معرف شهادة.
- uniqueness: التحقق من تعارض المعرفات في submissions وVerifications، ومن وجود PDF مطابق قبل إنشاء جديد.

## 12. دورة الحالات التشغيلية

**أ. النتيجة الأكاديمية (result)**: pending → passed أو failed. الرسوب أكاديمي فقط إذا كان score أقل من passThreshold؛ إخفاق الإرسال/التخزين لا يغيّر هذه النتيجة.

**ب. معالجة الإصدار (processingStatus) — النموذج المستهدف:** Pending → Processing → Issued؛ وعدم الاستحقاق → Completed / Not Eligible أو ما يعادله بحقل مستقل. بعض الحالات القديمة مثل Sent وFailed وCompleted تخص المعالج التاريخي ويجب تفسيرها بحسب سجل منشئها، لا إعادة كتابتها تلقائيًا.

**ج. حالة التسليم الجديدة في Queue:** Queued → Attempting → Accepted؛ وعند الالتباس Unknown، وعند الرد غير المؤكد/المرفوض Hold. **Accepted ≠ Delivered**. حالات Delivered/Bounced/Complained/Failed تحتاج تكامل أحداث Resend وإجراء تصالح؛ **[مطلوب]**.

**د. التحقق:** Pending قبل إتمام التسجيل؛ Valid بعد اكتمال الإصدار؛ Revoked عند قرار إبطال موثق، إن أصبح إجراء الإبطال مفعلًا.

**حالة معروفة:** توجد صفوف تاريخية بنتيجة score ناجحة لكن result=failed وprocessingStatus=Failed بسبب فشل تسليم البريد في المسار القديم؛ يجب ألا تُصنّف هذه تلقائيًا على أنها رسوب أكاديمي ولا تعالج تلقائيًا ضمن النظام الجديد.

## 13. المسار التشغيلي التفصيلي

### 13.1 استقبال الطلب
1. ترسل صفحة التدريب المحاولة إلى نقطة استقبال واحدة مع trainingId وlanguage وanswersJson وهوية الطلب.
2. يتحقق Collector من بنية البيانات والموافقة والحدود ومفتاح التكرار.
3. يطبّع البيانات ويحفظها في certificate-submissions، أو يعيد Duplicate/Rejected دون مضاعفة السجل.
4. يعيد إقرارًا مناسبًا للمتدرب لا يدعي أن الشهادة أُرسلت بالفعل.

### 13.2 تقييم الاستحقاق
1. يقرأ محرك التقييم trainingId من السجل المعتمد ويتأكد isActive.
2. يجلب answerKeyJson، totalQuestions، passThreshold للنسخة المعتمدة.
3. يقارن إجابات المتدرب بالمفتاح على الخادم.
4. يسجل score وtotalQuestions وpercentage وresult.
5. عند الرسوب: يحفظ النتيجة والتاريخ والحالة النهائية بلا إصدار PDF أو بريد شهادة، مع تطبيق سياسة إعادة المحاولة.
6. عند خطأ تحقق/بيانات: يسجل Error منفصلًا ولا يعامل المتدرب كراسب.

### 13.3 إصدار الشهادة
1. تحت قفل متحكم به، يتحقق المحرك من عدم إصدار شهادة سابقة لنفس الاستحقاق.
2. ينشئ أو يسترجع certificateId وverificationCode وissuedAt بصورة ثابتة.
3. ينشئ verificationUrl اعتمادًا على صفحة الموقع.
4. يولّد PDF بالعربية/الفرنسية عبر Cloudflare Worker وبقالب يحمل اسم المتدرب وعنوان التدريب والتاريخ والمعرف ورمز التحقق ورابطًا قابلًا للنقر.
5. يحفظ الملف في Google Drive خاص، ثم يتحقق من وجوده ونوعه وحجمه واسم ملفه.
6. يسجل البيانات في certificate-submissions وCertificate_Verifications، ولا يجعل verificationStatus=Valid إلا عند اكتمال شروط التسجيل.
7. لا يُعاد إنشاء شهادة جديدة بسبب مشكلة بريد لاحقة.

### 13.4 إدراج الشهادة في قائمة التسليم
1. بعد نجاح الإصدار والتسجيل، تؤكَّد Valid وتطابق certificateId / verificationCode / submissionId.
2. تضاف خانة واحدة للحالة Queued إلى Certificate_Delivery_Queue مع fileId وrecipient وlanguage.
3. إذا كانت موجودة بنفس submissionId فلا تضاف مرة ثانية.
4. لا تُقرأ الصفوف التاريخية تلقائيًا دون سياسة معالجة خاصة.

### 13.5 الإرسال
1. يتحقق عامل التسليم من تفعيل الخاصية الإنتاجية ووجود مفتاح Resend.
2. يفحص تطابق بيانات Queue مع سجلات الإصدار والتحقق ويقرأ PDF الأصلي من Drive.
3. يبني رسالة AR/FR؛ From = ConsuTrain Training <training@consutrain.com>.
4. يكتب Attempting قبل الاتصال الخارجي.
5. إذا عاد HTTP 2xx ومعرف رسالة Resend، يسجل Accepted + resendEmailId.
6. عند خطأ نقل مجهول ينتقل إلى Unknown؛ وعند عدم تأكد النتيجة ينتقل إلى Hold.
7. لا يعيد الإرسال تلقائيًا من Unknown أو Hold قبل المطابقة.
8. **[مطلوب]** Webhook أو آلية مزامنة لتحديث Delivered/Bounced/Complained.

### 13.6 التحقق العام
1. تفتح الجهة صفحة https://consutrain.com/certificate-verification.html.
2. يمكنها إدخال verificationCode يدويًا عند وجود صورة/نسخة مطبوعة، أو الضغط على رابط PDF الذي يمرر ?code=.
3. يُستدعى https://hooks.consutrain.com/webhook/consutrain-certificate-verification.
4. تظهر حالة Valid أو غير صالحة/غير موجودة/ملغاة دون كشف البريد أو الإجابات أو رابط Drive الداخلي.
5. رابط التحقق العام موجود أيضًا في Footer الموقع AR/FR.

## 14. قوالب الرسائل الرسمية

**العربية، موضوع:** ConsuTrain — شهادتك التدريبية

السلام عليكم ورحمة الله وبركاته،

يسر منصة ConsuTrain تهنئتكم بإتمام متطلبات التدريب بنجاح.

نرفق لكم شهادة التدريب بصيغة PDF، ويمكنكم التحقق من صحتها في أي وقت بالضغط على رابط التحقق المدرج داخل الشهادة.

كما يمكنكم التحقق يدويًا عبر صفحة التحقق من الشهادات في موقع ConsuTrain، بإدخال رمز التحقق المدون على الشهادة.

نتمنى لكم دوام التوفيق والنجاح في مسيرتكم المهنية.

مع خالص التحية والتقدير، فريق التدريب — ConsuTrain.

**Français, objet :** ConsuTrain — Votre attestation de formation

Bonjour,

L’équipe ConsuTrain vous félicite pour la réussite de votre formation.

Vous trouverez en pièce jointe votre attestation de formation au format PDF. Vous pouvez en vérifier l’authenticité à tout moment en cliquant sur le lien de vérification intégré à l’attestation.

Vous pouvez également consulter la page de vérification des attestations sur ConsuTrain et saisir le code indiqué sur l’attestation.

Nous vous souhaitons pleine réussite dans vos projets professionnels.

Cordialement, L’équipe formation — ConsuTrain.

**قواعد الرسالة:** اسم وعنوان الدورة ولغة الرسالة من السجل المعتمد؛ PDF مرفق؛ رمز التحقق ظاهر؛ رابط الصفحة العامة قابل للنقر. لا تستخدم رسالة «تم التسليم» لمجرد Accepted.

## 15. سجل Workflows والعناصر المساندة

| الاسم | نوعه | الاستخدام |
|---|---|---|
| ConsuTrain – Certificate Submission Collector | n8n | استقبال الطلبات الإنتاجي الحالي من موقع الويب |
| ConsuTrain Certificate Queue Processor v2 | n8n | المعالج التشغيلي المختار للتقييم والإصدار؛ تحقق 18 أكتوبر |
| ConsuTrain – Unified Certificate Delivery | n8n | توليد PDF في Drive وإرسال AR/FR عبر Resend SMTP؛ Gmail مفصول |
| ConsuTrain – Certificate Verification Lookup | n8n | فحص الرمز العام؛ يعمل |
| ConsuTrain – Admin Certificate Resend API | n8n | إدارة إعادة إرسال، نطاق صلاحياته وارتباطه بالمسار الجديد بحاجة مطابقة |
| ConsuTrain – Admin Certificates List API | n8n | إدارة قائمة الشهادات، بحاجة مطابقة |
| CertificateProcessingEngineV2.gs | Apps Script | تقييم موحد |
| CertificateIssuanceEngineV2.gs | Apps Script | إصدار POC مع gate مغلق |
| CertificateAutomationBridgeV1.gs | Apps Script | معالجة صفوف جديدة بعد Baseline؛ gate مغلق |
| CertificateDeliveryIntegrationV1.gs | Apps Script | Queue وتسليم Resend؛ gate مغلق |
| CertificateEmailDeliveryV1.gs | Apps Script | اختبارات البريد؛ لا يُستدعى إنتاجيًا |
| CertificateIssuanceEngineV1.gs | Apps Script | Dry Run تاريخي؛ لا يُستدعى إنتاجيًا |

**لا تُحذف مسارات الإدارة ولا ملفات Apps Script القديمة قبل فحص الاعتماديات.** نُشر مسار n8n المحدث، وأثبت عمله على حالات فعلية، لكن لا تُفعّل آليات Apps Script البديلة ولا تُعلن ضمانة 24/24 دون إثبات الاستضافة المستمرة.

## 16. إعدادات التشغيل والمشغلات

| العنصر | الوضع المتحقق بتاريخ الإصدار |
|---|---|
| CT_AUTO_START_ROW | 6، آخر صف تاريخي |
| CT_AUTO_ISSUANCE_ENABLED | false |
| CT_CERT_DELIVERY_ENABLED | false |
| CT_ISSUANCE_V2.allowPocWrites | false |
| RESEND_CERTIFICATES_API_KEY | محفوظ في Script Properties، لا يُعرض |
| CLOUDFLARE_CERTIFICATE_POC_KEY | محفوظ في Script Properties، لا يُعرض |
| ctAutoRunNewSubmissionsV1 | Time-driven، كل 5 دقائق، أنشئ |
| ctDeliveryProcessNextV1 | Time-driven، كل 5 دقائق، أنشئ |
| ctAutoPreflightV1 | أظهر baseline=6، newRows=0، readyForApproval=true؛ فحص تقني محدود |

**لا يعادل readyForApproval=true تفويض إطلاق:** ما دام التحويل من n8n إلى Apps Script وتفسير حالات الفشل غير محسومين، يبقى المفتاحان false.

**حدّ تشغيل n8n:** إذا كان محليًا على حاسوب Windows، فإن إيقاف الجهاز قد يوقف Webhooks والجدولة. يلزم توثيق خطة الاستضافة/التوفر قبل الوعد بالتشغيل المستمر.

## 17. الاسترجاع وإعادة المحاولة

| العَرَض | التشخيص أولًا | المعالجة المعتمدة |
|---|---|---|
| الطلب غير موجود | هل وصل Webhook؟ هل سجل Collector؟ | إصلاح الاستقبال، لا إصدار يدوي قبل إثبات الاستحقاق |
| سجل مكرر | مقارنة submissionId وcertificateKey | رد Duplicate؛ لا إنشاء شهادة إضافية |
| طلب Pending طويل | تقييم مكتمل؟ جهة إصدار نشطة؟ | بدء الاسترجاع من أول خطوة ناقصة دون محو الأدلة |
| درجة ناجحة مع failed تاريخية | فحص score وemailStatus وerrorMessage | تصنيفها كفشل تقني محتمل، لا رسوب آلي |
| فشل PDF | تحقق من Cloudflare وDrive والقالب | إعادة خطوة PDF إذا لم يوجد ملف صالح بالفعل |
| تحقق Valid لا يظهر | تطابق verificationCode والسجل وn8n Lookup | إصلاح الربط دون تغيير المعرف الأصلي |
| بريد Accepted دون وصول | Resend Logs/Events، بريد المستلم، Bounces | تحديث الحالة الفعلية، دون افتراض Delivered |
| Unknown / Hold | مطابقة Resend Email ID والزمن والعنوان | لا إعادة إرسال تلقائيًا قبل قرار موثق |
| رسوب فعلي | مقارنة score بالحد المعتمد | تخزين failed أكاديميًا، دون إصدار شهادة |
| اختلاف trainingId | مقارنة موقع الويب وRegistry وKeys | تصحيح مصدر التسمية، عدم إنشاء ID بديل عشوائي |
| n8n متوقف | حالة خدمة n8n والشبكة والطاقة | استعادة الخدمة وإعادة استقبال/معالجة مضبوطة |

**قاعدة مهمة:** لا يُعاد تشغيل السلسلة كاملة عند خطأ في آخر خطوة؛ استرجع من مرحلة الخطأ بعد إثبات المرحلة السابقة.

## 18. منع التكرار والأخطاء الحرجة

1. تأمين Collector ضد طلبات إعادة الإرسال السريعة قبل Append.
2. التحقق من uniqueness في Google Sheets وCertificate_Verifications قبل الإصدار.
3. الاحتفاظ بنفس certificateId وverificationCode عند استئناف إصدار غير مكتمل.
4. منع محركَي n8n وApps Script من إصدار شهادة للطلب ذاته.
5. منع Trigger من إعادة إرسال Queued سبق نقلها إلى Attempting أو Accepted.
6. فحص التعارض بين الاستحقاق والمحاولات الفاشلة الفعلية؛ لا يجوز أن تمنع أخطاء البريد المتدرب من حقه في الشهادة.
7. لا يُعاد تشغيل ctAutoInitializeBaselineV1؛ لا يتم تعديل baseline=6 بلا خطة انتقال.
8. لا يُعتمد ترتيب الصفوف أساسًا دائمًا للأمان: **[مطلوب]** الانتقال لاحقًا إلى حد أدنى ثابت من تاريخ/معرف الإنشاء أو سجل معالجة لحماية النظام من الفرز/إدراج صفوف.

## 19. الأمان وحماية البيانات

- يحتفظ Google Sheets ببيانات المتدرب والإجابات الخاصة؛ المشاركة بأقل الصلاحيات.
- يبقى مجلد Drive الخاص بالشهادات Restricted؛ لا يُجعل Public من أجل إرسال المرفق.
- مفاتيح Resend وCloudflare توضع في Script Properties/Secrets، ولا تدخل GitHub أو الكود أو الصور.
- مفتاح منفصل لإرسال شهادات Resend عن مفتاح المشتركين.
- منع CSV/Formula Injection في إدخال بيانات المستخدم إلى Sheets.
- حدود للمدخلات وتحقق لغوي/نوعي لمنع إساءة الاستخدام.
- نموذج الشهادة لا يدعي اعتمادًا أكاديميًا أو مهنيًا خارجيًا لم يُمنح.
- أي إبطال شهادة يحتاج قرارًا مفوضًا وسببًا وسجل تدقيق.
- استبقاء البيانات وحق الحذف والصلاحيات خاضع لسياسة الخصوصية المعتمدة؛ **[مطلوب]** جدول احتفاظ رسمي إذا لم يكن معتمدًا.

## 20. المسؤوليات RACI مبسطة

| النشاط | CT-03 محتوى | CT-05 أتمتة | CT-01 موقع | نظام آلي |
|---|---|---|---|---|
| اعتماد دورة وإجاباتها وحد نجاحها | A/R | C | I | — |
| إنشاء صفحة الاختبار وإرسال Payload | C | C | A/R | — |
| ضبط استقبال/تقييم/إصدار/تسليم | C | A/R | C | R عند التشغيل |
| اعتماد قالب وشكل الشهادة AR/FR | A | R تقنيًا | C | — |
| معالجة Unknown وحالات التسليم المتعارضة | I | A/R | — | تسجيل فقط |
| مراجعة قبول الإنتاج | A | R | C | — |
| التحقق العام وFooter | C | R للواجهة الخلفية | A/R للواجهة | R |

A = يعتمد/مسؤول نهائيًا؛ R = ينفذ؛ C = يُستشار؛ I = يُبلّغ.

## 21. مؤشرات الأداء KPIs

| المؤشر | الصيغة أو قاعدة القراءة | وضع الهدف |
|---|---|---|
| نسبة نجاح استقبال الطلبات | الطلبات المقبولة / الطلبات الصحيحة | يُعتمد هدف بعد Baseline |
| دقة التقييم | نتائج اختبار الحالات المرجعية الصحيحة / الحالات المختبرة | مستهدف جودة 100% |
| نسبة إصدار الشهادات للمستحقين | Issued / Passed Eligible | هدف مقترح، لا قيمة مرصودة |
| معدل إصدار الشهادات المكررة | شهادات إضافية لذات الاستحقاق | **0** إلزامي |
| معدل الإرسال المكرر | إرسالان تلقائيان للطلب نفسه | **0** إلزامي |
| معدل التسليم | Delivered / Accepted بعد أحداث Resend | غير متاح كاملًا قبل مزامنة Events |
| متوسط زمن شهادة ناجحة | Submitted → Issued وSubmitted → Delivered | يُقاس بعد التشغيل |
| الطلبات العالقة | Pending/Processing/Unknown/Hold حسب العمر | متابعة يومية |
| سلامة التحقق | عينات Valid/Not Found/Revoked | مراجعة دورية |
| جاهزية التشغيل | نسبة فترات توافر Collector وn8n والأدوات | يتطلب خطة استضافة |

## 22. مراقبة دورية

- يوميًا عند الإنتاج: صفوف Pending/Processing غير المعتادة، Queue Unknown/Hold، رسائل Resend Bounced، وصحة n8n.
- أسبوعيًا: تعارض عدد Passed/Issued/Valid/Accepted، ومراجعة الملفات غير المسجلة والتكرارات.
- شهريًا: صلاحيات Google Sheets/Drive/API، حجم السجلات، استهلاك Resend/Cloudflare، جودة قوالب AR/FR.
- عند إضافة دورة: مطابقة trainingId والمفتاح واللغة وحد النجاح وصفحة الاختبار قبل نشرها.

## 23. قوائم التحقق

### 23.1 قبل إضافة دورة
- [ ] معرف فريد، عنوان معتمد لكل لغة.
- [ ] عدد الأسئلة ومفتاح الإجابات وحد النجاح متطابق.
- [ ] الدورة active وcertificateEnabled على نحو صريح.
- [ ] Payload يستخدم المدخل العام ولا يحتوي منطق إصدار في المتصفح.
- [ ] لا Workflow خاص بالدورة.

### 23.2 قبل تشغيل إصدار Production
- [ ] تم حسم المالك الوحيد لعملية الإصدار (n8n أم Apps Script) وتعطيل التنافس.
- [ ] تم تأكيد ورقة Collector الإنتاجية الفعلية وارتباطها بملف Certificates Management.
- [ ] تم توثيق التقييم والرسوب الفعليين وعدم الكتابة بنتيجة failed عند فشل البريد.
- [ ] استرداد Processing المنقطع، وإعادة المحاولة دون تكرار.
- [ ] سياسة إعادة المحاولة بعد الرسوب محددة، وإخفاقات البريد القديمة لا تعامل كرسوب.
- [ ] مصادر Training Registry وanswerKey موحدة.
- [ ] قوالب PDF AR/FR وجودة عرضها ورابط التحقق سليمة.
- [ ] مسار ن8ن المحلي موثوق الوصول إلى Webhooks عند الحاجة.
- [ ] اختبار قبول شامل جديد واحد، يشمل نجاحًا ورسوبًا منطقيًا وإرسالًا واحدًا وتحققًا.
- [ ] موافقة مسؤول النظام على تغيير مفاتيح التفعيل وإعادة توجيه المسارات.

### 23.3 قبل تعديل Workflow أو Apps Script
- [ ] قراءة آخر نسخة حقيقية وإثبات مسار الاستخدام الحالي.
- [ ] حفظ نسخة استرجاع/commit مطابق.
- [ ] تحديد الملف/العقدة المتأثرة فقط وعدم استبدال مصدر مشترك بنسخة قديمة.
- [ ] تحديد أثر التغيير على النتيجة/التحقق/التسليم/اللغتين.
- [ ] تحديث سجل التغييرات وSOP بعد نجاح التحقق.

### 23.4 بعد التفعيل
- [ ] أول طلب حقيقي جديد أُسند لمعالج واحد فقط.
- [ ] شهادة واحدة وVerification Valid واحد.
- [ ] PDF خاص يفتح مع رابط صالح، حتى إذا انتقل كصورة بقي الرمز صالحًا.
- [ ] رسالة واحدة مع مرفق، وتوافق حالة Resend مع الواقع.
- [ ] لا تغيّر في أي صف تاريخي أو شهادات قائمة.
- [ ] سجل واضح للحوادث وطريقة استرجاعها.

## 24. شروط قبول الإنتاج Production Verified

لا يُمنح هذا الوسم للإصدار الجديد إلا بوجود أدلة: 1) جهة استقبال واحدة؛ 2) توافق إعدادات الدورات الحالية وإضافة دورة جديدة بالبيانات؛ 3) درجة صحيحة ورفض شهادة غير مستحقة؛ 4) إصدار دون ازدواجية، PDF محفوظ وسجل Valid صحيح؛ 5) تسليم AR/FR موثق ورسالة واحدة؛ 6) ربط Delivered أو توثيق واضح لحالة Accepted مع مخاطرها؛ 7) استرجاع معروف عند التعطل؛ 8) عدم تغيير السجلات القديمة؛ 9) عدم كشف الأسرار؛ 10) قرار اعتماد إنتاجي صريح.

**النتيجة المحدثة في 18-10-2026:** تم التحقق من إصدار وإرسال شهادة اختبار جديدة، ثم استعادة 3 محاولات ناجحة قديمة وإصدار الشهادات وتسجيلها؛ لا تُعد هذه الأدلة وحدها تحققًا من استمرارية 24/24 أو تسليم الرسائل الفعلي لصناديق بريد المستفيدين.

## 25. حالة المشروع الفعلية عند تأسيس SOP v1.0

| العنصر | الحكم |
|---|---|
| قراءة 5 مفاتيح تقييم نشطة، تغطي 8 واجهات لغوية | [متحقق] |
| Apps Script تقييم + PDF AR/FR + Drive + تسجيل + رمز | [متحقق] POC |
| PDF التجريبي أُرسل فعليًا إلى Gmail من training@consutrain.com | [متحقق] |
| رابط PDF إلى صفحة التحقق وإثبات Valid | [متحقق] |
| رابط التحقق في Footer AR/FR | [متحقق] من إفادة إنجاز CT-03 |
| قائمة إرسال Certificate_Delivery_Queue | [موجود/معطل]، فارغة |
| مشغّلا Apps Script كل 5 دقائق | [موجود/معطل] بخصائص false |
| CT_AUTO_START_ROW=6 | [متحقق] |
| معالج إنتاجي واحد بين n8n وApps Script | [مطلوب] قرار وتحويل |
| إنهاء حالة الرسوب واسترجاع أخطاء البريد القديمة | [مطلوب] |
| مزامنة Delivered/Bounced من Resend | [مطلوب] |
| مصدر Metadata موحد لكل دورة | [مطلوب] |
| ضمان عمل n8n باستمرار إذا بقي المحلي | [مطلوب] |

## 25A. نتائج التشغيل والاسترجاع المؤكدة — تحديث v1.1

**تغيير محقق بتاريخ 18-10-2026:** جرى تحديث مصادر Google Sheets في Collector وQueue Processor إلى ملف `ConsuTrain Certificates Management`، مع الحفاظ على `training-answer-keys` و`Certificate_Verifications`. نُشرت مسارات n8n الثلاثة، واستُبدلت عقدة إرسال Gmail في Unified Certificate Delivery بعقدة Send an Email مع Resend SMTP، دون تشغيل مرسلين متوازيين. يحافظ مسار أخطاء التسليم على `result=passed` إن كان المتدرب ناجحًا.

**اختبار القبول الأساسي:** `blue-ocean-strategy-fundamentals-ar-1792310136352-e96196`، درجة 20/20، شهادة `CT-AR-BO-20261018-6352E96196`، رمز `CT-26-1363-52E9-6196`، حالة السجل `Sent` والتحقق `Valid`. أكد صاحب المشروع وصول الرسالة وفعالية رابط التحقق. عولجت مشكلتا صلاحية Sheets وOAuth Google Drive، واستُخدم الطلب نفسه في الاسترجاع دون إنشاء طلب جديد.

**استرجاع ثلاث محاولات تاريخية:** تمت إعادة مقارنة الإجابات الأصلية بمفاتيح التصحيح، والتأكد من النجاح وعدم وجود شهادات سابقة لنفس المحاولات، وإعادة `emailStatus` و`processingStatus` إلى `Pending` مع تصحيح `result=passed`؛ ثم عالجها Queue Processor v2 وأصدر وأرسل كل واحدة:
 
| الصف | trainingId / اللغة | الدرجة | certificateId | verificationCode | الحالة |
|---|---|---:|---|---|---|
| 3 | kaizen-continuous-improvement / FR | 19/20 | CT-FR-KZ-20261018-1369RPSUSK | CT-26-7113-69RP-SUSK | Sent / Valid |
| 4 | kaizen-continuous-improvement / FR | 20/20 | CT-FR-KZ-20261018-4457R1JWWU | CT-26-0344-57R1-JWWU | Sent / Valid |
| 5 | digital-transformation-intro / AR | 12/12 | CT-AR-DT-20261018-8049S29JLR | CT-26-9180-49S2-9JLR | Sent / Valid |

تمت مطابقة الصفوف مع `Certificate_Verifications`، وتأكيد وجود معرّفات SMTP، وتنظيف رسائل `Certificate delivery failed.` القديمة من `errorMessage` في الصفوف 3–5 فقط. لم تُعد كتابة المحاولات أو تعديل الإجابات الأصلية.

**حدود الإثبات:** `emailStatus=Sent` في مسار SMTP تعني قبول خادم البريد حسب نتيجة العقدة، وليست إثبات `Delivered` للمستلمين الثلاثة. لا تُجرى إعادة إرسال تلقائية لهذه الشهادات دون فحص سجلات Resend لتجنب التكرار.

**مسائل لم تُغلق بعد:** مراجعة موثوقية تشغيل n8n دون الحاسوب 24/24؛ مزامنة Resend Delivered/Bounced؛ إصلاح سياسة محاولات الرسوب/الفشل بصورة عامة؛ منع التكرار في سجل التحقق؛ قابلية إضافة مئات الدورات عبر Registry؛ وضبط `errorMessage` تلقائيًا عند التحول من `Failed` إلى `Sent` بدل التنظيف اليدوي. تبقى `CT_AUTO_ISSUANCE_ENABLED=false` و`CT_CERT_DELIVERY_ENABLED=false` في Apps Script.

## 26. سجل القرارات والفجوات المفتوحة

| ID | القرار أو الفجوة | الأولوية | قاعدة عدم التسرع |
|---|---|---|---|
| D-01 | اعتماد n8n كمُصدر للشهادات الحقيقية، مع إبقاء Apps Script الجديد معطّلًا | **قرار منجز مع وجوب الحفاظ على العزل** | لا تشغيل متوازٍ |
| D-02 | توحيد Collector وProcessor على ConsuTrain Certificates Management | **متحقق عمليًا** | لا إعادة بيانات تاريخية |
| D-03 | سياسة الرسوب وإعادة محاولة المتدرب | **مانع للإطلاق** | لا اعتبار خطأ البريد رسوبًا |
| D-04 | استرجاع Processing من دون شهادة مزدوجة | **مانع للإطلاق** | لا إعادة تنفيذ شاملة غير مشروطة |
| D-05 | توحيد Registry/Metadata مع answer keys | **عالٍ** | لا شرط ثابت لكل دورة |
| D-06 | تسوية Accepted مع Delivered/Bounced | **عالٍ** | لا ادعاء تسليم دون دليل |
| D-07 | معالجة اعتمادية n8n المحلي | **عالٍ** | لا وعد بإرسال 24/7 دون استضافة |
| D-08 | ضبط تخطيط PDF في صفحة مناسبة للنشر العام | **تحسين جودة مطلوب** | لا تعميم نجاح POC الشكلي |
| D-09 | مراجعة واجهات Admin Resend/List مع قائمة Resend الجديدة | **عالٍ** | لا استخدام مفتاح/سجل قديم دون مطابقة |

## 27. إجراء إدارة تغيير SOP

1. يسجل طلب التغيير: رقم، سبب، عنصر متأثر، أثر AR/FR والأمن والسجلات والتوافق.
2. يراجع صاحب العملية أحدث نسخة SOP والحالة الإنتاجية الفعلية قبل تقديم الحل.
3. يقرّر: إصلاح موضعي، تطوير معماري، أو لا تغيير.
4. ينفذ التعديل على نسخة حديثة فقط مع إمكانية الرجوع.
5. يثبت نجاح التغيير بالدليل المطلوب، ولا يكرر اختبارات مستقلة لا صلة لها بالتعديل.
6. يحدث نص SOP في نفس المصدر ويضيف سجل إصدار مؤرخ، مع تحديث الروابط/الحقول/الحالات.
7. لا يوصف شيء بـProduction Verified دون شروط الفصل 24.

**قاعدة المحادثات الجديدة:** ابدأ دائمًا بقراءة هذه الوثيقة من GitHub، ثم التحقق من أحدث الحالة الفعلية في Sheets وGitHub وn8n عند الحاجة؛ لا تطلب من المستخدم إعادة مشاركة ملفات سبق إثباتها إلا إذا كان محتواها الحالي غير متاح ولا يمكن استنتاجه بأمان.

## 28. المراجع والأنظمة

- مرجع أسلوب الوثائق: ConsuTrain Tech Radar SOP v2.1 AR (استلهمت منه الحوكمة والهيكلة فقط).
- Google Sheets: ConsuTrain Certificates Management.
- GitHub: beauhope/consutrain-MVP، CERTIFICATE-SYSTEM.md (مرجع تاريخي مؤرخ)، ملفات assets/js/free-certificate-training*.js، وصفحة certificate-verification.html.
- Google Apps Script: CertificateProcessingEngineV2، CertificateIssuanceEngineV2، CertificateAutomationBridgeV1، CertificateDeliveryIntegrationV1، Code.gs، والملفات الاختبارية.
- n8n: Certificate Submission Collector؛ Certificate Queue Processor v2؛ Unified Certificate Delivery؛ Certificate Verification Lookup؛ وواجهتا Admin.
- Cloudflare: consutrain-certificate-poc Worker وGitHub Pages للعرض العام.
- Resend: نطاق consutrain.com Verified ورسائل training@consutrain.com.
- Google Drive: مجلد الشهادات الخاص الذي يستخدمه الإصدار التجريبي.

## 29. النماذج والسجلات المعتمدة

1. Training Registry / Training Answer Keys (بيانات المحتوى والتقييم).
2. Certificate Submissions (المحاولة والنتيجة).
3. Certificate Verifications (المرجع الرسمي للأصالة).
4. Certificate Delivery Queue (محاولات التسليم الجديدة).
5. Resend Logs / Events (إثبات القبول والتسليم أو الفشل).
6. Operational Incident Log **[مطلوب]** (الحادث، السبب، قرار الاسترجاع، النتيجة).
7. SOP Change Log (إصدارات الوثيقة).

## 30. الخلاصة التشغيلية

**دورة واحدة أو مئات الدورات → سجل تعريفي موحد + مفتاح تقييم خاص بالدورة → استقبال واحد → تقييم واحد → إصدار واحد → تسليم واحد → تحقق واحد.**

**المسار الجاري للشهادات الحقيقية هو n8n الثلاثي**، وقد أُثبتت وظيفته عمليًا في أكتوبر 2026. وتبقى **آليات التقييم/الإصدار/التسليم البديلة في Apps Script غير مفعّلة إنتاجيًا** منعًا للتنافس، مع استمرار مراجعة ضمان 24/24 وتسوية حالات Delivered/Bounced والحوكمة؛ لا يعني نجاح حالات الاختبار اعتمادًا شاملاً غير مشروط.