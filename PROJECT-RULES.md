# PROJECT RULES — ConsuTrain-MVP

## 1. Purpose of this file
This file records the fixed working rules for the project so they remain clear during development, review, maintenance, and future expansion.

---

## 2. Visitor-facing writing rules
All texts shown to visitors must be:
- clear
- professional
- direct
- useful
- free from internal development language

### Do not use public-facing phrases like:
- MVP
- scalable version
- first phase
- internal roadmap language
- technical planning phrases not relevant to visitors

### Preferred style:
- explain value clearly
- speak to the user’s need
- keep tone professional and accessible

---

## 3. Code commenting rules
All HTML, CSS, and JavaScript files must contain useful comments.

### Required commenting approach:
- explain the purpose of the file at the top
- explain each major section
- explain important blocks
- explain any non-obvious behavior
- use comments to support maintenance, debugging, learning, and future training

### Comment quality rule:
Comments must be practical and specific, not decorative.

---

## 4. Design identity rules
The visual identity of the project is based on:
- blue gradients
- gold gradients
- light gray to white surfaces

### General visual direction:
- professional
- elegant
- calm
- modern
- suitable for business, management, and learning

---

## 5. Favicon naming rules
Approved favicon logic:
- Main platform: CT-HUB
- MyTodo: MT
- Other tools: short clear abbreviations following the same logic

---

## 6. Technical direction for current phase
Current phase uses:
- HTML
- CSS
- JavaScript
- GitHub
- Visual Studio Code

Advanced technologies are postponed to later phases, especially when Project:Expert becomes more dynamic and requires stronger backend capabilities.

---

## 7. Development rule
Do not edit old reference projects directly unless necessary.
Build the new project cleanly, using previous files only as controlled sources for transfer and improvement.

---

## 8. Priority rule
The current priority is:
1. clean structure
2. stable navigation
3. consistent UI
4. useful content
5. working tools
6. clean public presentation

---

## 9. Long-term direction
ConsuTrain is being built as a platform that combines:
- learning
- tools
- services
- expert-related features later

This rule should guide future expansion decisions.

## 10. Root path rule for shared partials
This project uses shared partial files such as:
- header.html
- footer.html

Because pages exist at different folder levels, each page must define its root level using the `data-root` attribute on the `<body>` tag.

### Rule:
- Pages in the project root must use:
  `<body data-root=".">`

- Pages inside first-level folders must use:
  `<body data-root="..">`

- Pages inside deeper folders must use the appropriate relative root path such as:
  `<body data-root="../..">`

### Why this rule exists:
This rule allows shared partials and navigation links to work correctly in:
- local development
- Live Server
- GitHub Pages
- future project expansion

### Important:
Any new page added to the project must define the correct `data-root` value before testing navigation.

## 11. Relative asset path rule
When creating pages inside subfolders, relative paths must be reviewed carefully for:
- CSS files
- JavaScript files
- shared partial loaders
- links to other pages

Examples:
- Root page:
  `assets/js/includes.js`

- First-level subpage:
  `../assets/js/includes.js`

- Second-level subpage:
  `../../assets/js/includes.js`