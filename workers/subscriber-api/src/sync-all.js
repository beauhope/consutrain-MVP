import {
  runSyncWithLog,
} from "./sync-log.js";

import {
  syncSubscribersBatch,
} from "./subscribers-sync.js";

import {
  syncSubscriptionEventsBatch,
} from "./subscription-events-sync.js";

import {
  syncEmailOutboxBatch,
} from "./email-outbox-sync.js";

import {
  syncEmailDeliveryEventsBatch,
} from "./email-delivery-events-sync.js";


const SYNC_JOBS = [
  {
    name:
      "subscribers_to_sheets",

    sourceTable:
      "subscribers",

    targetTab:
      "Subscribers",

    run:
      syncSubscribersBatch,
  },

  {
    name:
      "subscriber_events_to_sheets",

    sourceTable:
      "subscriber_events",

    targetTab:
      "Subscription_Events",

    run:
      syncSubscriptionEventsBatch,
  },

  {
    name:
      "email_outbox_to_sheets",

    sourceTable:
      "subscriber_email_outbox",

    targetTab:
      "Email_Outbox",

    run:
      syncEmailOutboxBatch,
  },

  {
    name:
      "email_delivery_events_to_sheets",

    sourceTable:
      "subscriber_email_events",

    targetTab:
      "Email_Delivery_Events",

    run:
      syncEmailDeliveryEventsBatch,
  },
];


export async function runAllGoogleSheetsSyncs(
  env
) {
  const syncRunId =
    crypto.randomUUID();

  const startedAt =
    new Date().toISOString();

  const results = [];

  for (const job of SYNC_JOBS) {
    try {
      const result =
        await runSyncWithLog(
          env,
          {
            syncName:
              job.name,

            sourceTable:
              job.sourceTable,

            targetTab:
              job.targetTab,

            syncRunId,

            runSync: () =>
              job.run(
                env
              ),
          }
        );

      results.push({
        sync_name:
          job.name,

        ok:
          true,

        sync:
          result.sync,

        audit:
          result.audit,
      });
    } catch (error) {
      console.error(
        `Scheduled sync failed: ${job.name}`,
        error
      );

      results.push({
        sync_name:
          job.name,

        ok:
          false,

        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }

  const completedAt =
    new Date().toISOString();

  const failed =
    results.filter(
      (result) =>
        !result.ok
    ).length;

  return {
    sync_run_id:
      syncRunId,

    started_at:
      startedAt,

    completed_at:
      completedAt,

    total_jobs:
      results.length,

    succeeded:
      results.length -
      failed,

    failed,

    results,
  };
}