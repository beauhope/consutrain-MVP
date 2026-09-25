import {
  readSheetRange,
  appendSheetValues,
} from "./google-sheets.js";


const EXPECTED_HEADERS = [
  "sync_log_id",
  "sync_run_id",
  "source_table",
  "target_tab",
  "sync_mode",
  "started_at",
  "completed_at",
  "status",
  "records_read",
  "records_inserted",
  "records_updated",
  "records_skipped",
  "records_failed",
  "checkpoint_before",
  "checkpoint_after",
  "error_message",
  "duration_ms",
];


export async function dryRunSyncLog(
  env
) {
  const headerResult =
    await readSheetRange(
      env,
      "'Sync_Log'!A1:Q1"
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

  const existingResult =
    await readSheetRange(
      env,
      "'Sync_Log'!A2:A"
    );

  const existingRows =
    Array.isArray(
      existingResult.values
    )
      ? existingResult.values
      : [];

  return {
    headers: {
      match:
        headersMatch,
      expected:
        EXPECTED_HEADERS,
      actual:
        actualHeaders,
    },

    existing_log_rows:
      existingRows.length,

    writes_performed:
      false,
  };
}


export async function appendSyncLog(
  env,
  entry
) {
  const headerResult =
    await readSheetRange(
      env,
      "'Sync_Log'!A1:Q1"
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
      "Sync_Log sheet headers do not match expected schema"
    );
  }

  if (
    !entry ||
    !entry.sync_log_id ||
    !entry.sync_run_id
  ) {
    throw new Error(
      "Sync log entry is incomplete"
    );
  }

  const row = [
    toSheetValue(
      entry.sync_log_id
    ),
    toSheetValue(
      entry.sync_run_id
    ),
    toSheetValue(
      entry.source_table
    ),
    toSheetValue(
      entry.target_tab
    ),
    toSheetValue(
      entry.sync_mode
    ),
    toSheetValue(
      entry.started_at
    ),
    toSheetValue(
      entry.completed_at
    ),
    toSheetValue(
      entry.status
    ),
    toSheetValue(
      entry.records_read
    ),
    toSheetValue(
      entry.records_inserted
    ),
    toSheetValue(
      entry.records_updated
    ),
    toSheetValue(
      entry.records_skipped
    ),
    toSheetValue(
      entry.records_failed
    ),
    checkpointToSheetValue(
      entry.checkpoint_before
    ),
    checkpointToSheetValue(
      entry.checkpoint_after
    ),
    toSheetValue(
      entry.error_message
    ),
    toSheetValue(
      entry.duration_ms
    ),
  ];

  await appendSheetValues(
    env,
    "'Sync_Log'!A:Q",
    [row]
  );

  return {
    sync_log_id:
      entry.sync_log_id,
    sync_run_id:
      entry.sync_run_id,
    written:
      true,
  };
}


export function checkpointToSheetValue(
  checkpoint
) {
  if (!checkpoint) {
    return "";
  }

  return JSON.stringify({
    cursor_timestamp:
      checkpoint.cursor_timestamp ??
      null,

    cursor_id:
      checkpoint.cursor_id ??
      null,

    last_success_at:
      checkpoint.last_success_at ??
      null,
  });
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