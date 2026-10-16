import arTemplate from "./templates/ar.html";
import frTemplate from "./templates/fr.html";

// Standalone POC. No live submissions, Google data, mail or production routes.
const testData = {
  ar: {
    fullName: "متدرب تجريبي",
    trainingTitle: "دورة تجريبية في إدارة المشاريع",
    issueDate: "16/10/2026",
    certificateId: "POC-AR-0001",
    verificationCode: "POC-NOT-VALID-AR",
    verificationUrl: "https://consutrain.com/"
  },
  fr: {
    fullName: "Participant Test",
    trainingTitle: "Formation de démonstration en gestion de projet",
    issueDate: "16/10/2026",
    certificateId: "POC-FR-0001",
    verificationCode: "POC-NOT-VALID-FR",
    verificationUrl: "https://consutrain.com/"
  }
};
function escapeHtml(input) {
  return String(input).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function compose(lang) {
  const fields = testData[lang];
  let html = lang === "ar" ? arTemplate : frTemplate;
  for (const [name, value] of Object.entries(fields)) {
    html = html.split("{{" + name + "}}").join(escapeHtml(value));
  }
  if (/{{[A-Za-z]+}}/.test(html)) throw Error("Unresolved template fields");
  html = html.replace(/\.\.\/\.\.\/assets\/images\//g, "https://consutrain.com/assets/images/");
  // Ensure Arabic font is fetched from the existing public website assets.
  const font = lang === "ar"
    ? '<style>@font-face{font-family:"Cairo";src:url("https://consutrain.com/assets/fonts/Cairo-VariableFont_slnt,wght.woff2") format("woff2");font-weight:100 900;font-style:normal;font-display:block}</style>'
    : "";
  return html.replace("</head>", font + "</head>");
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method !== "GET" || !["/ar.pdf", "/fr.pdf"].includes(url.pathname))
      return new Response("Not found", { status: 404 });
    // An explicit secret is mandatory before any deployment. Do not expose a public PDF generator.
    if (!env.POC_ACCESS_KEY || request.headers.get("X-POC-Key") !== env.POC_ACCESS_KEY)
      return new Response("Unauthorized", { status: 401 });
    const lang = url.pathname === "/ar.pdf" ? "ar" : "fr";
    try {
      const result = await env.BROWSER.quickAction("pdf", {
        html: compose(lang),
        pdfOptions: {
          format: "a4", landscape: true, printBackground: true,
          preferCSSPageSize: true, displayHeaderFooter: false,
          margin: { top: "0", bottom: "0", left: "0", right: "0" }
        }
      });
      if (!result.ok) return new Response("PDF generation unavailable", { status: 502 });
      const headers = new Headers({
        "content-type": "application/pdf",
        "content-disposition": 'attachment; filename="consutrain-poc-' + lang + '.pdf"',
        "cache-control": "no-store",
        "x-content-type-options": "nosniff"
      });
      const used = result.headers.get("X-Browser-Ms-Used");
      if (used && /^\d+$/.test(used)) headers.set("X-Browser-Ms-Used", used);
      return new Response(result.body, { status: 200, headers });
    } catch {
      return new Response("PDF generation unavailable", { status: 502 });
    }
  }
};
