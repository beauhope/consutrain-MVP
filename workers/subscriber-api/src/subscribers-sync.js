import {
  readSheetRange,
  updateSheetValues,
  appendSheetValues,
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

export async function syncSubscribersBatch(
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

  if (
    !headersAreEqual(
      actualHeaders,
      EXPECTED_HEADERS
    )
  ) {
    throw new Error(
      "Subscribers sheet headers do not match expected schema"
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
        SUBSCRIBERS_SYNC_NAME
      )
      .first();

  if (!checkpoint) {
    throw new Error(
      "Subscribers sync checkpoint is missing"
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
        SUBSCRIBERS_SYNC_NAME
      )
      .run();

    return {
      mode,
      batch_count: 0,
      inserted: 0,
      updated: 0,
      skipped: 0,
      checkpoint_updated: true,
      last_success_at: now,
    };
  }

  const existingResult =
    await readSheetRange(
      env,
      "'Subscribers'!A2:Q"
    );

  const existingRows =
    Array.isArray(
      existingResult.values
    )
      ? existingResult.values
      : [];

  const existingById =
    new Map();

  for (
    let index = 0;
    index < existingRows.length;
    index += 1
  ) {
    const sheetRow =
      normalizeSheetRow(
        existingRows[index],
        EXPECTED_HEADERS.length
      );

    const subscriberId =
      sheetRow[0];

    if (!subscriberId) {
      continue;
    }

    if (
      existingById.has(
        subscriberId
      )
    ) {
      throw new Error(
        `Duplicate subscriber_id in Subscribers sheet: ${subscriberId}`
      );
    }

    existingById.set(
      subscriberId,
      {
        rowNumber:
          index + 2,
        values:
          sheetRow,
      }
    );
  }

  const syncedAt =
    new Date().toISOString();

  const rowsToAppend = [];

  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const subscriber of rows) {
    const values =
      subscriberToSheetRow(
        subscriber,
        syncedAt
      );

    const existing =
      existingById.get(
        subscriber.subscriber_id
      );

    if (!existing) {
      rowsToAppend.push(
        values
      );

      inserted += 1;
      continue;
    }

    if (
      subscriberRowsMatch(
        existing.values,
        values
      )
    ) {
      skipped += 1;
      continue;
    }

    await updateSheetValues(
      env,
      `'Subscribers'!A${existing.rowNumber}:Q${existing.rowNumber}`,
      [values]
    );

    updated += 1;
  }

  if (rowsToAppend.length > 0) {
    await appendSheetValues(
      env,
      "'Subscribers'!A:Q",
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
        lastRow.updated_at,
        lastRow.subscriber_id,
        syncedAt,
        SUBSCRIBERS_SYNC_NAME
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
      "Subscribers sync checkpoint update failed"
    );
  }

  return {
    mode,
    batch_count:
      rows.length,
    inserted,
    updated,
    skipped,

    checkpoint_updated:
      true,

    checkpoint: {
      cursor_timestamp:
        lastRow.updated_at,
      cursor_id:
        lastRow.subscriber_id,
      last_success_at:
        syncedAt,
    },
  };
}


function subscriberToSheetRow(
  subscriber,
  syncedAt
) {
  return [
    toSheetValue(
      subscriber.subscriber_id
    ),
    toSheetValue(
      subscriber.email
    ),
    toSheetValue(
      subscriber.language
    ),
    toSheetValue(
      subscriber.consent_status
    ),
    toSheetValue(
      subscriber.consent_version
    ),
    toSheetValue(
      subscriber.consent_timestamp
    ),
    toSheetValue(
      subscriber.subscriber_status
    ),
    toSheetValue(
      subscriber.email_send_status
    ),
    toSheetValue(
      subscriber.suppression_reason
    ),
    toSheetValue(
      subscriber.subscription_date
    ),
    toSheetValue(
      subscriber.unsubscribe_timestamp
    ),
    toSheetValue(
      subscriber.suppression_timestamp
    ),
    toSheetValue(
      subscriber.suppression_updated_at
    ),
    toSheetValue(
      subscriber.cta_location
    ),
    toSheetValue(
      subscriber.created_at
    ),
    toSheetValue(
      subscriber.updated_at
    ),
    syncedAt,
  ];
}


function subscriberRowsMatch(
  existing,
  incoming
) {
  /*
   * Compare D1-backed columns only.
   * Column Q (last_synced_at) is operational
   * metadata and does not determine equality.
   */
  for (
    let index = 0;
    index < 16;
    index += 1
  ) {
    if (
      toSheetValue(
        existing[index]
      ) !==
      toSheetValue(
        incoming[index]
      )
    ) {
      return false;
    }
  }

  return true;
}


function normalizeSheetRow(
  row,
  length
) {
  const normalized =
    Array.isArray(row)
      ? [...row]
      : [];

  while (
    normalized.length < length
  ) {
    normalized.push("");
  }

  return normalized.slice(
    0,
    length
  );
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