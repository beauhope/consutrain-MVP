import {
  deliverWelcomeEmail,
} from "./welcome-delivery.js";

import {
  dryRunSyncLog,
  runSyncWithLog,
} from "./sync-log.js";

import {
  runAllGoogleSheetsSyncs,
} from "./sync-all.js";

import {
  handleResendWebhook,
} from "./resend-webhook.js";

import {
  readSpreadsheetMetadata,
} from "./google-sheets.js";

import {
  dryRunEmailDeliveryEventsSync,
  syncEmailDeliveryEventsBatch,
} from "./email-delivery-events-sync.js";

import {
  dryRunSubscribersSync,
  syncSubscribersBatch,
} from "./subscribers-sync.js";

import {
  dryRunEmailOutboxSync,
  syncEmailOutboxBatch,
} from "./email-outbox-sync.js";

import {
  dryRunSubscriptionEventsSync,
  syncSubscriptionEventsBatch,
} from "./subscription-events-sync.js";

const CONFIG = {
  allowedOrigin: "https://consutrain.com",
  subscribePath: "/v1/subscribers",
  unsubscribePath: "/v1/unsubscribe",
  resubscribePath: "/v1/resubscribe",
  resendWebhookPath: "/v1/webhooks/resend",
  consentVersion: "email_updates_v1",
  googleSheetsTestPath: "/v1/internal/google-sheets-test",
  subscribersSyncDryRunPath: "/v1/internal/subscribers-sync-dry-run",
  subscribersSyncRunPath: "/v1/internal/subscribers-sync-run",
  subscriptionEventsSyncDryRunPath: "/v1/internal/subscription-events-sync-dry-run",
  emailDeliveryEventsSyncRunPath: "/v1/internal/email-delivery-events-sync-run",
  subscriptionEventsSyncRunPath: "/v1/internal/subscription-events-sync-run",
  emailOutboxSyncDryRunPath: "/v1/internal/email-outbox-sync-dry-run",
  emailOutboxSyncRunPath: "/v1/internal/email-outbox-sync-run",
  emailDeliveryEventsSyncDryRunPath: "/v1/internal/email-delivery-events-sync-dry-run",
  syncLogDryRunPath: "/v1/internal/sync-log-dry-run",
  syncAllRunPath:   "/v1/internal/sync-all-run",
  ctaLocation: "global_subscribe",
  allowedLanguages: new Set(["ar", "fr"]),
  maxBodyBytes: 4096,
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
       if (
  url.pathname !== CONFIG.subscribePath &&
  url.pathname !== CONFIG.unsubscribePath &&
  url.pathname !== CONFIG.resubscribePath &&
  url.pathname !== CONFIG.resendWebhookPath &&
  url.pathname !== CONFIG.googleSheetsTestPath &&
  url.pathname !== CONFIG.subscribersSyncDryRunPath &&
  url.pathname !== CONFIG.subscribersSyncRunPath  &&
  url.pathname !== CONFIG.subscriptionEventsSyncDryRunPath &&
  url.pathname !== CONFIG.subscriptionEventsSyncRunPath &&
  url.pathname !== CONFIG.emailOutboxSyncDryRunPath &&
  url.pathname !== CONFIG.emailOutboxSyncRunPath &&
  url.pathname !== CONFIG.emailDeliveryEventsSyncDryRunPath  &&
  url.pathname !== CONFIG.emailDeliveryEventsSyncRunPath  &&
  url.pathname !== CONFIG.syncLogDryRunPath &&
  url.pathname !== CONFIG.syncAllRunPath
) {
  return jsonResponse(
    {
      ok: false,
      status: "not_found",
    },
    404,
    origin
  );
}

if (
  url.pathname ===
  CONFIG.syncLogDryRunPath
) {
  return handleSyncLogDryRun(
    request,
    env
  );
}

if (
  url.pathname ===
  CONFIG.syncAllRunPath
) {
  return handleSyncAllRun(
    request,
    env
  );
}

if (
  url.pathname ===
  CONFIG.emailDeliveryEventsSyncDryRunPath
) {
  return handleEmailDeliveryEventsSyncDryRun(
    request,
    env
  );
}

if (
  url.pathname ===
  CONFIG.emailDeliveryEventsSyncRunPath
) {
  return handleEmailDeliveryEventsSyncRun(
    request,
    env
  );
}

if (
  url.pathname ===
  CONFIG.subscriptionEventsSyncDryRunPath
) {
  return handleSubscriptionEventsSyncDryRun(
    request,
    env
  );
}

if (
  url.pathname ===
  CONFIG.subscriptionEventsSyncRunPath
) {
  return handleSubscriptionEventsSyncRun(
    request,
    env
  );
}

    if (
  url.pathname === CONFIG.googleSheetsTestPath
) {
  return handleGoogleSheetsTest(
    request,
    env
  );
}
if (
  url.pathname ===
  CONFIG.subscribersSyncDryRunPath
) {
  return handleSubscribersSyncDryRun(
    request,
    env
  );
}

  if (
  url.pathname ===
  CONFIG.subscribersSyncRunPath
) {
  return handleSubscribersSyncRun(
    request,
    env
  );
}
    if (
      url.pathname === CONFIG.resendWebhookPath
    ) {
      return handleResendWebhook(
        request,
        env
      );
    }

      if (request.method === "OPTIONS") {
      if (origin !== CONFIG.allowedOrigin) {
        return new Response(null, {
          status: 403,
        });
      }

      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin),
      });
    }

    if (
  url.pathname ===
  CONFIG.emailOutboxSyncDryRunPath
) {
  return handleEmailOutboxSyncDryRun(
    request,
    env
  );
}

if (
  url.pathname ===
  CONFIG.emailOutboxSyncRunPath
) {
  return handleEmailOutboxSyncRun(
    request,
    env
  );
}

    if (url.pathname === CONFIG.subscribePath) {
      return handleSubscribe(
        request,
        env,
        origin,
        ctx
      );
    }

    if (
      url.pathname === CONFIG.resubscribePath
    ) {
      return handleResubscribe(
        request,
        env,
        origin
      );
    }

        return handleUnsubscribe(
      request,
      env,
      origin
    );
  },

  async scheduled(
    controller,
    env,
    ctx
  ) {
    const result =
      await runAllGoogleSheetsSyncs(
        env
      );

    console.log(
      "Scheduled Google Sheets sync completed",
      {
        cron:
          controller.cron,

        sync_run_id:
          result.sync_run_id,

        succeeded:
          result.succeeded,

        failed:
          result.failed,
      }
    );

    if (result.failed > 0) {
      throw new Error(
        `Scheduled Google Sheets sync completed with ${result.failed} failed job(s)`
      );
    }
  },
};


/* =========================================================
   Subscribe
   ========================================================= */

async function handleSubscribe(
  request,
  env,
  origin,
  ctx
) {
  if (origin !== CONFIG.allowedOrigin) {
    return jsonResponse(
      {
        ok: false,
        status: "origin_forbidden",
      },
      403,
      null
    );
  }

  if (request.method !== "POST") {
    return jsonResponse(
      {
        ok: false,
        status: "method_not_allowed",
      },
      405,
      origin,
      {
        Allow: "POST, OPTIONS",
      }
    );
  }

  const rateLimited =
    await checkIpRateLimit(
      request,
      env,
      origin
    );

  if (rateLimited) {
    return rateLimited;
  }

  const parsed =
    await parseJsonBody(
      request,
      origin
    );

  if (parsed.response) {
    return parsed.response;
  }

  const body = parsed.body;

  const email =
    typeof body.email === "string"
      ? body.email
          .trim()
          .toLowerCase()
      : "";

  if (!isValidEmail(email)) {
    return validationFailure(
      origin,
      "invalid_email"
    );
  }

  if (body.consent !== true) {
    return validationFailure(
      origin,
      "consent_required"
    );
  }

  if (
    body.consentVersion !==
    CONFIG.consentVersion
  ) {
    return validationFailure(
      origin,
      "invalid_consent_version"
    );
  }

  if (
    !CONFIG.allowedLanguages.has(
      body.language
    )
  ) {
    return validationFailure(
      origin,
      "invalid_language"
    );
  }

  if (
    body.ctaLocation !==
    CONFIG.ctaLocation
  ) {
    return validationFailure(
      origin,
      "invalid_cta_location"
    );
  }

  const emailLimit =
    await env.SUBSCRIBE_EMAIL_LIMITER.limit({
      key: `subscriber-email:${email}`,
    });

  if (!emailLimit.success) {
    return jsonResponse(
      {
        ok: false,
        status: "rate_limited",
      },
      429,
      origin
    );
  }

  const now =
    new Date().toISOString();

  try {
    const existing =
      await getSubscriberByEmail(
        env.SUBSCRIBERS_DB,
        email
      );

    if (existing) {
      return await handleExistingSubscriber({
        db: env.SUBSCRIBERS_DB,
        existing,
        body,
        now,
        origin,
      });
    }

    const subscriberId =
      crypto.randomUUID();

    const eventId =
      crypto.randomUUID();

    const emailId =
      crypto.randomUUID();

    const insertSubscriber =
      env.SUBSCRIBERS_DB.prepare(`
        INSERT INTO subscribers (
          subscriber_id,
          email,
          consent_status,
          consent_version,
          consent_timestamp,
          language,
          cta_location,
          subscriber_status,
          subscription_date,
          unsubscribe_timestamp,
          created_at,
          updated_at
        )
        VALUES (
          ?1, ?2, ?3, ?4, ?5, ?6,
          ?7, ?8, ?9, ?10, ?11, ?12
        )
      `).bind(
        subscriberId,
        email,
        "granted",
        body.consentVersion,
        now,
        body.language,
        body.ctaLocation,
        "active",
        now,
        null,
        now,
        now
      );

    const insertEvent =
      env.SUBSCRIBERS_DB.prepare(`
        INSERT INTO subscriber_events (
          event_id,
          subscriber_id,
          event_type,
          consent_version,
          language,
          cta_location,
          event_timestamp,
          details_json
        )
        VALUES (
          ?1, ?2, ?3, ?4,
          ?5, ?6, ?7, ?8
        )
      `).bind(
        eventId,
        subscriberId,
        "subscribed",
        body.consentVersion,
        body.language,
        body.ctaLocation,
        now,
        JSON.stringify({
          source:
            "public_subscriber_endpoint",
        })
      );

    const insertWelcomeOutbox =
      env.SUBSCRIBERS_DB.prepare(`
        INSERT INTO subscriber_email_outbox (
          email_id,
          subscriber_id,
          email_type,
          language,
          recipient_email,
          provider,
          provider_message_id,
          send_status,
          attempt_count,
          last_error,
          created_at,
          sent_at,
          updated_at
        )
        VALUES (
          ?1,
          ?2,
          'welcome',
          ?3,
          ?4,
          'resend',
          NULL,
          'pending',
          0,
          NULL,
          ?5,
          NULL,
          ?5
        )
      `).bind(
        emailId,
        subscriberId,
        body.language,
        email,
        now
      );

    const results =
      await env.SUBSCRIBERS_DB.batch([
        insertSubscriber,
        insertEvent,
        insertWelcomeOutbox,
      ]);

    if (
      !results.every(
        (result) =>
          result.success === true
      )
    ) {
      throw new Error(
        "D1 batch did not complete successfully"
      );
    }

    if (
      ctx &&
      env.RESEND_API_KEY &&
      env.UNSUBSCRIBE_SIGNING_SECRET
    ) {
      ctx.waitUntil(
        deliverWelcomeEmail({
          db: env.SUBSCRIBERS_DB,
          apiKey:
            env.RESEND_API_KEY,
          signingSecret:
            env.UNSUBSCRIBE_SIGNING_SECRET,
          subscriberId,
        }).catch((error) => {
          console.error(
            "Welcome email delivery failed",
            error
          );
        })
      );
    } else {
      console.error(
        "Welcome email delivery skipped: missing required configuration"
      );
    }

    return jsonResponse(
      {
        ok: true,
        status: "subscribed",
      },
      201,
      origin
    );
  } catch (error) {
    if (
      String(error).includes(
        "UNIQUE constraint failed"
      )
    ) {
      try {
        const concurrent =
          await getSubscriberByEmail(
            env.SUBSCRIBERS_DB,
            email
          );

        if (concurrent) {
          return await handleExistingSubscriber({
            db:
              env.SUBSCRIBERS_DB,
            existing:
              concurrent,
            body,
            now,
            origin,
          });
        }
      } catch (lookupError) {
        console.error(
          "Concurrent duplicate lookup failed",
          lookupError
        );
      }
    }

    console.error(
      "Subscriber storage error",
      error
    );

    return jsonResponse(
      {
        ok: false,
        status: "storage_failed",
      },
      503,
      origin
    );
  }
}


/* =========================================================
   Explicit Re-subscribe / Re-consent
   ========================================================= */

async function handleResubscribe(
  request,
  env,
  origin
) {
  if (origin !== CONFIG.allowedOrigin) {
    return jsonResponse(
      {
        ok: false,
        status: "origin_forbidden",
      },
      403,
      null
    );
  }

  if (request.method !== "POST") {
    return jsonResponse(
      {
        ok: false,
        status: "method_not_allowed",
      },
      405,
      origin,
      {
        Allow: "POST, OPTIONS",
      }
    );
  }

  const rateLimited =
    await checkIpRateLimit(
      request,
      env,
      origin
    );

  if (rateLimited) {
    return rateLimited;
  }

  const parsed =
    await parseJsonBody(
      request,
      origin
    );

  if (parsed.response) {
    return parsed.response;
  }

  const body = parsed.body;

  const email =
    typeof body.email === "string"
      ? body.email
          .trim()
          .toLowerCase()
      : "";

  if (!isValidEmail(email)) {
    return validationFailure(
      origin,
      "invalid_email"
    );
  }

  if (body.consent !== true) {
    return validationFailure(
      origin,
      "consent_required"
    );
  }

  if (
    body.confirmResubscribe !== true
  ) {
    return validationFailure(
      origin,
      "resubscribe_confirmation_required"
    );
  }

  if (
    body.consentVersion !==
    CONFIG.consentVersion
  ) {
    return validationFailure(
      origin,
      "invalid_consent_version"
    );
  }

  if (
    !CONFIG.allowedLanguages.has(
      body.language
    )
  ) {
    return validationFailure(
      origin,
      "invalid_language"
    );
  }

  if (
    body.ctaLocation !==
    CONFIG.ctaLocation
  ) {
    return validationFailure(
      origin,
      "invalid_cta_location"
    );
  }

  const emailLimit =
    await env.SUBSCRIBE_EMAIL_LIMITER.limit({
      key: `resubscribe-email:${email}`,
    });

  if (!emailLimit.success) {
    return jsonResponse(
      {
        ok: false,
        status: "rate_limited",
      },
      429,
      origin
    );
  }

  const now =
    new Date().toISOString();

  try {
    const existing =
      await getSubscriberByEmail(
        env.SUBSCRIBERS_DB,
        email
      );

    if (!existing) {
      return jsonResponse(
        {
          ok: false,
          status:
            "subscriber_not_found",
        },
        404,
        origin
      );
    }

    if (
      existing.subscriber_status ===
      "active"
    ) {
      return jsonResponse(
        {
          ok: true,
          status:
            "already_subscribed",
        },
        200,
        origin
      );
    }

    if (
      existing.subscriber_status !==
      "unsubscribed"
    ) {
      return jsonResponse(
        {
          ok: false,
          status:
            "validation_failed",
          reason:
            "subscriber_marked_invalid",
        },
        409,
        origin
      );
    }

    const eventId =
      crypto.randomUUID();

    const insertResubscribedEvent =
      env.SUBSCRIBERS_DB.prepare(`
        INSERT INTO subscriber_events (
          event_id,
          subscriber_id,
          event_type,
          consent_version,
          language,
          cta_location,
          event_timestamp,
          details_json
        )
        SELECT
          ?1,
          ?2,
          'resubscribed',
          ?3,
          ?4,
          ?5,
          ?6,
          ?7
        WHERE EXISTS (
          SELECT 1
          FROM subscribers
          WHERE subscriber_id = ?2
            AND subscriber_status =
              'unsubscribed'
        )
      `).bind(
        eventId,
        existing.subscriber_id,
        body.consentVersion,
        body.language,
        body.ctaLocation,
        now,
        JSON.stringify({
          source:
            "public_resubscribe_endpoint",
          previousConsentStatus:
            existing.consent_status,
        })
      );

    const updateSubscriber =
      env.SUBSCRIBERS_DB.prepare(`
        UPDATE subscribers
        SET
          consent_status =
            'granted',
          consent_version = ?1,
          consent_timestamp = ?2,
          language = ?3,
          cta_location = ?4,
          subscriber_status =
            'active',
          unsubscribe_timestamp =
            NULL,
          updated_at = ?2
        WHERE subscriber_id = ?5
          AND subscriber_status =
            'unsubscribed'
      `).bind(
        body.consentVersion,
        now,
        body.language,
        body.ctaLocation,
        existing.subscriber_id
      );

    const results =
      await env.SUBSCRIBERS_DB.batch([
        insertResubscribedEvent,
        updateSubscriber,
      ]);

    if (
      !results.every(
        (result) =>
          result.success === true
      )
    ) {
      throw new Error(
        "D1 resubscribe batch did not complete successfully"
      );
    }

    const updatedRows =
      Number(
        results[1]?.meta?.changes ||
          0
      );

    if (updatedRows === 0) {
      const current =
        await getSubscriberByEmail(
          env.SUBSCRIBERS_DB,
          email
        );

      if (
        current?.subscriber_status ===
        "active"
      ) {
        return jsonResponse(
          {
            ok: true,
            status:
              "already_subscribed",
          },
          200,
          origin
        );
      }

      throw new Error(
        "Subscriber was not updated during resubscribe"
      );
    }

    return jsonResponse(
      {
        ok: true,
        status: "resubscribed",
      },
      200,
      origin
    );
  } catch (error) {
    console.error(
      "Resubscribe storage error",
      error
    );

    return jsonResponse(
      {
        ok: false,
        status: "storage_failed",
      },
      503,
      origin
    );
  }
}


/* =========================================================
   Unsubscribe
   ========================================================= */

async function handleUnsubscribe(
  request,
  env,
  origin
) {
  /*
   * Browser requests are accepted only from
   * consutrain.com.
   *
   * Requests without Origin are allowed because
   * future email/backend integrations may POST
   * directly using a valid signed token.
   */
  if (
    origin &&
    origin !== CONFIG.allowedOrigin
  ) {
    return jsonResponse(
      {
        ok: false,
        status: "origin_forbidden",
      },
      403,
      null
    );
  }

  if (request.method !== "POST") {
    return jsonResponse(
      {
        ok: false,
        status: "method_not_allowed",
      },
      405,
      origin,
      {
        Allow: "POST, OPTIONS",
      }
    );
  }

  const rateLimited =
    await checkIpRateLimit(
      request,
      env,
      origin
    );

  if (rateLimited) {
    return rateLimited;
  }

  if (
    !env.UNSUBSCRIBE_SIGNING_SECRET
  ) {
    console.error(
      "UNSUBSCRIBE_SIGNING_SECRET is missing"
    );

    return jsonResponse(
      {
        ok: false,
        status:
          "configuration_error",
      },
      503,
      origin
    );
  }

  const parsed =
    await parseJsonBody(
      request,
      origin
    );

  if (parsed.response) {
    return parsed.response;
  }

  const token =
    typeof parsed.body.token ===
    "string"
      ? parsed.body.token.trim()
      : "";

  const subscriberId =
    await verifyUnsubscribeToken(
      token,
      env.UNSUBSCRIBE_SIGNING_SECRET
    );

  if (!subscriberId) {
    return validationFailure(
      origin,
      "invalid_unsubscribe_token"
    );
  }

  try {
    const subscriber =
      await getSubscriberById(
        env.SUBSCRIBERS_DB,
        subscriberId
      );

    if (!subscriber) {
      return validationFailure(
        origin,
        "invalid_unsubscribe_token"
      );
    }

    if (
      subscriber.subscriber_status ===
      "unsubscribed"
    ) {
      return jsonResponse(
        {
          ok: true,
          status:
            "already_unsubscribed",
        },
        200,
        origin
      );
    }

    if (
      subscriber.subscriber_status !==
      "active"
    ) {
      return jsonResponse(
        {
          ok: false,
          status:
            "validation_failed",
          reason:
            "subscriber_not_active",
        },
        409,
        origin
      );
    }

    const now =
      new Date().toISOString();

    const eventId =
      crypto.randomUUID();

    /*
     * Insert the audit event only while
     * the subscriber is still active.
     *
     * Both statements run in one D1 batch.
     */
    const insertEventIfActive =
      env.SUBSCRIBERS_DB.prepare(`
        INSERT INTO subscriber_events (
          event_id,
          subscriber_id,
          event_type,
          consent_version,
          language,
          cta_location,
          event_timestamp,
          details_json
        )
        SELECT
          ?1,
          ?2,
          'unsubscribed',
          ?3,
          ?4,
          ?5,
          ?6,
          ?7
        WHERE EXISTS (
          SELECT 1
          FROM subscribers
          WHERE subscriber_id = ?2
            AND subscriber_status =
              'active'
        )
      `).bind(
        eventId,
        subscriber.subscriber_id,
        subscriber.consent_version,
        subscriber.language,
        subscriber.cta_location,
        now,
        JSON.stringify({
          source:
            "public_unsubscribe_endpoint",
        })
      );

    const updateSubscriberIfActive =
      env.SUBSCRIBERS_DB.prepare(`
        UPDATE subscribers
        SET
          subscriber_status =
            'unsubscribed',
          consent_status =
            'withdrawn',
          unsubscribe_timestamp =
            ?1,
          updated_at = ?1
        WHERE subscriber_id = ?2
          AND subscriber_status =
            'active'
      `).bind(
        now,
        subscriber.subscriber_id
      );

    const results =
      await env.SUBSCRIBERS_DB.batch([
        insertEventIfActive,
        updateSubscriberIfActive,
      ]);

    if (
      !results.every(
        (result) =>
          result.success === true
      )
    ) {
      throw new Error(
        "D1 unsubscribe batch did not complete successfully"
      );
    }

    const updatedRows =
      Number(
        results[1]?.meta?.changes ||
          0
      );

    if (updatedRows === 0) {
      const current =
        await getSubscriberById(
          env.SUBSCRIBERS_DB,
          subscriber.subscriber_id
        );

      if (
        current?.subscriber_status ===
        "unsubscribed"
      ) {
        return jsonResponse(
          {
            ok: true,
            status:
              "already_unsubscribed",
          },
          200,
          origin
        );
      }

      throw new Error(
        "Subscriber was not updated during unsubscribe"
      );
    }

    return jsonResponse(
      {
        ok: true,
        status: "unsubscribed",
      },
      200,
      origin
    );
  } catch (error) {
    console.error(
      "Unsubscribe storage error",
      error
    );

    return jsonResponse(
      {
        ok: false,
        status: "storage_failed",
      },
      503,
      origin
    );
  }
}

/* =========================================================
   Google Sheets Protected Connection Test
   ========================================================= */

async function handleGoogleSheetsTest(
  request,
  env
) {
  if (request.method !== "GET") {
    return jsonResponse(
      {
        ok: false,
        status: "method_not_allowed",
      },
      405,
      null,
      {
        Allow: "GET",
      }
    );
  }

  if (
    !env.GOOGLE_SHEETS_TEST_TOKEN
  ) {
    console.error(
      "GOOGLE_SHEETS_TEST_TOKEN is missing"
    );

    return jsonResponse(
      {
        ok: false,
        status: "configuration_error",
      },
      503,
      null
    );
  }

  const authorization =
    request.headers.get(
      "Authorization"
    ) || "";

  const expectedAuthorization =
    `Bearer ${env.GOOGLE_SHEETS_TEST_TOKEN}`;

  if (
    authorization !==
    expectedAuthorization
  ) {
    return jsonResponse(
      {
        ok: false,
        status: "unauthorized",
      },
      401,
      null
    );
  }

  try {
    const metadata =
      await readSpreadsheetMetadata(
        env
      );

    return jsonResponse(
      {
        ok: true,
        status:
          "google_sheets_connected",
        spreadsheet: {
          title:
            metadata.title,
          sheets:
            metadata.sheets,
        },
      },
      200,
      null
    );
  } catch (error) {
    console.error(
      "Google Sheets connection test failed",
      error
    );

    return jsonResponse(
      {
        ok: false,
        status:
          "google_sheets_connection_failed",
      },
      502,
      null
    );
  }
}

/* =========================================================
   Subscribers Sync Dry Run
   ========================================================= */
   async function handleSubscribersSyncDryRun(
  request,
  env
) {
  if (request.method !== "GET") {
    return jsonResponse(
      {
        ok: false,
        status: "method_not_allowed",
      },
      405,
      null,
      {
        Allow: "GET",
      }
    );
  }

  if (
    !env.GOOGLE_SHEETS_TEST_TOKEN
  ) {
    return jsonResponse(
      {
        ok: false,
        status: "configuration_error",
      },
      503,
      null
    );
  }

  const authorization =
    request.headers.get(
      "Authorization"
    ) || "";

  if (
    authorization !==
    `Bearer ${env.GOOGLE_SHEETS_TEST_TOKEN}`
  ) {
    return jsonResponse(
      {
        ok: false,
        status: "unauthorized",
      },
      401,
      null
    );
  }

  try {
    const dryRun =
      await dryRunSubscribersSync(
        env
      );

    return jsonResponse(
      {
        ok: true,
        status:
          "subscribers_sync_dry_run",
        dry_run:
          dryRun,
      },
      200,
      null
    );
  } catch (error) {
    console.error(
      "Subscribers sync dry run failed",
      error
    );

    return jsonResponse(
      {
        ok: false,
        status:
          "subscribers_sync_dry_run_failed",
      },
      502,
      null
    );
  }
}
/* =========================================================
   Subscribers Sync Run
   ========================================================= */

async function handleSubscribersSyncRun(
  request,
  env
) {
  if (request.method !== "POST") {
    return jsonResponse(
      {
        ok: false,
        status: "method_not_allowed",
      },
      405,
      null,
      {
        Allow: "POST",
      }
    );
  }

  if (
    !env.GOOGLE_SHEETS_TEST_TOKEN
  ) {
    return jsonResponse(
      {
        ok: false,
        status: "configuration_error",
      },
      503,
      null
    );
  }

  const authorization =
    request.headers.get(
      "Authorization"
    ) || "";

  if (
    authorization !==
    `Bearer ${env.GOOGLE_SHEETS_TEST_TOKEN}`
  ) {
    return jsonResponse(
      {
        ok: false,
        status: "unauthorized",
      },
      401,
      null
    );
  }

  try {
  const result =
    await runSyncWithLog(
      env,
      {
        syncName:
          "subscriber_events_to_sheets",

        sourceTable:
          "subscriber_events",

        targetTab:
          "Subscription_Events",

        runSync: () =>
          syncSubscriptionEventsBatch(
            env
          ),
      }
    );

  return jsonResponse(
    {
      ok: true,
      status:
        "subscription_events_sync_completed",

      sync:
        result.sync,

      audit:
        result.audit,
    },
    200,
    null
  );
  } catch (error) {
    console.error(
      "Subscribers sync failed",
      error
    );

    return jsonResponse(
      {
        ok: false,
        status:
          "subscribers_sync_failed",
      },
      502,
      null
    );
  }
}

/* =========================================================
   Subscription Events Sync Dry Run
   ========================================================= */

async function handleSubscriptionEventsSyncDryRun(
  request,
  env
) {
  if (request.method !== "GET") {
    return jsonResponse(
      {
        ok: false,
        status: "method_not_allowed",
      },
      405,
      null,
      {
        Allow: "GET",
      }
    );
  }

  if (
    !env.GOOGLE_SHEETS_TEST_TOKEN
  ) {
    return jsonResponse(
      {
        ok: false,
        status: "configuration_error",
      },
      503,
      null
    );
  }

  const authorization =
    request.headers.get(
      "Authorization"
    ) || "";

  if (
    authorization !==
    `Bearer ${env.GOOGLE_SHEETS_TEST_TOKEN}`
  ) {
    return jsonResponse(
      {
        ok: false,
        status: "unauthorized",
      },
      401,
      null
    );
  }

  try {
    const dryRun =
      await dryRunSubscriptionEventsSync(
        env
      );

    return jsonResponse(
      {
        ok: true,
        status:
          "subscription_events_sync_dry_run",
        dry_run:
          dryRun,
      },
      200,
      null
    );
  } catch (error) {
    console.error(
      "Subscription events sync dry run failed",
      error
    );

    return jsonResponse(
      {
        ok: false,
        status:
          "subscription_events_sync_dry_run_failed",
      },
      502,
      null
    );
  }
}

/* =========================================================
   Subscription Events Sync Run
   ========================================================= */

async function handleSubscriptionEventsSyncRun(
  request,
  env
) {
  if (request.method !== "POST") {
    return jsonResponse(
      {
        ok: false,
        status: "method_not_allowed",
      },
      405,
      null,
      {
        Allow: "POST",
      }
    );
  }

  if (
    !env.GOOGLE_SHEETS_TEST_TOKEN
  ) {
    return jsonResponse(
      {
        ok: false,
        status: "configuration_error",
      },
      503,
      null
    );
  }

  const authorization =
    request.headers.get(
      "Authorization"
    ) || "";

  if (
    authorization !==
    `Bearer ${env.GOOGLE_SHEETS_TEST_TOKEN}`
  ) {
    return jsonResponse(
      {
        ok: false,
        status: "unauthorized",
      },
      401,
      null
    );
  }

  try {
    const result =
      await runSyncWithLog(
        env,
        {
          syncName:
            "subscriber_events_to_sheets",

          sourceTable:
            "subscriber_events",

          targetTab:
            "Subscription_Events",

          runSync: () =>
            syncSubscriptionEventsBatch(
              env
            ),
        }
      );

    return jsonResponse(
      {
        ok: true,
        status:
          "subscription_events_sync_completed",

        sync:
          result.sync,

        audit:
          result.audit,
      },
      200,
      null
    );
  } catch (error) {
    console.error(
      "Subscription events sync failed",
      error
    );

    return jsonResponse(
      {
        ok: false,
        status:
          "subscription_events_sync_failed",
      },
      502,
      null
    );
  }
}

/* =========================================================
   Email Outbox Sync Dry Run
   ========================================================= */

async function handleEmailOutboxSyncDryRun(
  request,
  env
) {
  if (request.method !== "GET") {
    return jsonResponse(
      {
        ok: false,
        status: "method_not_allowed",
      },
      405,
      null,
      {
        Allow: "GET",
      }
    );
  }

  if (
    !env.GOOGLE_SHEETS_TEST_TOKEN
  ) {
    return jsonResponse(
      {
        ok: false,
        status: "configuration_error",
      },
      503,
      null
    );
  }

  const authorization =
    request.headers.get(
      "Authorization"
    ) || "";

  if (
    authorization !==
    `Bearer ${env.GOOGLE_SHEETS_TEST_TOKEN}`
  ) {
    return jsonResponse(
      {
        ok: false,
        status: "unauthorized",
      },
      401,
      null
    );
  }

  try {
    const dryRun =
      await dryRunEmailOutboxSync(
        env
      );

    return jsonResponse(
      {
        ok: true,
        status:
          "email_outbox_sync_dry_run",
        dry_run:
          dryRun,
      },
      200,
      null
    );
  } catch (error) {
    console.error(
      "Email outbox sync dry run failed",
      error
    );

    return jsonResponse(
      {
        ok: false,
        status:
          "email_outbox_sync_dry_run_failed",
      },
      502,
      null
    );
  }
}

/* =========================================================
   Email Outbox Sync Run
   ========================================================= */
async function handleEmailOutboxSyncRun(
  request,
  env
) {
  if (request.method !== "POST") {
    return jsonResponse(
      {
        ok: false,
        status: "method_not_allowed",
      },
      405,
      null,
      {
        Allow: "POST",
      }
    );
  }

  if (
    !env.GOOGLE_SHEETS_TEST_TOKEN
  ) {
    return jsonResponse(
      {
        ok: false,
        status: "configuration_error",
      },
      503,
      null
    );
  }

  const authorization =
    request.headers.get(
      "Authorization"
    ) || "";

  if (
    authorization !==
    `Bearer ${env.GOOGLE_SHEETS_TEST_TOKEN}`
  ) {
    return jsonResponse(
      {
        ok: false,
        status: "unauthorized",
      },
      401,
      null
    );
  }

  try {
    const result =
      await runSyncWithLog(
        env,
        {
          syncName:
            "email_outbox_to_sheets",

          sourceTable:
            "subscriber_email_outbox",

          targetTab:
            "Email_Outbox",

          runSync: () =>
            syncEmailOutboxBatch(
              env
            ),
        }
      );

    return jsonResponse(
      {
        ok: true,
        status:
          "email_outbox_sync_completed",

        sync:
          result.sync,

        audit:
          result.audit,
      },
      200,
      null
    );
  } catch (error) {
    console.error(
      "Email outbox sync failed",
      error
    );

    return jsonResponse(
      {
        ok: false,
        status:
          "email_outbox_sync_failed",
      },
      502,
      null
    );
  }
}
/* =========================================================
   Email Delivery Events Sync Dry Run
   ========================================================= */

async function handleEmailDeliveryEventsSyncDryRun(
  request,
  env
) {
  if (request.method !== "GET") {
    return jsonResponse(
      {
        ok: false,
        status: "method_not_allowed",
      },
      405,
      null,
      {
        Allow: "GET",
      }
    );
  }

  if (
    !env.GOOGLE_SHEETS_TEST_TOKEN
  ) {
    return jsonResponse(
      {
        ok: false,
        status: "configuration_error",
      },
      503,
      null
    );
  }

  const authorization =
    request.headers.get(
      "Authorization"
    ) || "";

  if (
    authorization !==
    `Bearer ${env.GOOGLE_SHEETS_TEST_TOKEN}`
  ) {
    return jsonResponse(
      {
        ok: false,
        status: "unauthorized",
      },
      401,
      null
    );
  }

  try {
    const dryRun =
      await dryRunEmailDeliveryEventsSync(
        env
      );

    return jsonResponse(
      {
        ok: true,
        status:
          "email_delivery_events_sync_dry_run",
        dry_run:
          dryRun,
      },
      200,
      null
    );
  } catch (error) {
    console.error(
      "Email delivery events sync dry run failed",
      error
    );

    return jsonResponse(
      {
        ok: false,
        status:
          "email_delivery_events_sync_dry_run_failed",
      },
      502,
      null
    );
  }
}

/* =========================================================
   Email Delivery Events Sync Run
   ========================================================= */
   async function handleEmailDeliveryEventsSyncRun(
  request,
  env
) {
  if (request.method !== "POST") {
    return jsonResponse(
      {
        ok: false,
        status: "method_not_allowed",
      },
      405,
      null,
      {
        Allow: "POST",
      }
    );
  }

  if (
    !env.GOOGLE_SHEETS_TEST_TOKEN
  ) {
    return jsonResponse(
      {
        ok: false,
        status: "configuration_error",
      },
      503,
      null
    );
  }

  const authorization =
    request.headers.get(
      "Authorization"
    ) || "";

  if (
    authorization !==
    `Bearer ${env.GOOGLE_SHEETS_TEST_TOKEN}`
  ) {
    return jsonResponse(
      {
        ok: false,
        status: "unauthorized",
      },
      401,
      null
    );
  }

  try {
    const result =
      await runSyncWithLog(
        env,
        {
          syncName:
            "email_delivery_events_to_sheets",

          sourceTable:
            "subscriber_email_events",

          targetTab:
            "Email_Delivery_Events",

          runSync: () =>
            syncEmailDeliveryEventsBatch(
              env
            ),
        }
      );

    return jsonResponse(
      {
        ok: true,
        status:
          "email_delivery_events_sync_completed",

        sync:
          result.sync,

        audit:
          result.audit,
      },
      200,
      null
    );
  } catch (error) {
    console.error(
      "Email delivery events sync failed",
      error
    );

    return jsonResponse(
      {
        ok: false,
        status:
          "email_delivery_events_sync_failed",
      },
      502,
      null
    );
  }
}
/* =========================================================
   Sync Log Dry Run
   ========================================================= */

async function handleSyncLogDryRun(
  request,
  env
) {
  if (request.method !== "GET") {
    return jsonResponse(
      {
        ok: false,
        status: "method_not_allowed",
      },
      405,
      null,
      {
        Allow: "GET",
      }
    );
  }

  if (
    !env.GOOGLE_SHEETS_TEST_TOKEN
  ) {
    return jsonResponse(
      {
        ok: false,
        status: "configuration_error",
      },
      503,
      null
    );
  }

  const authorization =
    request.headers.get(
      "Authorization"
    ) || "";

  if (
    authorization !==
    `Bearer ${env.GOOGLE_SHEETS_TEST_TOKEN}`
  ) {
    return jsonResponse(
      {
        ok: false,
        status: "unauthorized",
      },
      401,
      null
    );
  }

  try {
    const dryRun =
      await dryRunSyncLog(
        env
      );

    return jsonResponse(
      {
        ok: true,
        status:
          "sync_log_dry_run",
        dry_run:
          dryRun,
      },
      200,
      null
    );
  } catch (error) {
    console.error(
      "Sync log dry run failed",
      error
    );

    return jsonResponse(
      {
        ok: false,
        status:
          "sync_log_dry_run_failed",
      },
      502,
      null
    );
  }
}

/* =========================================================
   Sync All Run
   ========================================================= */

async function handleSyncAllRun(
  request,
  env
) {
  if (request.method !== "POST") {
    return jsonResponse(
      {
        ok: false,
        status: "method_not_allowed",
      },
      405,
      null,
      {
        Allow: "POST",
      }
    );
  }

  if (
    !env.GOOGLE_SHEETS_TEST_TOKEN
  ) {
    return jsonResponse(
      {
        ok: false,
        status: "configuration_error",
      },
      503,
      null
    );
  }

  const authorization =
    request.headers.get(
      "Authorization"
    ) || "";

  if (
    authorization !==
    `Bearer ${env.GOOGLE_SHEETS_TEST_TOKEN}`
  ) {
    return jsonResponse(
      {
        ok: false,
        status: "unauthorized",
      },
      401,
      null
    );
  }

  try {
    const result =
      await runAllGoogleSheetsSyncs(
        env
      );

    const allSucceeded =
      result.failed === 0;

    return jsonResponse(
      {
        ok:
          allSucceeded,

        status:
          allSucceeded
            ? "sync_all_completed"
            : "sync_all_completed_with_errors",

        sync_all:
          result,
      },
      allSucceeded
        ? 200
        : 207,
      null
    );
  } catch (error) {
    console.error(
      "Sync all failed",
      error
    );

    return jsonResponse(
      {
        ok: false,
        status:
          "sync_all_failed",
      },
      502,
      null
    );
  }
}

/* =========================================================
   Rate Limiting
   ========================================================= */

async function checkIpRateLimit(
  request,
  env,
  origin
) {
  const ip =
    request.headers.get(
      "CF-Connecting-IP"
    ) || "unknown";

  const result =
    await env.SUBSCRIBE_IP_LIMITER.limit({
      key: `subscriber-ip:${ip}`,
    });

  if (result.success) {
    return null;
  }

  return jsonResponse(
    {
      ok: false,
      status: "rate_limited",
    },
    429,
    origin
  );
}


/* =========================================================
   Request Parsing
   ========================================================= */

async function parseJsonBody(
  request,
  origin
) {
  const contentType =
    request.headers.get(
      "Content-Type"
    ) || "";

  if (
    !contentType
      .toLowerCase()
      .startsWith(
        "application/json"
      )
  ) {
    return {
      response: jsonResponse(
        {
          ok: false,
          status:
            "unsupported_media_type",
        },
        415,
        origin
      ),
    };
  }

  const declaredLength =
    Number(
      request.headers.get(
        "Content-Length"
      ) || "0"
    );

  if (
    Number.isFinite(
      declaredLength
    ) &&
    declaredLength >
      CONFIG.maxBodyBytes
  ) {
    return {
      response: jsonResponse(
        {
          ok: false,
          status:
            "payload_too_large",
        },
        413,
        origin
      ),
    };
  }

  let rawBody;

  try {
    rawBody =
      await request.text();
  } catch {
    return {
      response:
        validationFailure(
          origin,
          "invalid_request_body"
        ),
    };
  }

  const actualSize =
    new TextEncoder()
      .encode(rawBody)
      .length;

  if (
    actualSize >
    CONFIG.maxBodyBytes
  ) {
    return {
      response: jsonResponse(
        {
          ok: false,
          status:
            "payload_too_large",
        },
        413,
        origin
      ),
    };
  }

  let body;

  try {
    body =
      JSON.parse(rawBody);
  } catch {
    return {
      response:
        validationFailure(
          origin,
          "invalid_json"
        ),
    };
  }

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    return {
      response:
        validationFailure(
          origin,
          "invalid_payload"
        ),
    };
  }

  return {
    body,
  };
}


/* =========================================================
   Subscriber Lookup
   ========================================================= */

async function getSubscriberByEmail(
  db,
  email
) {
  return db
    .prepare(`
      SELECT
        subscriber_id,
        email,
        subscriber_status,
        consent_status,
        consent_version,
        consent_timestamp,
        language,
        cta_location
      FROM subscribers
      WHERE email = ?1
      LIMIT 1
    `)
    .bind(email)
    .first();
}

async function getSubscriberById(
  db,
  subscriberId
) {
  return db
    .prepare(`
      SELECT
        subscriber_id,
        email,
        subscriber_status,
        consent_status,
        consent_version,
        consent_timestamp,
        language,
        cta_location
      FROM subscribers
      WHERE subscriber_id = ?1
      LIMIT 1
    `)
    .bind(subscriberId)
    .first();
}


/* =========================================================
   Existing Subscriber Handling
   ========================================================= */

async function handleExistingSubscriber({
  db,
  existing,
  body,
  now,
  origin,
}) {
  if (
    existing.subscriber_status ===
    "active"
  ) {
    return jsonResponse(
      {
        ok: true,
        status:
          "already_subscribed",
      },
      200,
      origin
    );
  }

  if (
    existing.subscriber_status ===
    "unsubscribed"
  ) {
    const eventResult =
      await db
        .prepare(`
          INSERT INTO subscriber_events (
            event_id,
            subscriber_id,
            event_type,
            consent_version,
            language,
            cta_location,
            event_timestamp,
            details_json
          )
          VALUES (
            ?1, ?2, ?3, ?4,
            ?5, ?6, ?7, ?8
          )
        `)
        .bind(
          crypto.randomUUID(),
          existing.subscriber_id,
          "resubscribe_requested",
          body.consentVersion,
          body.language,
          body.ctaLocation,
          now,
          JSON.stringify({
            outcome:
              "explicit_reconsent_required",
          })
        )
        .run();

    if (!eventResult.success) {
      throw new Error(
        "Unable to store resubscribe audit event"
      );
    }

    return jsonResponse(
      {
        ok: false,
        status:
          "resubscribe_required",
      },
      409,
      origin
    );
  }

  return jsonResponse(
    {
      ok: false,
      status:
        "validation_failed",
      reason:
        "subscriber_marked_invalid",
    },
    409,
    origin
  );
}


/* =========================================================
   Unsubscribe Token Verification
   ========================================================= */

async function verifyUnsubscribeToken(
  token,
  secret
) {
  if (
    typeof token !== "string" ||
    token.length < 20 ||
    token.length > 1024
  ) {
    return null;
  }

  const parts =
    token.split(".");

  if (
    parts.length !== 3 ||
    parts[0] !== "v1"
  ) {
    return null;
  }

  let subscriberId;
  let signature;

  try {
    subscriberId =
      base64UrlDecodeToString(
        parts[1]
      );

    signature =
      base64UrlDecodeToBytes(
        parts[2]
      );
  } catch {
    return null;
  }

  if (
    !isUuid(subscriberId) ||
    signature.length !== 32
  ) {
    return null;
  }

  const key =
    await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(
        secret
      ),
      {
        name: "HMAC",
        hash: "SHA-256",
      },
      false,
      ["verify"]
    );

  const payload =
    `unsubscribe:v1:${subscriberId}`;

  const valid =
    await crypto.subtle.verify(
      "HMAC",
      key,
      signature,
      new TextEncoder().encode(
        payload
      )
    );

  return valid
    ? subscriberId
    : null;
}


/* =========================================================
   Base64URL
   ========================================================= */

function base64UrlDecodeToString(
  value
) {
  return new TextDecoder().decode(
    base64UrlDecodeToBytes(
      value
    )
  );
}

function base64UrlDecodeToBytes(
  value
) {
  const normalized =
    value
      .replace(/-/g, "+")
      .replace(/_/g, "/");

  const padded =
    normalized +
    "=".repeat(
      (
        4 -
        (normalized.length % 4)
      ) % 4
    );

  const binary =
    atob(padded);

  const bytes =
    new Uint8Array(
      binary.length
    );

  for (
    let i = 0;
    i < binary.length;
    i += 1
  ) {
    bytes[i] =
      binary.charCodeAt(i);
  }

  return bytes;
}


/* =========================================================
   Validation Helpers
   ========================================================= */

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function validationFailure(
  origin,
  reason
) {
  return jsonResponse(
    {
      ok: false,
      status:
        "validation_failed",
      reason,
    },
    400,
    origin
  );
}


/* =========================================================
   CORS / Responses
   ========================================================= */

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin":
      origin,
    "Access-Control-Allow-Methods":
      "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type",
    "Access-Control-Max-Age":
      "86400",
    Vary: "Origin",
  };
}

function jsonResponse(
  body,
  status,
  origin,
  extraHeaders = {}
) {
  const cors =
    origin ===
    CONFIG.allowedOrigin
      ? corsHeaders(origin)
      : {};

  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        "Content-Type":
          "application/json; charset=utf-8",
        "Cache-Control":
          "no-store",
        ...cors,
        ...extraHeaders,
      },
    }
  );
}


/* =========================================================
   Email Validation
   ========================================================= */

function isValidEmail(email) {
  if (
    typeof email !== "string" ||
    email.length < 3 ||
    email.length > 254
  ) {
    return false;
  }

  const firstAt =
    email.indexOf("@");

  const lastAt =
    email.lastIndexOf("@");

  if (
    firstAt <= 0 ||
    firstAt !== lastAt
  ) {
    return false;
  }

  const local =
    email.slice(
      0,
      firstAt
    );

  const domain =
    email.slice(
      firstAt + 1
    );

  if (
    local.length === 0 ||
    local.length > 64 ||
    domain.length === 0 ||
    domain.length > 253
  ) {
    return false;
  }

  if (
    local.startsWith(".") ||
    local.endsWith(".") ||
    local.includes("..")
  ) {
    return false;
  }

  if (
    !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(
      local
    )
  ) {
    return false;
  }

  const labels =
    domain.split(".");

  if (labels.length < 2) {
    return false;
  }

  for (
    const label of labels
  ) {
    if (
      label.length === 0 ||
      label.length > 63
    ) {
      return false;
    }

    if (
      !/^[a-z0-9-]+$/i.test(
        label
      )
    ) {
      return false;
    }

    if (
      label.startsWith("-") ||
      label.endsWith("-")
    ) {
      return false;
    }
  }

  return true;
}