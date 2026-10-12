// CT-01 Global Search — generate Pagefind index using public sitemap allowlist.
// Run with node scripts/build-search-index.mjs after: npm install --no-save pagefind
import fs from "node:fs";
import path from "node:path";
import * as pagefind from "pagefind";
const sitemap=fs.readFileSync("sitemap.xml","utf8");
const sitemapUrls=[...sitemap.matchAll(/<loc>\s*(https:\/\/consutrain\.com\/[^<]*)<\/loc>/g)].map(m=>m[1]);
const categories=[/^\/(?:fr\/)?learn(?:\/|\.html$)/,/^\/(?:fr\/)?courses\//,/^\/(?:fr\/)?tools(?:\/|\.html$)/,/^\/(?:fr\/)?(?:templates|resources)\//,/^\/(?:fr\/)?services(?:\/|\.html$)/];
const disallowed=/(?:^|\/)(?:admin|certificate-request|final-assessment|unsubscribe|quote-request|consultation-form)(?:\/|\.|$)/i;
const articleData=(p)=>JSON.parse(fs.readFileSync(p,"utf8")).articles||[];
const publishedAr=new Set(articleData("assets/data/articles.json").filter(x=>x.contentType==="tech-radar"||x.content_type==="article").map(x=>x.id));
const publishedFr=new Set(articleData("assets/data/fr-articles.json").filter(x=>x.contentType==="tech-radar"||x.content_type==="article").map(x=>x.id));
// JSON is the authority for published Tech Radar articles; include new articles even before sitemap updates.
const publishedURLs=[...publishedAr].map(id=>`https://consutrain.com/learn/${id}.html`).concat([...publishedFr].map(id=>`https://consutrain.com/fr/learn/${id}.html`));
const urls=[...new Set([...sitemapUrls,...publishedURLs])];
const {index,errors:initErrors}=await pagefind.createIndex({rootSelector:"main",excludeSelectors:["nav","footer","header","script","style","form",".subscriber-global-entry",".site-header",".site-footer"],writePlayground:false});
if(initErrors?.length)throw Error(initErrors.join("; "));
let added=0;const selected=new Set();const audit={ar:{learn:0,courses:0,tools:0,resources:0,services:0},fr:{learn:0,courses:0,tools:0,resources:0,services:0},rejected:[],included:[]};
for(const raw of urls){
 const u=new URL(raw);let pathname=decodeURIComponent(u.pathname);
 if(!categories.some(r=>r.test(pathname))||disallowed.test(pathname))continue;
 let file=pathname.slice(1);
 if(!file||file.endsWith("/"))file+="index.html";
 if(!file.endsWith(".html")||file.includes("..")||!fs.existsSync(file))continue;
 if(selected.has(file))continue;
 let html=fs.readFileSync(file,"utf8");
 if(/<meta[^>]+(?:name=["']robots["'][^>]+content=["'][^"']*noindex|content=["'][^"']*noindex[^>]+name=["']robots)/i.test(html))continue;
 const isRadar=/20260713_tech_radar_article|data-tech-radar|\/assets\/images\/articles\/[^"' ]+\.jpg/i.test(html);
 if(isRadar){const id=path.posix.basename(file,".html");const allowed=file.startsWith("fr/")?publishedFr:publishedAr;if(!allowed.has(id)){audit.rejected.push({file,reason:"unpublished Tech Radar"});continue}}
 // Index visible semantic content only; pagefind ignores navigation/scripts.
 const {errors}=await index.addHTMLFile({sourcePath:file,content:html});
 if(errors?.length)throw Error(file+": "+errors.join("; "));
 selected.add(file);added++;
 const language=file.startsWith("fr/")?"fr":"ar";const section=categories.findIndex(r=>r.test(pathname));const group=["learn","courses","tools","resources","services"][section];audit[language][group]++;audit.included.push(file);
}
if(!added)throw Error("Empty public search index");
const write=await index.writeFiles({outputPath:"pagefind"});
if(write.errors?.length)throw Error(write.errors.join("; "));
fs.mkdirSync("search-audit",{recursive:true});
fs.writeFileSync("search-audit/report.json",JSON.stringify(audit,null,2));
console.log("CT-01 indexed public pages:",added);
console.log("CT-01 public categories:",JSON.stringify({ar:audit.ar,fr:audit.fr}));
console.log("CT-01 unpublished articles excluded:",audit.rejected.length);
