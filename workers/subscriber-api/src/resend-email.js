const RESEND_EMAIL_ENDPOINT =
  "https://api.resend.com/emails";

export async function sendEmailWithResend({
  apiKey,
  from,
  to,
  subject,
  html,
  text,
  replyTo,
  idempotencyKey,
}) {
  validateRequiredString(
    apiKey,
    "Missing Resend API key"
  );

  validateRequiredString(
    from,
    "Missing email sender"
  );

  validateRequiredString(
    to,
    "Missing email recipient"
  );

  validateRequiredString(
    subject,
    "Missing email subject"
  );

  validateRequiredString(
    html,
    "Missing email HTML"
  );

  validateRequiredString(
    idempotencyKey,
    "Missing idempotency key"
  );

  if (idempotencyKey.length > 256) {
    throw new Error(
      "Idempotency key is too long"
    );
  }

  const payload = {
    from,
    to: [to],
    subject,
    html,
  };

  if (
    typeof text === "string" &&
    text.trim().length > 0
  ) {
    payload.text = text;
  }

  if (
    typeof replyTo === "string" &&
    replyTo.trim().length > 0
  ) {
    payload.reply_to = replyTo;
  }

  const response = await fetch(
    RESEND_EMAIL_ENDPOINT,
    {
      method: "POST",
      headers: {
        Authorization:
          `Bearer ${apiKey}`,
        "Content-Type":
          "application/json",
        "Idempotency-Key":
          idempotencyKey,
      },
      body: JSON.stringify(payload),
    }
  );

  let responseData = null;

  try {
    responseData =
      await response.json();
  } catch {
    responseData = null;
  }

  if (!response.ok) {
    const error =
      new Error(
        `Resend request failed with status ${response.status}`
      );

    error.status =
      response.status;

    error.providerResponse =
      responseData;

    throw error;
  }

  if (
    !responseData ||
    typeof responseData.id !== "string" ||
    responseData.id.length === 0
  ) {
    throw new Error(
      "Resend response did not include an email id"
    );
  }

  return {
    provider: "resend",
    messageId: responseData.id,
  };
}

function validateRequiredString(
  value,
  message
) {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    throw new Error(message);
  }
}