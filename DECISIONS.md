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

## Decision - Build the French version through high-value pages first

Date: 2026-06-14

Decision:
The French version should continue to be built progressively through high-value pages first, such as Home, Services, About, Contact, and consultation request pages. Broader sections like tools, resources, courses, and service detail pages should be added gradually after the core French visitor path is stable.

Reason:
This keeps translation and maintenance controlled while giving French-speaking visitors a coherent path to understand ConsuTrain and submit a request.

Status: Approved

## Decision - Introduce French tools through landing pages first

Date: 2026-06-14

Decision:
French tools pages should be introduced progressively through a French landing page first. Individual tool interfaces can remain in their current original version until each tool is prioritized for translation or redesign.

Reason:
This gives French-speaking visitors a coherent entry point to available tools without creating a large translation and maintenance burden across all internal tool pages at once.

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


## قرار — تبسيط الهيدر

تم اعتماد الهيدر كمنطقة تنقل أساسية فقط، وعدم تحميله بروابط ثانوية أو وظائف متكررة.

تم حذف رابط "شاركنا رأيك" من الهيدر لتقليل الازدحام وتحسين وضوح التنقل، مع الإبقاء على صفحة feedback.html متاحة من الفوتر وصفحة التواصل.

كما يتم الإبقاء على زر "شارك الفائدة" كأيقونة عائمة مستقلة، لأنها تؤدي وظيفة المشاركة مباشرة ولا تحتاج إلى تكرار داخل الهيدر.

## قرار تنظيمي: هيكلة البريد المهني لمنصة ConsuTrain

تم اعتماد فكرة تنظيم البريد المهني للمنصة وفق استخدامات واضحة، بعد شراء نطاق `consutrain.com` من Cloudflare وربطه بالموقع المستضاف على GitHub Pages.

### الهيكلة المعتمدة مبدئيًا

| البريد | الاستخدام |
|---|---|
| contact@consutrain.com | التواصل العام |
| training@consutrain.com | طلبات الدورات |
| consulting@consutrain.com | طلبات الاستشارات |
| radar@consutrain.com | رادار أدوات الإدارة الرقمية وملفات Google Drive المرتبطة به |
| feedback@consutrain.com | آراء ومقترحات تطوير الموقع والمشكلات التقنية |

### القرار
يتم اعتماد هذه الهيكلة كبنية تنظيمية مستقبلية للبريد المهني، مع إمكانية تعديل الأسماء قبل التنفيذ النهائي إذا ظهرت حاجة أفضل.

### مبدأ أمني
يجب فصل البريد أو حساب Google المرتبط برادار أدوات الإدارة الرقمية عن البريد الذي يستقبل طلبات العملاء ونماذج Tally، حتى لا تختلط بيانات العملاء المحتملين مع ملفات الرادار والمحتوى العام.

### حالة التنفيذ
لم يتم التنفيذ بعد. يتم التفعيل لاحقًا عبر Cloudflare Email Routing أو خدمة بريد مناسبة.


## قرار — تبسيط قائمة الدورات في الهيدر

تم اعتماد أن الهيدر لا يعرض قائمة طويلة بأسماء الدورات.  
تعرض قائمة "الدورات" في الهيدر روابط عامة فقط:
- نظرة عامة
- الدورات المتوفرة
- اطلب دورة متخصصة

تبقى أسماء الدورات وتفاصيلها داخل `courses/index.html` كبطاقات أو أقسام داخلية.  
أي دورة جديدة مستقبلًا تُضاف إلى صفحة الدورات، ولا تُضاف مباشرة إلى القائمة المنسدلة في الهيدر إلا إذا وُجد سبب استراتيجي واضح.

## قرار — تبسيط قائمة الخدمات في الهيدر

تم اعتماد أن الهيدر لا يعرض قائمة طويلة بأسماء الخدمات.  
تعرض قائمة "الخدمات" في الهيدر روابط عامة فقط:
- نظرة عامة
- الخدمات المتوفرة
- اطلب خدمة أو استشارة

تبقى أسماء الخدمات وتفاصيلها داخل `services.html` كبطاقات أو أقسام داخلية.  
أي خدمة جديدة مستقبلًا تُضاف إلى صفحة الخدمات، ولا تُضاف مباشرة إلى القائمة المنسدلة في الهيدر إلا إذا وُجد سبب استراتيجي واضح.


## Decision – Completion Certificates Terminology

ConsuTrain will use the term "شهادة إتمام رقمية" for free introductory trainings.

These certificates confirm that the learner completed the training and passed a short assessment inside the platform. They must not be described as accredited certificates, professional certifications, official licenses, or formal qualifications unless the platform obtains the relevant accreditation in the future.

The first implementation will be an MVP without user login and without automated certificate generation. Certificate automation, QR verification, and user accounts may be added later if the pilot succeeds.

### اعتماد مسار موحد لإصدار شهادات ConsuTrain

تم اعتماد مسار موحد لإصدار الشهادات الرقمية في منصة ConsuTrain، بحيث لا يتم إنشاء Workflow مستقل لكل اختبار أو تدريب. يعتمد النظام على Webhook موحد يستقبل بيانات الاختبار والمتدرب، ثم يحفظها في Google Sheets، ويستدعي Workflow مستقلًا لتوليد الشهادة وإرسالها بالبريد.

يعتمد منع التكرار على حقل `certificateKey`، ويتم تكوينه من:

`trainingId + "-" + email`

وبذلك يحصل المتدرب على شهادة واحدة فقط لكل تدريب، مع السماح له بالحصول على شهادات أخرى في تدريبات مختلفة.

تم اعتماد Workflowين رئيسيين:

- `ConsuTrain – Certificate Submission Collector`
- `ConsuTrain – Certificate Generator and Email Sender`

كما تم اعتماد تشغيل n8n محليًا باستخدام ملف تشغيل خاص يفعّل السماح لعقدة Code باستخدام `fs` و `child_process` لتوليد PDF عبر Chrome Headless.


## اعتماد مسار موحد لإصدار الشهادات الرقمية في ConsuTrain

تم اعتماد مسار موحد لإصدار الشهادات الرقمية في منصة ConsuTrain، بحيث لا يتم إنشاء Workflow مستقل لكل اختبار أو تدريب، بل يتم استخدام Webhook موحد يستقبل بيانات الاختبار والمتدرب، ثم يحفظها في Google Sheets، ويستدعي Workflow فرعيًا لتوليد الشهادة وإرسالها بالبريد.

يعتمد المسار الحالي على Workflowين رئيسيين:

- `ConsuTrain – Certificate Submission Collector`
- `ConsuTrain – Certificate Generator and Email Sender`

يعتمد منع التكرار على حقل:

`certificateKey`

ويتم تكوينه وفق القاعدة التالية:

`trainingId + "-" + email`

وبذلك يحصل المتدرب على شهادة واحدة فقط لكل تدريب، مع السماح له بالحصول على شهادات أخرى في تدريبات مختلفة.

تم اعتماد `submissionId` كمعرّف فريد لكل محاولة اختبار، ويُستخدم لتتبع الطلب وربط السجل داخل Google Sheets.

تم اعتماد تشغيل n8n محليًا في المرحلة الحالية، مع ملف تشغيل خاص يفعّل السماح لعقدة Code باستخدام:

- `fs`
- `child_process`
- `path`

وذلك لتوليد ملفات PDF محليًا عبر Chrome Headless.

تم استبعاد ملفات التشغيل المحلية من Git عبر `.gitignore` لأنها مرتبطة ببيئة Windows المحلية ولا تمثل جزءًا من ملفات الموقع المنشورة.

### اعتماد رسالة واضحة عند تكرار طلب الشهادة

تم اعتماد تحسين تجربة المستخدم عند تكرار طلب شهادة الإتمام لنفس التدريب ونفس البريد.

يعتمد القرار على أن منع التكرار لا يكفي تقنيًا، بل يجب أن يظهر للمستخدم سبب عدم إصدار شهادة جديدة. لذلك تم تعديل مسار n8n وملف JavaScript الخاص بصفحة الاختبار ليتم قراءة رد Webhook وتمييز حالة التكرار.

عند رجوع الرد التالي من n8n:

`status = duplicate`

تعرض صفحة الموقع رسالة واضحة للمستخدم تفيد بأن الشهادة صدرت سابقًا، بدل عرض رسالة التهنئة العامة.

تم اعتماد هذا السلوك كجزء من مسار الشهادات الرقمية في ConsuTrain، ويجب تطبيقه لاحقًا على أي اختبار جديد يستخدم نفس Webhook ونفس آلية إصدار الشهادات.


## قرار — إنشاء صفحة داخلية لإدارة الشهادات الرقمية

تم اعتماد إنشاء صفحة داخلية لإدارة الشهادات الرقمية ضمن:
`admin/certificates/index.html`

لا تظهر هذه الصفحة في الهيدر أو الفوتر العام، لأنها صفحة إدارية وليست موجهة للزوار.

تبدأ الصفحة كواجهة UI/UX ثابتة ببيانات تجريبية، ثم يمكن ربطها لاحقًا مع:
- Google Sheets.
- n8n Webhook.
- Firebase أو قاعدة بيانات.
- نظام تسجيل دخول إداري وصلاحيات.

يجب أن تدعم اللوحة مستقبلًا شهادات صادرة عن اختبارات وبرامج متعددة، وليس اختبارًا واحدًا فقط.
## قرار — إنشاء مدخل إداري داخلي

تم اعتماد إنشاء مدخل إداري داخلي ضمن:
`admin/index.html`

يكون هذا المدخل نقطة وصول مستقبلية لصفحات الإدارة غير العامة، مثل إدارة الشهادات، الطلبات، ملاحظات الزوار، الموارد، والدورات.

لا تتم إضافة صفحات الإدارة إلى الهيدر أو الفوتر العام.  
أي تفعيل مستقبلي للبيانات الحقيقية داخل `/admin/` يجب أن يسبقه تسجيل دخول إداري وصلاحيات وصول مناسبة.

## قرار — إنشاء صفحة داخلية لإدارة طلبات الاستشارة والدورات

تم اعتماد إنشاء صفحة داخلية لإدارة طلبات الاستشارة والدورات ضمن:
`admin/requests/index.html`

لا تظهر هذه الصفحة في الهيدر أو الفوتر العام، لأنها صفحة إدارية وليست موجهة للزوار.

تبدأ الصفحة كواجهة UI/UX ثابتة ببيانات تجريبية، ثم يمكن ربطها لاحقًا مع:
- Tally submissions.
- Google Sheets.
- n8n Webhook.
- Gmail للمتابعة.
- قاعدة بيانات أو لوحة تحكم متقدمة.

يجب حماية هذه الصفحة بتسجيل دخول وصلاحيات قبل عرض أي بيانات حقيقية لأنها ستتعامل مع أسماء، بريد إلكتروني، أرقام هاتف، ورسائل زوار.

### إضافة تصنيف الشهادات لدعم التوسع المستقبلي

تم اعتماد حقول تصنيف إضافية في مسار شهادات ConsuTrain، وهي: `certificateType` و`learningType` و`trainingCategory`. الهدف هو تجهيز المنظومة منذ البداية لدعم الاختبارات المجانية، والدورات المدفوعة، والورش، والبرامج التدريبية ضمن لوحة شهادات موحدة مستقبلًا.

### اعتماد n8n كطبقة وسيطة للوحة إدارة الشهادات

تم اعتماد n8n كطبقة وسيطة بين صفحة لوحة إدارة الشهادات وGoogle Sheets، بدل قراءة Google Sheets مباشرة من الواجهة.

المسار المعتمد حاليًا:

`admin/certificates/index.html`
→ `n8n Admin Certificates List API`
→ `Google Sheets`
→ `JSON منظم`
→ `لوحة الشهادات`

سبب هذا القرار:

* عدم كشف Google Sheets مباشرة للواجهة.
* توحيد شكل البيانات الراجعة للوحة.
* تسهيل إضافة الفلاتر والتحويلات لاحقًا.
* جعل النظام قابلًا للتوسع مع الاختبارات المجانية، الدورات المدفوعة، الورش، والبرامج التدريبية.
* إبقاء صفحة الإدارة في المرحلة الحالية للقراءة فقط، دون عمليات حساسة مثل إعادة الإرسال أو الحذف أو التعديل.

تم اعتماد المرحلة الحالية كـ Read-only MVP، على أن تُضاف لاحقًا إمكانات مثل عرض التفاصيل، إعادة إرسال الشهادة، فتح ملف PDF، وإجراءات الحماية الإدارية بعد استقرار الربط الأساسي.

### اعتماد تفاصيل الشهادة كعرض قراءة فقط داخل اللوحة

تم اعتماد عرض تفاصيل الشهادة داخل نفس صفحة لوحة إدارة الشهادات بدل إنشاء صفحة مستقلة في هذه المرحلة.

يعتمد القرار على أن المرحلة الحالية تهدف إلى تمكين الإدارة من مراجعة بيانات الشهادات بسرعة دون تنفيذ أي إجراء حساس. لذلك تظهر التفاصيل داخل نافذة جانبية قراءة فقط، وتشمل بيانات المتدرب، التدريب، النتيجة، الشهادة، البريد، والتتبع.

تم تأجيل أي إجراءات تنفيذية مثل إعادة إرسال الشهادة أو فتح ملف PDF أو تعديل بيانات الشهادة إلى مرحلة لاحقة، بعد ضبط حماية صفحة الإدارة وWebhooks المرتبطة بها.

هذا القرار يحافظ على بساطة الـ MVP ويقلل مخاطر الاستخدام غير المصرح به قبل استكمال طبقة الحماية.

### اعتماد تحسين واجهة لوحة الشهادات قبل تفعيل الإجراءات الحساسة

تم اعتماد تحسين واجهة لوحة إدارة الشهادات الرقمية في وضع القراءة فقط قبل الانتقال إلى أي إجراءات تنفيذية مثل إعادة إرسال الشهادة أو فتح ملف PDF.

يعتمد هذا القرار على أن تحسين وضوح البيانات والحالات الإدارية يجب أن يسبق تفعيل العمليات الحساسة، حتى يتم اختبار تجربة الاستخدام، والبحث، والفلاتر، وعرض التفاصيل، دون تعريض النظام لمخاطر تشغيلية أو أمنية.

تم الإبقاء على أزرار الإجراءات مثل “فتح PDF” و“إعادة إرسال” في وضع معطل، مع توضيح أن تفعيلها سيكون لاحقًا بعد تنفيذ حماية مناسبة لصفحة الإدارة وWebhooks.

يساعد هذا القرار على إبقاء لوحة الشهادات قابلة للتوسع مستقبلًا لتشمل الاختبارات المجانية، الدورات المدفوعة، الورش، والبرامج التدريبية ضمن واجهة إدارية موحدة.


### اعتماد Cloudflare Access لحماية صفحات الإدارة

تم اعتماد Cloudflare Access كحل حماية أولي لصفحات الإدارة في ConsuTrain بدل بناء نظام تسجيل دخول داخلي في هذه المرحلة.

يغطي القرار المسار:

`/admin/*`

ويشمل صفحات مثل:

`admin/certificates/`
`admin/requests/`

يعتمد الوصول على سياسة تسمح فقط بالبريد الإداري المعتمد، بدل ترك صفحات الإدارة متاحة للعامة. وقد تم استبعاد فكرة وضع Token داخل JavaScript لأن ذلك لا يوفر حماية حقيقية، إذ يمكن لأي مستخدم رؤيته من أدوات المطور.

يسمح هذا القرار بحماية لوحة الإدارة الحالية، مع إبقاء الإجراءات الحساسة مثل إعادة إرسال الشهادات، فتح ملفات PDF، أو تعديل البيانات مؤجلة إلى ما بعد دراسة حماية Webhooks الإدارية نفسها.

تم اعتماد Cloudflare Access كحل مناسب للمرحلة الحالية لأنه سريع التنفيذ، لا يتطلب بناء نظام مصادقة جديد، وقابل للتوسع لاحقًا بإضافة حسابات إدارية أخرى عند الحاجة.


### اعتماد Cloudflare Access لحماية Webhooks الإدارية

تم اعتماد Cloudflare Access كطبقة حماية للـ Webhooks الإدارية المرتبطة بلوحة إدارة ConsuTrain، بحيث لا تكون روابط n8n الإدارية قابلة للوصول المباشر دون تحقق.

يغطي القرار المسار:

`hooks.consutrain.com/webhook/consutrain-admin-*`

ويشمل Webhooks الإدارية التي تُستخدم في قراءة أو إدارة بيانات الشهادات، مثل Webhook قراءة قائمة الشهادات:

`consutrain-admin-certificates-list`

سبب هذا القرار أن حماية صفحة الإدارة وحدها لا تكفي، لأن أي Webhook منشور يمكن استدعاؤه مباشرة إذا عرف المستخدم الرابط. لذلك تم فصل حماية صفحات الإدارة عن حماية Webhooks الإدارية، مع اعتماد نفس البريد الإداري المصرح به للوصول.

تم الحفاظ على مبدأ القراءة فقط في هذه المرحلة، حيث لا تزال إجراءات مثل إعادة إرسال الشهادة، فتح ملف PDF، أو تعديل بيانات الشهادة مؤجلة إلى مرحلة لاحقة، بعد إنشاء Webhooks تنفيذية منفصلة ومحمية ومحددة النطاق.

هذا القرار يعزز أمان لوحة الشهادات قبل الانتقال إلى أي إجراءات حساسة، ويجعل البنية قابلة للتوسع مستقبلًا مع الدورات المدفوعة، الورش، والبرامج التدريبية.

## قرار — اعتماد قاموس مصطلحات النسخة الفرنسية

تم اعتماد ملف `fr-glossary.md` كمرجع لغوي للنسخة الفرنسية من موقع ConsuTrain.

يُستخدم هذا الملف لتوحيد ترجمة المصطلحات الأساسية في الصفحات الفرنسية، مثل:
- Services
- Outils gratuits
- Ressources gratuites
- Formations
- Planification stratégique
- Gestion des risques
- Études de faisabilité

أي ترجمة جديدة للنسخة الفرنسية يجب أن تراجع هذا القاموس لتجنب اختلاف المصطلحات بين الصفحات.

تم التنفيذ.

  - الملف المعدل:
      - partials/header.html

  - أين أضفت زر Français؟
      - في نهاية قائمة التنقل الرئيسية داخل <nav class="main-nav">، بعد قسم تواصل معنا.

  - هل الرابط يشير إلى __ROOT__/fr/index.html؟
    نعم:

    <a class="nav-link nav-link--single" href="__ROOT__/fr/index.html" lang="fr" dir="ltr">Français</a>

  لم أعدّل أي ملفات أخرى، ولم أعمل commit.


  ## قرار — اعتماد شارة صغيرة لتغيير اللغة

تم اعتماد مبدّل اللغة في شكل شارة صغيرة بجانب شعار ConsuTrain بدل وضعه كرابط عادي داخل قائمة التنقل.

في الهيدر العربي تظهر الشارة:
`FR`

وتربط مؤقتًا إلى:
`fr/index.html`

وفي الصفحات الفرنسية تظهر الشارة:
`AR`

وتربط إلى الصفحة العربية المقابلة عند توفرها.

هذا الأسلوب يحافظ على بساطة الهيدر ويجعل تغيير اللغة واضحًا دون مزاحمة روابط التنقل الأساسية.

## قرار — الترجمة الفرنسية التدريجية مع روابط مؤقتة آمنة

تم اعتماد أن النسخة الفرنسية لا تُستكمل دفعة واحدة، بل تُبنى تدريجيًا حسب أولوية الزائر.

عند عدم توفر صفحة فرنسية مقابلة، يتم توجيه الرابط مؤقتًا إلى الصفحة العربية الأصلية بدل إنشاء رابط مكسور داخل مجلد `/fr/`.

هذا القرار يشمل حاليًا روابط الأدوات، الموارد، الدورات، التواصل، وآراء الزوار في الصفحات الفرنسية الأساسية.

يبقى مبدأ عدم تكرار SWOT كأداة مستقلة قائمًا؛ يظهر SWOT فقط ضمن الموارد والقوالب أو كفكرة مستقبلية متقدمة لتحويل SWOT إلى TOWS.

## Decision - Progressive French page creation and internal linking

Date: 2026-06-14

Decision:
French pages will continue to be created progressively. When a French page exists, French navigation should link to the French page internally. When a French equivalent does not exist yet, links may temporarily point back to the Arabic page using the correct relative path.

Reason:
This avoids broken links while allowing the French version to expand in controlled steps without translating the whole website at once.

Operational rule:
Before creating additional French pages, the current French pages should be audited and stabilized. Missing French pages should be prioritized in the roadmap, but new translation work should start only after the existing French visitor path remains consistent.

Navigation rule:
After adding new French landing pages, shared French navigation should be checked for consistent relative links by directory depth before expanding to additional French pages.

Language-switch rule:
Pages that have a French counterpart should use page-specific FR/AR language links. When the shared Arabic header defaults to the French homepage, the page should override the FR badge locally rather than sending visitors to `fr/index.html`.

Status: Approved

## Decision - Translate French service detail pages selectively

Date: 2026-06-15

Decision:
French service detail pages should be translated selectively, starting with high-value services rather than translating every service page at once.

Reason:
This keeps the French version focused and maintainable while giving French-speaking visitors deeper information for priority services. Strategic planning is the first selected French service detail page, followed by feasibility studies, ISO consulting, risk management, project management, and SOP/manuals.

Service detail page rule:
Selected French service detail pages should include breadcrumbs, a short "Dans cette page" internal summary, clear CTA links, and page-specific AR/FR language links.

Status: Approved

## Decision - Introduce French resources through a landing page first

Date: 2026-06-15

Decision:
French resource pages should be introduced progressively through a French resources landing page before translating every individual template, guide, or downloadable resource.

Reason:
This gives French-speaking visitors a coherent entry point to ConsuTrain resources while keeping translation and maintenance controlled. Existing resources and download folders may remain in the original Arabic version until selected high-value resources are prioritized for French adaptation.

Status: Approved

## Decision - Introduce French courses through a landing page first

Date: 2026-06-15

Decision:
French course pages should be introduced progressively through a French courses landing page before translating every course detail page.

Reason:
This gives French-speaking visitors a coherent entry point to ConsuTrain training programs while keeping course translation and maintenance controlled. Existing course detail pages may remain in their original version until selected high-value programs are prioritized for French adaptation.

Status: Approved

## Decision - Introduce French learning content through a landing page first

Date: 2026-06-15

Decision:
French learning content should be introduced progressively through a French learning landing page before translating every article, guide, or learning path.

Reason:
This gives French-speaking visitors a coherent entry point to ConsuTrain learning content while keeping translation and maintenance controlled. Existing learning pages may remain in the original Arabic version until selected high-value articles, paths, and guides are prioritized for French adaptation.

Status: Approved

## Decision - Internal ConsuTrain consultation forms

Date: 2026-06-14

Decision:
Consultation request pages should use internal ConsuTrain forms instead of third-party iframe form embeds. The forms should remain static for now, with temporary submit handling, and be prepared for future n8n webhook integration.

Reason:
This reduces dependency on external form tools, improves visual consistency, and keeps the path open for controlled automation through n8n and Google Sheets later.

Status: Approved

## Decision - Adopt Google Apps Script for simple public form workflows

Date: 2026-06-15

Decision:
After testing the Arabic and French consultation forms, Google Apps Script was adopted as the preferred operational solution for public forms that require only data collection, Google Sheets storage, and Gmail notification.

This decision avoids relying on locally hosted n8n for public form submissions, because local n8n stops when the developer machine is offline. Google Apps Script provides a free and always-available flow suitable for ConsuTrain's current stage.

The consultation form flow is now:

Form submission -> Google Apps Script Web App -> Google Sheet: ConsuTrain Consultation Requests / requests -> Gmail notification -> user success message.

n8n remains part of the project, but its role is shifted toward advanced automation, development experiments, manual triggers, and future workflows that require richer processing.

For course certificates, a future approach may use Google Sheets as the intake/storage layer, then trigger n8n manually to generate certificates and send them to participants. This future certificate workflow is not considered completed yet.

Status: Approved


## قرار — توحيد أيقونات PWA مع شعار ConsuTrain

تم اعتماد شعار ConsuTrain الحالي كمصدر لأيقونات تثبيت التطبيق على الهاتف، بما في ذلك أيقونات maskable.

الهدف هو ضمان ظهور هوية ConsuTrain الصحيحة عند تثبيت الموقع كتطبيق، بدل الأيقونة القديمة التي كانت تعرض حرف C.


### تعليق مؤقت لمسار Google Drive الخاص بالشهادات

تم تعليق مسار ربط الشهادات الرقمية بـ Google Drive مؤقتًا، وليس إلغاءه، وذلك بهدف الانتقال إلى مسار أكثر أولوية حاليًا وهو ربط نماذج طلب الاستشارة في الموقع مع n8n.

وصلنا في مسار الشهادات إلى أن الاعتماد على المسار المحلي لملفات PDF مثل:

`C:\Users\beauh\.n8n-files\...`

غير مناسب للإنتاج، ولا يصلح كأساس مستقر لإعادة إرسال الشهادات أو فتح ملفات PDF من لوحة الإدارة. لذلك تم اعتماد توجه جديد يقضي بأن يتم رفع نسخة من كل شهادة PDF إلى Google Drive بعد توليدها، ثم حفظ بيانات الملف داخل Google Sheets.

المطلوب لاحقًا عند العودة لهذا المسار:

1. إكمال إعداد Google Drive OAuth Credential داخل n8n.
2. تعديل Workflow إصدار الشهادة الأصلي لإضافة عقدة Google Drive Upload بعد توليد PDF.
3. حفظ الحقول التالية في Google Sheets:

   * `certificateDriveFileId`
   * `certificateDriveFileUrl`
4. تعديل Webhook إعادة إرسال الشهادة ليستخدم ملف Google Drive بدل المسار المحلي.
5. الإبقاء على أزرار “فتح PDF” و“إعادة إرسال الشهادة” داخل لوحة الإدارة معطّلة إلى أن يكتمل هذا المسار بشكل آمن.

سبب التعليق المؤقت هو أن مسار نماذج الاستشارة أكثر جاهزية للتنفيذ حاليًا، ويمكن إنجازه دون التأثير على نظام الشهادات أو فتح إجراءات إدارية حساسة قبل اكتمال تخزين ملفات الشهادات بطريقة مستقرة.
