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
### Decision – Add Free Resources as a Dedicated Section

Date: 2026-05-06

Decision:
A dedicated Free Resources section has been added under `resources/index.html` instead of limiting resources to a single downloadable file or only to the Templates area.

Reason:
The platform needs a strong value entry point for visitors. Free resources support trust-building, SEO, lead generation, and future monetization. The structure is broader than templates because resources may include checklists, guides, prompts, models, Word files, Excel files, PDFs, and future interactive tools.

Implementation:
- Created `resources/index.html`.
- Added 32 initial downloadable Markdown resources in `resources/downloads/`.
- Added a main navigation link for `الموارد المجانية`.
- Linked the new section from the homepage and `start-here.html`.
- Updated the Service Worker cache version.

Future Direction:
- Convert selected resources into branded PDF/Word/Excel lead magnets.
- Add resource detail pages when needed.
- Link each resource to its related consulting service and future course path.

Status: Approved for review.


## Decision: Categorize free resource downloads

- Free downloadable resources should not remain in one flat downloads folder.
- Files are organized inside `resources/downloads/` by domain, such as `operational-plans`, `risk-management`, `iso-quality`, `feasibility-studies`, `project-management`, `sop-procedures`, and `ai-management`.
- Pages that display resources should link to these categorized paths.
- The former root-level `/downloads/` folder should be avoided for new resources and can be removed after confirming no links depend on it.


## 2026-05-06 — Decision: Store professional downloadable resources inside `resources/downloads`

- Root-level `/downloads/` should not be used for new files.
- Professional Word/PDF resources should be stored inside categorized folders under `resources/downloads/`.
- The resources page should show Word/PDF buttons when professional versions are available, while keeping Markdown starter resources for the remaining items until they are upgraded.

## 2026-05-06 — Decision: Every important free resource should have an explanation page

Decision:
Free resources should not be treated only as downloadable files. Important resources will have a dedicated HTML explanation page that introduces the resource, explains when to use it, who it is for, how to use it, and provides download buttons for the available formats.

Implementation:
- `templates/` is used for explanation pages related to practical templates and downloadable resources.
- `resources/downloads/` remains the storage location for downloadable files such as Word, PDF, Excel, and Markdown.
- `resources/index.html` acts as the main free resources library and links selected resources to their explanation pages.

Reason:
This gives the website added value, improves user guidance, supports SEO, and creates a stronger bridge between free resources and paid services.


## 2026-05-06 — Decision: Review resource model before implementation

Decision:
For new free resources, the proposed model/content structure should be presented textually first. The downloadable file and explanation page should be prepared only after review and improvement notes are applied.

Reason:
The user wants to apply professional judgment before implementation so that each resource reflects practical consulting expertise and not just a generic template.

Applied now:
- KPI Performance Card model was reviewed and approved.
- It was converted into Word/PDF and connected to a dedicated explanation page.

## 2026-05-06 — Decision: Upgrade approved resource models into full free resources

Decision:
When a proposed free resource model is reviewed and approved, it can be converted into a professional downloadable Word/PDF file and connected to a dedicated explanation page.

Applied now:
- The Operational Plan Follow-up Report model was approved.
- It was converted into Word/PDF and connected to `templates/operational-plan-follow-up-report.html`.

Reason:
This keeps the free resources practical and professional while maintaining the agreed workflow: review the model first, then implement the downloadable file and explanation page.


## 2026-05-06 — Decision: Upgrade Stakeholder Register into a full free resource

Decision:
The approved Stakeholder Register model is converted into a professional free resource with a downloadable Word/PDF file and a dedicated explanation page.

Applied now:
- Added `templates/stakeholder-register.html`.
- Added Word/PDF files under `resources/downloads/project-management/`.
- Linked the resource from both `resources/index.html` and `templates/index.html`.

Reason:
This resource strengthens the project management and operational planning resource chain by helping users identify, analyze, and communicate with stakeholders before and during implementation.

## Decision - Project Charter resource

- Approved adding a free `Project Charter` resource as part of the project management resources.
- Each major free resource must include an explanation page plus downloadable Word/PDF files.



## قرار: اعتماد نموذج خطة تواصل المشروع كمورد مجاني
تم اعتماد المورد ضمن موارد إدارة المشاريع، مع صفحة شرح مستقلة وملفات Word/PDF داخل `resources/downloads/project-management/`.


## قرار: اعتماد نموذج محضر اجتماع ومتابعة القرارات كمورد مجاني
تم اعتماد المورد ضمن موارد إدارة المشاريع بصيغة Word فقط في هذه المرحلة، مع صفحة شرح مستقلة داخل `templates/` وملف تحميل داخل `resources/downloads/project-management/`.

- تمت إضافة نسخة PDF لمورد نموذج محضر اجتماع ومتابعة القرارات للمعاينة، وتحديث روابط صفحة المورد وصفحتي الموارد والقوالب.

## قرار - اعتماد مورد سجل الإجراءات التصحيحية والتحسينية

تم اعتماد نموذج سجل الإجراءات التصحيحية والتحسينية كمورد مجاني ضمن مجال ISO والجودة، مع صفحة شرح مستقلة وملفات تحميل Word/PDF.

### قرار: اعتماد نموذج خطة التدقيق الداخلي كمورد مجاني
تم اعتماد نموذج خطة التدقيق الداخلي كمورد مجاني بصيغة Word وPDF، مع صفحة شرح مستقلة بنفس نسق موارد ConsuTrain.

### قرار: اعتماد قائمة تحقق التدقيق الداخلي ISO 9001 كمورد مجاني
تم اعتماد نموذج قائمة تحقق التدقيق الداخلي ISO 9001 كمورد مجاني بصيغة Word وPDF، مع صفحة شرح مستقلة بنفس نسق موارد ConsuTrain.
- قرار: اعتماد نموذج سجل عدم المطابقة كمورد مجاني ضمن ISO والجودة، وربطه بخطة التدقيق الداخلي وقائمة تحقق ISO 9001 وسجل الإجراءات التصحيحية.


### قرار - ربط سياسة الجودة بأهداف جودة
تم اعتماد أن نموذج سياسة الجودة لا يقتصر على نص السياسة، بل يتضمن أهداف جودة قابلة للقياس ومسؤوليات متابعة ومراجعة.
- اعتماد نموذج أهداف الجودة ومؤشرات القياس كمورد مجاني يدعم سياسة الجودة ونظام ISO 9001.
- اعتماد نموذج سجل ضبط الوثائق والسجلات كمورد مجاني ضمن ISO والجودة، مع إضافة تصنيف مستقل للوثائق الخارجية.
- اعتماد نموذج سجل الشكاوى ورضا العملاء / المستفيدين كمورد مجاني ضمن مجال ISO والجودة، مع ربطه بالتحسين المستمر ومؤشرات الرضا.


- إضافة مورد مجاني: نموذج مراجعة الإدارة لنظام الجودة، مع صفحة شرح وملفات Word/PDF ضمن موارد ISO والجودة.

### قرار - إضافة نموذج خطة تحسين العمليات
تم اعتماد نموذج خطة تحسين العمليات كمورد مجاني مكمل لموارد الجودة والتحسين المستمر، بهدف مساعدة المستخدم على تحليل العملية الحالية ووضع إجراءات تحسين قابلة للقياس والتحقق.

### قرار - إضافة نموذج بطاقة عملية
تم اعتماد نموذج بطاقة عملية كمورد مجاني ضمن مسار الأدلة والإجراءات، على أن يتضمن تعريف العملية، مدخلاتها، مخرجاتها، أدوارها، مواردها، مؤشراتها، مخاطرها، وفرص تحسينها.

### قرار - إضافة نموذج إجراء تشغيلي SOP
تم اعتماد نموذج إجراء تشغيلي SOP كمورد مجاني ضمن مسار الأدلة والإجراءات، باعتباره النموذج التفصيلي المكمل لبطاقة العملية، ويستخدم لتوثيق طريقة تنفيذ العمل خطوة بخطوة.

- اعتماد نموذج تحليل SWOT كمورد مجاني ضمن قسم التخطيط الاستراتيجي، مع تحويل النسخة المختصرة السابقة إلى مورد احترافي قابل للتحميل.

- اعتماد نموذج تحليل PESTEL كمورد مجاني ضمن قسم التخطيط الاستراتيجي، وربطه بتحليل SWOT والخدمات ذات العلاقة.


## قرار - اعتماد نموذج بطاقة هدف استراتيجي
تم اعتماد النموذج كمورد مجاني ضمن التخطيط الاستراتيجي، ليكمل موارد SWOT وPESTEL ويربط التحليل بالأهداف والمؤشرات والمبادرات.


## قرار - اعتماد نموذج سجل المبادرات الاستراتيجية
تم اعتماد النموذج كمورد مجاني ضمن التخطيط الاستراتيجي، ليكمل موارد SWOT وPESTEL وبطاقة الهدف الاستراتيجي.


## قرار - اعتماد قائمة تحقق لمراجعة الخطة الاستراتيجية
تم اعتماد القائمة كمورد مجاني ضمن التخطيط الاستراتيجي، لمراجعة ترابط الخطة بين التحليل والأهداف والمؤشرات والمبادرات والمخاطر والحوكمة.


## قرار - اعتماد نموذج تحويل الأهداف إلى أنشطة تنفيذية
تم اعتماد النموذج كمورد مجاني ضمن الخطط التشغيلية، مع إضافة شرح مختصر لمفهوم WBS ومصفوفة RACI مختصرة لتوزيع الأدوار.

- اعتماد نموذج مصفوفة تقييم المخاطر كمورد مجاني ضمن إدارة المخاطر، وربطه بسجل المخاطر وخدمة إدارة المخاطر.


## قرار - مورد نموذج خطة معالجة المخاطر
تم اعتماد نموذج خطة معالجة المخاطر كمورد مجاني ضمن إدارة المخاطر، بصيغة Word/PDF، وربطه بسجل المخاطر ومصفوفة تقييم المخاطر.


### قرار: اعتماد قائمة تحقق لمراجعة نظام إدارة المخاطر
تم اعتماد المورد كمورد مجاني ضمن إدارة المخاطر، لاستكمال منظومة السجل والتقييم والمعالجة بمراجعة شاملة لنضج النظام.


### مورد جديد - نموذج وصف فكرة مشروع
تمت إضافة صفحة الشرح `templates/project-idea-description-template.html` وملفات التحميل `resources/downloads/feasibility-studies/ConsuTrain_Project_Idea_Description_Template_AR.docx` و`ConsuTrain_Project_Idea_Description_Template_AR.pdf`، وتحديث صفحات الموارد والقوالب.


### مورد جديد - نموذج تحليل السوق
تمت إضافة صفحة الشرح `templates/market-analysis-template.html` وملفات التحميل `resources/downloads/feasibility-studies/ConsuTrain_Market_Analysis_Template_AR.docx` و`ConsuTrain_Market_Analysis_Template_AR.pdf`، وتحديث صفحات الموارد والقوالب.

### قرار - إضافة نموذج تقدير التكاليف الأولية
تم اعتماد نموذج تقدير التكاليف الأولية كمورد مجاني ضمن مسار دراسات الجدوى، مع ربطه بأداة دراسة الجدوى ليكون جزءًا من مسار: وصف الفكرة، تحليل السوق، تقدير التكاليف، استخدام الأداة، ثم طلب استشارة عند الحاجة.


- اعتماد مورد قائمة تحقق قبل دراسة الجدوى كأداة أولية لتقييم جاهزية فكرة المشروع قبل استخدام أداة دراسة الجدوى أو طلب خدمة تفصيلية.


- اعتماد مورد نموذج متابعة مهام المشروع كأداة مجانية لمتابعة المهام والمسؤوليات والمواعيد ونسبة الإنجاز والقرارات المطلوبة.


- اعتماد مورد نموذج تقرير حالة مشروع كأداة مجانية لرفع حالة المشروع بصورة تنفيذية تشمل النطاق والجدول والميزانية والمخاطر والقرارات.

- اعتماد مورد: قائمة تحقق لمراجعة دليل الإجراءات كقائمة مراجعة عملية لدليل الإجراءات قبل الاعتماد أو النشر.
- اعتماد قائمة تحقق جاهزية ISO 9001 كمدخل أولي لخدمة التأهيل والاستشارات ISO.
- اعتماد نموذج إجراء تصحيحي كمورد مستقل لحالة واحدة، مكمل لسجل الإجراءات التصحيحية والتحسينية.

## قرار - تفعيل موارد الذكاء الاصطناعي بروابط شرح وتحميل
- عند تحويل أي مورد من صيغة Markdown قديمة إلى مورد احترافي، يجب استبدال بطاقته داخل resources/index.html بروابط: شرح المورد، تحميل Word، عرض PDF.
- لا يتم استخدام مجلد _snippets إلا بطلب صريح من المستخدم.

- 2026-05-07: اعتماد حزمة Prompts لدراسة الجدوى كمورد مجاني ضمن الذكاء الاصطناعي للإدارة، مع تفعيل روابط الشرح والتحميل والمعاينة.

- اعتماد مورد حزمة Prompts لإدارة المشاريع والجودة كآخر مورد ضمن حزم الذكاء الاصطناعي للإدارة، وربطه بصفحات الموارد والقوالب.


### Decision – Add Goal Management and Performance Measurement Path

Date: 2026-05-05

A new structured Learn path will be added under the title:
`مسار إدارة الأهداف وقياس الأداء`

Reason:
- The content is not just standalone articles; it forms a coherent learning sequence.
- It supports core ConsuTrain service areas such as strategic planning, operational planning, performance indicators, institutional excellence, and performance management.
- It provides a structured path from MBO to SMART, BSC, and OKRs.

Implementation:
- Create `learn/goal-management.html`.
- Add the path to the Learn dropdown.
- Keep article creation incremental, one lesson at a time.
- Add verified video links before activating video buttons.


### Decision – Keep Global Floating Actions Visible

Date: 2026-05-05

The site must always keep the following global floating actions visible across all pages:
- Quick Contact button / زر التواصل السريع
- Scroll-to-top button / زر العودة إلى الأعلى

Reason:
- They improve navigation and conversion.
- They provide a consistent user experience across Learn, Services, Tools, and Resources pages.
- They should not be removed when editing individual pages or adding new learning paths.

Implementation Rule:
- These buttons must be controlled centrally through shared assets, mainly:
  - `assets/js/includes.js`
  - `assets/css/style.css`
- Do not hard-code separate versions inside individual pages unless there is a specific exception.
- Any future layout update must test that both buttons still appear on desktop and mobile.

Testing Required:
- Open pages from root, `learn/`, `services/`, and `tools/`.
- Confirm that زر التواصل السريع appears.
- Confirm that زر العودة إلى الأعلى appears after scrolling.


### Decision – Add Futures and Scenario Planning Learn Path

Date: 2026-05-05

A new structured Learn path will be added under the title:
`مسار استشراف المستقبل والتخطيط بالسيناريو`

Reason:
- The uploaded materials form a coherent learning sequence.
- The path supports strategic planning, environmental scanning, uncertainty analysis, and scenario-based decision-making.
- The content is suitable as a dedicated learning path rather than scattered standalone articles.

Implementation:
- Create `learn/futures-and-scenarios.html`.
- Add ten lessons from YJ-24 to YJ-33.
- Link each lesson to its matched YouTube video from the content library.
- Create detailed Knowledge Library articles later, one lesson at a time.


### Decision – Keep Courses and Feedback Links in Header

Date: 2026-05-05

The site header must always keep the following navigation items visible:
- `الدورات`
- `شاركنا رأيك` as a sub-link under `تواصل معنا`

Reason:
- `الدورات` is a core learning/conversion path.
- `شاركنا رأيك` supports visitor feedback, improvement suggestions, and issue reporting.
- These links should not disappear when editing the shared header or adding new learning paths.

Implementation Rule:
- Header navigation must be maintained centrally in `partials/header.html`.
- Any future header update must verify the presence of:
  - `courses.html`
  - `feedback.html`
  - `learn/futures-and-scenarios.html`
  - the global floating actions from `assets/js/includes.js`

Testing Required:
- Open desktop header and mobile menu.
- Confirm `الدورات` appears in the main navigation.
- Confirm `شاركنا رأيك` appears under `تواصل معنا`.


## قرار: بروتوكول التعديل الآمن للملفات المشتركة

يجب عدم تعديل الملفات المشتركة الحساسة إلا بناءً على آخر نسخة فعلية من الملف.
الملفات الحساسة هي:
- partials/header.html
- partials/footer.html
- assets/css/style.css
- assets/js/includes.js
- sw.js

عند تعديل أي منها يجب تنفيذ فحص عدم الرجوع للخلف، والتأكد من عدم حذف الروابط أو الأزرار أو الوظائف المعتمدة سابقًا.

## قرار – تعديل الهيدر

عند تعديل partials/header.html يمنع استبدال الملف كاملًا من نسخة قديمة.  
أي تعديل مستقبلي على الهيدر يجب أن يتم على آخر نسخة عاملة فقط، وبإضافة السطر أو الرابط المطلوب دون حذف أو إعادة ترتيب العناصر القائمة.

العناصر التالية عناصر ثابتة لا يجوز حذفها:
- زر الدورات
- زر شاركنا رأيك تحت تواصل معنا
- زر الموارد المجانية تحت التعلّم
- زر تواصل سريع
- زر العودة للأعلى


## قرارات واجهة وتنظيم المحتوى

- اعتماد تسمية "مكتبة المعرفة" بدل "المقالات" في الواجهة.
- اعتماد صفحة مستقلة بعنوان "المسارات التعليمية" تجمع المسارات الحالية والمستقبلية.
- اعتماد تسمية "الأدوات المجانية" بدل "الأدوات" في الهيدر.
- اعتبار أدوات الحاسبات، CRM، الفواتير، القوالب، والمؤقت أدوات مجانية مستقلة، وليست أدوات فرعية تابعة لمنظّم مهامي.
- عدم عرض النصوص الداخلية الخاصة بخطط التطوير داخل واجهة الزائر، ونقلها إلى ملفات التوثيق مثل ROADMAP.md أو PROJECT-STATUS.md.

## قرار - تبسيط نسخة الزائر من مساعد دراسة الجدوى الأولية

تم اعتماد عرض زري "حفظ" و"تصدير PDF" فقط في لوحة إجراءات مساعد دراسة الجدوى الأولية. تبقى إجراءات الاستيراد والتصدير المتقدمة مثل JSON وWord ومسح البيانات مؤجلة وغير ظاهرة للزائر لتقليل التعقيد والحفاظ على تجربة استخدام مبسطة.

## قرار - نموذج طلب دراسة الجدوى الاحترافية

يعتمد مساعد دراسة الجدوى الأولية نموذج Tally مخصصًا داخل صفحة الأداة لاستقبال طلبات إعداد دراسة جدوى احترافية، بدل توجيه الزائر إلى رابط خارجي منفصل.

## قرار - اعتماد أداة ومضة إدارية

تم اعتماد أداة "ومضة إدارية" كأداة تفاعلية مجانية ضمن قسم الأدوات، مع إبرازها في الصفحة الرئيسية لقيمتها التسويقية وقدرتها على توجيه الزائر إلى موارد وخدمات مناسبة حسب مستواه واهتمامه.

## قرار - تثبيت ومضة إدارية وتجربة شارك الفائدة

تم اعتماد "ومضة إدارية" رسميًا كأداة تفاعلية مجانية ضمن أدوات ConsuTrain، ويتم الترويج لها في الصفحة الرئيسية بسبب قيمتها التسويقية وسهولة مشاركتها. يجب أن تبقى الأداة بسيطة في مرحلة MVP، مع إمكانية توسيعها لاحقًا عبر مكتبة ومضات أكبر، أو تنبيهات اختيارية، أو تحسينات PWA، أو توصيات مدعومة بالذكاء الاصطناعي.

تم اعتماد زر مشاركة عام بسهم منحني ملوّن بهوية ConsuTrain، مع خلفية فاتحة ولمسات ذهبية. كما يجب وضع قسم "شارك الفائدة" قرب أسفل الصفحة الرئيسية وقبل الفوتر.

## 2026-05-12 – اعتماد الصفحة الرئيسية وصفحة "ابدأ من هنا" كمسارات عملية

تم اعتماد إعادة بناء الصفحة الرئيسية وصفحة "ابدأ من هنا" بحيث تكونان بوابات عملية مختصرة، وليستا صفحات تعريفية طويلة.

### القرار

- الصفحة الرئيسية أصبحت بوابة تسويقية وعملية تعرض:
  - الدورات التدريبية.
  - الورش التطبيقية القصيرة.
  - الأدوات والموارد المجانية.
  - الخدمات الاستشارية المدفوعة.
  - أحدث الإضافات في المنصة.
  - المسارات العملية حسب احتياج الزائر.

- صفحة "ابدأ من هنا" أصبحت موجه طريق يساعد الزائر على اختيار المسار المناسب:
  - مورد مجاني.
  - دورة تدريبية.
  - ورشة تطبيقية.
  - خدمة استشارية.

### سبب القرار

الهدف هو تقليل النصوص الطويلة، وتوجيه الزائر إلى إجراء واضح، مع بناء الثقة قبل عرض الخدمات المدفوعة.

### ملاحظات تنفيذية

- يجب أن تبقى الصفحة الرئيسية مختصرة وعملية.
- يجب أن تظل صفحة "ابدأ من هنا" صفحة إرشاد وتوجيه، وليست صفحة بيع مباشرة.
- يجب إبراز الخدمات الاستشارية بوضوح دون إضعاف قيمة الموارد المجانية والدورات والورش.


## 2026-05-12 – اعتماد قسم الورش التطبيقية القصيرة

تم اعتماد قسم جديد للورش التطبيقية القصيرة داخل قسم الدورات.

### القرار

إضافة صفحة مستقلة للورش التطبيقية على الرابط:

`courses/practical-workshops/`

وتضم الحزمة الأولى من الورش التالية:

1. ورشة إعداد بطاقة مؤشر KPI.
2. ورشة بناء بطاقة أداء متوازن BSC.
3. ورشة كتابة عدم المطابقة والإجراء التصحيحي.
4. ورشة إعداد مصفوفة الصلاحيات والمسؤوليات.
5. ورشة صياغة الأهداف SMART.
6. ورشة إعداد سجل المخاطر وتعبئته.

### سبب القرار

الورش تخدم الزائر الذي لا يريد دورة طويلة، بل يريد مخرجًا عمليًا واضحًا خلال 3 إلى 4 ساعات.

### ملاحظات تنفيذية

- لا يتم إنشاء صفحة مستقلة لكل ورشة في هذه المرحلة.
- تبقى الورش في صفحة واحدة قابلة للتوسع لاحقًا.
- كل ورشة يجب أن تعرض:
  - المدة.
  - المستوى.
  - الفئة المستهدفة.
  - المخرج العملي.
  - زر "سجل اهتمامك".


  ## 2026-05-12 – إبراز الخدمات الاستشارية داخل رحلة الزائر

تم اعتماد إبراز الخدمات الاستشارية المدفوعة داخل الصفحة الرئيسية وصفحة "ابدأ من هنا".

### القرار

يجب أن تعكس المنصة بوضوح أنها لا تقدم محتوى تعليميًا فقط، بل تقدم أيضًا خدمات استشارية مدفوعة، مثل:

- التخطيط الاستراتيجي والتشغيلي.
- إعداد مؤشرات الأداء.
- بناء أنظمة ISO.
- نظام الإدارة المتكامل IMS.
- التميز المؤسسي.
- الحوكمة.
- إدارة المخاطر.
- الصحة والسلامة المهنية.
- دراسات الجدوى.
- العروض الفنية والمستندات المهنية.

### سبب القرار

الموقع هو واجهة تسويقية لخدمات ConsuTrain، وليس منصة محتوى فقط.

### ملاحظات تنفيذية

- يتم تقديم الخدمات ضمن رحلة ثقة:
  مورد مجاني → دورة → ورشة → خدمة استشارية.
- لا يتم الضغط على الزائر بالبيع المباشر.
- يجب أن يكون الانتقال إلى الخدمات طبيعيًا عندما يحتاج الزائر إلى تطبيق مخصص.

## 2026-05-12 – إغلاق أكورديون الخدمات افتراضيًا

تم تعديل سلوك أكورديون صفحة الخدمات.

### القرار

جميع أكورديونات الخدمات يجب أن تكون مغلقة افتراضيًا عند فتح صفحة الخدمات.

### سبب القرار

كان أكورديون "التخطيط الاستراتيجي" يظهر مفتوحًا تلقائيًا، مما قد يعطي انطباعًا أن الصفحة موجهة لخدمة واحدة فقط.

### ملاحظات تنفيذية

- لا يفتح أي أكورديون إلا بعد ضغط المستخدم.
- يجب الحفاظ على خصائص الوصول مثل `aria-expanded`.
- عند تعديل JavaScript أو HTML مرتبط بهذا السلوك، يجب تحديث `sw.js` لتجنب ظهور نسخة قديمة.

## 2026-05-13 – عدم تكرار مورد SWOT كأداة مستقلة

### القرار

يبقى تحليل SWOT ضمن الموارد والقوالب المجانية الحالية، ولا يتم نشر أداة منفصلة له في قسم الأدوات في هذه المرحلة.

### سبب القرار

توجد نسخة SWOT بالفعل كمورد/قالب مجاني، وإضافة أداة تحمل الوظيفة نفسها ستكرر نفس القيمة أمام الزائر.

### ملاحظات تنفيذية

- أي تطوير مستقبلي يجب أن يكون مختلفًا بوضوح، مثل أداة متقدمة لتحويل SWOT إلى TOWS وخيارات استراتيجية.
- لا يتم حذف أو تعطيل مورد SWOT الحالي ضمن الموارد أو القوالب.


## قرار — زر العودة للصفحة السابقة

تم اعتماد زر "العودة للصفحة السابقة" كعنصر ثابت ضمن تجربة الاستخدام الودية Friendly Use في الصفحات الداخلية.  
يتم توليد الزر من خلال `assets/js/includes.js` بعد إنشاء Breadcrumbs، ويتم تنسيقه من خلال `assets/css/style.css`.  
لا يتم إدراج الزر يدويًا داخل كل صفحة، حتى يبقى التحكم مركزيًا وسهل الصيانة.


## Decision – Postpone User Registration

User registration and login will not be implemented at the current stage. The platform will remain open for learning paths, articles, tools, and most free resources.

Lead capture will be introduced gradually through selected high-value resources and Tally forms, without forcing registration before users understand the platform value.

Full user accounts may be considered later when the platform includes saved tool results, paid courses, certificates, user dashboards, or client follow-up areas.

## Decision – Start HR Free Resources Before Digital Transformation Service

The next content development priority is the Human Resources free resources pack, because it can quickly strengthen the resources section and provide practical value to visitors.

The digital transformation service will be developed after preparing supporting articles that explain digitization and the evolution from traditional to smart and AI-enabled services.