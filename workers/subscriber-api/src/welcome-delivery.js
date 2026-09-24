import {
  createUnsubscribeUrl,
} from "./unsubscribe-token.js";

import {
  buildWelcomeEmail,
} from "./welcome-email.js";

import {
  sendEmailWithResend,
} from "./resend-email.js";


const WELCOME_FROM =
  "ConsuTrain <updates@mail.consutrain.com>";

const WELCOME_REPLY_TO =
  "contact@consutrain.com";


export async function deliverWelcomeEmail({
  db,
  apiKey,
  signingSecret,
  subscriberId,
}) {
  validateRequiredString(
    apiKey,
    "Missing Resend API key"
  );

  validateRequiredString(
    signingSecret,
    "Missing unsubscribe signing secret"
  );

  validateRequiredString(
    subscriberId,
    "Missing subscriber id"
  );

  const subscriber =
    await getSubscriber(
      db,
      subscriberId
    );

  if (!subscriber) {
    throw new Error(
      "Subscriber not found"
    );
  }

  /*
   * لا نرسل Welcome Email لمشترك
   * أصبح ملغي الاشتراك أو غير صالح.
   */
  if (
    subscriber.subscriber_status !== "active" ||
    subscriber.consent_status !== "granted"
  ) {
    return {
      status: "subscriber_not_active",
    };
  }

  const outbox =
    await getWelcomeOutbox(
      db,
      subscriberId
    );

  if (!outbox) {
    throw new Error(
      "Welcome email outbox record not found"
    );
  }

  /*
   * إذا تم الإرسال مسبقًا فلا نعيده.
   */
  if (outbox.send_status === "sent") {
    return {
      status: "already_sent",
      messageId:
        outbox.provider_message_id || null,
    };
  }

  const unsubscribeUrl =
    await createUnsubscribeUrl(
      subscriber.subscriber_id,
      signingSecret
    );

  const email =
    buildWelcomeEmail({
      language: subscriber.language,
      unsubscribeUrl,
    });

  /*
   * ثابت لنفس Welcome Email.
   * إذا حدث Retry فـ Resend يتعامل
   * معه كطلب idempotent.
   */
  const idempotencyKey =
    `welcome:${subscriber.subscriber_id}:v1`;

  try {
    const result =
      await sendEmailWithResend({
        apiKey,

        from: WELCOME_FROM,

        to: outbox.recipient_email,

        subject: email.subject,

        html: email.html,

        text: email.text,

        replyTo: WELCOME_REPLY_TO,

        idempotencyKey,
      });

    const now =
      new Date().toISOString();

    await markOutboxSent({
      db,
      emailId: outbox.email_id,
      messageId: result.messageId,
      now,
    });

    return {
      status: "sent",
      messageId: result.messageId,
    };
  } catch (error) {
    const now =
      new Date().toISOString();

    try {
      await markOutboxFailed({
        db,
        emailId: outbox.email_id,
        error,
        now,
      });
    } catch (auditError) {
      console.error(
        "Unable to update failed welcome email outbox",
        auditError
      );
    }

    throw error;
  }
}


async function getSubscriber(
  db,
  subscriberId
) {
  return db
    .prepare(`
      SELECT
        subscriber_id,
        email,
        consent_status,
        subscriber_status,
        language
      FROM subscribers
      WHERE subscriber_id = ?1
      LIMIT 1
    `)
    .bind(subscriberId)
    .first();
}


async function getWelcomeOutbox(
  db,
  subscriberId
) {
  return db
    .prepare(`
      SELECT
        email_id,
        subscriber_id,
        recipient_email,
        language,
        provider,
        provider_message_id,
        send_status,
        attempt_count
      FROM subscriber_email_outbox
      WHERE subscriber_id = ?1
        AND email_type = 'welcome'
      LIMIT 1
    `)
    .bind(subscriberId)
    .first();
}


async function markOutboxSent({
  db,
  emailId,
  messageId,
  now,
}) {
  const result =
    await db
      .prepare(`
        UPDATE subscriber_email_outbox
        SET
          provider_message_id = ?1,
          send_status = 'sent',
          attempt_count =
            attempt_count + 1,
          last_error = NULL,
          sent_at = ?2,
          updated_at = ?2
        WHERE email_id = ?3
          AND send_status <> 'sent'
      `)
      .bind(
        messageId,
        now,
        emailId
      )
      .run();

  if (!result.success) {
    throw new Error(
      "Unable to mark welcome email as sent"
    );
  }
}


async function markOutboxFailed({
  db,
  emailId,
  error,
  now,
}) {
  const safeError =
    buildSafeErrorMessage(error);

  const result =
    await db
      .prepare(`
        UPDATE subscriber_email_outbox
        SET
          send_status = 'failed',
          attempt_count =
            attempt_count + 1,
          last_error = ?1,
          updated_at = ?2
        WHERE email_id = ?3
          AND send_status <> 'sent'
      `)
      .bind(
        safeError,
        now,
        emailId
      )
      .run();

  if (!result.success) {
    throw new Error(
      "Unable to mark welcome email as failed"
    );
  }
}


function buildSafeErrorMessage(error) {
  const parts = [];

  if (
    error &&
    typeof error.message === "string"
  ) {
    parts.push(error.message);
  }

  if (
    error &&
    Number.isInteger(error.status)
  ) {
    parts.push(
      `status=${error.status}`
    );
  }

  const value =
    parts.join(" | ") ||
    "Unknown email delivery error";

  return value.slice(0, 1000);
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