ALTER TABLE subscribers
ADD COLUMN email_send_status TEXT NOT NULL DEFAULT 'eligible'
CHECK (email_send_status IN ('eligible', 'suppressed'));

ALTER TABLE subscribers
ADD COLUMN suppression_reason TEXT
CHECK (
  suppression_reason IS NULL
  OR suppression_reason IN (
    'hard_bounce',
    'complaint',
    'resend_suppressed',
    'manual'
  )
);

ALTER TABLE subscribers
ADD COLUMN suppression_timestamp TEXT;

ALTER TABLE subscribers
ADD COLUMN suppression_updated_at TEXT;

CREATE INDEX IF NOT EXISTS idx_subscribers_email_send_status
ON subscribers(email_send_status);
