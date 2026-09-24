import {
  readSheetRange,
} from "./google-sheets.js";


const SUBSCRIBERS_SYNC_NAME =
  "subscribers_to_sheets";

const SUBSCRIBERS_BATCH_SIZE = 100;

const EXPECTED_HEADERS = [
  "subscriber_id",
  "email",
  "language",
  "consent_status",
  "consent_version",
  "consent_timestamp",
  "subscriber_status",
  "email_send_status",
  "suppression_reason",
  "subscription_date",
  "unsubscribe_timestamp",
  "suppression_timestamp",
  "suppression_updated_at",
  "cta_location",
  "created_at",
  "updated_at",
  "last_synced_at",
];


export async function dryRunSubscribersSync(
  env
) {
  const headerResult =
    await readSheetRange(
      env,
      "'Subscribers'!A1:Q1"
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
        SUBSCRIBERS_SYNC_NAME
      )
      .first();

  if (!checkpoint) {
    throw new Error(
      "Subscribers sync checkpoint is missing"
    );
  }

  const totalResult =
    await env.SUBSCRIBERS_DB
      .prepare(`
        SELECT
          COUNT(*) AS total
        FROM subscribers
      `)
      .first();

  const totalSubscribers =
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
            subscriber_id,
            email,
            language,
            consent_status,
            consent_version,
            consent_timestamp,
            subscriber_status,
            email_send_status,
            suppression_reason,
            subscription_date,
            unsubscribe_timestamp,
            suppression_timestamp,
            suppression_updated_at,
            cta_location,
            created_at,
            updated_at
          FROM subscribers
          WHERE
            updated_at > ?1
            OR (
              updated_at = ?1
              AND subscriber_id > ?2
            )
          ORDER BY
            updated_at ASC,
            subscriber_id ASC
          LIMIT ?3
        `)
        .bind(
          checkpoint.cursor_timestamp,
          checkpoint.cursor_id,
          SUBSCRIBERS_BATCH_SIZE
        )
        .all();
  } else {
    batchResult =
      await env.SUBSCRIBERS_DB
        .prepare(`
          SELECT
            subscriber_id,
            email,
            language,
            consent_status,
            consent_version,
            consent_timestamp,
            subscriber_status,
            email_send_status,
            suppression_reason,
            subscription_date,
            unsubscribe_timestamp,
            suppression_timestamp,
            suppression_updated_at,
            cta_location,
            created_at,
            updated_at
          FROM subscribers
          ORDER BY
            updated_at ASC,
            subscriber_id ASC
          LIMIT ?1
        `)
        .bind(
          SUBSCRIBERS_BATCH_SIZE
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

    subscribers: {
      total:
        totalSubscribers,
      batch_size:
        SUBSCRIBERS_BATCH_SIZE,
      batch_count:
        rows.length,

      first_cursor:
        firstRow
          ? {
              updated_at:
                firstRow.updated_at,
              subscriber_id:
                firstRow.subscriber_id,
            }
          : null,

      last_cursor:
        lastRow
          ? {
              updated_at:
                lastRow.updated_at,
              subscriber_id:
                lastRow.subscriber_id,
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