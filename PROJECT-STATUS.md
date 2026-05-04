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