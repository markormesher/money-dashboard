CREATE TABLE currency (
  id UUID NOT NULL PRIMARY KEY,
  code VARCHAR NOT NULL,
  symbol VARCHAR NOT NULL,
  decimal_places INT NOT NULL,
  deleted BOOLEAN NOT NULL
);

-- pre-fill base value for GBP
INSERT INTO currency VALUES ('b3092a40-1802-46fd-9967-11c7ac3522c5', 'GBP', '£', 2, FALSE);
