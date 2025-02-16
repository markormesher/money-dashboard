-- name: GetHoldingById :one
SELECT
  sqlc.embed(holding),
  --sqlc.embed(currency),
  --sqlc.embed(asset),
  sqlc.embed(account),
  sqlc.embed(profile)
FROM
  holding
    --LEFT JOIN currency on holding.currency_id = currency.id
    --LEFT JOIN asset on holding.asset_id = asset.id
    JOIN account on holding.account_id = account.id
    JOIN profile on holding.profile_id = profile.id
WHERE
  holding.id = @holding_id
  AND profile.id = @profile_id
;

-- name: GetAllHoldingsForProfile :many
SELECT
  sqlc.embed(holding),
  --sqlc.embed(currency),
  --sqlc.embed(asset),
  sqlc.embed(account),
  sqlc.embed(profile)
FROM
  holding
    --LEFT JOIN currency on holding.currency_id = currency.id
    --LEFT JOIN asset on holding.asset_id = asset.id
    JOIN account on holding.account_id = account.id
    JOIN profile on holding.profile_id = profile.id
WHERE
  profile.id = @profile_id
;

-- name: UpsertHolding :exec
INSERT INTO holding (
  id,
  name,
  currency_id,
  asset_id,
  account_id,
  profile_id,
  active
) VALUES (
  @id,
  @name,
  @currency_id,
  @asset_id,
  @account_id,
  @profile_id,
  @active
) ON CONFLICT (id) DO UPDATE SET
  id = @id,
  name = @name,
  currency_id = @currency_id,
  asset_id = @asset_id,
  account_id = @account_id,
  profile_id = @profile_id,
  active = @active
;
