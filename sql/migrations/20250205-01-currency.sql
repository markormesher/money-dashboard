CREATE TABLE currency (
  id UUID NOT NULL PRIMARY KEY,
  code VARCHAR NOT NULL,
  symbol VARCHAR NOT NULL,
  decimal_places INT NOT NULL,
  deleted BOOLEAN NOT NULL
);

CREATE TABLE currency_value (
  id UUID NOT NULL PRIMARY KEY,
  currency_id UUID NOT NULL REFERENCES currency (id),
  "date" DATE NOT NULL,
  value NUMERIC(19, 4) NOT NULL
);

-- pre-fill base values for GBP
INSERT INTO currency VALUES ('b3092a40-1802-46fd-9967-11c7ac3522c5', 'GBP', '£', 2, FALSE);
INSERT INTO currency_value VALUES (uuid_generate_v4(), 'b3092a40-1802-46fd-9967-11c7ac3522c5', '2000-01-01', 1.0);
