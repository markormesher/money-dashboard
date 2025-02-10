CREATE TABLE currency_rate (
  id UUID NOT NULL PRIMARY KEY,
  currency_id UUID NOT NULL REFERENCES currency (id),
  "date" DATE NOT NULL,
  rate NUMERIC(19, 4) NOT NULL,
  UNIQUE(currency_id, "date")
);

INSERT INTO currency_rate VALUES (gen_random_uuid(), "b3092a40-1802-46fd-9967-11c7ac3522c5", "1970-01-01", 1.0);
