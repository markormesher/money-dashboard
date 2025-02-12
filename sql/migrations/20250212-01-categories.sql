ALTER TABLE category RENAME TO category_old;

CREATE TABLE category (
  id UUID NOT NULL PRIMARY KEY,
  name VARCHAR NOT NULL,
  is_memo BOOLEAN NOT NULL DEFAULT FALSE,
  is_interest_income BOOLEAN NOT NULL DEFAULT FALSE,
  is_dividend_income BOOLEAN NOT NULL DEFAULT FALSE,
  is_capital_acquisition BOOLEAN NOT NULL DEFAULT FALSE,
  is_capital_disposal BOOLEAN NOT NULL DEFAULT FALSE,
  is_capital_event_fee BOOLEAN NOT NULL DEFAULT FALSE,
  profile_id UUID NOT NULL REFERENCES profile (id),
  active BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO category (
  SELECT
    id, name, is_memo_category, name ILIKE '%interest%', name ILIKE '%dividend%', FALSE, FALSE, FALSE, profile_id, NOT deleted
  FROM
    category_old
);
