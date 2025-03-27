-- drop views that depend on these columns
DROP VIEW nullable_holding_asset;
DROP VIEW nullable_holding_asset_currency;
DROP VIEW nullable_holding_currency;

-- drop the columns
ALTER TABLE asset DROP COLUMN calculation_precision;
ALTER TABLE currency DROP COLUMN calculation_precision;

-- recreate views
CREATE VIEW nullable_holding_currency AS (
  SELECT holding.id AS holding_id, currency.* FROM holding LEFT JOIN currency ON holding.currency_id = currency.id
);

CREATE VIEW nullable_holding_asset AS (
  SELECT holding.id AS holding_id, asset.* FROM holding LEFT JOIN asset ON holding.asset_id = asset.id
);

CREATE VIEW nullable_holding_asset_currency AS (
  SELECT
    holding.id AS holding_id,
    currency.*
  FROM
    holding
      LEFT JOIN asset ON holding.asset_id = asset.id
      LEFT JOIN currency ON asset.currency_id = currency.id
);
