CREATE TABLE IF NOT EXISTS subscriber_email_outbox (
    email_id TEXT PRIMARY KEY,
    subscriber_id TEXT NOT NULL,
    email_type TEXT NOT NULL
        CHECK (email_type IN ('welcome')),
    language TEXT NOT NULL
        CHECK (language IN ('ar', 'fr')),
    recipient_email TEXT NOT NULL,
    provider TEXT NOT NULL
        CHECK (provider IN ('resend')),
    provider_message_id TEXT,
    send_status TEXT NOT NULL
        CHECK (send_status IN (
            'pending',
            'sent',
            'failed'
        )),
    attempt_count INTEGER NOT NULL DEFAULT 0,
    last_error TEXT,
    created_at TEXT NOT NULL,
    sent_at TEXT,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (subscriber_id)
        REFERENCES subscribers(subscriber_id)
        ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_email_outbox_unique_welcome
ON subscriber_email_outbox(subscriber_id, email_type);

CREATE INDEX IF NOT EXISTS idx_email_outbox_status
ON subscriber_email_outbox(send_status);

CREATE INDEX IF NOT EXISTS idx_email_outbox_created_at
ON subscriber_email_outbox(created_at);