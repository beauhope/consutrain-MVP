# ConsuTrain Certificate System – Production Status

آخر تحقق إنتاجي: 5 سبتمبر 2026

## 1. الحالة العامة

منظومة إصدار شهادات ConsuTrain والتحقق منها مكتملة ومختبرة من البداية إلى النهاية على Production.

المسار المعتمد:

```text
Assessment
→ Certificate Submission
→ Assessment Validation
→ Certificate Generation
→ PDF Generation
→ Email Delivery
→ Registration
→ Verification Code
→ Verification URL
→ Public Verification Page
→ Verification API
→ Validity Result
```

الحالة: **Production Ready / Verified End-to-End**.

## 2. Workflows المعتمدة في n8n

### ConsuTrain – Certificate Submission Collector

- الدور: استقبال طلبات الاختبار/الشهادة والتحقق الأولي منها.
- الحالة: **Published**.

### ConsuTrain Certificate Queue Processor v2

- الدور: معالجة الطلب، وتقييم الاختبار، وتجهيز بيانات الشهادة، وإنشاء `certificateId` و`verificationCode` و`verificationUrl`، ثم استدعاء Unified Certificate Delivery وتحديث السجلات.
- الحالة: **Published**.

### ConsuTrain – Unified Certificate Delivery

- الدور: التحقق من مدخلات الشهادة، وقراءة قالب الشهادة، ودمج البيانات، وإنشاء HTML، وتحويله إلى PDF، ورفع PDF، وإرسال البريد الإلكتروني.
- الحالة: **Published**.

### ConsuTrain – Certificate Verification Lookup

- الدور: API عام للتحقق من الشهادة باستخدام `verificationCode`.
- الحالة: **Published**.

### Workflow مستبدل

`ConsuTrain Certificate Queue Processor` القديم حالته **Deprecated / Unpublished**. لا يُعاد استخدامه ما دام الإصدار `v2` هو المسار المعتمد.

## 3. Google Sheets

الملف المعتمد: `ConsuTrain Consultation Requests`.

### certificate-submissions

يحتوي سجل طلب الشهادة وحالة المعالجة. الحقول المهمة المتعلقة بالإصدار:

- `certificateId`
- `certificateIssuedAt`
- `certificateFileUrl`
- `emailStatus`
- `gmailMessageId`
- `emailSentAt`
- `errorMessage`
- `verificationCode`
- `verificationUrl`

موقعا حقلي التحقق:

- `verificationCode`: العمود `AD`.
- `verificationUrl`: العمود `AE`.

### training-answer-keys

مصدر مفاتيح الإجابات المعتمدة للتدريبات.

### Certificate_Verifications

سجل التحقق الرسمي للشهادات الصادرة. الأعمدة المعتمدة `A:J`:

| العمود | الحقل |
| --- | --- |
| A | `verificationCode` |
| B | `certificateId` |
| C | `verificationStatus` |
| D | `holderName` |
| E | `trainingId` |
| F | `trainingTitle` |
| G | `language` |
| H | `issuedAt` |
| I | `submissionId` |
| J | `createdAt` |

الحالة الأساسية للشهادة الصالحة هي `verificationStatus = Valid`.

## 4. Verification Code

الصيغة المعتمدة:

```text
CT-YY-XXXX-XXXX-XXXX
```

مثال:

```text
CT-26-6473-97TQ-WFC7
```

Regex المعتمد:

```regex
^CT-\d{2}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$
```

يُنشأ `verificationCode` مرة واحدة أثناء تجهيز بيانات الشهادة.

## 5. Verification URL

الصيغة المعتمدة:

```text
https://consutrain.com/certificate-verification.html?code=<verificationCode>
```

مثال:

```text
https://consutrain.com/certificate-verification.html?code=CT-26-6473-97TQ-WFC7
```

يُحفظ الرابط في `certificate-submissions.verificationUrl` ويُمرر إلى PDF.

## 6. قوالب الشهادات

- القالب العربي: `templates/certificates/certificate-template.html`.
- القالب الفرنسي: `templates/certificates/certificate-template-fr.html`.

يدعم القالبان:

- `{{fullName}}`
- `{{trainingTitle}}`
- `{{issueDate}}`
- `{{certificateId}}`
- `{{verificationCode}}`
- `{{verificationUrl}}`

طريقة عرض التحقق داخل PDF:

العربية:

```text
رابط التحقق
تحقق من الشهادة
CT-YY-XXXX-XXXX-XXXX
```

الفرنسية:

```text
Lien de vérification
Vérifier l’attestation
CT-YY-XXXX-XXXX-XXXX
```

عبارة التحقق نفسها قابلة للنقر وتستخدم `verificationUrl`. لا يُعرض URL الطويل داخل تصميم الشهادة.

## 7. صفحة التحقق العامة

- ملف الصفحة: `certificate-verification.html`.
- الرابط الإنتاجي: `https://consutrain.com/certificate-verification.html`.

تتبع الصفحة الهوية البصرية الحالية لـConsuTrain، بما فيها Header وFooter المشتركان، والشعار، والألوان، وTypography، وLayout، والاستجابة للشاشات المختلفة. لا تستخدم الصفحة هوية مستقلة عن الموقع.

يمكن فتح الصفحة يدويًا وإدخال `verificationCode`. كما تدعم `?code=...`؛ وعند وجود قيمة غير فارغة تقرؤها، وتطبع الرمز المطبّع في الحقل، وتتحقق من صيغته، ثم تنفذ التحقق تلقائيًا مرة واحدة عبر دالة التحقق نفسها دون حاجة إلى ضغط الزر. الرمز غير الصحيح يعرض حالة invalid الحالية دون طلب API، وغياب الرمز لا يشغّل التحقق التلقائي.

## 8. Verification API

- Production endpoint: `https://hooks.consutrain.com/webhook/consutrain-certificate-verification`.
- Method: `GET`.
- Query: `?code=<verificationCode>`.
- CORS: `Access-Control-Allow-Origin: *`.
- Caching: `Cache-Control: no-store`.

## 9. حالات API

### valid

الشهادة موجودة وصالحة. البيانات العامة التي تستخدمها صفحة التحقق:

- `valid`
- `status`
- `verificationCode`
- `certificateId`
- `holderName`
- `trainingTitle`
- `language`
- `issuedAt`

لا تعرض الصفحة `submissionId` أو أي بيانات تشغيلية داخلية.

### invalid_code

صيغة رمز التحقق غير صحيحة.

### not_found

الرمز صحيح شكليًا لكن لا يوجد سجل مطابق.

### revoked

السجل موجود لكن `verificationStatus` لا يساوي `Valid`.

## 10. اللغات

اللغتان المعتمدتان حاليًا هما `ar` و`fr`:

- `language = ar`: يتحول مكوّن التحقق إلى العربية وRTL، وتصبح العربية هي اللغة النشطة.
- `language = fr`: يتحول مكوّن التحقق إلى الفرنسية وLTR، ويصبح FR هو اللغة النشطة.

تغيير لغة مكوّن ونتيجة التحقق لا يكسر Header أو Footer العامين.

## 11. Security / Privacy

صفحة التحقق:

- تستخدم `textContent` لعرض البيانات القادمة من API.
- تستخدم `encodeURIComponent` عند إرسال الرمز.
- تستخدم `cache: "no-store"`.
- لا تخزن بيانات الشهادة في `localStorage`.
- لا تعرض تفاصيل الأخطاء التقنية للزائر.
- تعرض فقط البيانات اللازمة للتحقق من الشهادة.
- لا تعرض `submissionId`.

## 12. SEO

صفحة التحقق صفحة عامة وظيفية. تستخدم canonical ثابتًا للصفحة حتى لا تُعامل روابط `?code=...` كصفحات SEO مستقلة. لا تُنشأ صفحات مستقلة مفهرسة لكل `verificationCode`.

## 13. QA المنفذ

تم اختبار الحالات التالية بنجاح:

- Certificate assessment success.
- Certificate PDF generation.
- Email delivery.
- Google Sheets registration.
- `verificationCode` generation.
- `verificationUrl` generation.
- Arabic PDF.
- French PDF.
- Clickable verification link in PDF.
- Valid Arabic certificate.
- Valid French certificate.
- `invalid_code`.
- `not_found`.
- `revoked`.
- Missing code.
- Mobile responsive.
- Desktop responsive.
- Automatic verification from `?code=`.
- AR / RTL switching.
- FR / LTR switching.
- Production verification.
- PDF → public page → automatic Valid result.

الاختبار النهائي من البداية إلى النهاية نجح على Production.

## 14. Maintenance Rules

1. لا تستخدم `ConsuTrain Certificate Queue Processor` القديم.
2. `ConsuTrain Certificate Queue Processor v2` هو المعتمد.
3. لا تغيّر صيغة `verificationCode` دون Migration واضحة.
4. لا تغيّر أسماء أعمدة `Certificate_Verifications` دون تحديث `Certificate Verification Lookup`.
5. لا تحذف `verificationCode` أو `verificationUrl` من Workflow Inputs الخاصة بـ`Unified Certificate Delivery`.
6. أي قالب شهادة جديد يجب أن يدعم `verificationCode` و`verificationUrl`.
7. أي لغة جديدة يجب أن تدعم صفحة التحقق ورسائل API وواجهة النتيجة.
8. لا تعرض بيانات داخلية إضافية على صفحة التحقق العامة.
9. يجب اختبار PDF → Verification Page بعد أي تعديل جوهري على نظام الشهادات.
10. تعامل مع `Certificate_Verifications` كسجل التحقق الرسمي للشهادات.

## 15. الحالة النهائية بتاريخ 5 سبتمبر 2026

الحالة: **COMPLETED / PRODUCTION VERIFIED**.

لا توجد مشكلة تشغيلية مفتوحة حاليًا في مسار إصدار الشهادة والتحقق منها.

الخطوات المستقبلية تحسينات اختيارية وليست إصلاحات عاجلة:

- QR Code داخل الشهادة.
- لوحة إدارة الشهادات.
- أدوات Revocation إدارية.
- Analytics لعمليات التحقق.
- لغات إضافية.

لا تُسجل هذه التحسينات كمهام عاجلة ما لم تُعتمد صراحة في `ROADMAP.md`.
