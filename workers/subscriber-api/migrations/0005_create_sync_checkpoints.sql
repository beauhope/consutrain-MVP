CREATE TABLE IF NOT EXISTS sync_checkpoints (
    sync_name TEXT PRIMARY KEY,

    source_table TEXT NOT NULL,

    target_tab TEXT NOT NULL,

    cursor_timestamp TEXT,

    cursor_id TEXT,

    last_success_at TEXT,

    created_at TEXT NOT NULL,

    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sync_checkpoints_source_table
ON sync_checkpoints(source_table);


INSERT OR IGNORE INTO sync_checkpoints (
    sync_name,
    source_table,
    target_tab,
    cursor_timestamp,
    cursor_id,
    last_success_at,
    created_at,
    updated_at
)
VALUES
(
    'subscribers_to_sheets',
    'subscribers',
    'Subscribers',
    NULL,
    NULL,
    NULL,
    datetime('now'),
    datetime('now')
),
(
    'subscriber_events_to_sheets',
    'subscriber_events',
    'Subscription_Events',
    NULL,
    NULL,
    NULL,
    datetime('now'),
    datetime('now')
),
(
    'email_outbox_to_sheets',
    'subscriber_email_outbox',
    'Email_Outbox',
    NULL,
    NULL,
    NULL,
    datetime('now'),
    datetime('now')
),
(
    'email_delivery_events_to_sheets',
    'subscriber_email_events',
    'Email_Delivery_Events',
    NULL,
    NULL,
    NULL,
    datetime('now'),
    datetime('now')
);