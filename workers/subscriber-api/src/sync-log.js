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

export async function runSyncWithLog(
  env,
  options
) {
  const {
    syncName,
    sourceTable,
    targetTab,
    runSync,
    syncRunId:
      providedSyncRunId = null,
  } = options;

  if (
    !syncName ||
    !sourceTable ||
    !targetTab ||
    typeof runSync !== "function"
  ) {
    throw new Error(
      "Sync log runner options are incomplete"
    );
  }

  const syncRunId =
    providedSyncRunId ||
    crypto.randomUUID();

  const syncLogId =
    crypto.randomUUID();

  const startedMs =
    Date.now();

  const startedAt =
    new Date(
      startedMs
    ).toISOString();

  const checkpointBefore =
    await readCheckpoint(
      env,
      syncName
    );

  const derivedMode =
    checkpointBefore
      ?.cursor_timestamp &&
    checkpointBefore
      ?.cursor_id
      ? "incremental"
      : "full";

  try {
    const sync =
      await runSync();

    const completedMs =
      Date.now();

    const completedAt =
      new Date(
        completedMs
      ).toISOString();

    const checkpointAfter =
      await readCheckpoint(
        env,
        syncName
      );

    let logWritten =
      false;

    let logError =
      null;

    try {
      await appendSyncLog(
        env,
        {
          sync_log_id:
            syncLogId,

          sync_run_id:
            syncRunId,

          source_table:
            sourceTable,

          target_tab:
            targetTab,

          sync_mode:
            sync.mode ||
            derivedMode,

          started_at:
            startedAt,

          completed_at:
            completedAt,

          status:
            "success",

          records_read:
            sync.batch_count ??
            0,

          records_inserted:
            sync.inserted ??
            0,

          records_updated:
            sync.updated ??
            0,

          records_skipped:
            sync.skipped ??
            0,

          records_failed:
            0,

          checkpoint_before:
            checkpointBefore,

          checkpoint_after:
            checkpointAfter,

          error_message:
            "",

          duration_ms:
            completedMs -
            startedMs,
        }
      );

      logWritten =
        true;
    } catch (error) {
      console.error(
        "Sync log write failed",
        error
      );

      logError =
        errorToMessage(
          error
        );
    }

    return {
      sync,

      audit: {
        sync_run_id:
          syncRunId,

        sync_log_id:
          syncLogId,

        log_written:
          logWritten,

        log_error:
          logError,
      },
    };
  } catch (error) {
    const completedMs =
      Date.now();

    const completedAt =
      new Date(
        completedMs
      ).toISOString();

    let checkpointAfter =
      null;

    try {
      checkpointAfter =
        await readCheckpoint(
          env,
          syncName
        );
    } catch (
      checkpointError
    ) {
      console.error(
        "Failed to read checkpoint after sync error",
        checkpointError
      );
    }

    try {
      await appendSyncLog(
        env,
        {
          sync_log_id:
            syncLogId,

          sync_run_id:
            syncRunId,

          source_table:
            sourceTable,

          target_tab:
            targetTab,

          sync_mode:
            derivedMode,

          started_at:
            startedAt,

          completed_at:
            completedAt,

          status:
            "failed",

          records_read:
            0,

          records_inserted:
            0,

          records_updated:
            0,

          records_skipped:
            0,

          records_failed:
            0,

          checkpoint_before:
            checkpointBefore,

          checkpoint_after:
            checkpointAfter,

          error_message:
            errorToMessage(
              error
            ),

          duration_ms:
            completedMs -
            startedMs,
        }
      );
    } catch (
      logError
    ) {
      console.error(
        "Failed sync log write also failed",
        logError
      );
    }

    throw error;
  }
}


async function readCheckpoint(
  env,
  syncName
) {
  const checkpoint =
    await env.SUBSCRIBERS_DB
      .prepare(`
        SELECT
          cursor_timestamp,
          cursor_id,
          last_success_at
        FROM sync_checkpoints
        WHERE sync_name = ?1
        LIMIT 1
      `)
      .bind(
        syncName
      )
      .first();

  if (!checkpoint) {
    throw new Error(
      `Sync checkpoint not found: ${syncName}`
    );
  }

  return {
    cursor_timestamp:
      checkpoint.cursor_timestamp,
    cursor_id:
      checkpoint.cursor_id,
    last_success_at:
      checkpoint.last_success_at,
  };
}


function errorToMessage(
  error
) {
  const message =
    error instanceof Error
      ? error.message
      : String(error);

  return message.slice(
    0,
    1000
  );
}