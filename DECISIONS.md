# DECISIONS — ConsuTrain-MVP

## Purpose of this file

This file records the approved, postponed, cancelled, and pending decisions related to the ConsuTrain project.

It helps the project team avoid repeating discussions and keeps the project direction clear.

---

## Decision status guide

- Approved: decision is accepted and should be followed.
- Postponed: decision is delayed to a later phase.
- Cancelled: decision is no longer valid.
- Under review: decision still needs discussion or testing.

---

## Decisions log

| Date | Related path | Decision | Reason | Status |
|---|---|---|---|---|
| 2026-05-04 | Project Management | اعتماد مسار تاسع باسم ConsuTrain – Project Management – إدارة المشروع والمتابعة | لتوثيق حالة المشروع، القرارات، القواعد، والخطة القادمة | Approved |
| 2026-05-04 | Tools + Project Management | حذف صفحات الهواتف والمواقع المغربية من MyTodo | لأن توجه منصة ConsuTrain دولي ولا يستهدف بلدًا محددًا في هذه المرحلة | Approved |
| 2026-05-04 | Technical + Project Management | اعتماد نتيجة اختبار GitHub Pages و PWA والكاش للنسخة الحالية | لأن الاختبار على الهاتف أظهر أن الموقع يعمل، وأن التطبيق قابل للتثبيت، ولا تظهر ملفات قديمة بعد التحديث | Approved |
| 2026-05-04 | Technical | الإبقاء على ملف assets/js/main.js رغم أنه لا يحتوي وظائف تشغيلية حاليًا | لتخصيصه مستقبلًا للوظائف العامة وتفادي كسر أي تحميل قائم | Approved |
| 2026-05-04 | UI/UX + Technical | تفعيل Breadcrumbs في الصفحات الداخلية التي تحتوي بيانات Breadcrumb | لتحسين تجربة التنقل وتوضيح موقع المستخدم داخل المنصة | Approved |
| 2026-05-04 | Tools + Technical | مراجعة Manifest و Service Worker الخاصين بـ MyTodo بعد دمجه داخل ConsuTrain | لضمان توافق المسارات مع البنية الحالية وعدم الاعتماد على المسار القديم /JYD/ | Approved |

---

## Detailed decisions

### 1. اعتماد مسار إدارة المشروع والمتابعة

تم اعتماد مسار تاسع ضمن مشروع ConsuTrain باسم:

ConsuTrain – Project Management – إدارة المشروع والمتابعة

ويخصص هذا المسار لمتابعة:
- حالة المشروع
- القرارات المعتمدة
- القواعد التشغيلية
- خطة العمل
- المشاكل المفتوحة والمغلقة
- الخطوات القادمة

Status: Approved

---

### 2. إزالة الملفات المحلية المغربية من MyTodo

تم حذف صفحات الهواتف والمواقع المغربية من MyTodo، لأن توجه منصة ConsuTrain دولي ولا يستهدف بلدًا محددًا في هذه المرحلة.

شمل القرار:
- حذف صفحات الهواتف المغربية.
- حذف صفحات المواقع المغربية.
- حذف الروابط المرتبطة بها من صفحة MyTodo.
- اختبار الموقع بعد الحذف.
- التأكد من عدم ظهور روابط مكسورة أو أخطاء 404.

Status: Approved

---

### 3. اعتماد اختبار GitHub Pages و PWA والكاش

تم اختبار النسخة الحالية من موقع ConsuTrain بعد رفعها على GitHub Pages من خلال الهاتف.

شمل الاختبار:
- فتح الصفحة الرئيسية.
- فتح صفحة MyTodo.
- تنفيذ تحديث عادي.
- إغلاق المتصفح وإعادة فتحه.
- التحقق من حالة تثبيت التطبيق.
- التأكد من عدم ظهور نسخة قديمة من الهيدر أو ملفات CSS/JS بعد التحديث.

النتيجة:
الموقع يعمل بشكل سليم، والتطبيق قابل للتثبيت، ولا توجد مشكلة كاش ظاهرة في النسخة الحالية.

Status: Approved

---

### 4. الإبقاء على ملف main.js

تم الإبقاء على ملف:

assets/js/main.js

رغم أنه لا يحتوي وظائف تشغيلية حاليًا.

السبب:
- قد يستخدم لاحقًا للوظائف العامة.
- بعض الملفات قد تشير إليه.
- حذفه الآن ليس ضروريًا.

Status: Approved

---

### 5. تفعيل Breadcrumbs

تم اعتماد تفعيل Breadcrumbs في الصفحات الداخلية التي تحتوي بيانات Breadcrumb.

الهدف:
- تحسين التنقل.
- توضيح موقع المستخدم داخل الموقع.
- دعم تجربة استخدام أكثر احترافية.

Status: Approved

---

### 6. مراجعة Manifest و Service Worker الخاصين بـ MyTodo

تم اعتماد مراجعة ملفات:

tools/mytodo/manifest.webmanifest  
tools/mytodo/sw.js

بعد دمج MyTodo داخل ConsuTrain.

الهدف:
- إزالة الاعتماد على المسار القديم /JYD/.
- ضمان توافق MyTodo مع بنية ConsuTrain الحالية.
- تحسين اختبار PWA والكاش.

Status: Approved

## Learn – Main Learning Portal Enhancement

تم تحسين صفحة learn.html لتصبح بوابة رئيسية واضحة لقسم التعلّم داخل ConsuTrain، مع إبراز مسارات القاموس الإداري، المقالات، محاور التميز، الذكاء الاصطناعي، والمهارات الناعمة. كما تم تحسين قسم "من أين تبدأ؟" وربط المحتوى التعليمي ببقية أقسام المنصة.

Status: Approved after local and GitHub testing.

## Learn – AI Articles Integration

تمت إضافة أول مجموعة مقالات تعليمية في قسم Learn اعتمادًا على ملفات الشرح الخاصة بفيديوهات الذكاء الاصطناعي. شملت المقالات مدخلًا مبسطًا للذكاء الاصطناعي، شرح فكرة استشعار الآلة، وربط الذكاء الاصطناعي بعالم VUCA. تم دعم المقالات بروابط فيديو، وروابط مصطلحات للقاموس، ومقالات مرتبطة.

Status: Approved after cache fix and local testing. 

## Learn – Essential Management Skills Path – Phase 1 Completed

تم اعتماد المرحلة الأولى من مسار المهارات الإدارية الأساسية داخل قسم Learn، وتشمل الدروس من EMS-01 إلى EMS-12. تغطي هذه المرحلة وظائف الإدارة الأساسية: المهارات الإدارية، التخطيط، التنظيم، القيادة، والرقابة.

تم ربط كل درس بمقال تعليمي داخل assets/data/articles.json، مع إضافة رابط الفيديو المرتبط وصورة SVG تعليمية وروابط داخلية للمصطلحات ذات العلاقة في القاموس الإداري.

Status: Completed

### Decision – Rename Articles Section to Knowledge Library

Date: 2026-05-05

The section previously named "Articles" has been renamed to "Administrative Knowledge Library" / "مكتبة المعرفة الإدارية".

Reason:
- The section is no longer limited to simple articles.
- It now includes structured knowledge, learning content, videos, internal links, glossary connections, and future learning paths.
- The new name better reflects the value offered to users and supports future expansion.

Implementation:
- Update the page title and hero text.
- Update the learning menu label from "المقالات" to "مكتبة المعرفة".
- Keep the page URL as `learn/articles.html` for now to avoid breaking existing links.

Future Direction:
The knowledge library may later be organized by main knowledge domains, such as:
- Project Management
- Strategic Planning
- Institutional Excellence and Quality
- Operations Management
- Administrative Skills
- AI for Management
- Tools and Templates

The current structure will remain light for now, using:
- Search bar
- Topic dropdown
- Popular tags
- Full keyword list on demand

### Decision – Separate Soft Skills and Management Skills Path

Date: 2026-05-05

The Learn dropdown will include both:
- Soft Skills / المهارات الناعمة
- Essential Management Skills Path / مسار المهارات الإدارية الأساسية

Reason:
The Soft Skills page is a separate learning page focused on behavioral and personal skills, while the Management Skills path is a structured course-style path covering management functions, leadership, teamwork, decision-making, and project management methodologies.

Implementation:
- Keep `learn/soft-skills.html`.
- Keep `learn/management-skills.html`.
- Show both links in the Learn dropdown.
- Use relative links inside the Learn dropdown to avoid duplicated paths such as `learn/learn/...`.

### Decision – ConsuTrain Contact and Request Flow

Date: 2026-05-07

تم اعتماد مسار تواصل مزدوج داخل منصة ConsuTrain:

- زر واتساب سريع للزائر المستعجل أو الاستفسار المختصر.
- نموذج Tally موحد بعنوان: طلب استشارة أو دورة تدريبية.

رابط نموذج Tally المعتمد:
`https://tally.so/r/ja5Dlx`

يستخدم النموذج لطلبات:
- استشارة
- دورة تدريبية
- استفسار عام
- طلب عرض سعر

يتم توجيه الزائر إلى النموذج من صفحات التواصل، حجز الاستشارة، وصفحات الخدمات. ويُستخدم واتساب كقناة سريعة موازية.

ملاحظة: سيتم لاحقًا ربط Tally مع Google Sheets كجدول متابعة بسيط للطلبات، مع أعمدة مثل الحالة، تم التواصل؟، تاريخ المتابعة، ملاحظات، وتم التحويل إلى عميل؟
