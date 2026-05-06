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

### معالجة مشكلة بقاء قائمة الهاتف مفتوحة في MyTodo

ظهرت مشكلة بقاء قائمة الهاتف مفتوحة فوق صفحة MyTodo على الهاتف رغم اختفائها على الحاسوب بعد رفع الملفات إلى GitHub Pages. وبعد مراجعة السلوك، تبيّن أن السبب كان مرتبطًا بكاش الهاتف أو Service Worker وليس بالكود الجديد. تم حل المشكلة بعد مسح بيانات الموقع من إعدادات Chrome عبر: إعدادات Chrome ← إعدادات الموقع ← التخزين ← beauhope.github.io ← حذف البيانات. بعد ذلك ظهرت النسخة الصحيحة واختفت القائمة المفتوحة.

## Phase 1 — MVP Stabilization

Status: Completed technically

The first technical stabilization phase of ConsuTrain MVP has been completed. The platform was reviewed and tested across the main pages, internal navigation, shared header and footer, breadcrumbs, MyTodo integration, GitHub Pages deployment, PWA installation, Service Worker behavior, and mobile browsing.

Key outcomes:
- Unnecessary local files were removed.
- Broken links and path issues were reviewed.
- `data-root` rules were validated across page levels.
- Shared partials for header and footer were tested.
- Breadcrumbs were activated on the main internal pages.
- MyTodo was tested on desktop and mobile.
- The mobile navigation issue was fixed.
- GitHub Pages deployment was verified.
- PWA installation was tested successfully.
- Cache and Service Worker issues were reviewed and resolved.
- No blocking 404 errors or broken internal links remain.

Technical note:
A mobile issue in MyTodo where the navigation menu remained open was confirmed to be caused by browser cache / Service Worker behavior, not by the latest code. It was resolved by clearing site data from Chrome settings on the phone.

Next phase:
Move to Structure and Monetization improvements, starting with “Start Here”, consulting booking, downloadable lead magnet, service page improvements, and templates landing page.


## تحديث الحالة – ConsuTrain UI/UX

### آخر حالة
تم الانتهاء مبدئيًا من مسار:

ConsuTrain – UI/UX – التصميم العام

وتم تنفيذ تحسينات واسعة على الهوية البصرية وتجربة المستخدم.

### ما تم إنجازه

1. تحسين عرض الموقع على الجوال:
   - ضبط Hero والعناوين.
   - تحسين البطاقات والأزرار.
   - تحسين قائمة الهاتف والقوائم الفرعية.
   - تكبير سهم الأكورديون.
   - تحسين الفوتر.

2. توحيد التصميم:
   - توحيد أحجام العناوين.
   - توحيد الأزرار.
   - توحيد البطاقات.
   - تحسين الخلفيات والمسافات.

3. تحسين الصفحات الرئيسية:
   - الصفحة الرئيسية.
   - صفحات Learn.
   - صفحات Tools.
   - صفحات Services.

4. إصلاحات إضافية:
   - إصلاح تباين نص Hero في صفحة الأدوات.
   - تحسين وضوح Breadcrumbs فوق الخلفيات الداكنة.
   - اختبار سريع للروابط والملفات الأساسية.
   - التأكد من وجود ملفات المشروع الأساسية:
     - index.html
     - style.css
     - includes.js
     - header.html
     - footer.html
     - manifest.webmanifest
     - sw.js
     - offline.html

### ملاحظة قبل الإغلاق النهائي
تم تجهيز ملف إصلاح خاص بصفحات Learn التي كانت تفتقد:

```html
<div id="breadcrumbs-placeholder"></div>