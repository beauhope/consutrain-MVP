import {
  Resend,
} from "resend";


const SUPPORTED_EVENTS =
  new Set([
    "email.delivered",
    "email.bounced",
    "email.complained",
    "email.suppressed",
  ]);


export async function handleResendWebhook(
  request,
  env
) {
  if (request.method !== "POST") {
    return webhookResponse(
      {
        ok: false,
        status: "method_not_allowed",
      },
      405,
      {
        Allow: "POST",
      }
    );
  }

  if (
    typeof env.RESEND_WEBHOOK_SECRET !== "string" ||
    env.RESEND_WEBHOOK_SECRET.length === 0
  ) {
    console.error(
      "Missing RESEND_WEBHOOK_SECRET"
    );

    return webhookResponse(
      {
        ok: false,
        status: "webhook_not_configured",
      },
      503
    );
  }

  const webhookId =
    request.headers.get("svix-id") || "";

  const webhookTimestamp =
    request.headers.get("svix-timestamp") || "";

  const webhookSignature =
    request.headers.get("svix-signature") || "";

  if (
    !webhookId ||
    !webhookTimestamp ||
    !webhookSignature
  ) {
    return webhookResponse(
      {
        ok: false,
        status: "invalid_webhook_signature",
      },
      400
    );
  }

  /*
   * مهم:
   * Resend يتحقق من التوقيع باستخدام
   * النص الخام كما وصل تمامًا.
   */
  const rawPayload =
    await request.text();

  let event;

  try {
    /*
     * verify() لا يحتاج فعليًا API call.
     * في Production يوجد RESEND_API_KEY،
     * أما fallback فيسمح بالاختبار المحلي
     * دون إضافة مفتاح إرسال إلى .dev.vars.
     */
    const resend =
      new Resend(
        env.RESEND_API_KEY ||
        "re_webhook_verification_only"
      );

    event =
      resend.webhooks.verify({
        payload: rawPayload,

        headers: {
          id: webhookId,
          timestamp: webhookTimestamp,
          signature: webhookSignature,
        },

        webhookSecret:
          env.RESEND_WEBHOOK_SECRET,
      });
  } catch (error) {
    console.error(
      "Resend webhook signature verification failed",
      error
    );

    return webhookResponse(
      {
        ok: false,
        status: "invalid_webhook_signature",
      },
      400
    );
  }

  const eventType =
    typeof event?.type === "string"
      ? event.type
      : "";

  /*
   * إذا أضيف Event آخر في Resend مستقبلًا،
   * لا نسبب Retry غير ضروري.
   */
  if (!SUPPORTED_EVENTS.has(eventType)) {
    return webhookResponse(
      {
        ok: true,
        status: "ignored",
      },
      200
    );
  }
  const existingEvent =
  await env.SUBSCRIBERS_DB.prepare(`
    SELECT webhook_event_id
    FROM subscriber_email_events
    WHERE webhook_event_id = ?1
    LIMIT 1
  `)
    .bind(webhookId)
    .first();

if (existingEvent) {
  return webhookResponse(
    {
      ok: true,
      status: "duplicate",
    },
    200
  );
}
  const providerMessageId =
    typeof event?.data?.email_id === "string"
      ? event.data.email_id
      : "";

  if (!providerMessageId) {
    return webhookResponse(
      {
        ok: false,
        status: "invalid_webhook_payload",
      },
      400
    );
  }

  const recipientEmail =
    Array.isArray(event?.data?.to) &&
    typeof event.data.to[0] === "string"
      ? event.data.to[0]
          .trim()
          .toLowerCase()
      : null;

  const eventTimestamp =
  typeof event?.created_at === "string" &&
  event.created_at.length > 0
    ? event.created_at
    : new Date().toISOString();

const bounce =
  eventType === "email.bounced" &&
  event?.data?.bounce &&
  typeof event.data.bounce === "object"
    ? event.data.bounce
    : null;

const bounceType =
  typeof bounce?.type === "string"
    ? bounce.type
    : null;

const bounceSubtype =
  typeof bounce?.subType === "string"
    ? bounce.subType
    : null;

const bounceMessage =
  typeof bounce?.message === "string"
    ? bounce.message.slice(0, 2000)
    : null;

const suppressionReason =
  getSuppressionReason(
    eventType,
    bounceType
  );

const deliveryStatus =
  mapDeliveryStatus(eventType);

const receivedAt =
  new Date().toISOString();

  const insertEvent =
    env.SUBSCRIBERS_DB.prepare(`
      INSERT OR IGNORE INTO subscriber_email_events (
        webhook_event_id,
        provider,
        provider_event_type,
        provider_message_id,
        email_id,
        subscriber_id,
        recipient_email,
        event_timestamp,
        bounce_type,
        bounce_subtype,
        bounce_message,
        payload_json,
        received_at
      )
      VALUES (
        ?1,
        'resend',
        ?2,
        ?3,

        (
          SELECT email_id
          FROM subscriber_email_outbox
          WHERE provider = 'resend'
            AND provider_message_id = ?3
          LIMIT 1
        ),

        (
          SELECT subscriber_id
          FROM subscriber_email_outbox
          WHERE provider = 'resend'
            AND provider_message_id = ?3
          LIMIT 1
        ),

        ?4,
        ?5,
        ?6,
        ?7,
        ?8,
        ?9,
        ?10
      )
    `)
      .bind(
        webhookId,
        eventType,
        providerMessageId,
        recipientEmail,
        eventTimestamp,
        bounceType,
        bounceSubtype,
        bounceMessage,
        rawPayload,
        receivedAt
      );

      const updateOutbox =
  env.SUBSCRIBERS_DB.prepare(`
    UPDATE subscriber_email_outbox
    SET
      delivery_status = ?1,
      delivery_updated_at = ?2,
      updated_at = ?3
    WHERE provider = 'resend'
      AND provider_message_id = ?4
      AND (
        delivery_status = 'unknown'

        OR (
          delivery_status = 'delivered'
          AND ?1 IN ('bounced', 'complained', 'suppressed')
        )

        OR (
          delivery_status = ?1
          AND (
            delivery_updated_at IS NULL
            OR delivery_updated_at <= ?2
          )
        )
      )
  `)
      .bind(
        deliveryStatus,
        eventTimestamp,
        receivedAt,
        providerMessageId
      );
      const updateSubscriberSuppression =
  suppressionReason
    ? env.SUBSCRIBERS_DB.prepare(`
        UPDATE subscribers
        SET
          email_send_status = 'suppressed',
          suppression_reason = ?1,
          suppression_timestamp = ?2,
          suppression_updated_at = ?3,
          updated_at = ?3
        WHERE subscriber_id = (
          SELECT subscriber_id
          FROM subscriber_email_outbox
          WHERE provider = 'resend'
            AND provider_message_id = ?4
          LIMIT 1
        )
          AND email_send_status = 'eligible'
      `)
        .bind(
          suppressionReason,
          eventTimestamp,
          receivedAt,
          providerMessageId
        )
    : null;

const databaseStatements = [
  insertEvent,
  updateOutbox,
];

if (updateSubscriberSuppression) {
  databaseStatements.push(
    updateSubscriberSuppression
  );
}
  try {
    await env.SUBSCRIBERS_DB.batch(
  databaseStatements
);
  } catch (error) {
    console.error(
      "Unable to persist Resend webhook event",
      error
    );

    return webhookResponse(
      {
        ok: false,
        status: "storage_unavailable",
      },
      503
    );
  }

  return webhookResponse(
    {
      ok: true,
      status: "processed",
    },
    200
  );
}


function mapDeliveryStatus(
  eventType
) {
  if (eventType === "email.delivered") {
    return "delivered";
  }

  if (eventType === "email.bounced") {
    return "bounced";
  }

  if (eventType === "email.complained") {
    return "complained";
  }

  if (eventType === "email.suppressed") {
    return "suppressed";
  }

  return "unknown";
}
function getSuppressionReason(
  eventType,
  bounceType
) {
  if (eventType === "email.complained") {
    return "complaint";
  }

  if (eventType === "email.suppressed") {
    return "resend_suppressed";
  }

  if (
    eventType === "email.bounced" &&
    typeof bounceType === "string" &&
    bounceType.toLowerCase() === "permanent"
  ) {
    return "hard_bounce";
  }

  return null;
}
function webhookResponse(
  body,
  status,
  extraHeaders = {}
) {
  return new Response(
    JSON.stringify(body),
    {
      status,

      headers: {
        "Content-Type":
          "application/json; charset=utf-8",

        "Cache-Control":
          "no-store",

        ...extraHeaders,
      },
    }
  );
}