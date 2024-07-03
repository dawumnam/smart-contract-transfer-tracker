CREATE TABLE IF NOT EXISTS token_owners (
    token_id BIGINT PRIMARY KEY,
    owner_address VARCHAR(42) NOT NULL
);