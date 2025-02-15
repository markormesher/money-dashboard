ALTER TABLE account RENAME TO account_old;

CREATE TABLE account (
  id UUID NOT NULL PRIMARY KEY,
  name VARCHAR NOT NULL,
  notes VARCHAR NOT NULL,
  is_isa BOOLEAN NOT NULL DEFAULT FALSE,
  is_pension BOOLEAN NOT NULL DEFAULT FALSE,
  exclude_from_envelopes BOOLEAN NOT NULL DEFAULT FALSE,
  profile_id UUID NOT NULL REFERENCES profile (id),
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE holding (
  id UUID NOT NULL PRIMARY KEY,
  name VARCHAR NOT NULL,
  currency_id UUID REFERENCES currency (id),
  asset_id UUID REFERENCES asset (id),
  account_id UUID NOT NULL REFERENCES account (id),
  profile_id UUID NOT NULL REFERENCES profile (id),
  active BOOLEAN DEFAULT TRUE
);

INSERT INTO account (
  SELECT
    id,
    name,
    COALESCE(note, ''),
    name LIKE '%ISA%' OR 'isa' = ANY(tags),
    name LIKE '%SIPP%' OR name ILIKE '%pension%' OR 'pension' = ANY(tags),
    NOT include_in_envelopes,
    profile_id,
    active AND NOT deleted
  FROM account_old
);

INSERT INTO holding (
  SELECT
    uuid_generate_v4(),
    'Cash',
    'b3092a40-1802-46fd-9967-11c7ac3522c5',
    NULL,
    id,
    profile_id,
    active AND NOT deleted
  FROM account_old
);
