// CT-01: static policy regression checks for the generated public search index.
import assert from "node:assert/strict";
import fs from "node:fs";
const audit=JSON.parse(fs.readFileSync("search-audit/report.json","utf8"));
const files=audit.included;
const groups=["learn","courses","tools","resources","services"];
const categorise=p=>{let x=p.startsWith("fr/")?p.slice(3):p;if(x==="tools.html"||x.startsWith("tools/"))return "tools";if(x==="services.html"||x.startsWith("services/"))return "services";if(x==="learn.html"||x.startsWith("learn/"))return "learn";if(x.startsWith("courses/"))return "courses";if(x.startsWith("resources/")||x.startsWith("templates/"))return "resources";return null};
assert(files.length>0,"index must not be empty");
assert.equal(new Set(files).size,files.length,"no duplicates");
for(const file of files){
  assert(file.endsWith(".html"),`non-HTML result: ${file}`);
  assert(groups.includes(categorise(file)),`out of scope: ${file}`);
  assert(!/(?:^|\/)(admin|certificate-request|final-assessment|unsubscribe|quote-request|consultation-form)(?:\/|\.|$)/i.test(file),`operational page leaked: ${file}`);
}
for(const lang of ["ar","fr"]){
  const count=files.filter(p=>(lang==="fr")===p.startsWith("fr/")).length;
  assert.equal(count,Object.values(audit[lang]).reduce((x,y)=>x+y,0),`${lang} count mismatch`);
  for(const group of groups)assert(audit[lang][group]>0,`missing ${lang} category ${group}`);
}
for(const p of ["learn/management-tech-radar.html","fr/learn/management-tech-radar.html"])assert(files.includes(p),`public Radar index missing: ${p}`);
for(const {file} of audit.rejected)assert(!files.includes(file),`unpublished Radar leaked: ${file}`);
console.log("CT-01 policy checks passed:",files.length,"public pages across two locales/five sections.");
