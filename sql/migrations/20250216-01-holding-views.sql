-- these nullable views are a hack to get around the lack of support for left-joins in sqlc.embed
-- see https://github.com/sqlc-dev/sqlc/issues/2997

CREATE VIEW nullable_holding_currency AS (
  SELECT holding.id AS holding_id, currency.* FROM holding LEFT JOIN currency ON holding.currency_id = currency.id
);

CREATE VIEW nullable_holding_asset AS (
  SELECT holding.id AS holding_id, asset.* FROM holding LEFT JOIN asset ON holding.asset_id = asset.id
);
