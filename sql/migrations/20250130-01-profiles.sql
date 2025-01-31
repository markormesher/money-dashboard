-- create the old profile table, then tweak the schema to match new defaults
-- no need to use a temporary table, the original table works fine for the new schema

CREATE TABLE IF NOT EXISTS profile (
  id UUID NOT NULL PRIMARY KEY,
  name VARCHAR NOT NULL,
  deleted bOOLEAN NOT NULL
);

ALTER TABLE profile ALTER COLUMN name TYPE TEXT;
ALTER TABLE profile ALTER COLUMN deleted SET DEFAULT FALSE;

-- user <-> profile links: create the old table, copy the data across, drop the old table

CREATE TABLE IF NOT EXISTS user_profiles_profile (
  user_id UUID NOT NULL,
  profile_id UUID NOT NULL
);

CREATE TABLE user_profile_role (
  user_id UUID NOT NULL REFERENCES usr (id),
  profile_id UUID NOT NULL REFERENCES profile (id),
  role TEXT NOT NULL,
  CONSTRAINT pk_user_profile_role PRIMARY KEY (user_id, profile_id)
);

INSERT INTO user_profile_role (
  SELECT
    user_id,
    profile_id,
    'owner'
  FROM user_profiles_profile
);

DROP TABLE user_profiles_profile;

-- drop the old users table now that nothing references it

DROP TABLE "user";
