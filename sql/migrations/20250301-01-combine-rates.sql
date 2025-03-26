CREATE TABLE rate (
  id UUID NOT NULL PRIMARY KEY,
  asset_id UUID REFERENCES asset (id),
  currency_id UUID REFERENCES currency (id),
  "date" DATE NOT NULL,
  rate NUMERIC(19, 4) NOT NULL,
  UNIQUE(asset_id, currency_id, "date")
);

INSERT INTO rate (
  SELECT
    id,
    NULL,
    currency_id,
    "date",
    rate
  FROM currency_rate
);

INSERT INTO rate (
  SELECT
    id,
    asset_id,
    NULL,
    "date",
    price
  FROM asset_price
);
