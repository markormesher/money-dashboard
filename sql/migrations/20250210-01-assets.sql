CREATE TABLE asset (
  id UUID NOT NULL PRIMARY KEY,
  name VARCHAR NOT NULL,
  notes VARCHAR NOT NULL,
  display_precision INT NOT NULL,
  calculation_precision INT NOT NULL,
  currency_id UUID NOT NULL REFERENCES currency (id),
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE asset_price (
  id UUID NOT NULL PRIMARY KEY,
  asset_id UUID NOT NULL REFERENCES asset (id),
  "date" DATE NOT NULL,
  price NUMERIC(19, 4) NOT NULL,
  UNIQUE(asset_id, "date")
);
