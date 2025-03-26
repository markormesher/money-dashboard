CREATE VIEW nullable_holding_asset_currency AS (
  SELECT
    holding.id AS holding_id,
    currency.*
  FROM
    holding
      LEFT JOIN asset ON holding.asset_id = asset.id
      LEFT JOIN currency ON asset.currency_id = currency.id
);
