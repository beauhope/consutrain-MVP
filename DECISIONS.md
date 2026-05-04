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