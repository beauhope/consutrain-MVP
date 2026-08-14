# قواعد مشروع ConsuTrain

## قواعد النسخة الفرنسية للمحاكي

- مسارها `fr/tools/project-exam-lab/` وبادئة تخزينها `projectExamLab_fr_`، ولا يجوز خلط بياناتها أو كاشها مع النسخة العربية.
- اكتملت FR-2 إلى FR-7 للأسئلة Q001–Q500 ودراسات الحالة الخمس واعتمد النشر العام. عند تغيير بنك الأسئلة الفرنسي أو أي ملف في `APP_FILES` يجب رفع إصدار Cache الفرنسي، والتحقق من 500 `qid` والإجابات والترتيب والمطابقة قبل النشر.
- لا تربط `fr/tools.html` بالنسخة الفرنسية ولا تضفها إلى Sitemap قبل FR-7.
- التطبيق ملك ConsuTrain وموجه للجمهور العام؛ يمنع تخصيص نصوصه لشخص بعينه.

## French Project Management Terminology

- استخدم بصورة ثابتة: `partie prenante`, `chef de projet`, `équipe projet`, `sponsor`, `périmètre`, `échéancier`, `demande de changement`, `registre des risques`, `critères d’acceptation`, `livrables`, `gouvernance`, `durabilité` و`intelligence artificielle`.
- استخدم `approche prédictive`, `approche agile`, `approche hybride`, `leadership serviteur`, `autonomisation`, `gestion de la configuration`, `gestion de la valeur acquise`, `réserve pour aléas` و`réserve de gestion`.
- احتفظ بالمصطلحات المهنية الرسمية `Scrum`, `Kanban`, `Sprint`, `Product Owner`, `Product Backlog`, `Sprint Backlog` و`MVP` دون تعريب أو بدائل غير مستقرة.
- أضيفت في FR-3: `marge totale`, `chemin critique`, `accélération par ajout de ressources (crashing)`, `sécurité psychologique`, `autogestion`, `définition de fini`, `transfert de connaissances`, `communication inclusive`, `retours d’information`, `escalade appropriée` و`adaptation (tailoring)`.
- أضيفت في FR-4: `culture d’apprentissage`, `juste responsabilisation`, `coût de la non-qualité`, `indicateurs de résultats et d’adoption`, `utilisation responsable de l’intelligence artificielle`, `gestion des équipes virtuelles`, `boucles de revue`, `maîtrise intégrée des changements`, `valeur monétaire attendue (EMV)`, `feuille de route de versions`, `jalons d’interface`, `contrat à prix forfaitaire ferme`, `contrôle des versions`, `cybersécurité`, `continuité des activités`, `site de reprise`, `test de basculement`, `analyse de sensibilité`, `stock de sécurité` و`reconception des rôles`.
- أضيفت في FR-5: `intégration des plans et des dépendances`, `lissage des ressources`, `nivellement des ressources`, `voie d’escalade`, `responsabilisation collective`, `accords de travail`, `cadence de communication`, `traitement des difficultés de l’équipe`, `compression de l’échéancier`, `expérimentation à petite échelle`, `indicateurs de réalisation des bénéfices`, `taux de transactions reprises ou défectueuses`, `Net Promoter Score` و`seuil d’escalade`.
- أضيفت في FR-6: `corps enseignant`, `plateforme d’apprentissage`, `livraison axée sur la valeur`, `accompagnement pratique`, `connaissances tacites`, `réalisation des bénéfices`, `clôture et transition`, `analyse de l’environnement externe`, `veille technologique`, `preuve de concept`, `analyse de scénarios`, `étapes d’adoption du changement`, `prise de conscience` و`renforcement`.
- توحيد FR-7 النهائي: `cause profonde`, `goulot d’étranglement`, `Plateforme judiciaire électronique`, `Extension d’un aéroport régional`, `Programme de transformation numérique de l’enseignement` و`référentiel officiel` عند الإشارة إلى المفهوم نفسه.

آخر مراجعة: 2026-08-14

## قاعدة محاكي إدارة المشاريع

- يبقى `tools/project-exam-lab/` تطبيقًا ثابتًا مستقلًا، ولا تنقل ملفاته إلى الجذر ولا تخلط CSS أو JavaScript الخاص به مع ملفات الموقع العامة.
- لا تعدّل نصوص `data/questions.json` أو مفاتيح `localStorage` دون طلب صريح ومراجعة مخصصة. بعد أي تحديث للبنك يجب التحقق من العدد 500 والبنية والأنواع ثم اختبار التطبيق.
- عند تعديل ملف يدخل في العمل دون اتصال، حدّث إصدار `CACHE_NAME` وراجع `APP_FILES`. يجب أن يظل تسجيل Service Worker ونطاقه نسبيين ومحصورين في مجلد المحاكي.
- لا تنشر أدوات التحقق الداخلية أو ملفات المصدر أو الاختبار أو النسخ الاحتياطية داخل مجلد المحاكي العام.

هذه القواعد هي المرجع العملي لأي تعديل جديد. اقرأ أيضًا `PROJECT-STATUS.md` و`DECISIONS.md` و`ROADMAP.md` قبل العمل.

## 1. حدود التعديل وGit

- لا ينفذ Codex عمليات `commit` أو `push`. يقتصر دوره على التعديل والتحقق وعرض `git diff` و`git status` للمستخدم.
- تُحصر التغييرات في الملفات المطلوبة فقط، مع الحفاظ على أي تغييرات موجودة للمستخدم وعدم الكتابة فوقها.
- عند تعديل جزء محدود، لا تُرسل أو تستبدل حزمة المشروع كاملة؛ سلّم الملفات المتغيرة فقط.
- قبل العمل افحص `git status`. وإذا كانت هناك commits آلية حديثة على remote، راجع نتيجة GitHub Actions واسحب التحديثات قبل إنشاء تعديل قد يتعارض معها.
- لا تنشئ ملفًا مرجعيًا مكررًا بسبب اختلاف حالة الأحرف أو تسمية قريبة، ولا تغيّر أسماء الملفات دون ضرورة واضحة.

## 2. لغة المحتوى وتجربة الزائر

- حافظ على التكافؤ بين العربية والفرنسية متى كان المحتوى متاحًا باللغتين. لا تعرض أصلًا عربيًا على أنه نسخة فرنسية مترجمة.
- استخدم لغة نهائية موجهة للزائر. تُمنع عبارات المطور والحزمة والمرحلة المؤقتة مثل: "ضع الرابط هنا" أو "استبدل هذا الملف" أو "سنضيف لاحقًا" داخل الواجهة العامة.
- لا تُعرض ادعاءات غير مؤكدة، ولا توصف شهادة الإتمام الرقمية بأنها شهادة معتمدة أو ترخيص مهني.
- لا تُضف روابط شبكات اجتماعية غير مؤكدة. استخدم فقط القنوات المثبتة في بيانات المشروع.
- لا تُضمّن قسم مصادر داخل مقالات ConsuTrain العربية أو الفرنسية إلا بطلب صريح.
- حافظ على المصطلحات الفرنسية المتفق عليها في `FR-GLOSSARY.md` عند توسيع النسخة الفرنسية.

## 3. النماذج والتواصل والأمن

- استخدم النماذج الداخلية للموقع لطلبات الاستشارة والأسعار والملاحظات، ولا تعد إلى Tally.
- حافظ على المسارين معًا: رابط واتساب سريع للاتصال المباشر، ونموذج داخلي منظم لجمع الطلبات.
- لا تضع مفاتيح أو رموز وصول أو بيانات دخول أو عناوين Webhook تشغيلية أو معلومات شخصية حساسة في الوثائق أو الشيفرة العامة.
- لا تعتبر إخفاء رابط أو صفحة حماية كافيًا للأمن. أي إجراء إداري حساس يحتاج تحققًا وصلاحيات محددة على جهة الخادم أو طبقة الحماية المعتمدة.
- لا تفعّل إجراءات لوحة الشهادات مثل التعديل أو إعادة الإرسال أو فتح الملفات قبل اكتمال الحماية ومصدر البيانات والتخزين المستقر.

## 4. البنية المشتركة والمسارات

- استخدم الأجزاء المشتركة بدل نسخ الهيدر والفوتر: `partials/header.html` و`partials/footer.html` للعربية، و`partials/fr-header.html` و`partials/fr-footer.html` للفرنسية.
- تحقّق من `data-root` في كل صفحة تستخدم الأجزاء المشتركة؛ يجب أن يعكس عمق الصفحة من جذر الموقع.
- تحقّق من المسارات النسبية للصور وCSS وJavaScript والروابط والتنزيلات عند نقل صفحة أو إضافة صفحة متداخلة.
- استخدم سمات breadcrumb المعتمدة والعنوان الخاص بالصفحة عند تطبيق نظام الأجزاء المشتركة.
- لا تكرر محتوى مشتركًا يدويًا إذا كان مصدره جزءًا مشتركًا أو ملف بيانات.

## 5. Service Worker وPWA

- عند تعديل ملف موجود في قائمة precache أو إضافة أصل يجب أن يعمل دون اتصال، حدّث اسم كاش Service Worker في `sw.js` وراجع قائمة الملفات المخزنة.
- لا تضف إلى precache مسارًا غير موجود، وتحقق من أن التحديث لا يعيد نسخة قديمة للزائر.
- اختبر PWA والكاش والمسار غير المتصل بعد تغييرات الواجهة أو المسارات المؤثرة، وليس بمجرد نجاح الصفحة في تحميل مباشر.

## 6. المحتوى القابل للتوسع

- الخدمات والدورات والموارد الجديدة يجب أن تتبع بنية مجلدات وتسمية قابلة للتوسع، مع صفحة فهرس ومسارات واضحة بدل روابط خاصة متناثرة.
- افصل بيانات الفهرسة والمحتوى المتكرر عن العرض متى كانت البنية الحالية تستخدم ملفات بيانات.
- أضف المقالة إلى ملف البيانات المناسب للغتها، وأنشئ الصفحة في مسار اللغة الصحيح، ثم تحقق من ظهورها وروابطها.
- عند إضافة دورة أو خدمة، حدّث الفهرس والروابط المشتركة ذات الصلة فقط، ولا تنسخ هيكلًا قديمًا يحتوي نصوصًا مؤقتة أو مسارات غير مناسبة.

## 7. دليل المنصة وPDF

- بيانات الدليل الحي تُحدّث من `assets/data/platform-guide.json` و`assets/data/fr-platform-guide.json`، وبيانات الاتصال من `assets/data/platform-contact.json`. لا تكرر محتوى الدليل يدويًا داخل صفحتي العرض.
- يولد `scripts/generate_platform_guide_pdfs.py` ملفي PDF والـmanifest. تعامل مع ملفات PDF المولدة و`assets/data/platform-guide-pdf-manifest.json` كمخرجات أتمتة.
- لا تعدّل المخرجات المولدة محليًا بالتوازي مع GitHub Actions. راجع workflow، وانتظر اكتماله، ثم اسحب commit الآلي قبل بدء تعديل جديد متعلق بالمصادر نفسها.
- حافظ على أسماء PDF وروابطهما الثابتة ما لم يصدر قرار صريح بتغييرها.

## 8. جودة التنفيذ والتحقق

- لا تفترض اكتمال ميزة من وصف قديم؛ تحقق من الملفات الفعلية، وميّز بين وجود واجهة واكتمال الربط الخارجي.
- اختبر الصفحة المتأثرة على سطح المكتب والهاتف عند وجود تغيير واجهة، واختبر اللغتين عند وجود مقابل عربي وفرنسي.
- افحص الروابط والمسارات، وتعارضات Git، و`git diff`، و`git status` قبل التسليم.
- لا تعدّل ملفات مولدة أو ثنائية أو ملفات عمل آلي خارج نطاق المهمة.
- حدّث الوثيقة المرجعية المناسبة فقط: الحالة للواقع الحالي، القرارات للخيارات المعتمدة، والخارطة للأعمال المقبلة.

## أعمال مكتملة وقواعد مستبدلة

- استُبدل الاعتماد السابق على Tally بالنماذج الداخلية؛ أي إشارة قديمة إليه تاريخية وليست توجيهًا للتنفيذ.
- اكتمل الانتقال الأساسي إلى أجزاء مشتركة عربية وفرنسية؛ إنشاء صفحة جديدة بنسخ هيدر أو فوتر كامل لم يعد أسلوبًا معتمدًا.
- ملفات دليل المنصة وPDF لها الآن مصدر بيانات ومولد وworkflow محددان؛ التحديث اليدوي المتكرر لمحتوى النسخ المختلفة مستبدل بهذا المسار.
