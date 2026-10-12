// CT-01: browser-level smoke tests. Runs against the temporary CI web server, never production.
import assert from "node:assert/strict";
import { chromium } from "playwright";
const origin="http://127.0.0.1:8765";
const browser=await chromium.launch({headless:true});
let failures=[];
async function test(label,fn){try{await fn();console.log("PASS",label)}catch(e){failures.push(label+": "+e.message);console.error("FAIL",label,e)}}
try {
 for(const item of [
  {lang:"ar",url:"/search.html?q=%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9",q:"إدارة",expected:"البحث في الموقع"},
  {lang:"fr",url:"/fr/search.html?q=management",q:"management",expected:"Recherche sur ConsuTrain"}
 ]){
  await test(item.lang+" results load",async()=>{
   const page=await browser.newPage({viewport:{width:1280,height:800},locale:item.lang});
   const jsErrors=[];page.on("pageerror",e=>jsErrors.push(String(e)));
   const response=await page.goto(origin+item.url,{waitUntil:"domcontentloaded"});
   assert.equal(response.status(),200);
   await page.locator(".ct-search-page h1").waitFor();
   await page.locator("#header-placeholder .ct-global-search__input").waitFor({timeout:20000});
   await page.waitForFunction(()=>{const e=document.querySelector("[data-ct-search-status]");return e && !/جارٍ البحث|Recherche\.\.\./.test(e.textContent)}, {timeout:30000});
   const status=await page.locator("[data-ct-search-status]").innerText();
   assert(!/غير متاح|indisponible/.test(status),"search engine unavailable: "+status);
   if(item.lang==="fr") {
     const styles=await page.evaluate(()=>{
       const get=s=>{const e=document.querySelector(s);return e?{direction:getComputedStyle(e).direction,textAlign:getComputedStyle(e).textAlign,justifyContent:getComputedStyle(e).justifyContent}:null};
       return {main:get("main.ct-search-page"),heading:get("main.ct-search-page h1"),form:get(".ct-search-page__form"),filters:get(".ct-search-filters"),input:get("[data-ct-search-input]"),result:get(".ct-search-result")};
     });
     console.log("French computed alignment:",JSON.stringify(styles));
     for(const key of ["main","heading","form","filters","input","result"])assert.equal(styles[key]?.direction,"ltr",key+" not LTR");
     for(const key of ["main","heading","input","result"])assert.equal(styles[key]?.textAlign,"left",key+" not left-aligned");
     assert.equal(styles.form.justifyContent,"flex-start","form not left");
     assert.equal(styles.filters.justifyContent,"flex-start","filters not left");
   }
   const rows=page.locator(".ct-search-result");
   const count=await rows.count();
   assert(count>0,"no indexed results for "+item.q+"; status="+status);
   const hrefs=await page.locator(".ct-search-result h2 a").evaluateAll(nodes=>nodes.map(n=>new URL(n.href).pathname));
   assert(hrefs.every(h=>item.lang==="fr"?h.startsWith("/fr/"):!h.startsWith("/fr/")),"language leakage");
   assert.equal(await page.locator("[data-ct-search-filters] button").count(),6);
   assert.equal(jsErrors.length,0,jsErrors.join("; "));
   console.log(item.lang+" results:",count,"status:",status);
   await page.close();
  });
 }
 await test("desktop subscriber and search coexist",async()=>{
   const page=await browser.newPage({viewport:{width:1300,height:800}});
   await page.goto(origin+"/index.html",{waitUntil:"domcontentloaded"});
   await page.locator("#header-placeholder .ct-global-search__input").waitFor({timeout:20000});
   assert(await page.locator("#header-placeholder .subscriber-global-trigger").count()>0,"subscriber CTA missing");
   await page.close();
 });
 await test("mobile layout does not overflow",async()=>{
   const page=await browser.newPage({viewport:{width:375,height:812}});
   await page.goto(origin+"/fr/index.html",{waitUntil:"domcontentloaded"});
   await page.locator("#header-placeholder .ct-global-search__input").waitFor({timeout:20000});
   const x=await page.locator(".ct-global-search").boundingBox();
   assert(x && x.x>=-2 && x.x+x.width<=377,"mobile search bar horizontal overflow");
   await page.close();
 });
}finally{await browser.close()}
if(failures.length){console.error("CT-01 browser failures:\n"+failures.join("\n"));process.exitCode=1}else console.log("CT-01 browser smoke tests passed");
