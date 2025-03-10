-- name: GetHoldingById :one
SELECT
  sqlc.embed(holding),
  sqlc.embed(nullable_holding_currency),
  sqlc.embed(nullable_holding_asset),
  sqlc.embed(nullable_holding_asset_currency),
  sqlc.embed(account),
  sqlc.embed(account_group),
  sqlc.embed(profile)
FROM
  holding
    LEFT JOIN nullable_holding_currency ON holding.id = nullable_holding_currency.holding_id
    LEFT JOIN nullable_holding_asset ON holding.id = nullable_holding_asset.holding_id
    LEFT JOIN nullable_holding_asset_currency ON holding.id = nullable_holding_asset_currency.holding_id
    JOIN account ON holding.account_id = account.id
    JOIN account_group ON account.account_group_id = account_group.id
    JOIN profile ON holding.profile_id = profile.id
WHERE
  holding.id = @holding_id
  AND profile.id = @profile_id
;

-- name: GetAllHoldings :many
SELECT
  sqlc.embed(holding),
  sqlc.embed(nullable_holding_currency),
  sqlc.embed(nullable_holding_asset),
  sqlc.embed(nullable_holding_asset_currency),
  sqlc.embed(account),
  sqlc.embed(account_group),
  sqlc.embed(profile)
FROM
  holding
    LEFT JOIN nullable_holding_currency ON holding.id = nullable_holding_currency.holding_id
    LEFT JOIN nullable_holding_asset ON holding.id = nullable_holding_asset.holding_id
    LEFT JOIN nullable_holding_asset_currency ON holding.id = nullable_holding_asset_currency.holding_id
    JOIN account ON holding.account_id = account.id
    JOIN account_group ON account.account_group_id = account_group.id
    JOIN profile ON holding.profile_id = profile.id
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
