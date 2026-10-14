# CT-BABD360 public guide generator - controlled by CT-03
# Public-copy rebuild marker
#!/usr/bin/env python3
from __future__ import annotations
import argparse, base64, datetime as dt, hashlib, html, io, json, os
from pathlib import Path
import qrcode
from playwright.sync_api import sync_playwright

C={'p':'#0f2747','g':'#d4a63a','gs':'#f4ead1','t':'#1a1f2b','m':'#667085','b':'#e4e7ec','bg':'#f5f7fb'}
def E(x): return html.escape(str(x or ''), quote=True)
def J(p): return json.loads(p.read_text(encoding='utf-8'))
def uri(p):
    if not p.exists(): return ''
    mime='image/png' if p.suffix.lower()=='.png' else 'image/jpeg'
    return f'data:{mime};base64,'+base64.b64encode(p.read_bytes()).decode()
def qr(v):
    q=qrcode.QRCode(box_size=6,border=2); q.add_data(v); q.make(fit=True)
    im=q.make_image(fill_color=C['p'],back_color='white').convert('RGB')
    b=io.BytesIO(); im.save(b,'PNG')
    return 'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()
def font_css(root):
    r=root/'assets/fonts/Cairo-Regular.ttf'; b=root/'assets/fonts/Cairo-Bold.ttf'
    if not (r.exists() and b.exists()):
        raise FileNotFoundError('ConsuTrain Cairo font files are required.')
    return f"@font-face{{font-family:Cairo;src:url('{r.resolve().as_uri()}') format('truetype');font-weight:400}}@font-face{{font-family:Cairo;src:url('{b.resolve().as_uri()}') format('truetype');font-weight:700}}"
def brand(root):
    x=uri(root/'assets/images/consutrain-logo-horizontal.png')
    return f'<img class="logo" src="{x}" alt="ConsuTrain">'
def footer(m,n):
    return f'<footer><span>ConsuTrain • {E(m["programCode"])}</span><span>{E(m["guideVersion"])} • {E(m["guideDate"])}</span><span>{n:02d}</span></footer>'
def page(m,n,body,cls=''):
    logo=m.get('_logo_html','')
    lc='page-logo page-logo--dark' if 'dark' in cls.split() else 'page-logo'
    return f'<section class="page {cls}"><div class="{lc}">{logo}</div><div class="content">{body}</div>{footer(m,n)}</section>'
def title(k,h,s=''):
    return f'<div class="head"><div><span class="eye">{E(k)}</span><h2>{E(h)}</h2></div><small>{E(s)}</small></div>'
def ul(items):
    return '<ul>'+''.join(f'<li>{E(x)}</li>' for x in items)+'</ul>'

def build(d,c,root):
    m=d['meta']; logo=brand(root); m['_logo_html']=logo
    qcourse=qr(m['courseUrl']); qwa=qr(c['whatsapp']['url'])
    css=font_css(root)+'''@page{size:A4;margin:0}*{box-sizing:border-box}html,body{margin:0;font-family:Cairo,sans-serif;direction:rtl;text-align:right;color:#1a1f2b;font-size:9.4pt;line-height:1.55}a{text-decoration:none;color:inherit}h1,h2,h3,p,ul{margin-top:0}.page{width:210mm;height:297mm;position:relative;overflow:hidden;padding:22mm 14mm 18mm;page-break-after:always;background:#fff}.page:last-child{page-break-after:auto}.alt{background:#f5f7fb}.dark{background:linear-gradient(145deg,#0f2747,#163760);color:#fff}.page-logo{position:absolute;top:6mm;right:14mm;z-index:5;width:43mm;height:13mm;display:flex;align-items:center}.page-logo .logo{width:43mm;max-height:12mm;object-fit:contain;object-position:right center}.page-logo--dark{background:#fff;border-radius:3mm;padding:2mm 3mm;box-shadow:0 1mm 3mm rgba(0,0,0,.12);width:49mm;height:17mm}.page-logo--dark .logo{width:43mm;max-height:12mm}.content{position:relative;z-index:2}footer{position:absolute;right:14mm;left:14mm;bottom:6.5mm;border-top:1px solid rgba(102,112,133,.25);padding-top:2.5mm;display:grid;grid-template-columns:1fr auto 8mm;gap:4mm;color:#667085;font-size:7pt}.dark footer{color:rgba(255,255,255,.65);border-color:rgba(255,255,255,.15)}.eye{display:inline-block;background:#f4ead1;color:#b48218;padding:1.2mm 3mm;border-radius:99px;font-size:7.7pt;font-weight:700;margin-bottom:3mm}.dark .eye{background:rgba(212,166,58,.18);color:#f6d777}h1{font-size:24pt;line-height:1.35;margin-bottom:4mm}h2{font-size:18pt;color:#0f2747;margin:0 0 2mm}h3{font-size:11pt;color:#0f2747;margin-bottom:1.5mm}.dark h1,.dark h2,.dark h3{color:#fff}.lead{font-size:10.8pt;line-height:1.85;color:#667085}.dark .lead{color:rgba(255,255,255,.82)}.head{display:flex;justify-content:space-between;gap:8mm;align-items:flex-start;border-bottom:2px solid #d4a63a;padding-bottom:3.5mm;margin-bottom:7mm}.head small{color:#667085;font-weight:700}.cover{margin-top:31mm;max-width:170mm}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm;margin-top:12mm}.metric{background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.14);border-radius:4mm;padding:4mm;text-align:center}.metric strong{display:block;color:#f2cf70;font-size:18pt}.metric span{font-size:7.7pt;color:rgba(255,255,255,.76)}.grid2{display:grid;grid-template-columns:1fr 1fr;gap:5mm}.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}.card{border:1px solid #e4e7ec;border-radius:4mm;padding:4mm;background:#fff;break-inside:avoid}.card p,.card li{color:#465064;font-size:8.4pt}.card ul{padding-right:5mm;margin-bottom:0}.facts{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm;margin:6mm 0}.fact{border:1px solid #e4e7ec;border-radius:4mm;padding:4mm;background:#fff;min-height:25mm}.fact small{display:block;color:#667085}.fact strong{color:#0f2747;font-size:10.2pt}.out{list-style:none;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:2.5mm 5mm}.out li{display:grid;grid-template-columns:8mm 1fr;gap:3mm;align-items:start;border-bottom:1px solid #e4e7ec;padding:2.5mm 0}.out b{display:grid;place-items:center;width:8mm;height:8mm;border-radius:2.5mm;background:#0f2747;color:#fff;font-size:7pt}.part{border:1px solid #e4e7ec;border-radius:4mm;padding:5mm;margin-bottom:4mm;background:#fff}.part-top{display:flex;justify-content:space-between;gap:6mm}.part-num{display:grid;place-items:center;width:11mm;height:11mm;border-radius:3mm;background:#0f2747;color:#fff;font-weight:700}.chips{display:flex;flex-wrap:wrap;gap:2mm}.chip{background:#f4ead1;color:#0f2747;padding:1mm 2.5mm;border-radius:99px;font-size:7pt;font-weight:700}.call{margin-top:6mm;border-right:4px solid #d4a63a;background:#fffaf0;padding:4mm;border-radius:3mm;color:#4d5360}.apps{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}.app{border-top:3px solid #d4a63a;background:#fff;border-radius:3mm;padding:4mm;box-shadow:0 1mm 4mm rgba(15,39,71,.06)}.contact{display:grid;grid-template-columns:1.25fr .75fr;gap:10mm;margin-top:14mm}.contact-item{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);padding:4mm;border-radius:3mm;margin-bottom:3mm}.contact-item small{display:block;color:rgba(255,255,255,.62)}.contact-item a{font-weight:700;color:#fff}.qrstack{display:grid;gap:5mm}.qrcard{background:#fff;color:#0f2747;padding:4mm;border-radius:4mm;text-align:center}.qrcard img{width:34mm;height:34mm}.qrcard strong{display:block;margin-top:2mm}.buttons{display:flex;flex-wrap:wrap;gap:2mm;margin-top:5mm}.buttons a{background:#d4a63a;color:#0f2747;padding:2.2mm 4mm;border-radius:99px;font-weight:700}.buttons a.secondary{background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2)}.doc{margin-top:7mm;color:rgba(255,255,255,.7);font-size:7.6pt;line-height:1.7}'''
    P=[]
    P.append(page(m,1,f'''<div class="cover"><span class="eye">دليل برنامج مهني</span><h1>{E(m['titleAr'])}</h1><p class="lead">{E(d['intro']['headline'])}</p><div class="metrics"><div class="metric"><strong>3</strong><span>أجزاء مترابطة</span></div><div class="metric"><strong>123</strong><span>شريحة تدريبية</span></div><div class="metric"><strong>360°</strong><span>من المشكلة إلى القيمة</span></div></div></div>''','dark'))
    P.append(page(m,2,title('لماذا CT-BABD360؟','من المشكلة إلى قرار أعمال وقيمة قابلة للقياس','Business Analysis + Business Development + Digital/AI')+f'<p class="lead">{E(d["intro"]["body"])}</p><div class="grid3"><article class="card"><h3>تحليل الأعمال</h3><p>المشكلة، أصحاب المصلحة، العمليات، المتطلبات والبيانات.</p></article><article class="card"><h3>تطوير الأعمال</h3><p>السوق، العميل، الفرص، القيمة، نموذج الأعمال وBusiness Case.</p></article><article class="card"><h3>الرقمنة والذكاء الاصطناعي</h3><p>Digital/AI Use Cases والحوكمة وخارطة الطريق وقياس المنافع.</p></article></div>'))
    facts=[('الرمز',m['programCode']),('المستوى',m['level']),('البنية',m['structure']),('المحتوى',f"{m['slides']} شريحة تدريبية"),('المدة',m['durationPublic']),('طريقة التنفيذ',m['deliveryPublic'])]
    P.append(page(m,3,title('بطاقة البرنامج','المعلومات الأساسية','ملخص عملي للبرنامج')+'<div class="facts">'+''.join(f'<div class="fact"><small>{E(a)}</small><strong>{E(b)}</strong></div>' for a,b in facts)+'</div><div class="grid2"><section class="card"><h3>الفئات المستهدفة</h3>'+ul(d['audience'])+'</section><section class="card"><h3>متطلبات الالتحاق</h3>'+ul(d['prerequisites'])+'</section></div>','alt'))
    P.append(page(m,4,title('نواتج التعلم','قدرات تحليلية وتطويرية مترابطة','Learning outcomes')+'<ul class="out">'+''.join(f'<li><b>{i:02d}</b><span>{E(x)}</span></li>' for i,x in enumerate(d['outcomes'],1))+'</ul>'))
    P.append(page(m,5,title('منهجية التدريب','Concept → Framework → Example → Exercise / Case','منهجية تطبيقية')+f'<p class="lead">يبدأ التعلم بالمفهوم، ثم الإطار المهني، ثم المثال، وينتقل سريعًا إلى تمرين أو حالة عملية.</p><div class="apps">'+''.join(f'<article class="app"><h3>{E(x)}</h3><p>نشاط يستخدم لتحويل المفهوم إلى ممارسة أو قرار تطبيقي.</p></article>' for x in d['methodology']['activities'][:6])+'</div><div class="call">يشمل البرنامج أيضًا Prompt Exercise وCapstone Project ضمن المحتوى الحالي.</div>','alt'))
    for idx,part in enumerate(d['parts'],start=6):
        body=title(f'الجزء {part["number"]}',part['title'],f'{part["slides"]} شريحة')+f'<div class="part"><div class="part-top"><span class="part-num">{part["number"]:02d}</span><strong>{part["slides"]} شريحة</strong></div><h3>المحاور الرئيسية</h3>{ul(part["topics"])}<div class="call"><b>التطبيق:</b> {E(part["application"])}<br><b>المخرج المتوقع:</b> {E(part["outcome"])}</div></div>'
        P.append(page(m,idx,body,'alt' if idx%2 else ''))
    P.append(page(m,9,title('التطبيقات العملية','نماذج لما ينجزه المشارك','Applied work')+'<div class="apps">'+''.join(f'<article class="app"><h3>{E(x.split(" ")[0])}</h3><p>{E(x)}</p></article>' for x in d['applications'])+'</div>','alt'))
    cap=d['capstone']
    P.append(page(m,10,title('المشروع الختامي','Capstone','دمج التحليل والتطوير والرقمنة والذكاء الاصطناعي')+f'<div class="grid2"><section class="card"><h3>الهدف</h3><p>{E(cap["purpose"])}</p></section><section class="card"><h3>المخرج</h3><p>{E(cap["confirmedOutput"])}</p></section></div><div class="call">يركز المشروع على تجميع الأدلة وتحليل البدائل وربط التوصية بالقيمة والجدوى والحوكمة وقياس المنافع.</div>'))
    P.append(page(m,11,title('أدوات وتجربة التعلم','ممارسة الأدوات داخل سياق أعمال','Applied learning')+f'<div class="grid2"><section class="card"><h3>أنشطة تطبيقية</h3>{ul(["تمارين وورش لتحليل المشكلات والعمليات والمتطلبات.","Mini Cases وCase Studies لاتخاذ القرار وربط الأدوات بالسياق.","Opportunity Analysis وحالات B2B لتقييم فرص النمو.","Prompt Exercises وتطبيقات مرتبطة بالذكاء الاصطناعي للأعمال."])}</section><section class="card"><h3>مخرجات يبنيها المشارك</h3>{ul(["Problem Brief وتحليل للأسباب والفجوات.","خرائط عمليات ومتطلبات ومعايير قبول.","تحليل فرصة وعرض قيمة وBusiness Case أولي.","Digital / AI Use Case وخارطة طريق لقياس المنافع."])}</section></div>','alt'))
    P.append(page(m,12,title('كيف يتحقق التعلم؟','من المعرفة إلى الممارسة','Learning evidence')+f'<div class="grid3"><article class="card"><h3>Exercises</h3><p>تطبيق مباشر للأدوات والمفاهيم.</p></article><article class="card"><h3>Workshops</h3><p>عمل تطبيقي على مشكلات وفرص أعمال.</p></article><article class="card"><h3>Mini Cases</h3><p>مواقف قصيرة لاتخاذ قرار واختيار أداة مناسبة.</p></article><article class="card"><h3>Case Studies</h3><p>تحليل حالات تجمع السوق والعمليات والبيانات والقيمة.</p></article><article class="card"><h3>Self-assessment</h3><p>أسئلة لمراجعة الفهم وربط المفاهيم بالممارسة.</p></article><article class="card"><h3>Capstone</h3><p>مشروع ختامي يدمج التحليل وتطوير الأعمال والحل الرقمي أو AI.</p></article></div>'))
    P.append(page(m,13,title('الأثر المهني والتخصيص','ماذا يستطيع المشارك إنجازه؟','Professional capabilities')+f'<div class="grid2"><section class="card"><h3>قدرات مهنية</h3>{ul(d["professionalCapabilities"])}</section><section class="card"><h3>تخصيص البرنامج للمؤسسات</h3>{ul(d["customization"])}</section></div><div class="call"><b>منهج ثابت:</b> Problem → Process → Requirements → Data → Opportunity → Value → Digital/AI Solution → Business Case → Benefits.</div>','alt'))
    P.append(page(m,14,f'''<div style="margin-top:20mm"><span class="eye">الاستفسار وطلب العرض</span><h1>اطلب CT-BABD360 لجهتك أو فريقك</h1><p class="lead">تواصل معنا لاختيار صيغة التنفيذ الأنسب لفريقك ومواءمة الحالات التطبيقية مع قطاعك واحتياجات أعمالك.</p></div><div class="contact"><div><div class="contact-item"><small>الموقع</small><a href="{E(c['website']['url'])}">consutrain.com</a></div><div class="contact-item"><small>البريد الإلكتروني</small><a href="{E(c['email']['url'])}">{E(c['email']['label'])}</a></div><div class="contact-item"><small>الهاتف وواتساب</small><a href="{E(c['whatsapp']['url'])}"><bdi dir="ltr">{E(c['phone']['label'])}</bdi></a></div><div class="buttons"><a href="{E(m['quoteUrl'])}">طلب عرض تدريبي</a><a class="secondary" href="{E(m['courseUrl'])}">صفحة البرنامج</a><a class="secondary" href="{E(c['whatsapp']['url'])}">واتساب</a></div><div class="doc"><b>رمز البرنامج:</b> {E(m['programCode'])}<br><b>الدليل:</b> {E(m['guideVersion'])} • {E(m['guideDate'])}<br><br>هذا الدليل يقدم نظرة عملية على البرنامج ومحاوره وتجربة التعلم والمخرجات المهنية. © 2026 ConsuTrain. جميع الحقوق محفوظة.</div></div><div class="qrstack"><div class="qrcard"><img src="{qcourse}"><strong>فتح صفحة CT-BABD360</strong></div><div class="qrcard"><img src="{qwa}"><strong>التواصل عبر واتساب</strong></div></div></div>''','dark'))
    return '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>'+E(m['guideTitle'])+'</title><style>'+css+'</style></head><body>'+''.join(P)+'</body></html>'

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--root',default='.'); ap.add_argument('--force',action='store_true'); ap.add_argument('--html-preview',default='')
    a=ap.parse_args(); root=Path(a.root).resolve()
    dp=root/'assets/data/ct-babd360-course-guide.json'; cp=root/'assets/data/platform-contact.json'
    out=root/'assets/downloads/ct-babd360/ct-babd360-program-guide-ar.pdf'
    mp=root/'assets/data/ct-babd360-course-guide-manifest.json'
    d=J(dp); c=J(cp)
    h=hashlib.sha256()
    for p in [dp,cp,Path(__file__).resolve(),root/'assets/images/consutrain-logo-horizontal.png',root/'assets/fonts/Cairo-Regular.ttf',root/'assets/fonts/Cairo-Bold.ttf']:
        h.update(p.read_bytes() if p.exists() else b'')
    sh=h.hexdigest()
    old=J(mp) if mp.exists() else {}
    if not a.force and old.get('sourceHash')==sh and out.exists() and out.stat().st_size: return 0
    doc=build(d,c,root)
    if a.html_preview:
        pp=root/a.html_preview; pp.parent.mkdir(parents=True,exist_ok=True); pp.write_text(doc,encoding='utf-8')
    out.parent.mkdir(parents=True,exist_ok=True)
    temp=root/'assets/downloads/ct-babd360/.render.html'; temp.parent.mkdir(parents=True,exist_ok=True); temp.write_text(doc,encoding='utf-8')
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
    manifest={'sourceHash':sh,'updatedAt':dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat(),'source':str(dp.relative_to(root)).replace('\\','/'),'contactSource':str(cp.relative_to(root)).replace('\\','/'),'pdf':{'url':str(out.relative_to(root)).replace('\\','/'),'version':d['meta']['guideVersion'],'documentDate':d['meta']['guideDate'],'fileHash':fh,'downloadName':'ConsuTrain_CT-BABD360_Program_Guide_AR.pdf'}}
    mp.parent.mkdir(parents=True,exist_ok=True); mp.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('Generated',out); print('SHA-256',fh)
    return 0
if __name__=='__main__': raise SystemExit(main())
