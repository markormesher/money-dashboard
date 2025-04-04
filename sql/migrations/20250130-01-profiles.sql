-- tweak the existing profile schema to match new defaults
-- no need to use a temporary table, the original table works fine for the new schema

ALTER TABLE profile ALTER COLUMN name TYPE TEXT;
ALTER TABLE profile ALTER COLUMN deleted SET DEFAULT FALSE;

-- user <-> profile links: copy the data across, drop the old table

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
