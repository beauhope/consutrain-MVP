import {
  readSheetRange,
  updateSheetValues,
  appendSheetValues,
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

export async function syncEmailOutboxBatch(
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

  if (
    !headersAreEqual(
      actualHeaders,
      EXPECTED_HEADERS
    )
  ) {
    throw new Error(
      "Email_Outbox sheet headers do not match expected schema"
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
        EMAIL_OUTBOX_SYNC_NAME
      )
      .first();

  if (!checkpoint) {
    throw new Error(
      "Email outbox sync checkpoint is missing"
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
        EMAIL_OUTBOX_SYNC_NAME
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
      "'Email_Outbox'!A2:P"
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

    const emailId =
      sheetRow[0];

    if (!emailId) {
      continue;
    }

    if (
      existingById.has(
        emailId
      )
    ) {
      throw new Error(
        `Duplicate email_id in Email_Outbox sheet: ${emailId}`
      );
    }

    existingById.set(
      emailId,
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

  for (const email of rows) {
    const values =
      emailOutboxToSheetRow(
        email,
        syncedAt
      );

    const existing =
      existingById.get(
        email.email_id
      );

    if (!existing) {
      rowsToAppend.push(
        values
      );

      inserted += 1;
      continue;
    }

    if (
      emailOutboxRowsMatch(
        existing.values,
        values
      )
    ) {
      skipped += 1;
      continue;
    }

    await updateSheetValues(
      env,
      `'Email_Outbox'!A${existing.rowNumber}:P${existing.rowNumber}`,
      [values]
    );

    updated += 1;
  }

  if (rowsToAppend.length > 0) {
    await appendSheetValues(
      env,
      "'Email_Outbox'!A:P",
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
        lastRow.email_id,
        syncedAt,
        EMAIL_OUTBOX_SYNC_NAME
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
      "Email outbox sync checkpoint update failed"
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
        lastRow.email_id,
      last_success_at:
        syncedAt,
    },
  };
}


function emailOutboxToSheetRow(
  email,
  syncedAt
) {
  return [
    toSheetValue(
      email.email_id
    ),
    toSheetValue(
      email.subscriber_id
    ),
    toSheetValue(
      email.recipient_email
    ),
    toSheetValue(
      email.email_type
    ),
    toSheetValue(
      email.language
    ),
    toSheetValue(
      email.provider
    ),
    toSheetValue(
      email.provider_message_id
    ),
    toSheetValue(
      email.send_status
    ),
    toSheetValue(
      email.delivery_status
    ),
    toSheetValue(
      email.attempt_count
    ),
    toSheetValue(
      email.last_error
    ),
    toSheetValue(
      email.created_at
    ),
    toSheetValue(
      email.sent_at
    ),
    toSheetValue(
      email.delivery_updated_at
    ),
    toSheetValue(
      email.updated_at
    ),
    syncedAt,
  ];
}


function emailOutboxRowsMatch(
  existing,
  incoming
) {
  /*
   * Compare D1-backed columns only.
   * Column P (last_synced_at) is operational
   * metadata and does not determine equality.
   */
  for (
    let index = 0;
    index < 15;
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