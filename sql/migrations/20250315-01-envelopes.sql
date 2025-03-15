-- envelopes

ALTER TABLE envelope RENAME TO envelope_old;

CREATE TABLE envelope (
  id UUID NOT NULL PRIMARY KEY,
  name VARCHAR NOt NULL,
  profile_id UUID NOT NULL REFERENCES profile (id),
  active BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO envelope (
  SELECT
    id,
    name,
    profile_id,
    TRUE
  FROM envelope_old WHERE deleted = FALSE
);

-- allocations

ALTER TABLE envelope_allocation RENAME TO envelope_allocation_old;

CREATE TABLE envelope_allocation (
  id UUID NOT NULL PRIMARY KEY,
  start_date DATE NOt NULL,
  category_id UUID NOT NULL REFERENCES category (id),
  envelope_id UUID NOT NULL REFERENCES envelope (id),
  profile_id UUID NOT NULL REFERENCES profile (id),
  deleted BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO envelope_allocation (
  SELECT
    id,
    to_timestamp(start_date / 1000)::DATE,
    category_id,
    envelope_id,
    profile_id,
    deleted
  FROM envelope_allocation_old
);
