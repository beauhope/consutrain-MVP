CREATE TABLE IF NOT EXISTS subscribers (
    subscriber_id TEXT PRIMARY KEY,

    email TEXT NOT NULL COLLATE NOCASE UNIQUE,

    consent_status TEXT NOT NULL
        CHECK (consent_status IN ('granted', 'withdrawn')),

    consent_version TEXT NOT NULL,

    consent_timestamp TEXT NOT NULL,

    language TEXT NOT NULL
        CHECK (language IN ('ar', 'fr')),

    cta_location TEXT NOT NULL
        CHECK (cta_location = 'global_subscribe'),

    subscriber_status TEXT NOT NULL
        CHECK (subscriber_status IN ('active', 'unsubscribed', 'invalid')),

    subscription_date TEXT NOT NULL,

    unsubscribe_timestamp TEXT,

    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_subscribers_status
ON subscribers(subscriber_status);


CREATE TABLE IF NOT EXISTS subscriber_events (
    event_id TEXT PRIMARY KEY,

    subscriber_id TEXT NOT NULL,

    event_type TEXT NOT NULL
        CHECK (
            event_type IN (
                'subscribed',
                'resubscribe_requested',
                'resubscribed',
                'unsubscribed',
                'invalidated'
            )
        ),

    consent_version TEXT,
    language TEXT,
    cta_location TEXT,

    event_timestamp TEXT NOT NULL,

    details_json TEXT,

    FOREIGN KEY (subscriber_id)
        REFERENCES subscribers(subscriber_id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_subscriber_events_subscriber
ON subscriber_events(subscriber_id);

CREATE INDEX IF NOT EXISTS idx_subscriber_events_timestamp
ON subscriber_events(event_timestamp);