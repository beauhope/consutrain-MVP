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

### Learn – Goal Management and Performance Measurement Path

Status: Completed / Ready for Testing

Completed:
- Created the Goal Management and Performance Measurement path.
- Added the path page: `learn/goal-management.html`.
- Added the path to the Learn dropdown.
- Added six structured lessons from YJ-35 to YJ-40.
- Added six knowledge articles to the Knowledge Library.
- Linked each lesson to its verified YouTube video.
- Added SVG educational visuals for each article.
- Updated `sw.js` cache version during the latest article updates.

Testing Required:
- Test `learn/goal-management.html`.
- Test all video buttons.
- Test all article links.
- Test article display from `learn/article.html`.
- Test Knowledge Library search using MBO, SMART, BSC, OKRs, and إدارة الأهداف.
- Test mobile layout.

Closed When:
- All six lessons and articles display correctly on desktop and mobile.