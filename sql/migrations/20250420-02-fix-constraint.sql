-- drop the constraint that didn't respect nulls
ALTER TABLE rate DROP CONSTRAINT rate_asset_id_currency_id_date_key;

-- add a proper constraint
ALTER TABLE rate ADD CONSTRAINT rate_asset_id_currency_id_date_unique UNIQUE NULLS NOT DISTINCT (
  asset_id,
  currency_id,
  "date"
);
