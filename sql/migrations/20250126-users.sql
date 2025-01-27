-- the old table was called "user", the new one is called "usr" for convenience

-- create the old table if it doesn't exist
CREATE TABLE IF NOT EXISTS "user" (
  id UUID NOT NULL,
  display_name VARCHAR NOT NULL,
  image VARCHAR NOT NULL,
  deleted bOOLEAN NOT NULL,
  active_profile_id UUID,
  external_username VARCHAR
);

CREATE TABLE usr (
  id UUID NOT NULL PRIMARY KEY,
  external_username TEXT NOT NULL,
  display_name TEXT NOT NULL,
  deleted BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO usr (
  SELECT
    id,
    external_username,
    display_name,
    deleted
  FROM "user"
);

-- note: not dropping the old table yet
