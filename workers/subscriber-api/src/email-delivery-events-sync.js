import {
  readSheetRange,
  appendSheetValues,
} from "./google-sheets.js";


const EMAIL_DELIVERY_EVENTS_SYNC_NAME =
  "email_delivery_events_to_sheets";

const EMAIL_DELIVERY_EVENTS_BATCH_SIZE =
  100;

const EXPECTED_HEADERS = [
  "webhook_event_id",
  "provider",
  "provider_event_type",
  "provider_message_id",
  "email_id",
  "subscriber_id",
  "recipient_email",
  "event_timestamp",
  "bounce_type",
  "bounce_subtype",
  "bounce_message",
  "payload_json",
  "received_at",
  "last_synced_at",
];


export async function dryRunEmailDeliveryEventsSync(
  env
) {
  const headerResult =
    await readSheetRange(
      env,
      "'Email_Delivery_Events'!A1:N1"
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
        EMAIL_DELIVERY_EVENTS_SYNC_NAME
      )
      .first();

  if (!checkpoint) {
    throw new Error(
      "Email delivery events sync checkpoint is missing"
    );
  }

  const totalResult =
    await env.SUBSCRIBERS_DB
      .prepare(`
        SELECT
          COUNT(*) AS total
        FROM subscriber_email_events
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
          FROM subscriber_email_events
          WHERE
            received_at > ?1
            OR (
              received_at = ?1
              AND webhook_event_id > ?2
            )
          ORDER BY
            received_at ASC,
            webhook_event_id ASC
          LIMIT ?3
        `)
        .bind(
          checkpoint.cursor_timestamp,
          checkpoint.cursor_id,
          EMAIL_DELIVERY_EVENTS_BATCH_SIZE
        )
        .all();
  } else {
    batchResult =
      await env.SUBSCRIBERS_DB
        .prepare(`
          SELECT
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
          FROM subscriber_email_events
          ORDER BY
            received_at ASC,
            webhook_event_id ASC
          LIMIT ?1
        `)
        .bind(
          EMAIL_DELIVERY_EVENTS_BATCH_SIZE
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
        EMAIL_DELIVERY_EVENTS_BATCH_SIZE,
      batch_count:
        rows.length,

      first_cursor:
        firstRow
          ? {
              received_at:
                firstRow.received_at,
              webhook_event_id:
                firstRow.webhook_event_id,
            }
          : null,

      last_cursor:
        lastRow
          ? {
              received_at:
                lastRow.received_at,
              webhook_event_id:
                lastRow.webhook_event_id,
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

export async function syncEmailDeliveryEventsBatch(
  env
) {
  const headerResult =
    await readSheetRange(
      env,
      "'Email_Delivery_Events'!A1:N1"
    );

  const actualHeaders =
    Array.isArray(
      headerResult.values?.[0]
    )
      ? headerResult.values[0]
      : [];

  if (
    !headersAreEqual(
      actualHeaders,
      EXPECTED_HEADERS
    )
  ) {
    throw new Error(
      "Email Delivery Events sheet headers do not match expected schema"
    );
  }

  const checkpoint =
    await env.SUBSCRIBERS_DB
      .prepare(`
        SELECT
          sync_name,
          cursor_timestamp,
          cursor_id,
          last_success_at
        FROM sync_checkpoints
        WHERE sync_name = ?1
        LIMIT 1
      `)
      .bind(
        EMAIL_DELIVERY_EVENTS_SYNC_NAME
      )
      .first();

  if (!checkpoint) {
    throw new Error(
      "Email delivery events sync checkpoint is missing"
    );
  }

  let batchResult;

  if (
    checkpoint.cursor_timestamp &&
    checkpoint.cursor_id
  ) {
    batchResult =
      await env.SUBSCRIBERS_DB
        .prepare(`
          SELECT
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
          FROM subscriber_email_events
          WHERE
            received_at > ?1
            OR (
              received_at = ?1
              AND webhook_event_id > ?2
            )
          ORDER BY
            received_at ASC,
            webhook_event_id ASC
          LIMIT ?3
        `)
        .bind(
          checkpoint.cursor_timestamp,
          checkpoint.cursor_id,
          EMAIL_DELIVERY_EVENTS_BATCH_SIZE
        )
        .all();
  } else {
    batchResult =
      await env.SUBSCRIBERS_DB
        .prepare(`
          SELECT
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
          FROM subscriber_email_events
          ORDER BY
            received_at ASC,
            webhook_event_id ASC
          LIMIT ?1
        `)
        .bind(
          EMAIL_DELIVERY_EVENTS_BATCH_SIZE
        )
        .all();
  }

  const rows =
    Array.isArray(
      batchResult?.results
    )
      ? batchResult.results
      : [];

  const mode =
    checkpoint.cursor_timestamp &&
    checkpoint.cursor_id
      ? "incremental"
      : "full";

  if (rows.length === 0) {
    const now =
      new Date().toISOString();

    await env.SUBSCRIBERS_DB
      .prepare(`
        UPDATE sync_checkpoints
        SET
          last_success_at = ?1,
          updated_at = ?1
        WHERE sync_name = ?2
      `)
      .bind(
        now,
        EMAIL_DELIVERY_EVENTS_SYNC_NAME
      )
      .run();

    return {
      mode,
      batch_count: 0,
      inserted: 0,
      skipped: 0,
      checkpoint_updated: true,
      last_success_at: now,
    };
  }

  const existingResult =
    await readSheetRange(
      env,
      "'Email_Delivery_Events'!A2:N"
    );

  const existingRows =
    Array.isArray(
      existingResult.values
    )
      ? existingResult.values
      : [];

  const existingEventIds =
    new Set();

  for (const sheetRow of existingRows) {
    const webhookEventId =
      Array.isArray(sheetRow)
        ? sheetRow[0]
        : "";

    if (!webhookEventId) {
      continue;
    }

    if (
      existingEventIds.has(
        webhookEventId
      )
    ) {
      throw new Error(
        `Duplicate webhook_event_id in Email_Delivery_Events sheet: ${webhookEventId}`
      );
    }

    existingEventIds.add(
      webhookEventId
    );
  }

  const syncedAt =
    new Date().toISOString();

  const rowsToAppend = [];

  let inserted = 0;
  let skipped = 0;

  for (const event of rows) {
    if (
      existingEventIds.has(
        event.webhook_event_id
      )
    ) {
      skipped += 1;
      continue;
    }

    rowsToAppend.push([
      toSheetValue(
        event.webhook_event_id
      ),
      toSheetValue(
        event.provider
      ),
      toSheetValue(
        event.provider_event_type
      ),
      toSheetValue(
        event.provider_message_id
      ),
      toSheetValue(
        event.email_id
      ),
      toSheetValue(
        event.subscriber_id
      ),
      toSheetValue(
        event.recipient_email
      ),
      toSheetValue(
        event.event_timestamp
      ),
      toSheetValue(
        event.bounce_type
      ),
      toSheetValue(
        event.bounce_subtype
      ),
      toSheetValue(
        event.bounce_message
      ),
      toSheetValue(
        event.payload_json
      ),
      toSheetValue(
        event.received_at
      ),
      syncedAt,
    ]);

    inserted += 1;
  }

  if (rowsToAppend.length > 0) {
    await appendSheetValues(
      env,
      "'Email_Delivery_Events'!A:N",
      rowsToAppend
    );
  }

  const lastRow =
    rows[
      rows.length - 1
    ];

  const checkpointResult =
    await env.SUBSCRIBERS_DB
      .prepare(`
        UPDATE sync_checkpoints
        SET
          cursor_timestamp = ?1,
          cursor_id = ?2,
          last_success_at = ?3,
          updated_at = ?3
        WHERE sync_name = ?4
      `)
      .bind(
        lastRow.received_at,
        lastRow.webhook_event_id,
        syncedAt,
        EMAIL_DELIVERY_EVENTS_SYNC_NAME
      )
      .run();

  if (
    !checkpointResult.success ||
    Number(
      checkpointResult.meta?.changes ||
      0
    ) !== 1
  ) {
    throw new Error(
      "Email delivery events sync checkpoint update failed"
    );
  }

  return {
    mode,
    batch_count:
      rows.length,
    inserted,
    skipped,

    checkpoint_updated:
      true,

    checkpoint: {
      cursor_timestamp:
        lastRow.received_at,
      cursor_id:
        lastRow.webhook_event_id,
      last_success_at:
        syncedAt,
    },
  };
}


function toSheetValue(
  value
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value);
}