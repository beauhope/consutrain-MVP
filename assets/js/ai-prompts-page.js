/*
  =========================================================
  FILE: assets/js/ai-prompts-page.js
  PURPOSE:
  منطق صفحة learn/ai-prompts.html

  RESPONSIBILITIES:
  - تعريف مكتبة الـ Prompts
  - عرضها كبطاقات
  - البحث داخلها
  - التصفية حسب الفئة
  - نسخ الـ Prompt
  - تحديث عداد النتائج
  - تشغيل زر العودة للأعلى
  =========================================================
*/

/* =========================================================
   1) PROMPTS DATA
   في هذه المرحلة نخزن البيانات داخل الملف مباشرة.
   لاحقًا يمكن نقلها إلى JSON إذا أردنا.
   ========================================================= */
const promptsLibrary = [
  {
    category: "التخطيط الاستراتيجي",
    title: "تحليل SWOT",
    prompt: "تصرف كمستشار تخطيط استراتيجي. قم بإعداد تحليل SWOT لجهة تعمل في قطاع [القطاع] داخل [المدينة/الدولة]، مع تقديم نقاط القوة والضعف والفرص والتهديدات بشكل واضح ومنظم."
  },
  {
    category: "التخطيط الاستراتيجي",
    title: "تحليل PESTEL",
    prompt: "تصرف كمحلل استراتيجي. قم بإعداد تحليل PESTEL لجهة تعمل في قطاع [القطاع]، مع توضيح العوامل السياسية والاقتصادية والاجتماعية والتقنية والبيئية والقانونية المؤثرة على العمل."
  },
  {
    category: "التخطيط الاستراتيجي",
    title: "صياغة الرؤية والرسالة",
    prompt: "تصرف كمستشار تطوير مؤسسي. ساعدني في صياغة رؤية ورسالة لجهة تعمل في [النشاط]، مع مراعاة الوضوح والاختصار والطابع المهني."
  },
  {
    category: "التخطيط الاستراتيجي",
    title: "بناء مؤشرات الأداء KPIs",
    prompt: "تصرف كخبير أداء مؤسسي. قم باقتراح مؤشرات أداء رئيسية KPI لجهة تعمل في [النشاط]، مع ذكر اسم المؤشر وطريقة القياس والدورية والهدف من المؤشر."
  },

  {
    category: "دراسات الجدوى",
    title: "تحليل السوق",
    prompt: "تصرف كمستشار دراسات جدوى. قم بتحليل أولي للسوق لمشروع في مجال [المجال] داخل [المدينة]، مع توضيح حجم الطلب المحتمل والمنافسين والفجوات والفرص."
  },
  {
    category: "دراسات الجدوى",
    title: "تقدير التكاليف",
    prompt: "تصرف كمستشار مالي لمشاريع ناشئة. ساعدني في إعداد قائمة أولية بالتكاليف المتوقعة لمشروع في مجال [المجال]، مع تصنيفها إلى تكاليف تأسيس وتشغيل وتسويق."
  },
  {
    category: "دراسات الجدوى",
    title: "تحليل المخاطر",
    prompt: "تصرف كخبير إدارة مخاطر. حدد أبرز المخاطر المتوقعة لمشروع في قطاع [المجال] داخل [المدينة]، مع بيان وصف كل خطر وأثره واحتماله وإجراءاته المقترحة."
  },
  {
    category: "دراسات الجدوى",
    title: "نموذج مالي مبدئي",
    prompt: "تصرف كمستشار دراسات جدوى. أنشئ تصورًا أوليًا لنموذج مالي لمشروع في [المجال] يشمل الإيرادات المحتملة والتكاليف الأساسية ونقطة التعادل بشكل مبسط."
  },

  {
    category: "التسويق",
    title: "العميل المثالي ICP",
    prompt: "تصرف كخبير تسويق. ساعدني في تحديد العميل المثالي ICP لخدمة أو منتج في مجال [المجال]، مع توضيح خصائصه واحتياجاته وسلوكه الشرائي."
  },
  {
    category: "التسويق",
    title: "تحليل المنافسين",
    prompt: "تصرف كمحلل سوق. قم بتحليل أبرز المنافسين في مجال [المجال] داخل [المدينة/الدولة]، مع توضيح نقاط القوة والضعف والفرص التي يمكن الاستفادة منها."
  },
  {
    category: "التسويق",
    title: "خطة محتوى",
    prompt: "تصرف كخبير محتوى وتسويق رقمي. اقترح خطة محتوى لمدة 4 أسابيع لجهة تعمل في [المجال]، مع توزيع أفكار المحتوى حسب نوع المنشور والهدف والجمهور."
  },
  {
    category: "التسويق",
    title: "اقتراح حملات",
    prompt: "تصرف كمدير تسويق. اقترح 3 حملات تسويقية عملية لمنتج أو خدمة في مجال [المجال]، مع توضيح الهدف والجمهور والفكرة الرئيسية وقنوات التنفيذ."
  },

  {
    category: "إدارة المشاريع",
    title: "بناء WBS",
    prompt: "تصرف كمدير مشروع محترف. قم بإعداد Work Breakdown Structure (WBS) لمشروع يهدف إلى [وصف المشروع]، مع تقسيمه إلى مراحل رئيسية وأنشطة فرعية."
  },
  {
    category: "إدارة المشاريع",
    title: "خطة تشغيلية",
    prompt: "تصرف كمستشار تنفيذ وتشغيل. ساعدني في إعداد خطة تشغيلية لمشروع [اسم المشروع]، مع تحديد الأنشطة، المسؤوليات، المدد الزمنية، والنتائج المتوقعة."
  },
  {
    category: "إدارة المشاريع",
    title: "سجل مخاطر المشروع",
    prompt: "تصرف كخبير PMO وإدارة مخاطر. قم بإنشاء سجل مخاطر أولي لمشروع [اسم المشروع]، مع وصف المخاطر واحتمالها وتأثيرها وإجراءات التعامل معها."
  },
  {
    category: "إدارة المشاريع",
    title: "مصفوفة RACI",
    prompt: "تصرف كمستشار حوكمة مشاريع. أنشئ مصفوفة RACI لمشروع [اسم المشروع]، مع توزيع المسؤوليات بين الأطراف الرئيسية بشكل واضح."
  },

  {
    category: "ريادة الأعمال",
    title: "بناء نموذج الأعمال BMC",
    prompt: "تصرف كمستشار أعمال. ساعدني في إعداد Business Model Canvas لمشروع ناشئ في مجال [المجال]، مع تعبئة جميع المربعات بشكل عملي ومبسط."
  },
  {
    category: "ريادة الأعمال",
    title: "صياغة القيمة المقترحة",
    prompt: "تصرف كخبير Value Proposition. ساعدني في صياغة القيمة المقترحة لمشروع أو خدمة في [المجال]، بحيث تكون واضحة ومقنعة وموجهة للعميل."
  },
  {
    category: "ريادة الأعمال",
    title: "تقييم فكرة المشروع",
    prompt: "تصرف كمستشار ريادة أعمال. قيّم فكرة مشروع في [المجال] من حيث الجاذبية والطلب والمخاطر وإمكانية التنفيذ، وقدم توصية أولية."
  },
  {
    category: "ريادة الأعمال",
    title: "خطة إطلاق أولية",
    prompt: "تصرف كخبير إطلاق مشاريع ناشئة. اقترح خطة إطلاق أولية لمشروع في [المجال] تتضمن الخطوات الأساسية قبل الإطلاق وبعده خلال أول 30 يومًا."
  }
];

/* =========================================================
   2) STATE
   ========================================================= */
let filteredPrompts = [...promptsLibrary];
let activeCategory = "";

/* =========================================================
   3) ELEMENT REFERENCES
   ========================================================= */
const promptsList = document.getElementById("promptsList");
const promptsSearch = document.getElementById("promptsSearch");
const promptsCount = document.getElementById("promptsCount");
const promptsResetBtn = document.getElementById("promptsResetBtn");
const promptsFilters = document.getElementById("promptsFilters");
const promptsEmptyState = document.getElementById("promptsEmptyState");
const backToTopBtn = document.getElementById("backToTopBtn");

/* =========================================================
   4) HELPERS
   ========================================================= */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

async function copyText(text, successMessage = "تم النسخ بنجاح") {
  try {
    await navigator.clipboard.writeText(text);
    alert(successMessage);
  } catch (error) {
    console.error("Copy failed:", error);
    alert("تعذر النسخ من المتصفح الحالي.");
  }
}

/* =========================================================
   5) BUILD CARD
   ========================================================= */
function buildPromptCard(item) {
  const category = escapeHtml(item.category);
  const title = escapeHtml(item.title);
  const prompt = escapeHtml(item.prompt);

  return `
    <article class="section-card prompt-card">
      <div class="prompt-card-top">
        <span class="article-tag">${category}</span>
      </div>

      <h3>${title}</h3>

      <div class="prompt-box">
        <p>${prompt}</p>
      </div>

      <div class="prompt-actions">
        <button
          class="btn btn-secondary prompt-copy-btn"
          type="button"
          data-copy-prompt="${prompt}"
        >
          نسخ الـ Prompt
        </button>
      </div>
    </article>
  `;
}

/* =========================================================
   6) COUNT
   ========================================================= */
function updatePromptsCount() {
  const count = filteredPrompts.length;

  if (count === 0) {
    promptsCount.textContent = "لم يتم العثور على عناصر مطابقة.";
  } else if (count === 1) {
    promptsCount.textContent = "تم العثور على Prompt واحد.";
  } else {
    promptsCount.textContent = `عدد العناصر المعروضة: ${count}`;
  }
}

/* =========================================================
   7) RENDER
   ========================================================= */
function renderPrompts() {
  if (!promptsList) return;

  if (!filteredPrompts.length) {
    promptsList.innerHTML = "";
    if (promptsEmptyState) promptsEmptyState.hidden = false;
    updatePromptsCount();
    return;
  }

  if (promptsEmptyState) promptsEmptyState.hidden = true;

  promptsList.innerHTML = filteredPrompts.map(buildPromptCard).join("");
  updatePromptsCount();
}

/* =========================================================
   8) FILTERS
   ========================================================= */
function applyPromptFilters() {
  const query = (promptsSearch?.value || "").trim().toLowerCase();

  filteredPrompts = promptsLibrary.filter((item) => {
    const title = item.title.toLowerCase();
    const category = item.category.toLowerCase();
    const prompt = item.prompt.toLowerCase();

    const matchesQuery =
      !query ||
      title.includes(query) ||
      category.includes(query) ||
      prompt.includes(query);

    const matchesCategory =
      !activeCategory ||
      item.category === activeCategory;

    return matchesQuery && matchesCategory;
  });

  renderPrompts();
}

/* =========================================================
   9) FILTER CHIPS
   ========================================================= */
function renderPromptFilters() {
  if (!promptsFilters) return;

  const categories = [...new Set(promptsLibrary.map(item => item.category))];

  promptsFilters.innerHTML = `
    <button class="tag-chip ${activeCategory === "" ? "active" : ""}" type="button" data-category="">
      الكل
    </button>
    ${categories.map(category => `
      <button class="tag-chip ${activeCategory === category ? "active" : ""}" type="button" data-category="${escapeHtml(category)}">
        ${escapeHtml(category)}
      </button>
    `).join("")}
  `;
}

/* =========================================================
   10) EVENTS
   ========================================================= */
if (promptsSearch) {
  promptsSearch.addEventListener("input", applyPromptFilters);
}

if (promptsResetBtn) {
  promptsResetBtn.addEventListener("click", () => {
    if (promptsSearch) promptsSearch.value = "";
    activeCategory = "";
    renderPromptFilters();
    applyPromptFilters();
    promptsSearch?.focus();
  });
}

if (promptsFilters) {
  promptsFilters.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-category]");
    if (!btn) return;

    activeCategory = btn.dataset.category || "";
    renderPromptFilters();
    applyPromptFilters();
  });
}

if (promptsList) {
  promptsList.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-copy-prompt]");
    if (!btn) return;

    copyText(btn.dataset.copyPrompt || "", "تم نسخ الـ Prompt.");
  });
}

/* =========================================================
   11) BACK TO TOP
   ========================================================= */
window.addEventListener("scroll", () => {
  if (!backToTopBtn) return;

  if (window.scrollY > 300) {
    backToTopBtn.classList.add("show");
  } else {
    backToTopBtn.classList.remove("show");
  }
});

if (backToTopBtn) {
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/* =========================================================
   12) INIT
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  renderPromptFilters();
  applyPromptFilters();
});