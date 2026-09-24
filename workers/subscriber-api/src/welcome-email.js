const SITE_URL = "https://consutrain.com";

export function buildWelcomeEmail({
  language,
  unsubscribeUrl,
}) {
  if (!["ar", "fr"].includes(language)) {
    throw new Error(
      "Unsupported welcome email language"
    );
  }

  validateUnsubscribeUrl(unsubscribeUrl);

  return language === "ar"
    ? buildArabicEmail(unsubscribeUrl)
    : buildFrenchEmail(unsubscribeUrl);
}


/* =========================================================
   Arabic Welcome Email
   ========================================================= */

function buildArabicEmail(unsubscribeUrl) {
  const safeUnsubscribeUrl =
    escapeHtml(unsubscribeUrl);

  const subject =
    "مرحبًا بك في تحديثات ConsuTrain";

  const text = `
مرحبًا بك في ConsuTrain،

شكرًا لاشتراكك في تحديثات ConsuTrain.

سنشارك معك محتوى مهنيًا وموارد عملية حول الإدارة، والتخطيط، وإدارة المشاريع، ونظم الإدارة، والتميز المؤسسي، والتطوير المهني.

زيارة ConsuTrain:
${SITE_URL}

مع التحية،
فريق ConsuTrain
التدريب • الاستشارات • الموارد المهنية
consutrain.com

أنت تتلقى هذه الرسالة لأنك اشتركت في تحديثات ConsuTrain.

إذا لم تعد ترغب في تلقي هذه الرسائل، يمكنك إلغاء الاشتراك من خلال الرابط التالي:
${unsubscribeUrl}
`.trim();

  const html = `
<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  >
  <title>${escapeHtml(subject)}</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f5f7f8;
  font-family:Arial,Tahoma,sans-serif;
  color:#1f2937;
  direction:rtl;
  text-align:right;
">
  <div style="
    max-width:640px;
    margin:0 auto;
    padding:32px 16px;
  ">
    <div style="
      background:#ffffff;
      border:1px solid #e5e7eb;
      border-radius:12px;
      padding:32px;
      direction:rtl;
      text-align:right;
    ">

      <div style="
        font-size:26px;
        font-weight:700;
        color:#145da0;
        margin:0 0 24px;
      ">
        ConsuTrain
      </div>

      <h1 style="
        font-size:22px;
        line-height:1.6;
        margin:0 0 18px;
        color:#111827;
      ">
        مرحبًا بك في ConsuTrain
      </h1>

      <p style="
        font-size:16px;
        line-height:1.9;
        margin:0 0 16px;
      ">
        شكرًا لاشتراكك في تحديثات ConsuTrain.
      </p>

      <p style="
        font-size:16px;
        line-height:1.9;
        margin:0 0 24px;
      ">
        سنشارك معك محتوى مهنيًا وموارد عملية حول
        الإدارة، والتخطيط، وإدارة المشاريع، ونظم
        الإدارة، والتميز المؤسسي، والتطوير المهني.
      </p>

      <p style="margin:0 0 30px;">
        <a
          href="${SITE_URL}"
          style="
            display:inline-block;
            background:#145da0;
            color:#ffffff;
            text-decoration:none;
            padding:12px 22px;
            border-radius:8px;
            font-size:15px;
            font-weight:700;
          "
        >
          زيارة ConsuTrain
        </a>
      </p>

      <!-- Signature -->
      <div style="
        margin:0 0 28px;
        padding:18px 0 0;
        direction:rtl;
        text-align:right;
      ">
        <p style="
          margin:0 0 10px;
          font-size:15px;
          line-height:1.8;
          color:#374151;
        ">
          مع التحية،
        </p>

        <p style="
          margin:0 0 6px;
          font-size:15px;
          line-height:1.8;
          font-weight:700;
          color:#111827;
        ">
          فريق ConsuTrain
        </p>

        <p style="
          margin:0 0 8px;
          font-size:14px;
          line-height:1.8;
          color:#4b5563;
        ">
          التدريب • الاستشارات • الموارد المهنية
        </p>

        <p style="
          margin:0 0 4px;
          font-size:13px;
          line-height:1.7;
          color:#6b7280;
        ">
          الموقع الإلكتروني
        </p>

        <p
          dir="ltr"
          style="
            margin:0;
            font-size:14px;
            line-height:1.7;
            text-align:right;
          "
        >
          <a
            href="${SITE_URL}"
            style="
              color:#145da0;
              text-decoration:none;
              font-weight:600;
            "
          >
            consutrain.com
          </a>
        </p>
      </div>

      <hr style="
        border:0;
        border-top:1px solid #e5e7eb;
        margin:28px 0;
      ">

      <!-- Subscription notice -->
      <p style="
        font-size:13px;
        line-height:1.8;
        color:#6b7280;
        margin:0 0 8px;
      ">
        أنت تتلقى هذه الرسالة لأنك اشتركت في
        تحديثات ConsuTrain.
      </p>

      <p style="
        font-size:13px;
        line-height:1.8;
        margin:0;
      ">
        <a
          href="${safeUnsubscribeUrl}"
          style="
            color:#4b5563;
            text-decoration:underline;
          "
        >
          إلغاء الاشتراك
        </a>
      </p>

    </div>
  </div>
</body>
</html>
`.trim();

  return {
    subject,
    text,
    html,
  };
}


/* =========================================================
   French Welcome Email
   ========================================================= */

function buildFrenchEmail(unsubscribeUrl) {
  const safeUnsubscribeUrl =
    escapeHtml(unsubscribeUrl);

  const subject =
    "Bienvenue dans les actualités ConsuTrain";

  const text = `
Bienvenue chez ConsuTrain,

Merci de vous être inscrit aux actualités de ConsuTrain.

Nous partagerons avec vous des contenus professionnels et des ressources pratiques autour du management, de la planification, de la gestion de projet, des systèmes de management, de l’excellence organisationnelle et du développement professionnel.

Découvrir ConsuTrain :
${SITE_URL}

Bien cordialement,
L’équipe ConsuTrain
Formation • Conseil • Ressources professionnelles
consutrain.com

Vous recevez ce message parce que vous vous êtes inscrit aux actualités de ConsuTrain.

Si vous ne souhaitez plus recevoir ces messages, vous pouvez vous désabonner ici :
${unsubscribeUrl}
`.trim();

  const html = `
<!doctype html>
<html lang="fr" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  >
  <title>${escapeHtml(subject)}</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f5f7f8;
  font-family:Arial,Helvetica,sans-serif;
  color:#1f2937;
  direction:ltr;
  text-align:left;
">
  <div style="
    max-width:640px;
    margin:0 auto;
    padding:32px 16px;
  ">
    <div style="
      background:#ffffff;
      border:1px solid #e5e7eb;
      border-radius:12px;
      padding:32px;
    ">

      <div style="
        font-size:26px;
        font-weight:700;
        color:#145da0;
        margin:0 0 24px;
      ">
        ConsuTrain
      </div>

      <h1 style="
        font-size:22px;
        line-height:1.5;
        margin:0 0 18px;
        color:#111827;
      ">
        Bienvenue chez ConsuTrain
      </h1>

      <p style="
        font-size:16px;
        line-height:1.8;
        margin:0 0 16px;
      ">
        Merci de vous être inscrit aux actualités
        de ConsuTrain.
      </p>

      <p style="
        font-size:16px;
        line-height:1.8;
        margin:0 0 24px;
      ">
        Nous partagerons avec vous des contenus
        professionnels et des ressources pratiques
        autour du management, de la planification,
        de la gestion de projet, des systèmes de
        management, de l’excellence organisationnelle
        et du développement professionnel.
      </p>

      <p style="margin:0 0 30px;">
        <a
          href="${SITE_URL}"
          style="
            display:inline-block;
            background:#145da0;
            color:#ffffff;
            text-decoration:none;
            padding:12px 22px;
            border-radius:8px;
            font-size:15px;
            font-weight:700;
          "
        >
          Découvrir ConsuTrain
        </a>
      </p>

      <!-- Signature -->
      <div style="
        margin:0 0 28px;
        padding:18px 0 0;
      ">
        <p style="
          margin:0 0 10px;
          font-size:15px;
          line-height:1.8;
          color:#374151;
        ">
          Bien cordialement,
        </p>

        <p style="
          margin:0 0 6px;
          font-size:15px;
          line-height:1.8;
          font-weight:700;
          color:#111827;
        ">
          L’équipe ConsuTrain
        </p>

        <p style="
          margin:0 0 8px;
          font-size:14px;
          line-height:1.8;
          color:#4b5563;
        ">
          Formation • Conseil • Ressources professionnelles
        </p>

        <p style="
          margin:0;
          font-size:14px;
          line-height:1.7;
        ">
          <a
            href="${SITE_URL}"
            style="
              color:#145da0;
              text-decoration:none;
              font-weight:600;
            "
          >
            consutrain.com
          </a>
        </p>
      </div>

      <hr style="
        border:0;
        border-top:1px solid #e5e7eb;
        margin:28px 0;
      ">

      <!-- Subscription notice -->
      <p style="
        font-size:13px;
        line-height:1.7;
        color:#6b7280;
        margin:0 0 8px;
      ">
        Vous recevez ce message parce que vous
        vous êtes inscrit aux actualités de
        ConsuTrain.
      </p>

      <p style="
        font-size:13px;
        line-height:1.7;
        margin:0;
      ">
        <a
          href="${safeUnsubscribeUrl}"
          style="
            color:#4b5563;
            text-decoration:underline;
          "
        >
          Se désabonner
        </a>
      </p>

    </div>
  </div>
</body>
</html>
`.trim();

  return {
    subject,
    text,
    html,
  };
}


/* =========================================================
   Validation
   ========================================================= */

function validateUnsubscribeUrl(value) {
  if (
    typeof value !== "string" ||
    value.length === 0
  ) {
    throw new Error(
      "Missing unsubscribe URL"
    );
  }

  let url;

  try {
    url = new URL(value);
  } catch {
    throw new Error(
      "Invalid unsubscribe URL"
    );
  }

  if (
    url.protocol !== "https:" ||
    url.hostname !== "consutrain.com" ||
    url.pathname !== "/unsubscribe.html"
  ) {
    throw new Error(
      "Unexpected unsubscribe URL"
    );
  }

  if (!url.searchParams.get("token")) {
    throw new Error(
      "Missing unsubscribe token"
    );
  }
}


/* =========================================================
   HTML Safety
   ========================================================= */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}