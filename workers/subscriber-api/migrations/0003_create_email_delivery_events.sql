CREATE TABLE IF NOT EXISTS subscriber_email_events (
    webhook_event_id TEXT PRIMARY KEY,

    provider TEXT NOT NULL
        CHECK (provider = 'resend'),

    provider_event_type TEXT NOT NULL,

    provider_message_id TEXT NOT NULL,

    email_id TEXT,
    subscriber_id TEXT,

    recipient_email TEXT,

    event_timestamp TEXT NOT NULL,

    bounce_type TEXT,
    bounce_subtype TEXT,
    bounce_message TEXT,

    payload_json TEXT NOT NULL,

    received_at TEXT NOT NULL,

    FOREIGN KEY (email_id)
        REFERENCES subscriber_email_outbox(email_id)
        ON DELETE SET NULL,

    FOREIGN KEY (subscriber_id)
        REFERENCES subscribers(subscriber_id)
        ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_email_events_message
ON subscriber_email_events(provider_message_id);

CREATE INDEX IF NOT EXISTS idx_email_events_subscriber
ON subscriber_email_events(subscriber_id);

CREATE INDEX IF NOT EXISTS idx_email_events_type
ON subscriber_email_events(provider_event_type);

CREATE INDEX IF NOT EXISTS idx_email_events_timestamp
ON subscriber_email_events(event_timestamp);


ALTER TABLE subscriber_email_outbox
ADD COLUMN delivery_status TEXT NOT NULL DEFAULT 'unknown';

ALTER TABLE subscriber_email_outbox
ADD COLUMN delivery_updated_at TEXT;