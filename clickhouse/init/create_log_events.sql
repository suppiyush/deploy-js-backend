CREATE DATABASE IF NOT EXISTS analytics;

CREATE TABLE IF NOT EXISTS analytics.log_events
(
    event_id UUID,
    deployment_id String,
    log String,
    created_at DateTime DEFAULT now()
)
ENGINE = MergeTree
ORDER BY (deployment_id, created_at);
