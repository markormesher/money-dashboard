CREATE TABLE account_group (
  id UUID NOT NULL PRIMARY KEY,
  name VARCHAR NOT NULL,
  display_order INTEGER NOT NULL,
  profile_id UUID NOT NULL REFERENCES profile (id)
);

INSERT INTO account_group (
  SELECT
    -- 9c7... is a random seed to create predictable IDs based on the profile
    uuid_generate_v5('9c7b0138-261a-43c2-bd1e-2a74e05fd1e5', id::text),
    'All Accounts',
    0,
    id
  FROM profile
);

-- create the column as nullable...
ALTER TABLE account ADD COLUMN account_group_id UUID REFERENCES account_group (id);

-- ...populate the rows...
UPDATE account SET account_group_id = uuid_generate_v6('9c7b0138-261a-43c2-bd1e-2a74e05fd1e5', profile_id::text);

-- ...then make it non-null.
ALTER TABLE account ALTER COLUMN account_group_id SET NOT NULL;
