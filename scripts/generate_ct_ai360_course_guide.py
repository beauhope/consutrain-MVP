# CT-AI360 public guide generator - controlled by CT-03
#!/usr/bin/env python3
from __future__ import annotations
import argparse, base64, datetime as dt, hashlib, html, io, json, os
from pathlib import Path
import qrcode
from playwright.sync_api import sync_playwright

def E(x): return html.escape(str(x or ''),quote=True)
def J(p): return json.loads(p.read_text(encoding='utf-8'))
def uri(p):
    if not p.exists(): return ''
    mime='image/png' if p.suffix.lower()=='.png' else 'image/jpeg'
    return f'data:{mime};base64,'+base64.b64encode(p.read_bytes()).decode()
def qr(v):
    q=qrcode.QRCode(box_size=6,border=2); q.add_data(v); q.make(fit=True)
    im=q.make_image(fill_color='#0f2747',back_color='white').convert('RGB')
    b=io.BytesIO(); im.save(b,'PNG')
    return 'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()
def font_css(root):
    r=root/'assets/fonts/Cairo-Regular.ttf'; b=root/'assets/fonts/Cairo-Bold.ttf'
    if not (r.exists() and b.exists()): raise FileNotFoundError('ConsuTrain Cairo font files are required.')
    return f"@font-face{{font-family:Cairo;src:url('{r.resolve().as_uri()}') format('truetype');font-weight:400}}@font-face{{font-family:Cairo;src:url('{b.resolve().as_uri()}') format('truetype');font-weight:700}}"
def brand(root):
    x=uri(root/'assets/images/consutrain-logo-horizontal.png')
    return f'<img class="logo" src="{x}" alt="ConsuTrain">'
def footer(m,n):
    return f'<footer><span>ConsuTrain • {E(m["programCode"])}</span><span>{E(m["guideVersion"])} • {E(m["guideDate"])}</span><span>{n:02d}</span></footer>'
def page(m,n,body,cls=''):
    lc='page-logo page-logo--dark' if 'dark' in cls.split() else 'page-logo'
    return f'<section class="page {cls}"><div class="{lc}">{m["_logo"]}</div><div class="content">{body}</div>{footer(m,n)}</section>'
def title(k,h,s=''):
    return f'<div class="head"><div><span class="eye">{E(k)}</span><h2>{E(h)}</h2></div><small>{E(s)}</small></div>'
def ul(xs): return '<ul>'+''.join(f'<li>{E(x)}</li>' for x in xs)+'</ul>'

def build(d,c,root):
    m=d['meta']; m['_logo']=brand(root); qcourse=qr(m['courseUrl']); qwa=qr(c['whatsapp']['url'])
    css=font_css(root)+'''@page{size:A4;margin:0}*{box-sizing:border-box}html,body{margin:0;font-family:Cairo,sans-serif;direction:rtl;text-align:right;color:#1a1f2b;font-size:9.3pt;line-height:1.55}.page{width:210mm;height:297mm;position:relative;overflow:hidden;padding:22mm 14mm 18mm;page-break-after:always;background:#fff}.page:last-child{page-break-after:auto}.alt{background:#f5f7fb}.dark{background:linear-gradient(145deg,#0f2747,#163760);color:#fff}.page-logo{position:absolute;top:6mm;right:14mm;width:43mm;height:13mm;z-index:5;display:flex;align-items:center}.page-logo .logo{width:43mm;max-height:12mm;object-fit:contain}.page-logo--dark{background:#fff;border-radius:3mm;padding:2mm 3mm;box-shadow:0 1mm 3mm rgba(0,0,0,.12);width:49mm;height:17mm}.content{position:relative;z-index:2}footer{position:absolute;right:14mm;left:14mm;bottom:6.5mm;border-top:1px solid rgba(102,112,133,.25);padding-top:2.5mm;display:grid;grid-template-columns:1fr auto 8mm;gap:4mm;color:#667085;font-size:7pt}.dark footer{color:rgba(255,255,255,.65);border-color:rgba(255,255,255,.15)}.eye{display:inline-block;background:#f4ead1;color:#b48218;padding:1.2mm 3mm;border-radius:99px;font-size:7.7pt;font-weight:700;margin-bottom:3mm}.dark .eye{background:rgba(212,166,58,.18);color:#f6d777}h1{font-size:24pt;line-height:1.35;margin:0 0 4mm}h2{font-size:18pt;line-height:1.35;color:#0f2747;margin:0 0 2mm}h3{font-size:11pt;color:#0f2747;margin:0 0 1.5mm}.dark h1,.dark h2,.dark h3{color:#fff}.lead{font-size:10.8pt;line-height:1.85;color:#667085}.dark .lead{color:rgba(255,255,255,.82)}.head{display:flex;justify-content:space-between;gap:8mm;align-items:flex-start;border-bottom:2px solid #d4a63a;padding-bottom:3.5mm;margin-bottom:7mm}.head small{color:#667085;font-weight:700}.cover{margin-top:31mm;max-width:172mm}.cover-fr{direction:ltr;text-align:right;color:#f6d777;font-size:11.5pt;font-weight:700;margin:4mm 0 7mm}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:4mm;margin-top:11mm}.metric{background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.14);border-radius:4mm;padding:4mm;text-align:center}.metric strong{display:block;color:#f2cf70;font-size:18pt}.metric span{font-size:7.5pt;color:rgba(255,255,255,.78)}.grid2{display:grid;grid-template-columns:1fr 1fr;gap:5mm}.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}.card{border:1px solid #e4e7ec;border-radius:4mm;padding:4mm;background:#fff;break-inside:avoid}.card p,.card li{color:#465064;font-size:8.35pt}.card ul{padding-right:5mm;margin-bottom:0}.facts{display:grid;grid-template-columns:repeat(4,1fr);gap:4mm}.fact{background:#fff;border:1px solid #e4e7ec;border-radius:4mm;padding:4mm;min-height:25mm}.fact small{display:block;color:#667085}.fact strong{color:#0f2747;font-size:10pt}.out{list-style:none;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:2.3mm 5mm}.out li{display:grid;grid-template-columns:8mm 1fr;gap:3mm;border-bottom:1px solid #e4e7ec;padding:2.3mm 0}.out b{display:grid;place-items:center;width:8mm;height:8mm;border-radius:2.5mm;background:#0f2747;color:#fff;font-size:7pt}.level{border:1px solid #e4e7ec;border-radius:4mm;padding:5mm;background:#fff;margin-bottom:4mm}.level-top{display:grid;grid-template-columns:12mm 1fr 24mm;gap:4mm;align-items:center}.level-num{display:grid;place-items:center;width:10mm;height:10mm;border-radius:3mm;background:#0f2747;color:#fff;font-weight:700}.level strong{color:#b48218;text-align:center}.chips{display:flex;flex-wrap:wrap;gap:2mm;margin-top:3mm}.chip{background:#f4ead1;color:#0f2747;padding:1mm 2.4mm;border-radius:99px;font-size:7pt;font-weight:700}.call{margin-top:5mm;border-right:4px solid #d4a63a;background:#fffaf0;padding:4mm;border-radius:3mm;color:#4d5360}.apps{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}.app{border-top:3px solid #d4a63a;background:#fff;border-radius:3mm;padding:4mm}.flow{display:grid;gap:3mm}.step{display:grid;grid-template-columns:13mm 1fr;gap:4mm;align-items:center;background:#fff;border:1px solid #e4e7ec;border-radius:4mm;padding:4mm}.step b{display:grid;place-items:center;width:11mm;height:11mm;border-radius:50%;background:#d4a63a;color:#0f2747}.contact{display:grid;grid-template-columns:1.25fr .75fr;gap:10mm;margin-top:13mm}.contact-item{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);padding:4mm;border-radius:3mm;margin-bottom:3mm}.contact-item small{display:block;color:rgba(255,255,255,.62)}.contact-item a{font-weight:700;color:#fff;text-decoration:none}.qrstack{display:grid;gap:5mm}.qrcard{background:#fff;color:#0f2747;padding:4mm;border-radius:4mm;text-align:center}.qrcard img{width:34mm;height:34mm}.buttons{display:flex;flex-wrap:wrap;gap:2mm;margin-top:5mm}.buttons a{background:#d4a63a;color:#0f2747;padding:2.2mm 4mm;border-radius:99px;font-weight:700;text-decoration:none}.buttons a.secondary{background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2)}.doc{margin-top:7mm;color:rgba(255,255,255,.7);font-size:7.5pt;line-height:1.7}'''
    P=[]
    P.append(page(m,1,f'''<div class="cover"><span class="eye">دليل برنامج تدريبي</span><h1>{E(m["titleAr"])}</h1><div class="cover-fr">{E(m["titleFr"])}</div><p class="lead">{E(d["intro"]["headline"])}</p><div class="metrics"><div class="metric"><strong>30</strong><span>ساعة تدريبية</span></div><div class="metric"><strong>3</strong><span>مستويات</span></div><div class="metric"><strong>180</strong><span>شريحة</span></div><div class="metric"><strong>36</strong><span>موضوعًا</span></div></div></div>''','dark'))
    P.append(page(m,2,title('لماذا CT-AI360؟','من استخدام ChatGPT إلى بناء نظام عمل ذكي','تدرج عملي في ثلاث مراحل')+f'<p class="lead">{E(d["intro"]["body"])}</p><div class="grid3"><article class="card"><h3>Fondamental</h3><p>الفهم، ChatGPT، prompting، reasoning، web research والتحقق.</p></article><article class="card"><h3>Professionnel</h3><p>Projects، Deep Research، files، data، Work، apps، Codex والاستخدام المهني.</p></article><article class="card"><h3>Avancé</h3><p>Agents، Agentic AI، RAG، APIs، MCP، automation، security وgovernance.</p></article></div>'))
    facts=[('الرمز',m['programCode']),('المدة','30 ساعة تدريبية'),('المستويات','3 مستويات'),('المحتوى','180 شريحة'),('النطاق','36 موضوعًا'),('اللغة',m['languageLabel']),('المسار',m['levelPath']),('المشروع','Assistant / Consultant IA')]
    P.append(page(m,3,title('بطاقة البرنامج','المعلومات الأساسية','CT-AI360')+'<div class="facts">'+''.join(f'<div class="fact"><small>{E(a)}</small><strong>{E(b)}</strong></div>' for a,b in facts)+'</div><div class="grid2" style="margin-top:7mm"><section class="card"><h3>الفئات المستهدفة</h3>{}</section><section class="card"><h3>طبيعة التجربة</h3><p>برنامج عام متدرج يخدم التعلم والعمل والإنتاجية والبحث واتخاذ القرار، ويقود المشارك تدريجيًا إلى فهم الأنظمة الوكيلة والأتمتة.</p></section></div>'.format(ul(d['audience'])),'alt'))
    P.append(page(m,4,title('نواتج التعلم','قدرات من الاستخدام الأساسي إلى التصميم المتقدم','Learning outcomes')+'<ul class="out">'+''.join(f'<li><b>{i:02d}</b><span>{E(x)}</span></li>' for i,x in enumerate(d['outcomes'],1))+'</ul>'))
    seq=d['methodology']['sequence']
    P.append(page(m,5,title('منهجية التدريب','شرح → Demonstration → Practice → Verification → Capitalisation','تعلم بالممارسة والتحقق')+'<div class="flow">'+''.join(f'<article class="step"><b>{i}</b><div><h3>{E(x)}</h3><p>مرحلة متكررة داخل الرحلة التدريبية لتحويل المعرفة إلى ممارسة قابلة للاستخدام.</p></div></article>' for i,x in enumerate(seq,1))+'</div><div class="call">'+E(d['methodology']['learningThread'])+'</div>','alt'))
    for pageno,level in enumerate(d['levels'],start=6):
        chips=''.join(f'<span class="chip">{E(x["title"])}</span>' for x in level['modules'])
        P.append(page(m,pageno,title(f'المستوى {level["number"]}',level['name'],f'{level["slides"]} شريحة')+f'<div class="level"><div class="level-top"><span class="level-num">{level["number"]}</span><div><h3>{E(level["promise"])}</h3></div><strong>{len(level["modules"])} موضوعًا</strong></div><div class="chips">{chips}</div><div class="call"><b>التطبيق:</b> {E(level["application"])}</div></div>','alt' if pageno%2 else ''))
    P.append(page(m,9,title('الأنشطة التطبيقية','من Micro-exercises إلى Agentic Workshops','Applied learning')+'<div class="apps">'+''.join(f'<article class="app"><h3>{E(x)}</h3><p>نشاط يربط الأداة أو المفهوم بمهمة عملية قابلة للمراجعة والتحسين.</p></article>' for x in d['methodology']['activities'])+'</div>','alt'))
    fp=d['finalProject']
    P.append(page(m,10,title('المشروع النهائي',fp['title'],'مشروع متكامل قابل للقياس')+f'<div class="grid2"><section class="card"><h3>الهدف</h3><p>{E(fp["purpose"])}</p><h3>أنواع الاحتياج</h3><div class="chips">'+''.join(f'<span class="chip">{E(x)}</span>' for x in fp['needs'])+f'</div></section><section class="card"><h3>منطق التصميم</h3><p>{E(fp["designFlow"])}</p><h3>القدرات</h3><p>{E(fp["capabilities"])}</p><h3>الضوابط</h3><p>{E(fp["controls"])}</p></section></div><div class="call"><b>Workflow:</b> {E(fp["workflow"])}</div>'))
    P.append(page(m,11,title('قياس النظام','من جودة النتيجة إلى قيمة الاستخدام','Tests + KPIs + Roadmap')+f'<div class="grid3">'+''.join(f'<article class="card"><h3>{E(x)}</h3><p>مؤشر يساعد على اختبار جودة النظام وقيمته في الاستخدام الفعلي.</p></article>' for x in fp['measures'])+'</div><div class="flow" style="margin-top:7mm">'+''.join(f'<article class="step"><b>{i}</b><div><h3>{E(x)}</h3><p>مرحلة تطوير تدريجية للنظام من MVP إلى أتمتة أكثر موثوقية وتحكمًا.</p></div></article>' for i,x in enumerate(fp['roadmap'],1))+'</div>','alt'))
    P.append(page(m,12,title('الأثر المهني','ما الذي يستطيع المشارك إنجازه؟','Professional capabilities')+'<ul class="out">'+''.join(f'<li><b>{i:02d}</b><span>{E(x)}</span></li>' for i,x in enumerate(d['professionalCapabilities'],1))+'</ul><div class="call">الهدف النهائي: demande complexe → travail traçable → résultat validable.</div>'))
    P.append(page(m,13,f'''<div style="margin-top:20mm"><span class="eye">الاستفسار وطلب العرض</span><h1>ابدأ رحلة CT-AI360</h1><p class="lead">30 ساعة تدريبية تقود من أساسيات ChatGPT والذكاء الاصطناعي إلى الاستخدام المهني والوكلاء والأتمتة.</p></div><div class="contact"><div><div class="contact-item"><small>الموقع</small><a href="{E(c['website']['url'])}">consutrain.com</a></div><div class="contact-item"><small>البريد الإلكتروني</small><a href="{E(c['email']['url'])}">{E(c['email']['label'])}</a></div><div class="contact-item"><small>الهاتف وواتساب</small><a href="{E(c['whatsapp']['url'])}"><bdi dir="ltr">{E(c['phone']['label'])}</bdi></a></div><div class="buttons"><a href="{E(m['quoteUrl'])}">طلب عرض تدريبي</a><a class="secondary" href="{E(m['courseUrl'])}">صفحة البرنامج</a><a class="secondary" href="{E(c['whatsapp']['url'])}">واتساب</a></div><div class="doc"><b>رمز البرنامج:</b> {E(m['programCode'])}<br><b>الدليل:</b> {E(m['guideVersion'])} • {E(m['guideDate'])}<br><b>لغة التدريب:</b> {E(m['languageLabel'])}<br><br>هذا الدليل يقدم نظرة عملية على البرنامج ومحاوره وتجربة التعلم والمشروع النهائي. © 2026 ConsuTrain. جميع الحقوق محفوظة.</div></div><div class="qrstack"><div class="qrcard"><img src="{qcourse}"><strong>فتح صفحة CT-AI360</strong></div><div class="qrcard"><img src="{qwa}"><strong>التواصل عبر واتساب</strong></div></div></div>''','dark'))
    return '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>'+E(m['guideTitle'])+'</title><style>'+css+'</style></head><body>'+''.join(P)+'</body></html>'

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--root',default='.'); ap.add_argument('--force',action='store_true')
    a=ap.parse_args(); root=Path(a.root).resolve()
    dp=root/'assets/data/ct-ai360-course-guide.json'; cp=root/'assets/data/platform-contact.json'
    out=root/'assets/downloads/ct-ai360/ct-ai360-program-guide-ar.pdf'
    mp=root/'assets/data/ct-ai360-course-guide-manifest.json'
    d=J(dp); c=J(cp)
    h=hashlib.sha256()
    for p in [dp,cp,Path(__file__).resolve(),root/'assets/images/consutrain-logo-horizontal.png',root/'assets/fonts/Cairo-Regular.ttf',root/'assets/fonts/Cairo-Bold.ttf']:
        h.update(p.read_bytes() if p.exists() else b'')
    sh=h.hexdigest()
    old=J(mp) if mp.exists() else {}
    if not a.force and old.get('sourceHash')==sh and out.exists() and out.stat().st_size: return 0
    doc=build(d,c,root); out.parent.mkdir(parents=True,exist_ok=True)
    temp=out.parent/'.render.html'; temp.write_text(doc,encoding='utf-8')
    with sync_playwright() as p:
        kw={'headless':True}; bp=os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH')
        if bp: kw['executable_path']=bp
        b=p.chromium.launch(**kw); pg=b.new_page(viewport={'width':1240,'height':1754})
        pg.goto(temp.resolve().as_uri(),wait_until='load'); pg.evaluate("document.fonts.ready")
        if not pg.evaluate("document.fonts.check('16px Cairo')"): raise RuntimeError('Cairo font did not load.')
        pg.emulate_media(media='print')
        pg.pdf(path=str(out),format='A4',print_background=True,prefer_css_page_size=True,margin={'top':'0','right':'0','bottom':'0','left':'0'})
        b.close()
    temp.unlink(missing_ok=True)
    fh=hashlib.sha256(out.read_bytes()).hexdigest()
    manifest={'sourceHash':sh,'updatedAt':dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat(),'source':str(dp.relative_to(root)).replace('\\','/'),'contactSource':str(cp.relative_to(root)).replace('\\','/'),'pdf':{'url':str(out.relative_to(root)).replace('\\','/'),'version':d['meta']['guideVersion'],'documentDate':d['meta']['guideDate'],'fileHash':fh,'downloadName':'ConsuTrain_CT-AI360_Program_Guide_AR.pdf'}}
    mp.parent.mkdir(parents=True,exist_ok=True); mp.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('Generated',out); print('SHA-256',fh)
    return 0
if __name__=='__main__': raise SystemExit(main())
