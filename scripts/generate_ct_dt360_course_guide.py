#!/usr/bin/env python3
from __future__ import annotations
import argparse, base64, datetime as dt, hashlib, html, io, json, os
from pathlib import Path
import qrcode
from playwright.sync_api import sync_playwright

C={'p':'#0f2747','p2':'#163760','g':'#d4a63a','gs':'#f4ead1','t':'#1a1f2b','m':'#667085','b':'#e4e7ec','bg':'#f5f7fb'}
def E(x): return html.escape(str(x or ''),quote=True)
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
        raise FileNotFoundError('ConsuTrain Cairo font files are required for CT-DT360 PDF generation.')
    return f"@font-face{{font-family:Cairo;src:url('{r.resolve().as_uri()}') format('truetype');font-weight:400;font-style:normal}}@font-face{{font-family:Cairo;src:url('{b.resolve().as_uri()}') format('truetype');font-weight:700;font-style:normal}}"
def brand(root):
    x=uri(root/'assets/images/consutrain-logo-horizontal.png')
    return f'<img class="logo" src="{x}" alt="ConsuTrain">' if x else '<div class="brand">ConsuTrain <b>CT</b></div>'
def footer(m,n):
    return f'<footer><span>ConsuTrain • {E(m["programCode"])}</span><span>{E(m["guideVersion"])} • {E(m["guideDate"])}</span><span>{n:02d}</span></footer>'
def page(m,n,body,cls=''):
    logo=m.get('_logo_html','')
    logo_class='page-logo page-logo--dark' if 'dark' in cls.split() else 'page-logo'
    logo_html=f'<div class="{logo_class}">{logo}</div>' if logo else ''
    return f'<section class="page {cls}">{logo_html}<div class="content">{body}</div>{footer(m,n)}</section>'
def title(k,h,s=''):
    return f'<div class="head"><div><span class="eye">{E(k)}</span><h2>{E(h)}</h2></div><small>{E(s)}</small></div>'
def ul(items,cls=''):
    return '<ul class="'+cls+'">'+''.join(f'<li>{E(x)}</li>' for x in items)+'</ul>'

def build(d,c,root):
    m=d['meta']; qcourse=qr(m['courseUrl']); qwa=qr(c['whatsapp']['url']); logo=brand(root); m['_logo_html']=logo
    css=font_css(root)+'''@page{size:A4;margin:0}*{box-sizing:border-box}html,body{margin:0;font-family:Cairo,sans-serif;direction:rtl;text-align:right;color:#1a1f2b;font-size:9.4pt;line-height:1.55}a{text-decoration:none;color:inherit}h1,h2,h3,p,ul{margin-top:0}.page{width:210mm;height:297mm;position:relative;overflow:hidden;padding:15mm 14mm 18mm;page-break-after:always;background:#fff}.page:last-child{page-break-after:auto}.alt{background:#f5f7fb}.dark{background:linear-gradient(145deg,#0f2747,#163760);color:#fff}.dark:before{content:'';position:absolute;width:120mm;height:120mm;border-radius:50%;left:-48mm;bottom:-38mm;background:rgba(255,255,255,.05)}.page-logo{position:absolute;top:7mm;right:14mm;z-index:5;width:43mm;height:13mm;display:flex;align-items:center;justify-content:flex-start}.page-logo .logo{width:43mm;max-height:12mm;object-fit:contain;object-position:right center}.page-logo--dark{background:#fff;border-radius:3mm;padding:2mm 3mm;box-shadow:0 1mm 3mm rgba(0,0,0,.12);width:49mm;height:17mm}.page-logo--dark .logo{width:43mm;max-height:12mm}.content{position:relative;z-index:2;padding-top:9mm}footer{position:absolute;right:14mm;left:14mm;bottom:6.5mm;border-top:1px solid rgba(102,112,133,.25);padding-top:2.5mm;display:grid;grid-template-columns:1fr auto 8mm;gap:4mm;color:#667085;font-size:7pt;z-index:4}.dark footer{color:rgba(255,255,255,.65);border-color:rgba(255,255,255,.15)}.logo{width:55mm;max-height:17mm;object-fit:contain;object-position:right center}.brand{display:inline-flex;direction:ltr;align-items:center;gap:3mm;font-size:18pt;font-weight:700}.brand b{display:grid;place-items:center;width:11mm;height:11mm;border-radius:50%;background:#d4a63a;color:#0f2747;font-size:8pt}.eye{display:inline-block;background:#f4ead1;color:#b48218;padding:1.2mm 3mm;border-radius:99px;font-size:7.7pt;font-weight:700;margin-bottom:3mm}.dark .eye{background:rgba(212,166,58,.18);color:#f6d777}h1{font-size:25pt;line-height:1.35;margin-bottom:4mm}h2{font-size:19pt;line-height:1.35;color:#0f2747;margin:0 0 2mm}h3{font-size:11pt;color:#0f2747;line-height:1.45;margin-bottom:1.5mm}.dark h1,.dark h2,.dark h3{color:#fff}.lead{font-size:11pt;line-height:1.85;color:#667085}.dark .lead{color:rgba(255,255,255,.82)}.head{display:flex;justify-content:space-between;gap:8mm;align-items:flex-start;border-bottom:2px solid #d4a63a;padding-bottom:3.5mm;margin-bottom:7mm}.head small{color:#667085;font-weight:700}.cover{margin-top:32mm;max-width:170mm}.cover-en{direction:ltr;text-align:right;color:#f5d77e;font-size:11.5pt;font-weight:700;margin-bottom:6mm}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:4mm;margin-top:12mm}.metric{background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.14);border-radius:4mm;padding:4mm;text-align:center}.metric strong{display:block;color:#f2cf70;font-size:18pt}.metric span{font-size:7.7pt;color:rgba(255,255,255,.76)}.grid2{display:grid;grid-template-columns:1fr 1fr;gap:5mm}.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}.card{border:1px solid #e4e7ec;border-radius:4mm;padding:4mm;background:#fff;break-inside:avoid}.card p,.card li{color:#465064;font-size:8.4pt}.card ul{padding-right:5mm;margin-bottom:0}.facts{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm;margin:6mm 0}.fact{border:1px solid #e4e7ec;border-radius:4mm;padding:4mm;background:#fff;min-height:26mm}.fact small{display:block;color:#667085}.fact strong{color:#0f2747;font-size:10.5pt}.out{list-style:none;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:2.5mm 5mm}.out li{display:grid;grid-template-columns:8mm 1fr;gap:3mm;align-items:start;border-bottom:1px solid #e4e7ec;padding:2.5mm 0}.out b{display:grid;place-items:center;width:8mm;height:8mm;border-radius:2.5mm;background:#0f2747;color:#fff;font-size:7pt}.ratio{display:grid;grid-template-columns:62mm 1fr;gap:10mm;align-items:center;margin-top:8mm}.ring{width:58mm;height:58mm;border-radius:50%;background:conic-gradient(#d4a63a 0 70%,#0f2747 70% 100%);display:grid;place-items:center;position:relative}.ring:after{content:'';position:absolute;width:39mm;height:39mm;border-radius:50%;background:#fff}.ring div{position:relative;z-index:2;text-align:center;color:#0f2747}.ring strong{font-size:17pt;display:block}.phase{display:grid;grid-template-columns:11mm 1fr 20mm;gap:4mm;align-items:center;background:#fff;border:1px solid #e4e7ec;border-radius:4mm;padding:4mm;margin-bottom:3mm}.phase>span{display:grid;place-items:center;width:9mm;height:9mm;border-radius:3mm;background:#0f2747;color:#fff;font-weight:700}.phase p{margin:0;color:#667085;font-size:8pt}.phase>strong{color:#b48218;text-align:center}table{width:100%;border-collapse:separate;border-spacing:0;font-size:7.3pt;border:1px solid #e4e7ec;border-radius:3mm;overflow:hidden}th{background:#0f2747;color:#fff;padding:2.5mm;text-align:right}td{padding:2.3mm;border-bottom:1px solid #e4e7ec;border-left:1px solid #e4e7ec;vertical-align:top;line-height:1.42}tr:last-child td{border-bottom:0}td:last-child{border-left:0}.mod{display:flex;gap:2mm;font-weight:700;color:#0f2747}.mod b{background:#f4ead1;color:#b48218;border-radius:2mm;padding:.5mm 1.5mm}.hrs{text-align:center;white-space:nowrap}.hrs strong{display:block;color:#0f2747;font-size:12pt}.apps{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}.app{border-top:3px solid #d4a63a;background:#fff;border-radius:3mm;padding:4mm;box-shadow:0 1mm 4mm rgba(15,39,71,.06)}.app span{font-size:7.5pt;color:#b48218;font-weight:700}.flow{display:grid;gap:3mm;margin-top:7mm}.cap{display:grid;grid-template-columns:14mm 1fr;gap:4mm;align-items:center;background:#fff;border:1px solid #e4e7ec;border-radius:4mm;padding:4mm}.cap b{display:grid;place-items:center;width:12mm;height:12mm;border-radius:50%;background:#d4a63a;color:#0f2747}.cap p{margin:0;color:#667085;font-size:8.3pt}.call{margin-top:6mm;border-right:4px solid #d4a63a;background:#fffaf0;padding:4mm;border-radius:3mm;color:#4d5360}.assess{display:grid;grid-template-columns:1fr 1fr;gap:4mm}.as{display:grid;grid-template-columns:15mm 1fr;gap:4mm;background:#fff;border:1px solid #e4e7ec;border-radius:4mm;padding:4mm}.as>span{display:grid;place-items:center;width:13mm;height:13mm;border-radius:50%;background:#0f2747;color:#fff;font-weight:700}.chips{display:flex;flex-wrap:wrap;gap:2mm;margin-top:3mm}.chip{background:#f4ead1;color:#0f2747;padding:1mm 2.5mm;border-radius:99px;font-size:7pt;font-weight:700}.contact{display:grid;grid-template-columns:1.25fr .75fr;gap:10mm;margin-top:14mm}.contact-item{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);padding:4mm;border-radius:3mm;margin-bottom:3mm}.contact-item small{display:block;color:rgba(255,255,255,.62)}.contact-item a{font-weight:700;color:#fff}.qrstack{display:grid;gap:5mm}.qrcard{background:#fff;color:#0f2747;padding:4mm;border-radius:4mm;text-align:center}.qrcard img{width:34mm;height:34mm}.qrcard strong{display:block;margin-top:2mm}.buttons{display:flex;flex-wrap:wrap;gap:2mm;margin-top:5mm}.buttons a{background:#d4a63a;color:#0f2747;padding:2.2mm 4mm;border-radius:99px;font-weight:700}.buttons a.secondary{background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2)}.doc{margin-top:7mm;color:rgba(255,255,255,.7);font-size:7.6pt;line-height:1.7}'''
    P=[]
    P.append(page(m,1,f'''<div class="cover"><span class="eye">دليل برنامج مهني متقدم</span><h1>{E(m['titleAr'])}</h1><div class="cover-en">{E(m['titleEn'])}</div><p class="lead">{E(d['intro']['headline'])}</p><div class="metrics"><div class="metric"><strong>72</strong><span>ساعة تدريبية صافية</span></div><div class="metric"><strong>14</strong><span>وحدة تدريبية</span></div><div class="metric"><strong>6</strong><span>مراحل مترابطة</span></div><div class="metric"><strong>14</strong><span>ساعة مشروع نهائي</span></div></div></div>''','dark'))
    steps=['التشخيص: فهم الواقع وخط الأساس','الاستراتيجية: تحديد القيمة والأولويات','الهندسة: إعادة تصميم العمليات والمتطلبات','التنفيذ: إدارة المشروع وتسليم القيمة','الذكاء والحوكمة: أتمتة وAI بضوابط','القياس: UAT وKPIs والتبني والاستدامة']
    P.append(page(m,2,title('لماذا CT-DT360؟','من مبادرات رقمية متفرقة إلى قدرة مؤسسية تقود القيمة','رحلة واحدة من القرار إلى الاستدامة')+f'<p class="lead">{E(d["intro"]["body"])}</p><div class="grid3">'+''.join(f'<article class="card"><h3>{i+1:02d}</h3><p>{E(s)}</p></article>' for i,s in enumerate(steps))+'</div>'))
    facts=[('الرمز',m['programCode']),('المدة',f"{m['durationHours']} ساعة تدريبية صافية"),('المستوى',m['level']),('اللغة',m['trainingLanguage']),('التقديم',' / '.join(m['deliveryModes'])),('المنهجية',f"نحو {m['methodology']['practical']}% تطبيق و{m['methodology']['guided']}% شرح موجّه")]
    P.append(page(m,3,title('بطاقة البرنامج','المعلومات الأساسية والجمهور المستهدف','Professional profile')+'<div class="facts">'+''.join(f'<div class="fact"><small>{E(a)}</small><strong>{E(b)}</strong></div>' for a,b in facts)+'</div><div class="grid2"><section class="card"><h3>الفئات المستهدفة</h3>'+ul(d['audience'])+'</section><section class="card"><h3>متطلبات الالتحاق</h3>'+ul(d['prerequisites'])+'</section></div>','alt'))
    P.append(page(m,4,title('نواتج التعلم','عشر قدرات مترابطة قابلة للتطبيق','Learning outcomes')+'<ul class="out">'+''.join(f'<li><b>{i:02d}</b><span>{E(x)}</span></li>' for i,x in enumerate(d['outcomes'],1))+'</ul>'))
    P.append(page(m,5,title('منهجية التدريب','نحو 70% تطبيق ومحاكاة','توزيع إرشادي قابل للمراجعة')+f'''<div class="ratio"><div class="ring"><div><strong>70%</strong><span>تطبيق ومحاكاة</span></div></div><div><h3>تعلم مهني قائم على المخرجات</h3><p class="lead">الشرح والنقاش الموجّه يمثلان نحو 30%، بينما توجَّه معظم الساعات إلى التمرين والتحليل والمحاكاة والعمل الجماعي وبناء المخرجات.</p><div class="call">{E(m['methodology']['note'])}</div></div></div><div class="grid2" style="margin-top:9mm"><section class="card"><h3>الحالة الممتدة</h3><p><b>{E(d['caseStudy']['name'])}</b> - {E(d['caseStudy']['profile'])}</p></section><section class="card"><h3>كيف تُستخدم؟</h3><p>{E(d['caseStudy']['use'])}</p></section></div>''','alt'))
    P.append(page(m,6,title('هيكل البرنامج','ست مراحل بمجموع 72 ساعة','14 وحدة • Capstone ضمن الساعات')+''.join(f'<article class="phase"><span>{p["number"]:02d}</span><div><h3>{E(p["title"])}</h3><p>الوحدات {E(p["modules"])}</p></div><strong>{p["hours"]}س</strong></article>' for p in d['phases'])+'<div class="call"><b>المجموع:</b> 13 + 9 + 10 + 10 + 16 + 14 = 72 ساعة تدريبية صافية.</div>'))
    def mtable(ms):
        rows=''.join(f'<tr><td><div class="mod"><b>{x["number"]:02d}</b><span>{E(x["title"])}</span></div></td><td class="hrs"><strong>{x["hours"]}</strong><small>ساعات</small></td><td>{E(x["topics"])}</td><td>{E(x["application"])}</td></tr>' for x in ms)
        return '<table><thead><tr><th>الوحدة</th><th>المدة</th><th>المحاور الرئيسية</th><th>التطبيق / المخرج</th></tr></thead><tbody>'+rows+'</tbody></table>'
    P.append(page(m,7,title('الخطة التفصيلية','الوحدات 01–07','32 ساعة')+mtable(d['modules'][:7]),'alt'))
    P.append(page(m,8,title('الخطة التفصيلية','الوحدات 08–14','40 ساعة')+mtable(d['modules'][7:])))
    apps=[('تشخيص','Digital Maturity + AS-IS','تحديد الفجوات وخط الأساس قبل اقتراح أي منصة.'),('استراتيجية','OKRs + Roadmap','ترتيب المبادرات وربطها بالقيمة والاعتماديات.'),('جدوى','TCO + ROI + Build/Buy/SaaS','الدفاع عن قرار الاستثمار بثلاثة سيناريوهات.'),('عمليات','BPMN + BRD + Wireframe','تحويل مشكلات التشغيل إلى متطلبات قابلة للاختبار.'),('تنفيذ','WBS + RACI + Agile Backlog','ربط النطاق والموارد بالتسليم المرحلي.'),('ذكاء','Automation + AI + HITL','تصميم حالة استخدام مع حدود الاستقلالية والإشراف البشري.'),('حوكمة','IAM + Data + Risk','تحديد الضوابط والمسؤوليات قبل التوسع.'),('قياس','KPI + UAT + Adoption','اختبار القبول وقياس التبني والقيمة 30/90 يومًا.'),('عرض','Consulting Defense','عرض التوصية والدفاع عن الافتراضات والأدلة.')]
    P.append(page(m,9,title('التطبيق والمحاكاة','أمثلة لما يُنجز أثناء البرنامج','Work products')+'<div class="apps">'+''.join(f'<article class="app"><span>{E(a)}</span><h3>{E(b)}</h3><p>{E(c)}</p></article>' for a,b,c in apps)+'</div>','alt'))
    P.append(page(m,10,title('المشروع الاستشاري النهائي','14 ساعة لتجميع الرحلة في ملف واحد','Capstone')+'<p class="lead">محاكاة لمهمة استشارية تبدأ بالتكليف والنطاق وتنتهي بالعرض والدفاع عن القرارات أمام لجنة تقييم.</p><div class="flow">'+''.join(f'<article class="cap"><b>{x["hours"]}س</b><div><h3>{E(x["title"])}</h3><p>{E(x["output"])}</p></div></article>' for x in d['capstone'])+'</div><div class="call">المشروع لا يشترط بناء ERP إنتاجي كامل. يمكن استخدام نموذج أولي محدود عندما يخدم التحقق من القرار أو رحلة المستخدم أو UAT.</div>','alt'))
    P.append(page(m,11,title('مواد وتجربة التعلم','أدوات تساعد على التطبيق وبناء المخرجات','Participant learning materials')+f'<div class="grid2"><section class="card"><h3>مواد المشارك</h3>{ul(d["participantMaterials"])}</section><section class="card"><h3>كيف تُستخدم؟</h3>{ul(["لبناء التشخيص وخارطة الطريق وBusiness Case.","لصياغة المتطلبات وتحليل المخاطر والحوكمة.","لدعم المحاكاة والعمل الجماعي والمشروع الاستشاري النهائي.","لمراجعة التقدم وربط المخرجات بمؤشرات القيمة والتبني."])}</section></div>'))
    tech=ul(d['delivery']['technical'])
    P.append(page(m,12,title('طرق التقديم','حضوري، مباشر عن بُعد، أو مدمج','بحسب ترتيبات الدفعة')+f'''<div class="grid3"><article class="card"><h3>حضوري</h3><p>{E(d['delivery']['inPerson'])}</p></article><article class="card"><h3>مباشر عن بُعد</h3><p>{E(d['delivery']['remote'])}</p></article><article class="card"><h3>مدمج</h3><p>{E(d['delivery']['blended'])}</p></article></div><div class="grid2" style="margin-top:7mm"><section class="card"><h3>المتطلبات التقنية الأساسية</h3>{tech}</section><section class="card"><h3>سياسة الأدوات</h3><p>{E(d['delivery']['licensingNote'])}</p><div class="chips">{''.join(f'<span class="chip">{E(x)}</span>' for x in ['BPMN','Jira / MS Project','Power BI / Excel','n8n / Power Automate','LLM / AI Agents'])}</div></section></div>''','alt'))
    P.append(page(m,13,title('التقييم والإتمام','قياس الفهم وجودة التطبيق والقدرة المهنية','Assessment')+'<div class="assess">'+''.join(f'<article class="as"><span>{a["weight"]}%</span><div><h3>{E(a["title"])}</h3><p>{E(a["measures"])}</p></div></article>' for a in d['assessment'])+f'''</div><div class="card" style="margin-top:7mm"><h3>شروط الإتمام والشهادة</h3><p><b>الاجتياز:</b> {E(d['completion']['pass'])}</p><p><b>الحضور:</b> {E(d['completion']['attendance'])}</p><p><b>الشهادة:</b> {E(d['completion']['certificate'])}</p></div><div class="call">يبدأ البرنامج بتقييم تشخيصي لتحديد خط البداية، ثم يقيس التقدم عبر الاختبارات القصيرة والأعمال التطبيقية والمشروع الاستشاري والأداء المهني.</div>'''))
    P.append(page(m,14,title('الأثر المهني','ما الذي يستطيع المشارك إنجازه بعد التدريب؟','Capabilities')+f'<div class="grid2"><section class="card"><h3>قدرات تطبيقية</h3>{ul(d["professionalCapabilities"])}</section><section class="card"><h3>تخصيص التدريب للمؤسسات</h3>{ul(d["customization"])}</section></div><div class="call">عند تخصيص النسخة الكاملة، تُحفظ نواتج التعلم الأساسية وإجمالي 72 ساعة ومنطق التدرج من التشخيص إلى الحوكمة والقيمة.</div>','alt'))
    P.append(page(m,15,f'''<div style="margin-top:20mm"><span class="eye">ابدأ الاستفسار</span><h1>اطلب CT-DT360 لدفعتك أو فريقك</h1><p class="lead">برنامج مهني متقدم يمكن تقديمه حضوريًا أو مباشرًا عن بُعد أو بصيغة مدمجة، مع مواءمة الحالات والأدوات مع احتياجات المؤسسة.</p></div><div class="contact"><div><div class="contact-item"><small>الموقع</small><a href="{E(c['website']['url'])}">consutrain.com</a></div><div class="contact-item"><small>البريد الإلكتروني</small><a href="{E(c['email']['url'])}">{E(c['email']['label'])}</a></div><div class="contact-item"><small>الهاتف وواتساب</small><a href="{E(c['whatsapp']['url'])}"><bdi dir="ltr">{E(c['phone']['label'])}</bdi></a></div><div class="buttons"><a href="{E(m['quoteUrl'])}">طلب عرض تدريبي</a><a class="secondary" href="{E(m['courseUrl'])}">صفحة البرنامج</a><a class="secondary" href="{E(c['whatsapp']['url'])}">واتساب</a></div><div class="doc"><b>رمز البرنامج:</b> {E(m['programCode'])}<br><b>الدليل:</b> {E(m['guideVersion'])} • {E(m['guideDate'])}<br><b>المراجع التعليمية:</b> CT-DT360-EDU-001 v1.0 / CT-DT360-EDU-002 v1.0<br><br>هذا الدليل يقدم نظرة عملية على البرنامج ومحاوره وتجربة التعلم والمخرجات المهنية. © 2026 ConsuTrain. جميع الحقوق محفوظة.</div></div><div class="qrstack"><div class="qrcard"><img src="{qcourse}"><strong>فتح صفحة CT-DT360</strong></div><div class="qrcard"><img src="{qwa}"><strong>التواصل عبر واتساب</strong></div></div></div>''','dark'))
    return '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>'+E(m['guideTitle'])+'</title><style>'+css+'</style></head><body>'+''.join(P)+'</body></html>'

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--root',default='.')
    ap.add_argument('--force',action='store_true')
    ap.add_argument('--html-preview',default='')
    a=ap.parse_args()
    root=Path(a.root).resolve()
    dp=root/'assets/data/ct-dt360-course-guide.json'
    cp=root/'assets/data/platform-contact.json'
    out=root/'assets/downloads/ct-dt360/ct-dt360-program-guide-ar.pdf'
    mp=root/'assets/data/ct-dt360-course-guide-manifest.json'
    d=J(dp); c=J(cp)
    h=hashlib.sha256()
    for p in [dp,cp,Path(__file__).resolve(),root/'assets/images/consutrain-logo-horizontal.png',root/'assets/fonts/Cairo-Regular.ttf',root/'assets/fonts/Cairo-Bold.ttf']:
        h.update(str(p.relative_to(root) if p.is_relative_to(root) else p.name).encode())
        h.update(p.read_bytes() if p.exists() else b'')
    sh=h.hexdigest()
    old=J(mp) if mp.exists() else {}
    if not a.force and old.get('sourceHash')==sh and out.exists() and out.stat().st_size:
        print('CT-DT360 guide is already up to date.')
        return 0
    doc=build(d,c,root)
    if a.html_preview:
        pp=root/a.html_preview
        pp.parent.mkdir(parents=True,exist_ok=True)
        pp.write_text(doc,encoding='utf-8')
    out.parent.mkdir(parents=True,exist_ok=True)
    with sync_playwright() as p:
        kw={'headless':True}
        bp=os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH')
        if bp: kw['executable_path']=bp
        b=p.chromium.launch(**kw)
        pg=b.new_page(viewport={'width':1240,'height':1754})
        temp_html=root/'assets/course-guides/.ct-dt360-render.html'
        temp_html.write_text(doc,encoding='utf-8')
        pg.goto(temp_html.resolve().as_uri(),wait_until='load')
        pg.evaluate("document.fonts.ready")
        if not pg.evaluate("document.fonts.check('16px Cairo')"):
            raise RuntimeError('Cairo font did not load in the CT-DT360 PDF renderer.')
        pg.emulate_media(media='print')
        pg.pdf(path=str(out),format='A4',print_background=True,prefer_css_page_size=True,margin={'top':'0','right':'0','bottom':'0','left':'0'})
        b.close()
        temp_html.unlink(missing_ok=True)
    fh=hashlib.sha256(out.read_bytes()).hexdigest()
    manifest={
      'sourceHash':sh,
      'updatedAt':dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat(),
      'source':str(dp.relative_to(root)).replace('\\','/'),
      'contactSource':str(cp.relative_to(root)).replace('\\','/'),
      'pdf':{
        'url':str(out.relative_to(root)).replace('\\','/'),
        'version':d['meta']['guideVersion'],
        'documentDate':d['meta']['guideDate'],
        'fileHash':fh,
        'downloadName':'ConsuTrain_CT-DT360_Program_Guide_AR.pdf'
      }
    }
    mp.parent.mkdir(parents=True,exist_ok=True)
    mp.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('Generated',out.relative_to(root))
    print('SHA-256',fh)
    return 0

if __name__=='__main__':
    raise SystemExit(main())
