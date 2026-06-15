# PROJECT STATUS — ConsuTrain-MVP

## 1. Purpose of this file

This file records the current status of the ConsuTrain project.

It is used to know:
- what has been completed
- what is currently in progress
- what still needs work
- what decisions are already approved
- what technical or content issues remain open
- what the next practical step should be

This file should be updated after every major development step.

---

## 2. Current project status

The project has reached a structured MVP stage.

The website now includes:
- a clear folder structure
- shared header and footer partials
- main public pages
- learning pages
- service pages
- tools pages
- PWA-related files
- project rules file

The next priority is not to add many new pages, but to stabilize the current version, document decisions, and fix the remaining technical points before further expansion.

---

## 3. Completed items

### 3.1 Main website pages

The following main pages exist:

- `index.html`
- `learn.html`
- `tools.html`
- `services.html`
- `about.html`
- `contact.html`
- `expert.html`

### 3.2 Learning section

The following learning pages exist:

- `learn/articles.html`
- `learn/article.html`
- `learn/glossary.html`
- `learn/ai.html`
- `learn/ai-prompts.html`
- `learn/soft-skills.html`
- `learn/soft-skill.html`
- `learn/topics.html`

### 3.3 Services section

The following service pages exist:

- `services/strategic-planning.html`
- `services/feasibility-studies.html`
- `services/iso-consulting.html`
- `services/project-management.html`

### 3.4 Tools section

The following tools exist:

- `tools/feasibility/indexFeasibility.html`
- `tools/mytodo/index.html`

### 3.5 Shared structure

The following shared files exist:

- `partials/header.html`
- `partials/footer.html`
- `assets/js/includes.js`
- `assets/css/style.css`

### 3.6 PWA-related files

The following PWA-related files exist:

- `manifest.webmanifest`
- `sw.js`
- `offline.html`
- `assets/js/pwa.js`

### 3.7 Project management file

The following project management file exists:

- `PROJECT-RULES.md`

---

## 4. Items currently in progress

The following items are considered in progress:

1. Stabilizing the MVP structure.
2. Reviewing all pages against the project rules.
3. Checking `data-root` values across all pages.
4. Checking relative paths for CSS, JavaScript, and links.
5. Reviewing breadcrumb readiness.
6. Reviewing MyTodo integration inside ConsuTrain.
7. Preparing project management files:
   - `PROJECT-STATUS.md`
   - `DECISIONS.md`
   - `ROADMAP.md`

---

## 5. Items that still need work

### 5.1 Breadcrumbs

The JavaScript logic for breadcrumbs exists, but some pages may still need the visual placeholder:

```html
<div id="breadcrumbs-placeholder"></div>

### Learn – Essential Management Skills Path

Status: Phase 1 Completed

Completed:
- Created and linked `learn/management-skills.html`.
- Added 12 articles covering EMS-01 to EMS-12.
- Linked each lesson to its article and related YouTube video.
- Added SVG educational visuals for all Phase 1 articles.
- Updated `assets/data/articles.json`.

Next:
- Final local/GitHub test for all Phase 1 lesson links.
- Start Phase 2: Leadership, teams, emotional intelligence, and decision-making.

### Learn – Essential Management Skills Path – Phase 2

Status: Completed

Completed:
- Added EMS-13 to EMS-21 articles.
- Covered leadership, leadership styles, situational leadership, emotional intelligence, teamwork, team development, and decision-making.
- Linked each lesson to its article and YouTube video.
- Added SVG visuals for all Phase 2 articles.
- Updated `assets/data/articles.json`.
- Updated `learn/management-skills.html`.

Next:
- Final test of all Phase 2 links and visuals.
- Start Phase 3: Project management and methodologies.

### Learn – Knowledge Library Enhancement

Status: In Progress / Stable for Testing

Completed:
- Renamed the articles section conceptually to "مكتبة المعرفة الإدارية".
- Updated the page title and introductory text.
- Updated the learning dropdown menu label to "مكتبة المعرفة".
- Added a topic dropdown for easier filtering.
- Kept popular topics visible for quick discovery.
- Added a toggle to show or hide the full keyword list.
- Preserved the existing search function.
- Preserved card/table view switching.
- Updated the knowledge library data with the latest management skills and project management articles.

Testing Required:
- Verify that the header dropdown shows "مكتبة المعرفة" instead of "المقالات".
- Verify that `learn/articles.html` opens correctly.
- Verify that the search bar works.
- Verify that the topic dropdown filters articles correctly.
- Verify that popular tags filter articles correctly.
- Verify that the full keyword list is hidden by default and appears only when requested.
- Verify mobile display and spacing.

Next:
- Continue testing the Learn section.
- Later, consider adding a domain-based classification layer for the knowledge library:
  Project Management, Strategic Planning, Institutional Excellence, Operations Management, Administrative Skills, AI for Management, Tools and Templates.


  ### Learn – Knowledge Library Enhancement

Status: Completed

Completed:
- Renamed the articles section to "مكتبة المعرفة الإدارية".
- Unified the naming across the page, header, JavaScript messages, and interface labels.
- Replaced inconsistent labels such as "المقالات" and "المكتبة المعرفية".
- Added topic dropdown filtering.
- Added popular topic tags.
- Added show/hide control for the full keyword list.
- Preserved search, card view, and table view.
- Tested the page successfully and confirmed stability.

Closed:
- Knowledge Library naming and filtering enhancement is now stable.

### Learn – Knowledge Library and Management Skills Navigation

Status: Completed

Completed:
- Knowledge Library page is stable.
- Unified naming as "مكتبة المعرفة الإدارية" and "مكتبة المعرفة".
- Repositioned the card/table view buttons below the popular topics and keyword controls.
- Added phase filtering to the Management Skills path page.
- Restored the Soft Skills page link.
- Added the Management Skills path as a separate link in the Learn dropdown.
- Fixed Learn dropdown links to avoid duplicated paths such as `learn/learn/management-skills.html`.
- Tested navigation successfully.

Closed:
- Knowledge Library interface enhancement.
- Management Skills path navigation enhancement.
### Structure + Monetization – Free Resources Library

Status: Completed / Ready for Review

Completed:
- Added a new section for free resources under `resources/index.html`.
- Added 32 downloadable starter resources under categorized folders inside `resources/downloads/`.
- Organized resources into eight categories:
  Strategic Planning, Operational Plans, ISO and Quality, Risk Management, Feasibility Studies, Project Management, SOP and Procedures, and AI for Management.
- Added filter buttons on the resources page to help visitors browse by category.
- Added the Resources link to the shared header.
- Added Resources links to the homepage and `start-here.html`.
- Updated the Service Worker cache version and included `resources/index.html` in the precache list.

Notes:
- The current downloadable files are lightweight Markdown starter templates. They can later be converted into Word, PDF, Excel, or interactive web templates.
- Future service pages should remain scalable because more consulting services will be added gradually.

Next:
- Review the resources page visually on desktop and mobile.
- Decide whether to convert selected high-value resources into PDF/Word lead magnets.
- Later, connect each resource more precisely to its related service page.


### Resources downloads organization update
- Reorganized free resource download files under `resources/downloads/` by category folders.
- Updated `resources/index.html` download links to point to the new categorized paths.
- The old flat `resources/downloads/*.md` structure is no longer used.


## 2026-05-06 — Free Resources downloadable files integrated

- Moved the uploaded Word/PDF download files into categorized folders under `resources/downloads/`.
- Operational plan files were placed under `resources/downloads/operational-plans/`.
- Simple risk register files were placed under `resources/downloads/risk-management/`.
- ConsuTrain profile PDF was placed under `resources/downloads/profile/`.
- Updated `resources/index.html` to link to the Word/PDF versions where available.
- Confirmed that no root-level `/downloads/` folder is needed in the updated package.

## 2026-05-06 — Templates linked to Free Resources

Status: Completed / Ready for Review

Completed:
- Added a dedicated `templates/` section for resources that need explanation pages before download.
- Created `templates/index.html` as a lightweight listing page for explained templates.
- Created explanation pages for:
  - `templates/operational-plan-template.html`
  - `templates/operational-plan-checklist.html`
  - `templates/simple-risk-register.html`
- Linked the related cards in `resources/index.html` to their explanation pages.
- Kept downloadable Word/PDF files under categorized folders inside `resources/downloads/`.
- Added CSS support for template detail pages.
- Updated the Service Worker cache version and precache list for the new template pages.

Decision applied:
- Each important free resource should have a useful explanation page inside the website, not only a download link.

Next:
- Review the template pages visually on desktop and mobile.
- Apply the same model gradually to the remaining free resources.


## 2026-05-06 — KPI Performance Card resource finalized

Status: Completed / Ready for Review

Completed:
- Added a new explained free resource page: `templates/kpi-performance-card.html`.
- Added the downloadable Word file: `resources/downloads/performance-management/ConsuTrain_KPI_Performance_Card_AR.docx`.
- Added the PDF preview: `resources/downloads/performance-management/ConsuTrain_KPI_Performance_Card_AR.pdf`.
- Updated `resources/index.html` to replace the old lightweight KPI Markdown resource with the professional Word/PDF version and explanation page.
- Updated `templates/index.html` to include the KPI resource.
- Restored the stronger explanation-page style for the three previously prepared resources and updated their download paths to the categorized `resources/downloads/` structure.
- Rendered and visually checked the KPI DOCX output before packaging.
- Added `services/book-consultation.html` because template CTA links point to this consultation page and the current package did not include it.

Decision applied:
- For future free resources, the basic model will first be presented textually for review before preparing the downloadable file and explanation page.

## 2026-05-06 — Operational Plan Follow-up Report resource finalized

Status: Completed / Ready for Review

Completed:
- Added a new explained free resource page: `templates/operational-plan-follow-up-report.html`.
- Added the downloadable Word file: `resources/downloads/operational-plans/ConsuTrain_Operational_Plan_Follow_Up_Report_AR.docx`.
- Added the PDF preview: `resources/downloads/operational-plans/ConsuTrain_Operational_Plan_Follow_Up_Report_AR.pdf`.
- Updated `resources/index.html` by upgrading the former operational follow-up starter resource into a professional Word/PDF resource with an explanation page.
- Updated `templates/index.html` to include the operational plan follow-up report resource.
- Updated the Service Worker cache version and precache list.
- Rendered and visually checked the DOCX output before packaging.

Decision applied:
- Approved resources are upgraded into a downloadable file and a dedicated explanation page after the basic model is reviewed.


## 2026-05-06 — Stakeholder Register resource finalized

Status: Completed / Ready for Review

Completed:
- Added a new explained free resource page: `templates/stakeholder-register.html`.
- Added the downloadable Word file: `resources/downloads/project-management/ConsuTrain_Stakeholder_Register_AR.docx`.
- Added the PDF preview: `resources/downloads/project-management/ConsuTrain_Stakeholder_Register_AR.pdf`.
- Updated `resources/index.html` by upgrading the former stakeholder register starter resource into a professional Word/PDF resource with an explanation page.
- Updated `templates/index.html` to include the stakeholder register resource.
- Updated the Service Worker cache version and precache list.
- Rendered and visually checked the DOCX output before packaging.

Decision applied:
- Approved resource models are upgraded into a downloadable file and a dedicated explanation page after the basic model is reviewed.

### Resource update - Project Charter

- Added `templates/project-charter.html` as the explanation page for the free Project Charter resource.
- Added Word/PDF files under `resources/downloads/project-management/`.
- Updated `resources/index.html` and `templates/index.html` to link the resource.



### إضافة مورد مجاني: نموذج خطة تواصل المشروع
- تمت إضافة صفحة شرح: `templates/project-communication-plan.html`.
- تمت إضافة ملفات التحميل: `resources/downloads/project-management/ConsuTrain_Project_Communication_Plan_AR.docx` ونسخة PDF.
- تم ربط المورد داخل `resources/index.html` و `templates/index.html`.


### إضافة مورد مجاني: نموذج محضر اجتماع ومتابعة القرارات
- تمت إضافة صفحة شرح: `templates/meeting-minutes-decision-tracking.html`.
- تمت إضافة ملف Word قابل للتعديل: `resources/downloads/project-management/ConsuTrain_Meeting_Minutes_Decision_Tracking_AR.docx`.
- تم ربط المورد داخل `resources/index.html` و `templates/index.html`.
- تم عرض ملف Word بصريًا بعد الإنشاء للتحقق من سلامة الجداول والتنسيق.

- تمت إضافة نسخة PDF لمورد نموذج محضر اجتماع ومتابعة القرارات للمعاينة، وتحديث روابط صفحة المورد وصفحتي الموارد والقوالب.

## تحديث الموارد المجانية - سجل الإجراءات التصحيحية والتحسينية

تم اعتماد مورد مجاني جديد بعنوان: نموذج سجل الإجراءات التصحيحية والتحسينية. تمت إضافة صفحة شرح داخل templates، وملفات تحميل Word/PDF داخل resources/downloads/iso-quality، وتحديث صفحات الموارد والقوالب ونسخة الكاش في sw.js.

### مورد جديد: نموذج خطة التدقيق الداخلي
تمت إضافة مورد مجاني جديد ضمن ISO والجودة، ويشمل صفحة شرح وملفي تحميل Word وPDF داخل resources/downloads/iso-quality.

### مورد جديد: قائمة تحقق التدقيق الداخلي ISO 9001
تمت إضافة مورد مجاني جديد ضمن ISO والجودة، ويشمل صفحة شرح وملفي تحميل Word وPDF داخل resources/downloads/iso-quality.
- تمت إضافة مورد مجاني جديد: نموذج سجل عدم المطابقة، مع صفحة شرح وملفات Word/PDF ضمن قسم ISO والجودة.


### مورد مجاني جديد - نموذج سياسة الجودة
تمت إضافة نموذج سياسة الجودة ضمن موارد ISO والجودة، مع تضمين أهداف جودة قابلة للقياس داخل السياسة، وإضافة صفحة شرح وملفات Word/PDF.
- إضافة مورد مجاني جديد: نموذج أهداف الجودة ومؤشرات القياس، مع صفحة شرح وملفات Word/PDF ضمن قسم ISO والجودة.
- إضافة مورد مجاني جديد: نموذج سجل ضبط الوثائق والسجلات، مع إدراج صنف الوثائق الخارجية مثل التشريعات والقوانين واللوائح والمعايير ذات العلاقة.
- تمت إضافة مورد مجاني جديد: نموذج سجل الشكاوى ورضا العملاء / المستفيدين بصيغتي Word وPDF، مع صفحة شرح داخل templates وربطه ضمن الموارد المجانية.


- إضافة مورد مجاني: نموذج مراجعة الإدارة لنظام الجودة، مع صفحة شرح وملفات Word/PDF ضمن موارد ISO والجودة.

### تحديث الموارد المجانية - نموذج خطة تحسين العمليات
تم اعتماد وإضافة مورد جديد بعنوان "نموذج خطة تحسين العمليات" ضمن موارد ISO والجودة، مع صفحة شرح وملفات تحميل Word/PDF داخل resources/downloads/iso-quality.

### تحديث الموارد المجانية - نموذج بطاقة عملية
تم اعتماد وإضافة مورد جديد بعنوان "نموذج بطاقة عملية" ضمن موارد الأدلة والإجراءات، مع صفحة شرح وملفات تحميل Word/PDF داخل resources/downloads/sop-procedures. يتضمن النموذج جدولًا خاصًا بالموارد اللازمة لتفعيل العملية: بشرية، مادية، مالية، ومعرفية.

### تحديث الموارد المجانية - نموذج إجراء تشغيلي SOP
تم اعتماد وإضافة مورد جديد بعنوان "نموذج إجراء تشغيلي SOP" ضمن موارد الأدلة والإجراءات، مع صفحة شرح وملفات تحميل Word/PDF داخل resources/downloads/sop-procedures. يوضح النموذج الغرض والنطاق والمسؤوليات والمدخلات وخطوات التنفيذ والمخرجات والسجلات والمؤشرات والمخاطر ومعايير الجودة وحالات التصعيد.

- تمت إضافة مورد نموذج تحليل SWOT ضمن موارد التخطيط الاستراتيجي، مع صفحة شرح وملفات Word/PDF.

- تمت إضافة مورد نموذج تحليل PESTEL ضمن موارد التخطيط الاستراتيجي، مع صفحة شرح وملفات Word/PDF.


## تحديث - مورد نموذج بطاقة هدف استراتيجي
تم اعتماد وإضافة نموذج بطاقة هدف استراتيجي ضمن موارد التخطيط الاستراتيجي، مع صفحة شرح وملفات Word/PDF وروابط في الموارد والقوالب.


## تحديث - مورد نموذج سجل المبادرات الاستراتيجية
تم اعتماد وإضافة نموذج سجل المبادرات الاستراتيجية ضمن موارد التخطيط الاستراتيجي، مع صفحة شرح وملفات Word/PDF وروابط في الموارد والقوالب.


## تحديث - مورد قائمة تحقق لمراجعة الخطة الاستراتيجية
تم اعتماد وإضافة قائمة تحقق لمراجعة الخطة الاستراتيجية ضمن موارد التخطيط الاستراتيجي، مع صفحة شرح وملفات Word/PDF وروابط في الموارد والقوالب.


## تحديث - مورد تحويل الأهداف إلى أنشطة تنفيذية
تم اعتماد وإضافة نموذج تحويل الأهداف إلى أنشطة تنفيذية ضمن موارد الخطط التشغيلية، مع تضمين مفهوم WBS ومصفوفة RACI مختصرة، وصفحة شرح وملفات Word/PDF.

- تمت إضافة مورد مجاني جديد: نموذج مصفوفة تقييم المخاطر ضمن قسم إدارة المخاطر، مع صفحة شرح وملفات Word/PDF.


- تمت إضافة مورد مجاني جديد: نموذج خطة معالجة المخاطر ضمن قسم إدارة المخاطر، مع صفحة شرح وملفات Word/PDF وروابط في الموارد والقوالب.


### تم إضافة مورد: قائمة تحقق لمراجعة نظام إدارة المخاطر
تمت إضافة صفحة الشرح `templates/risk-management-system-review-checklist.html` وملفات التحميل Word/PDF ضمن `resources/downloads/risk-management/`، مع تحديث صفحة الموارد والقوالب والكاش.


### مورد جديد - نموذج وصف فكرة مشروع
تمت إضافة صفحة الشرح `templates/project-idea-description-template.html` وملفات التحميل `resources/downloads/feasibility-studies/ConsuTrain_Project_Idea_Description_Template_AR.docx` و`ConsuTrain_Project_Idea_Description_Template_AR.pdf`، وتحديث صفحات الموارد والقوالب.


### مورد جديد - نموذج تحليل السوق
تمت إضافة صفحة الشرح `templates/market-analysis-template.html` وملفات التحميل `resources/downloads/feasibility-studies/ConsuTrain_Market_Analysis_Template_AR.docx` و`ConsuTrain_Market_Analysis_Template_AR.pdf`، وتحديث صفحات الموارد والقوالب.

### تحديث الموارد المجانية - نموذج تقدير التكاليف الأولية
تم اعتماد وإضافة مورد جديد ضمن دراسات الجدوى بعنوان "نموذج تقدير التكاليف الأولية"، مع صفحة شرح وملفات Word/PDF، وربطه بأداة دراسة الجدوى داخل الموقع.


### مورد جديد - قائمة تحقق قبل دراسة الجدوى
تمت إضافة صفحة شرح وملفات Word/PDF لمورد قائمة تحقق قبل دراسة الجدوى ضمن موارد دراسات الجدوى، مع ربط المورد بأداة دراسة الجدوى.


### مورد جديد - نموذج متابعة مهام المشروع
تمت إضافة صفحة شرح وملفات Word/PDF لمورد نموذج متابعة مهام المشروع ضمن موارد إدارة المشاريع.


### مورد جديد - نموذج تقرير حالة مشروع
تمت إضافة صفحة شرح وملفات Word/PDF لمورد نموذج تقرير حالة مشروع ضمن موارد إدارة المشاريع.

- تم إضافة مورد مجاني جديد: قائمة تحقق لمراجعة دليل الإجراءات، مع صفحة شرح وملفات Word/PDF ضمن قسم الأدلة والإجراءات.
- تمت إضافة مورد مجاني جديد: قائمة تحقق جاهزية ISO 9001، مع صفحة شرح وملفات Word/PDF.
- تمت إضافة مورد نموذج إجراء تصحيحي ضمن موارد ISO والجودة مع صفحة شرح وملفات Word/PDF.

## تحديث الموارد المجانية - حزمة Prompts للتخطيط الاستراتيجي
- تم تفعيل مورد حزمة Prompts للتخطيط الاستراتيجي ضمن صفحة الموارد المجانية.
- تم إنشاء صفحة شرح للمورد وربطها بملفات Word وPDF.
- تم تنظيف صفحة القوالب وإعادة بنائها من بطاقات الموارد المشروحة لتجنب التكرار أو وضع بطاقات خارج الشبكة.

- 2026-05-07: تمت إضافة مورد حزمة Prompts لدراسة الجدوى مع صفحة شرح وملفات Word/PDF وربطه بصفحة الموارد والقوالب.

- تمت إضافة مورد حزمة Prompts لإدارة المشاريع والجودة ضمن موارد الذكاء الاصطناعي للإدارة، مع صفحة شرح وملفات Word/PDF وروابط مفعلة في الموارد والقوالب.


### Learn – Goal Management Path

Status: In Progress

Completed:
- Added a new Learn path page: `learn/goal-management.html`.
- Added the path link to the Learn dropdown menu.
- Created an initial lesson structure for YJ-35 to YJ-40.
- Covered MBO, SMART, BSC, and OKRs as the core sequence.
- Kept video and article buttons as pending until verified links and articles are added.

Next:
- Add verified YouTube links for each lesson.
- Start creating the first article: "مدخل إلى إدارة الأهداف: من MBO إلى OKRs".
- Add each article to `assets/data/articles.json` and link it from the path page.


### Learn – Futures and Scenario Planning Path

Status: Initial Path Created

Completed:
- Created `learn/futures-and-scenarios.html`.
- Added the path to the Learn dropdown.
- Added ten lessons from YJ-24 to YJ-33.
- Linked each lesson to its matched F&S YouTube video.
- Preserved global floating buttons through the shared `includes.js` and `style.css`.

Next:
- Review the page visually on desktop and mobile.
- Later, create Knowledge Library articles for the lessons one by one.


## عناصر يجب الحفاظ عليها دائمًا

- زر ابدأ من هنا في الهيدر
- زر الدورات في الهيدر
- رابط شاركنا رأيك تحت تواصل معنا
- زر تواصل سريع عائم
- زر الصعود للأعلى
- روابط Tally/WhatsApp/Email
- صفحة القوالب
- صفحات الخدمات الأساسية


## آخر تحديث — تحسين بنية التعلّم والأدوات والموارد

تم إغلاق حزمة تحسينات واجهة وتجربة المستخدم لمنصة ConsuTrain، وشملت:

- إعادة تنظيم قائمة التعلّم.
- إنشاء صفحة المسارات التعليمية.
- اعتماد المسارات التعليمية الحالية:
  - مسار الذكاء الاصطناعي في الإدارة.
  - مسار المهارات الناعمة.
  - مسار استشراف المستقبل والتخطيط بالسيناريو.
  - مسار المهارات الإدارية الأساسية.
- تحويل تسمية المقالات إلى مكتبة المعرفة.
- فصل المقالات العامة عن دروس المسارات التعليمية.
- تحسين صفحة الموارد المجانية كبطاقات.
- تحسين صفحة منظّم مهامي.
- اعتماد الأدوات الخمس كأدوات مجانية مستقلة.
- حذف زر الرجوع إلى منظّم مهامي من صفحات الأدوات المستقلة.
- تحديث Service Worker لضمان ظهور النسخة الجديدة للمستخدمين.

## آخر تحديث - تثبيت مساعد دراسة الجدوى الأولية

تم تثبيت مساعد دراسة الجدوى الأولية كأداة مجانية مستقلة داخل قسم الأدوات. تعرض نسخة الزائر الآن إجراءات مبسطة فقط: الحفظ المحلي وتصدير PDF، مع توجيه واضح إلى خدمة دراسة الجدوى الاحترافية عند الحاجة إلى تحليل متكامل.

## آخر تحديث - نموذج طلب دراسة الجدوى الاحترافية

تم تضمين نموذج طلب دراسة الجدوى الاحترافية داخل صفحة مساعد دراسة الجدوى الأولية باستخدام نموذج Tally مخصص، ليتمكن الزائر من إرسال طلب الخدمة دون مغادرة صفحة الأداة.

## آخر تحديث - أداة ومضة إدارية

تم إنشاء النسخة الأولى MVP من أداة "ومضة إدارية" وربطها من صفحة الأدوات والصفحة الرئيسية، مع ومضات مبدئية حسب المستوى والمجال وروابط تطبيقية داخلية.

## آخر تحديث - توسيع ومضة إدارية

تمت إضافة "ومضة إدارية" إلى قائمة الأدوات، وتوسيع مكتبة الومضات إلى ثلاثة ومضات على الأقل لكل مجال ومستوى.

## آخر تحديث - مشاركة ومضة إدارية

تم تحسين تجربة مشاركة أداة "ومضة إدارية" لتشمل واتساب وLinkedIn ونسخ الومضة إلى الحافظة.

## آخر تحديث - مشاركة الصفحة الرئيسية

تمت إضافة قسم مشاركة في الصفحة الرئيسية يتيح للزوار مشاركة ConsuTrain عبر واتساب وLinkedIn أو نسخ رابط الموقع.

## آخر تحديث - تجربة شارك الفائدة العامة

تمت إضافة تجربة "شارك الفائدة" العامة وتشمل قسمًا في أسفل الصفحة الرئيسية، ورابطًا في الفوتر، ورابطًا في قائمة التواصل، وزر مشاركة عائمًا بسهم منحني متوافق مع هوية ConsuTrain.

## آخر تحديث - اعتماد ومضة إدارية وتجربة شارك الفائدة

تم اعتماد "ومضة إدارية" كأداة تفاعلية رسمية ضمن أدوات ConsuTrain. الأداة مرتبطة من صفحة الأدوات ومميزة في الصفحة الرئيسية، وتقدم ومضات قصيرة في الإدارة والأعمال حسب مستوى المستخدم واهتمامه. تشمل الأداة خيارات مشاركة عبر واتساب وLinkedIn ونسخ الومضة.

تم أيضًا اعتماد تجربة "شارك الفائدة" العامة، وتشمل زر مشاركة عائمًا، وقسم مشاركة في أسفل الصفحة الرئيسية، ورابطًا في الفوتر، ورابطًا في قائمة التواصل.


### ربط الدومين الرسمي لمنصة ConsuTrain

تم ربط الدومين الرسمي `consutrain.com` بمنصة ConsuTrain المستضافة على GitHub Pages، من خلال إدارة DNS عبر Cloudflare.

الإعدادات المعتمدة:
- الدومين الأساسي: consutrain.com
- الاستضافة: GitHub Pages
- إدارة DNS: Cloudflare
- سجلات A للدومين الأساسي موجهة إلى GitHub Pages
- سجل CNAME للـ www موجه إلى beauhope.github.io
- حالة DNS في GitHub: DNS check successful
- الخطوة التالية: تفعيل Enforce HTTPS ثم اختبار الموقع كاملًا على الدومين الرسمي

### تفعيل Cloudflare Web Analytics

تم الوصول إلى صفحة Web Analytics داخل Cloudflare للدومين `consutrain.com`، وتم اعتماد تفعيل Real User Measurements (RUM) على مستوى الموقع عبر خيار Enable Globally، بهدف متابعة أداء الموقع وتجربة المستخدم والصفحات الأكثر زيارة بعد إطلاق الدومين الرسمي.


# PROJECT STATUS – ConsuTrain

## آخر تحديث: 2026-05-12

## الحالة العامة

منصة ConsuTrain تعمل حاليًا كموقع Static Site منشور على GitHub Pages ومربوط بالدومين:

`https://consutrain.com`

الموقع مستقر تقنيًا، ويعمل محليًا عبر:

`npx serve . -l 8000`

ثم فتح:

`http://localhost:8000`

## ما تم اعتماده مؤخرًا

### 1. الصفحة الرئيسية

تم اعتماد الصفحة الرئيسية كواجهة عملية وتسويقية مختصرة.

تعرض الصفحة الآن:

- الدورات.
- الورش التطبيقية.
- الموارد والأدوات المجانية.
- الخدمات الاستشارية المدفوعة.
- أحدث الإضافات.
- المسارات العملية حسب احتياج الزائر.

الحالة: مكتملة ومعتمدة.

---

### 2. صفحة "ابدأ من هنا"

تم تحويل صفحة "ابدأ من هنا" إلى موجه طريق عملي يساعد الزائر على اختيار المسار المناسب.

تعرض الصفحة خيارات مثل:

- التعلم من خلال الدورات.
- التطبيق من خلال الورش.
- البدء بالأدوات والموارد المجانية.
- طلب خدمة استشارية عند الحاجة إلى تنفيذ مخصص.

الحالة: مكتملة ومعتمدة.

---

### 3. قسم الورش التطبيقية القصيرة

تم إنشاء صفحة مستقلة للورش التطبيقية:

`courses/practical-workshops/`

وتضم 6 ورش تطبيقية:

1. إعداد بطاقة مؤشر KPI.
2. بناء بطاقة أداء متوازن BSC.
3. كتابة عدم المطابقة والإجراء التصحيحي.
4. إعداد مصفوفة الصلاحيات والمسؤوليات.
5. صياغة الأهداف SMART.
6. إعداد سجل المخاطر وتعبئته.

الحالة: مكتملة ومعتمدة.

---

### 4. صفحة الخدمات

تم تعديل سلوك أكورديون الخدمات بحيث تكون جميع الأقسام مغلقة افتراضيًا عند فتح الصفحة.

الحالة: مكتملة ومعتمدة.

---

### 5. Service Worker / Cache

يجب تحديث `sw.js` عند كل تعديل مهم في:

- الهيدر.
- الصفحة الرئيسية.
- صفحة ابدأ من هنا.
- صفحة الخدمات.
- صفحات الدورات والورش.
- ملفات CSS أو JavaScript.

الحالة: يحتاج متابعة مستمرة عند كل تعديل.


## ملفات مهمة حاليًا

- `index.html`  
  الصفحة الرئيسية المعتمدة.

- `start-here.html`  
  صفحة التوجيه العملية "ابدأ من هنا".

- `services.html`  
  صفحة الخدمات الاستشارية.

- `courses/index.html`  
  صفحة الدورات الرئيسية.

- `courses/practical-workshops/index.html`  
  صفحة الورش التطبيقية القصيرة.

- `partials/header.html`  
  الهيدر الرئيسي.

- `partials/footer.html`  
  الفوتر الرئيسي.

- `sw.js`  
  ملف Service Worker والكاش.

- `assets/css/style.css`  
  ملف التنسيق الرئيسي.

- `assets/js/includes.js`  
  ملف تحميل partials والسلوك العام.

  ## تحديث – ربط الخدمات بالدورات والورش

تم اعتماد تحسين صفحة الخدمات وربط كل خدمة بما يدعمها من دورات وورش وموارد قادمة.

### ما تم

- ربط الخدمات الاستشارية بالدورات المناسبة.
- ربط الخدمات بالورش التطبيقية القصيرة.
- إضافة قسم "يدعم هذه الخدمة" داخل كل خدمة.
- الإشارة إلى الموارد أو النماذج القادمة عند عدم توفر رابط جاهز.
- الحفاظ على أكورديون الخدمات مغلقًا افتراضيًا.
- التأكد من أن صفحة الخدمات مناسبة على الهاتف واللابتوب.

### الهدف من التحديث

توضيح رحلة الزائر داخل الموقع وفق المسار التالي:

`مورد مجاني → دورة → ورشة → خدمة استشارية`

وبذلك لا تبقى الخدمات منفصلة عن المحتوى التعليمي والتطبيقي، بل تصبح مرتبطة بمنظومة ConsuTrain الكاملة.

### الحالة

مكتمل ومعتمد.

## تحديث – إزالة تكرار أداة SWOT

تم إلغاء الصفحة المكررة التي كانت ستكرر مورد SWOT المجاني الموجود مسبقًا.

### ما تم

- حذف صفحة الأداة المكررة من مجلد الأدوات.
- إزالة بطاقة أداة SWOT المكررة من صفحة الأدوات.
- إزالة رابط الأداة من قائمة الأدوات المجانية في الهيدر.
- الإبقاء على مورد/قالب SWOT المجاني الحالي دون تعديل.

### الحالة

تمت إزالة التكرار.

## تحديث – اعتماد صفحة التواصل Contact / Conversion

تم تحسين صفحة التواصل `contact.html` واعتمادها كصفحة تحويل عملية تساعد الزائر على اختيار طريقة التواصل المناسبة حسب نوع احتياجه.

### ما تم

- تحسين توجيه الزائر حسب نوع الطلب.
- توضيح الفرق بين:
  - طلب خدمة استشارية.
  - طلب دورة تدريبية.
  - طلب ورشة تطبيقية.
  - طلب عرض سعر.
  - استفسار عام.
  - ملاحظة أو اقتراح على الموقع.
- ربط صفحة التواصل بالصفحات المناسبة:
  - الخدمات.
  - الدورات.
  - الورش التطبيقية.
  - صفحة "ابدأ من هنا".
  - صفحة الملاحظات.
- توضيح ماذا يحتاج الزائر لذكره في الطلب.
- توضيح الخطوات المتوقعة بعد إرسال الطلب.
- الحفاظ على الصفحة مختصرة ومناسبة للهاتف واللابتوب.

### الهدف من التحديث

تحسين مسار التحويل داخل الموقع، بحيث لا يبقى الزائر أمام محتوى فقط، بل يجد طريقًا واضحًا للتواصل وطلب الخدمة أو الدورة أو الورشة المناسبة.

### الحالة

مكتمل ومعتمد.

## تحديث – اعتماد مسار الاقتصاد والأعمال الدولية

تم إنشاء واعتماد مسار تعليمي جديد بعنوان "الاقتصاد والأعمال الدولية" ضمن قسم المسارات التعليمية.

### ما تم

- إنشاء صفحة المسار:
  `learn/business-economics/`
- تنظيم المسار في 6 وحدات تعليمية.
- إضافة 26 درسًا.
- ربط الدروس بفيديوهات YouTube المتاحة.
- إنشاء صفحة مقال مستقلة لكل درس.
- تعبئة المقالات التعليمية لجميع الدروس من 01 إلى 26.
- اعتماد بطاقات دروس مختصرة تحتوي على:
  - عنوان الدرس.
  - زر شاهد الفيديو.
  - زر اقرأ المقال.
- عدم نشر ملفات PDF الأصلية داخل الموقع.
- إبقاء المسار داخل صفحة المسارات التعليمية فقط.

### الحالة

مكتمل ومعتمد.


## Friendly Use — زر العودة للصفحة السابقة

تمت إضافة زر واضح بعنوان "العودة للصفحة السابقة" في الصفحات الداخلية التي تحتوي على Breadcrumbs.  
الزر يظهر أسفل مسار التنقل، ولا يظهر في الصفحة الرئيسية.  
يعمل الزر بالعودة إلى الصفحة السابقة داخل الموقع عند توفر سجل تصفح مناسب، وفي حال عدم توفره يوجه المستخدم إلى الصفحة الرئيسية.  
تم اختبار الزر وظهر بشكل مناسب، واستقرت حركة التنقل.


## تحديث – اعتماد مسار استراتيجيات بورتر العامة للتنافس

تم إنشاء واعتماد مسار تعليمي جديد بعنوان "استراتيجيات بورتر العامة للتنافس" ضمن قسم المسارات التعليمية.

### ما تم

- إنشاء صفحة المسار:
  `learn/porter-generic-strategies/`
- إضافة 5 دروس تعليمية.
- ربط الدروس 1 إلى 4 بفيديوهات YouTube.
- إبقاء الدرس الخامس دون رابط فيديو إلى حين توفر رابط مؤكد.
- إنشاء صفحة مقال مستقلة لكل درس.
- تعبئة المقالات التعليمية الخمسة.
- عدم نشر ملفات PDF الأصلية داخل الموقع.
- إضافة المسار إلى صفحة المسارات التعليمية.
- تحديث `sw.js` بعد اعتماد المسار.

### الحالة

مكتمل ومعتمد. 


## تحديث – اعتماد مسار تحليل سلسلة القيمة لبورتر

تم إنشاء واعتماد مسار تعليمي جديد بعنوان "تحليل سلسلة القيمة لبورتر" ضمن قسم المسارات التعليمية.

### ما تم

- إنشاء صفحة المسار:
  `learn/value-chain-analysis/`
- إضافة 3 دروس تعليمية.
- ربط الدروس الثلاثة بفيديوهات YouTube.
- إنشاء صفحة مقال مستقلة لكل درس.
- تعبئة المقالات التعليمية الثلاثة.
- عدم نشر ملفات PDF الأصلية داخل الموقع.
- إضافة المسار إلى صفحة المسارات التعليمية.
- تحديث `sw.js` بعد اعتماد المسار.

### الحالة

مكتمل ومعتمد.


## تحديث – إضافة أدلة التحول الرقمي والرقمنة

تمت إضافة دليلين جديدين ضمن قسم التعلّم ومكتبة المعرفة:

- دليل رقمنة المؤسسات:
  `learn/digitization-guide.html`

- دليل من الخدمة الورقية إلى الخدمة الذاتية الذكية:
  `learn/digital-services-evolution.html`

### ما تم

- إعداد الدليلين بنفس تنسيق الأدلة الطويلة في الموقع.
- إضافة بطاقاتهما في صفحة التعلّم.
- إدراجهما في مكتبة المعرفة الإدارية.
- ربط الدليلين بخدمة طلب إعداد خارطة طريق الرقمنة عبر صفحة:
  `quote-request.html`
- تحديث `sw.js` بعد اعتماد الإضافات.

### الحالة

مكتمل ومعتمد.


## Header Simplification

تم تبسيط الهيدر بحذف رابط "شاركنا رأيك" منه لتقليل الازدحام وتحسين وضوح التنقل.  
رابط "شاركنا رأيك" ما زال متاحًا من الفوتر وصفحة التواصل ويفتح `feedback.html` بشكل صحيح.  
كما بقيت أيقونة "شارك الفائدة" العائمة مسؤولة عن وظيفة المشاركة المباشرة.


## تحديث – تحويل رادار أدوات الإدارة الرقمية إلى محتوى معرفي وتسويقي

تم تحويل صفحة رادار أدوات الإدارة الرقمية إلى صفحة معرفية موجهة للزائر ضمن قسم التعلّم:

- الصفحة الرئيسية:
  `learn/management-tech-radar.html`
- إزالة المعلومات الداخلية من الصفحة العامة، مثل الأرقام التحريرية والعناصر المؤجلة.
- جعل عناوين البطاقات عربية أولًا، مع إبقاء اسم المفهوم أو الأداة بالإنجليزية كسطر ثانوي.
- ربط كل بطاقة بمقال داخلي داخل ConsuTrain بدل الروابط الخارجية المباشرة.
- إنشاء مقالات داخلية ثابتة تحت:
  `learn/radar/`
- إضافة CTA موجه للزائر لطلب استشارة أو استكشاف أدوات ConsuTrain.
- تحديث `sw.js` لإضافة صفحة الرادار ومقالات الرادار الجديدة إلى التخزين المسبق.

### الحالة

مكتمل كإصدار ثابت أولي موجه للتسويق بالمحتوى. 

## Header — Courses Dropdown Simplification

تم تبسيط القائمة المنسدلة الخاصة بقسم "الدورات" في الهيدر، بحيث أصبحت تحتوي على ثلاثة روابط رئيسية فقط:
- نظرة عامة
- الدورات المتوفرة
- اطلب دورة متخصصة

تم نقل تفاصيل الدورات إلى صفحة الدورات نفسها بدل عرضها داخل الهيدر، مما يحسن وضوح التنقل ويقلل الازدحام البصري، خصوصًا على الشاشات الصغيرة.

الملفات المتأثرة:
- partials/header.html
- courses/index.html


## Header — Services Dropdown Simplification

تم تبسيط القائمة المنسدلة الخاصة بقسم "الخدمات" في الهيدر، بحيث أصبحت تحتوي على ثلاثة روابط رئيسية فقط:
- نظرة عامة
- الخدمات المتوفرة
- اطلب خدمة أو استشارة

تم نقل تفاصيل الخدمات إلى صفحة الخدمات نفسها بدل عرضها داخل الهيدر، مما يحسن وضوح التنقل ويقلل الازدحام البصري، خصوصًا على الشاشات الصغيرة.

الملفات المتأثرة:
- partials/header.html
- services.html


## Branding — Favicon and App Icons

تم اعتماد شعار ConsuTrain الصغير `consutrain-logo-mark.png` كمصدر لأيقونات الموقع.

تم إنشاء وتحديث الأيقونات التالية:
- assets/icons/favicon-16x16.png
- assets/icons/favicon-32x32.png
- assets/icons/apple-touch-icon.png
- assets/icons/icon-192.png
- assets/icons/icon-512.png

تم تحديث روابط favicon في صفحات HTML التي كانت تشير إلى `icon-192.png`، مع الإبقاء على `manifest.webmanifest` كما هو لأنه يستخدم المسارات الصحيحة للأيقونات.  
تم تحديث `sw.js` لتغيير نسخة الكاش فقط حتى تظهر الأيقونات الجديدة بدل النسخ القديمة.


### اكتمال دورة إصدار الشهادات الرقمية

تم إنجاز دورة إصدار الشهادات الرقمية لمنصة ConsuTrain بنجاح. تشمل الدورة الحالية:

- استقبال نتائج الاختبار من صفحة الموقع عبر Webhook.
- توليد `submissionId` لكل محاولة اختبار.
- توليد `certificateKey` لمنع تكرار إصدار الشهادة لنفس التدريب ونفس البريد.
- حفظ بيانات الاختبار في Google Sheets.
- استدعاء Workflow فرعي لتوليد الشهادة.
- بناء شهادة HTML وفق القالب الرسمي المعتمد.
- تحويل الشهادة إلى PDF محليًا باستخدام Chrome Headless داخل n8n.
- إرسال الشهادة عبر Gmail كمرفق PDF.
- تحديث حالة الصف في Google Sheets بعد الإرسال.
- منع تكرار إصدار الشهادة عند إعادة الاختبار بنفس البريد ونفس التدريب.

الحالة الحالية: مكتمل تشغيليًا ومختبر بنجاح.


## PWA — App Icon Update

تم إصلاح مشكلة استمرار ظهور الأيقونة القديمة عند تثبيت تطبيق ConsuTrain على الهاتف.

تم إنشاء أيقونات جديدة بأسماء مختلفة لتجاوز كاش المتصفح وService Worker:
- assets/icons/icon-192-v2.png
- assets/icons/icon-512-v2.png

تم تحديث `manifest.webmanifest` لاستخدام الأيقونات الجديدة، كما تم تحديث `sw.js` لأن الأيقونات وملف manifest ضمن precache.

تم التحقق من صلاحية `manifest.webmanifest` كملف JSON، ومن سلامة `sw.js` عبر `node --check`.


## اكتمال دورة إصدار الشهادات الرقمية وإرسالها بالبريد

تم إنجاز دورة إصدار الشهادات الرقمية لمنصة ConsuTrain بنجاح، وتم اختبارها عمليًا من صفحة الاختبار داخل الموقع.

تشمل الدورة الحالية ما يلي:

1. استقبال بيانات الاختبار من صفحة الموقع عبر Webhook.
2. توليد `submissionId` لكل محاولة اختبار.
3. توليد `certificateKey` لمنع تكرار إصدار الشهادة لنفس التدريب ونفس البريد.
4. حفظ بيانات الاختبار في Google Sheets.
5. منع إضافة صف جديد إذا كان `certificateKey` موجودًا سابقًا.
6. استدعاء Workflow فرعي لتوليد الشهادة وإرسالها.
7. بناء شهادة HTML وفق القالب الرسمي المعتمد.
8. تحويل الشهادة إلى PDF محليًا باستخدام Chrome Headless داخل n8n.
9. إرسال الشهادة عبر Gmail كمرفق PDF.
10. تحديث حالة السجل في Google Sheets بعد الإرسال.
11. منع إعادة إصدار شهادة جديدة عند تكرار نفس البريد لنفس التدريب.

الحالة الحالية:

`مكتمل تشغيليًا ومختبر بنجاح`

المسار التشغيلي الحالي:

`Website Test → Webhook → Google Sheets → Sub-workflow → PDF Certificate → Gmail Attachment → Sheet Status Update`

تم التأكد من وصول الشهادة إلى البريد الإلكتروني بنجاح، وتم التأكد من منع التكرار عند إعادة الاختبار بنفس البريد ونفس التدريب.

### تحسين رسالة التكرار في طلب شهادة الإتمام

تم تحسين تجربة المستخدم في صفحة طلب شهادة الإتمام، بحيث لا تظهر رسالة التهنئة العامة عند إعادة إرسال اختبار سبق أن صدرت له شهادة بنفس البريد ونفس التدريب.

أصبح المسار الحالي يميز بين حالتين:

* طلب جديد: يتم حفظ النتيجة، ثم إصدار الشهادة وإرسالها بالبريد.
* طلب مكرر: لا يتم إضافة صف جديد في Google Sheets، ولا يتم إصدار شهادة جديدة، وتظهر للمستخدم رسالة واضحة تفيد بأن الشهادة صدرت سابقًا.

تم اختبار الحالة عمليًا، وكانت النتيجة كالتالي:

* لم يتم إضافة صف جديد في Google Sheets عند استخدام نفس البريد ونفس التدريب.
* لم يتم إرسال شهادة جديدة.
* ظهرت رسالة التكرار الصحيحة في صفحة الموقع.
* عاد زر الإرسال إلى حالته الطبيعية بعد انتهاء المعالجة.

الحالة الحالية: مكتمل ومختبر بنجاح.

## Admin — Digital Certificates Management UI

تم إنشاء نموذج أولي لواجهة إدارة الشهادات الرقمية داخل المسار:
`admin/certificates/index.html`

الصفحة داخلية وغير مضافة إلى الهيدر أو الفوتر العام، وتعرض بيانات تجريبية ثابتة فقط.

تشمل الصفحة:
- بطاقات إحصائية.
- فلاتر بحث وتصفية.
- جدول شهادات.
- لوحة تفاصيل شهادة.
- ملاحظات للربط المستقبلي.

تم تصميم الصفحة لتدعم مستقبلًا شهادات متعددة مرتبطة ببرامج واختبارات مختلفة، مع حقول مثل:
- نوع الشهادة.
- اسم البرنامج.
- اسم الاختبار.
- كود الاختبار.
- نسخة الاختبار.
- حالة الإصدار.
- حالة الإرسال.

تم تعديل أزرار الإجراءات لتكون أزرارًا شكلية معطلة، كما تم منع نموذج الفلاتر من تنفيذ submit غير مقصود.

لم يتم ربط الصفحة بعد مع Google Sheets أو n8n أو قاعدة بيانات.

## Admin — Home Dashboard UI

تم إنشاء صفحة مدخل إداري داخلي لمنصة ConsuTrain ضمن:
`admin/index.html`

تعرض الصفحة بطاقات إدارية مبدئية تشمل:
- إدارة الشهادات الرقمية.
- إدارة طلبات الاستشارة والدورات.
- إدارة ملاحظات الزوار.
- إدارة الموارد والقوالب.
- إدارة الدورات.
- إعدادات الربط والأتمتة.

صفحة الإدارة غير مضافة إلى الهيدر أو الفوتر العام، وتعمل حاليًا كواجهة UI/UX تجريبية غير مرتبطة بنظام تسجيل دخول أو قاعدة بيانات.

تم أيضًا إضافة رابط رجوع داخل:
`admin/certificates/index.html`

بعنوان:
`العودة إلى لوحة الإدارة`

ويربط إلى:
`../index.html`


## Admin — Consultation and Training Requests UI

تم إنشاء نموذج أولي لواجهة إدارة طلبات الاستشارة والدورات داخل المسار:
`admin/requests/index.html`

تعرض الصفحة بيانات تجريبية ثابتة فقط، وتشمل:
- بطاقات إحصائية.
- فلاتر بحث وتصفية.
- جدول طلبات.
- لوحة تفاصيل الطلب.
- ملاحظات للربط المستقبلي.
- تنبيه خصوصية قبل تفعيل البيانات الحقيقية.

تم ربط بطاقة "إدارة طلبات الاستشارة والدورات" في:
`admin/index.html`

بالمسار:
`requests/index.html`

الصفحة غير مرتبطة بعد مع Tally أو Google Sheets أو n8n أو API.

### دعم تصنيف الشهادات

تمت إضافة حقول تصنيف الشهادات إلى Google Sheets وn8n، وتم اختبارها بنجاح ضمن مسار الاختبارات المجانية. تظهر القيم الحالية كالتالي: `free_test`، `اختبار مجاني`، `التحول الرقمي`.

### ربط لوحة إدارة الشهادات الرقمية بواجهة قراءة فقط

تم تنفيذ المرحلة الأولى من ربط لوحة إدارة الشهادات الرقمية داخل:

`admin/certificates/index.html`

مع مسار n8n جديد مخصص للقراءة فقط باسم:

`ConsuTrain – Admin Certificates List API`

يعتمد هذا المسار على قراءة بيانات الشهادات من Google Sheets، ثم تحويلها إلى JSON منظم يحتوي على بيانات الملخص العام وقائمة الشهادات. تم ربط الصفحة بهذا الـ API لعرض البيانات الفعلية بدل البيانات التجريبية.

ما تم إنجازه:

* إنشاء Workflow جديد في n8n للوحة الشهادات.
* إنشاء Webhook قراءة فقط:
  `consutrain-admin-certificates-list`
* قراءة بيانات الشهادات من Google Sheets.
* تنسيق البيانات في JSON موحد يحتوي على:

  * `ok`
  * `source`
  * `generatedAt`
  * `summary`
  * `items`
* ربط صفحة لوحة الشهادات بالـ API.
* عرض بطاقات الإحصائيات من بيانات `summary`.
* عرض الشهادات في جدول من بيانات `items`.
* تفعيل البحث المحلي حسب الاسم، البريد، رقم الشهادة، واسم/معرّف التدريب.
* تفعيل الفلاتر المحلية حسب:

  * `certificateStatus`
  * `certificateType`
  * `learningType`
  * `trainingCategory`
* إبقاء أزرار الإجراءات داخل الجدول معطلة، لأن المرحلة الحالية مخصصة للقراءة فقط.
* إضافة حالة تحميل ورسالة خطأ واضحة في حال فشل الاتصال بالـ API.

الحالة الحالية: مكتمل كـ Read-only MVP ومناسب للانتقال لاحقًا إلى مرحلة التفاصيل والإجراءات الإدارية بعد ضبط الحماية.

### إضافة لوحة تفاصيل الشهادة داخل إدارة الشهادات

تم تنفيذ مرحلة عرض تفاصيل الشهادة داخل لوحة إدارة الشهادات الرقمية في:

`admin/certificates/index.html`

أصبحت اللوحة تتيح للمستخدم الإداري الضغط على زر “عرض التفاصيل” داخل جدول الشهادات لفتح نافذة جانبية داخل نفس الصفحة، تعرض بيانات الشهادة المختارة بشكل منظم وقراءة فقط.

تشمل التفاصيل المعروضة:

* بيانات المتدرب.
* بيانات التدريب.
* بيانات النتيجة.
* بيانات الشهادة.
* بيانات البريد.
* بيانات التتبع.

تم الحفاظ على مبدأ القراءة فقط في هذه المرحلة، لذلك بقيت أزرار مثل فتح ملف PDF وإعادة إرسال الشهادة معطلة وغير تنفيذية. كما لم تتم إضافة أي عمليات حساسة مثل الحذف أو التعديل أو إعادة الإصدار.

الحالة الحالية: مكتمل ومناسب كمرحلة Read-only قبل الانتقال لاحقًا إلى الحماية ثم تفعيل الإجراءات الإدارية الحساسة.

### تحسين واجهة لوحة إدارة الشهادات الرقمية Read-only

تم تحسين واجهة لوحة إدارة الشهادات الرقمية داخل:

`admin/certificates/index.html`

وذلك بعد ربطها ببيانات الشهادات الفعلية القادمة من n8n وGoogle Sheets.

شملت التحسينات:

* إعادة ترتيب أعمدة جدول الشهادات حسب الأولوية الإدارية.
* عرض حالات الشهادة `certificateStatus` كشارات واضحة.
* عرض حالات البريد `emailStatus` كشارات واضحة.
* اعتبار وجود `errorMessage` مؤشرًا لحالة فشل تحتاج مراجعة.
* تحويل القيم التقنية مثل `free_test` إلى نصوص مفهومة مثل “اختبار مجاني”.
* تحسين عرض `learningType` و`trainingCategory` داخل الجدول والتفاصيل.
* تحسين رسالة عدم وجود نتائج عند البحث أو التصفية.
* تحسين نافذة تفاصيل الشهادة بصريًا.
* منع ظهور قيم مثل `undefined` أو `null` داخل الواجهة.
* إبقاء أزرار “فتح PDF” و“إعادة إرسال” معطلة وغير تنفيذية.

الحالة الحالية: مكتمل كتحسين واجهة ضمن مرحلة Read-only، مع استمرار تأجيل أي إجراءات حساسة إلى ما بعد تنفيذ حماية صفحة الإدارة وWebhooks.


### حماية صفحات الإدارة عبر Cloudflare Access

تم تنفيذ حماية مبدئية لصفحات الإدارة في منصة ConsuTrain باستخدام Cloudflare Access، وذلك على المسار:

`https://consutrain.com/admin/*`

تم إنشاء تطبيق حماية باسم:

`ConsuTrain Admin`

مع سياسة وصول تسمح بالدخول للبريد الإداري المعتمد فقط:

`consutrain@gmail.com`

كما تم تحويل سجلات DNS الخاصة بالدومين الرئيسي و`www` إلى وضع `Proxied` داخل Cloudflare حتى تمر طلبات الموقع عبر Cloudflare وتعمل طبقة Access بشكل صحيح.

تم اختبار الحماية عمليًا من جلسة متصفح جديدة، حيث ظهرت صفحة Cloudflare Access، وتم إرسال كود الدخول إلى البريد المسموح، وبعد إدخال الكود فُتحت صفحة الإدارة بنجاح.

الحالة الحالية: مكتمل وظيفيًا لحماية صفحات `/admin/*`.
ملاحظة: ما زالت Webhooks الإدارية بحاجة إلى تصور حماية مستقل قبل تفعيل أي إجراءات حساسة مثل إعادة إرسال الشهادة أو فتح ملف PDF.


### حماية Webhooks الإدارية عبر Cloudflare Access

تم تنفيذ حماية مبدئية للـ Webhooks الإدارية الخاصة بمنصة ConsuTrain باستخدام Cloudflare Access، وذلك على المسار:

`https://hooks.consutrain.com/webhook/consutrain-admin-*`

تم إنشاء تطبيق حماية مستقل باسم:

`ConsuTrain Admin Webhooks`

ويغطي Webhooks الإدارية التي تبدأ بـ:

`consutrain-admin-`

ومنها حاليًا:

`consutrain-admin-certificates-list`

تم ربط التطبيق بسياسة الوصول الإدارية المعتمدة، والتي تسمح فقط بالبريد الإداري:

`consutrain@gmail.com`

تم اختبار الحماية عمليًا من جلسة Edge InPrivate، حيث ظهرت صفحة Cloudflare Access عند محاولة فتح رابط Webhook الإداري مباشرة، مما يؤكد أن بيانات الشهادات لم تعد متاحة مباشرة دون تحقق.

كما تم اختبار لوحة الشهادات بعد الحماية، واستمرت في عرض البيانات داخل:

`https://consutrain.com/admin/certificates/`

الحالة الحالية: مكتمل وظيفيًا لحماية Webhooks الإدارية الخاصة بالقراءة.
ملاحظة: ما زالت أزرار الإجراءات الحساسة مثل إعادة إرسال الشهادة وفتح ملف PDF معطلة، ولن يتم تفعيلها إلا بعد تصميم Webhooks تنفيذية محمية ومحددة الصلاحيات.


## French Version — Glossary

تم بدء التحضير للنسخة الفرنسية من موقع ConsuTrain عبر اعتماد قاموس مصطلحات فرنسي موحد.

سيتم حفظ القاموس في:
`fr-glossary.md`

وسيُستخدم كمرجع عند ترجمة الصفحات العامة والتسويقية ضمن مجلد:
`/fr/`
تم التنفيذ.

  - الملف المعدل:
      - partials/header.html

  - أين أضفت زر Français؟
      - في نهاية قائمة التنقل الرئيسية داخل <nav class="main-nav">، بعد قسم تواصل معنا.

  - هل الرابط يشير إلى __ROOT__/fr/index.html؟
    نعم:

    <a class="nav-link nav-link--single" href="__ROOT__/fr/index.html" lang="fr" dir="ltr">Français</a>

  لم أعدّل أي ملفات أخرى، ولم أعمل commit.


  ## French Version — Language Badge

تم تحسين زر تغيير اللغة ليظهر كشارة صغيرة بجانب شعار ConsuTrain.

تم تعديل:
- partials/header.html
- assets/css/style.css
- fr/index.html
- fr/services.html

أصبحت النسخة العربية تعرض شارة `FR`، بينما تعرض الصفحات الفرنسية شارة `AR` للرجوع إلى النسخة العربية.

## تحديث – تثبيت الروابط الفرنسية وتنظيف صفحة الأدوات

تم تنفيذ دفعة تنظيف آمنة للنسخة الحالية قبل التوسع في الترجمة الفرنسية.

الملفات المعدلة في هذه الدفعة:
- `tools.html`
- `fr/index.html`
- `fr/services.html`
- `fr/services/consultation-form.html`
- `sw.js`

ما تم إنجازه:
- إزالة الإشارة إلى SWOT من خانة البحث في صفحة الأدوات حتى لا يظهر كأداة مستقلة.
- إزالة قسم الأدوات المستقلة المكرر من صفحة الأدوات، مع الإبقاء على نفس الأدوات ضمن قسم الأدوات العملية المجانية.
- إصلاح روابط الصفحات الفرنسية الحالية بحيث تشير مؤقتًا إلى الصفحات العربية المقابلة عند عدم وجود نسخة فرنسية مستقلة.
- تنظيف `sw.js` من أسطر غير لازمة كانت قبل تعريفات cache.
- تحديث نسخة cache في Service Worker لضمان تحميل النسخ الجديدة بعد النشر.

الحالة الحالية:
النسخة الفرنسية الأساسية موجودة، والروابط أصبحت أوضح مؤقتًا إلى حين إنشاء صفحات فرنسية مستقلة مثل `fr/contact.html` و `fr/tools.html`.

## 2026-06-14 - French contact page

Status: Completed

- Created `fr/contact.html` as the French contact page.
- Updated existing French pages so their Contact navigation now points to the French contact page.
- Updated `sw.js` cache names and precache list for the new French contact page.

## 2026-06-14 - Internal consultation forms

Status: Completed

- Removed Tally embeds from `services/consultation-form.html` and `fr/services/consultation-form.html`.
- Replaced them with internal temporary ConsuTrain consultation request forms.
- Added temporary submit messages while future automatic submission is prepared.
- Updated `sw.js` cache names for the changed consultation form pages.

## 2026-06-15 - Consultation forms connected to Google Apps Script

Status: Completed

- Arabic and French consultation forms are connected to Google Apps Script and tested successfully.
- The tested flow is: consultation form -> Google Apps Script Web App -> Google Sheet: ConsuTrain Consultation Requests / requests -> Gmail notification -> user success message.
- Submissions are saved in Google Sheets and email notifications are sent via Gmail.
- This flow works without requiring the local n8n instance to be running.

Operational note:
- Google Apps Script is now the preferred solution for simple public form workflows.
- Local n8n remains available for development and advanced/manual automation.
- Certificate automation through Google Sheets plus a manual n8n trigger remains a future option and is not completed yet.

## 2026-06-15 - French version audit and stabilization

Status: Completed

- Audited the current French pages before expanding the French version.
- Confirmed the existing French pages use `lang="fr"` and `dir="ltr"`.
- Confirmed local links point to existing pages or intentional Arabic/original fallbacks.
- Normalized AR language-switch labels on the audited French pages so no Arabic interface text remains in those pages.
- Updated `sw.js` cache names for the audited French page fixes.

## 2026-06-15 - French resources landing page

Status: Completed

- Created `fr/resources/index.html` as the French resources landing page.
- Linked the current French pages to the new French resources page.
- The page introduces resource categories in French while linking to existing resource/download folders.
- No individual French templates or resource pages were created in this step.

## 2026-06-15 - French courses landing page

Status: Completed

- Created `fr/courses/index.html` as the French courses landing page.
- Linked the current French pages to the new French courses page.
- The page introduces ConsuTrain training categories in French while linking to existing course directories.
- No individual French course detail pages were created in this step.

## 2026-06-14 - French about page

Status: Completed

- Created `fr/about.html` as the French About page.
- Linked `fr/about.html` from the current French pages: `fr/index.html`, `fr/services.html`, `fr/contact.html`, and `fr/services/consultation-form.html`.
- Updated `sw.js` cache names and precache list for the new French About page.

## 2026-06-14 - French tools landing page

Status: Completed

- Created `fr/tools.html` as the French tools landing page.
- Linked the current French pages to `fr/tools.html`.
- The page introduces the tools area progressively and links to existing tool pages without translating each internal tool yet.
- Updated `sw.js` cache names and precache list for the new French tools page.

## PWA Icons — Mobile Installation Fix

تم إصلاح أيقونات تثبيت تطبيق ConsuTrain على الهاتف.

تم إنشاء أيقونات maskable جديدة من شعار ConsuTrain الحالي:
- assets/icons/icon-192-maskable-v2.png
- assets/icons/icon-512-maskable-v2.png

كما تم تحديث manifest.webmanifest و sw.js لاستخدام الأيقونات الجديدة بدل الأيقونة القديمة التي كانت تظهر كمربع بداخله حرف C.
