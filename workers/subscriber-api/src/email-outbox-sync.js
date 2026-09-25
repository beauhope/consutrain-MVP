import {
  readSheetRange,
} from "./google-sheets.js";


const EMAIL_OUTBOX_SYNC_NAME =
  "email_outbox_to_sheets";

const EMAIL_OUTBOX_BATCH_SIZE =
  100;

const EXPECTED_HEADERS = [
  "email_id",
  "subscriber_id",
  "recipient_email",
  "email_type",
  "language",
  "provider",
  "provider_message_id",
  "send_status",
  "delivery_status",
  "attempt_count",
  "last_error",
  "created_at",
  "sent_at",
  "delivery_updated_at",
  "updated_at",
  "last_synced_at",
];


export async function dryRunEmailOutboxSync(
  env
) {
  const headerResult =
    await readSheetRange(
      env,
      "'Email_Outbox'!A1:P1"
    );

  const actualHeaders =
    Array.isArray(
      headerResult.values?.[0]
    )
      ? headerResult.values[0]
      : [];

  const headersMatch =
    headersAreEqual(
      actualHeaders,
      EXPECTED_HEADERS
    );

  const checkpoint =
    await env.SUBSCRIBERS_DB
      .prepare(`
        SELECT
          sync_name,
          source_table,
          target_tab,
          cursor_timestamp,
          cursor_id,
          last_success_at
        FROM sync_checkpoints
        WHERE sync_name = ?1
        LIMIT 1
      `)
      .bind(
        EMAIL_OUTBOX_SYNC_NAME
      )
      .first();

  if (!checkpoint) {
    throw new Error(
      "Email outbox sync checkpoint is missing"
    );
  }

  const totalResult =
    await env.SUBSCRIBERS_DB
      .prepare(`
        SELECT
          COUNT(*) AS total
        FROM subscriber_email_outbox
      `)
      .first();

  const totalEmails =
    Number(
      totalResult?.total || 0
    );

  let batchResult;

  if (
    checkpoint.cursor_timestamp &&
    checkpoint.cursor_id
  ) {
    batchResult =
      await env.SUBSCRIBERS_DB
        .prepare(`
          SELECT
            email_id,
            subscriber_id,
            recipient_email,
            email_type,
            language,
            provider,
            provider_message_id,
            send_status,
            delivery_status,
            attempt_count,
            last_error,
            created_at,
            sent_at,
            delivery_updated_at,
            updated_at
          FROM subscriber_email_outbox
          WHERE
            updated_at > ?1
            OR (
              updated_at = ?1
              AND email_id > ?2
            )
          ORDER BY
            updated_at ASC,
            email_id ASC
          LIMIT ?3
        `)
        .bind(
          checkpoint.cursor_timestamp,
          checkpoint.cursor_id,
          EMAIL_OUTBOX_BATCH_SIZE
        )
        .all();
  } else {
    batchResult =
      await env.SUBSCRIBERS_DB
        .prepare(`
          SELECT
            email_id,
            subscriber_id,
            recipient_email,
            email_type,
            language,
            provider,
            provider_message_id,
            send_status,
            delivery_status,
            attempt_count,
            last_error,
            created_at,
            sent_at,
            delivery_updated_at,
            updated_at
          FROM subscriber_email_outbox
          ORDER BY
            updated_at ASC,
            email_id ASC
          LIMIT ?1
        `)
        .bind(
          EMAIL_OUTBOX_BATCH_SIZE
        )
        .all();
  }

  const rows =
    Array.isArray(
      batchResult?.results
    )
      ? batchResult.results
      : [];

  const firstRow =
    rows.length > 0
      ? rows[0]
      : null;

  const lastRow =
    rows.length > 0
      ? rows[
          rows.length - 1
        ]
      : null;

  return {
    mode:
      checkpoint.cursor_timestamp &&
      checkpoint.cursor_id
        ? "incremental"
        : "full",

    headers: {
      match:
        headersMatch,
      expected:
        EXPECTED_HEADERS,
      actual:
        actualHeaders,
    },

    checkpoint: {
      cursor_timestamp:
        checkpoint.cursor_timestamp,
      cursor_id:
        checkpoint.cursor_id,
      last_success_at:
        checkpoint.last_success_at,
    },

    emails: {
      total:
        totalEmails,
      batch_size:
        EMAIL_OUTBOX_BATCH_SIZE,
      batch_count:
        rows.length,

      first_cursor:
        firstRow
          ? {
              updated_at:
                firstRow.updated_at,
              email_id:
                firstRow.email_id,
            }
          : null,

      last_cursor:
        lastRow
          ? {
              updated_at:
                lastRow.updated_at,
              email_id:
                lastRow.email_id,
            }
          : null,
    },

    writes_performed: false,
    checkpoint_updated: false,
  };
}


function headersAreEqual(
  actual,
  expected
) {
  if (
    actual.length !==
    expected.length
  ) {
    return false;
  }

  return expected.every(
    (header, index) =>
      actual[index] === header
  );
}