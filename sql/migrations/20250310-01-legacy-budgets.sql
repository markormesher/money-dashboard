CREATE TABLE legacy_budget (
  id UUID NOT NULL PRIMARY KEY,
  type VARCHAR NOT NULL,
  amount NUMERIC(19, 4) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  category_id UUID NOT NULL REFERENCES category (id),
  profile_id UUID NOT NULL REFERENCES profile (id)
);

INSERT INTO legacy_budget (
  SELECT
    id,
    type,
    amount,
    to_timestamp(start_date / 1000)::DATE,
    to_timestamp(end_date / 1000)::DATE,
    category_id,
    profile_id
  FROM budget
  WHERE NOT deleted
);

DROP TABLE budget;
