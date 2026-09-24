import {
  readSheetRange,
} from "./google-sheets.js";


const SUBSCRIPTION_EVENTS_SYNC_NAME =
  "subscriber_events_to_sheets";

const SUBSCRIPTION_EVENTS_BATCH_SIZE =
  100;

const EXPECTED_HEADERS = [
  "event_id",
  "subscriber_id",
  "email",
  "event_type",
  "consent_version",
  "language",
  "cta_location",
  "event_timestamp",
  "details_json",
  "last_synced_at",
];


export async function dryRunSubscriptionEventsSync(
  env
) {
  const headerResult =
    await readSheetRange(
      env,
      "'Subscription_Events'!A1:J1"
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
        SUBSCRIPTION_EVENTS_SYNC_NAME
      )
      .first();

  if (!checkpoint) {
    throw new Error(
      "Subscription events sync checkpoint is missing"
    );
  }

  const totalResult =
    await env.SUBSCRIBERS_DB
      .prepare(`
        SELECT
          COUNT(*) AS total
        FROM subscriber_events
      `)
      .first();

  const totalEvents =
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
            e.event_id,
            e.subscriber_id,
            s.email,
            e.event_type,
            e.consent_version,
            e.language,
            e.cta_location,
            e.event_timestamp,
            e.details_json
          FROM subscriber_events e
          LEFT JOIN subscribers s
            ON s.subscriber_id =
               e.subscriber_id
          WHERE
            e.event_timestamp > ?1
            OR (
              e.event_timestamp = ?1
              AND e.event_id > ?2
            )
          ORDER BY
            e.event_timestamp ASC,
            e.event_id ASC
          LIMIT ?3
        `)
        .bind(
          checkpoint.cursor_timestamp,
          checkpoint.cursor_id,
          SUBSCRIPTION_EVENTS_BATCH_SIZE
        )
        .all();
  } else {
    batchResult =
      await env.SUBSCRIBERS_DB
        .prepare(`
          SELECT
            e.event_id,
            e.subscriber_id,
            s.email,
            e.event_type,
            e.consent_version,
            e.language,
            e.cta_location,
            e.event_timestamp,
            e.details_json
          FROM subscriber_events e
          LEFT JOIN subscribers s
            ON s.subscriber_id =
               e.subscriber_id
          ORDER BY
            e.event_timestamp ASC,
            e.event_id ASC
          LIMIT ?1
        `)
        .bind(
          SUBSCRIPTION_EVENTS_BATCH_SIZE
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

    events: {
      total:
        totalEvents,
      batch_size:
        SUBSCRIPTION_EVENTS_BATCH_SIZE,
      batch_count:
        rows.length,

      first_cursor:
        firstRow
          ? {
              event_timestamp:
                firstRow.event_timestamp,
              event_id:
                firstRow.event_id,
            }
          : null,

      last_cursor:
        lastRow
          ? {
              event_timestamp:
                lastRow.event_timestamp,
              event_id:
                lastRow.event_id,
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