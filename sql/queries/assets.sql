-- name: GetAssetById :one
SELECT
  sqlc.embed(asset),
  sqlc.embed(currency)
FROM
  asset JOIN currency on asset.currency_id = currency.id
WHERE
  asset.id = $1
;

-- name: GetAllAssets :many
SELECT
  sqlc.embed(asset),
  sqlc.embed(currency)
FROM
  asset JOIN currency on asset.currency_id = currency.id
;

-- name: UpsertAsset :exec
INSERT INTO asset (
  id, name, notes, display_precision, calculation_precision, currency_id, active
) VALUES (
  @id, @name, @notes, @display_precision, @calculation_precision, @currency_id, @active
) ON CONFLICT (id) DO UPDATE SET
  name = @name,
  notes = @notes,
  display_precision = @display_precision,
  calculation_precision = @calculation_precision,
  currency_id = @currency_id,
  active = @active
;

-- name: GetLatestAssetPrices :many
SELECT DISTINCT ON (asset_id) * FROM asset_price ORDER BY asset_id, "date" DESC;

-- name: UpsertAssetPrice :exec
INSERT INTO asset_price (
  id, asset_id, "date", price
) VALUES (
  @id, @asset_id, @date, @price
) ON CONFLICT (asset_id, "date") DO UPDATE SET
  price = @price
;
