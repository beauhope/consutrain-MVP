const fs = require('fs');
const bankPath = 'fr/tools/project-exam-lab/data/questions.json';
const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
const translations = JSON.parse(fs.readFileSync('.fr2-batch.json', 'utf8'));
for (const tr of translations.questions) {
  const q = bank.questions.find(item => item.qid === tr.qid);
  if (!q) throw new Error(`Missing ${tr.qid}`);
  const oldOptions = q.options ? [...q.options] : null;
  const oldLeft = q.left_items ? [...q.left_items] : null;
  const oldRight = q.right_items ? [...q.right_items] : null;
  const oldCorrect = Array.isArray(q.correct) ? [...q.correct] : null;
  const oldPairs = q.correct_pairs ? {...q.correct_pairs} : null;
  for (const key of ['topic','prompt','explanation','context_name','case_title','case_scenario']) if (Object.hasOwn(tr,key)) q[key]=tr[key];
  if (tr.options) {
    if (!oldOptions || tr.options.length !== oldOptions.length) throw new Error(`Options mismatch ${tr.qid}`);
    q.options=tr.options;
    if (oldCorrect) q.correct=oldCorrect.map(value=>tr.options[oldOptions.indexOf(value)]);
  }
  if (tr.left_items) q.left_items=tr.left_items;
  if (tr.right_items) q.right_items=tr.right_items;
  if (oldPairs) {
    q.correct_pairs={};
    oldLeft.forEach((left,i)=>q.correct_pairs[q.left_items[i]]=q.right_items[oldRight.indexOf(oldPairs[left])]);
  }
}
for (const tr of translations.cases||[]) {
  const c=bank.cases.find(item=>item.id===tr.id); if(!c) throw new Error(`Missing case ${tr.id}`);
  c.title=tr.title;c.scenario=tr.scenario;
}
fs.writeFileSync(bankPath, JSON.stringify(bank,null,2)+'\n','utf8');
