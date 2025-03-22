-- name: GetCategoryById :one
SELECT
  sqlc.embed(category),
  sqlc.embed(profile)
FROM
  category JOIN profile on category.profile_id = profile.id
WHERE
  category.id = @category_id
  AND profile.id = @profile_id
;

-- name: GetAllCategories :many
SELECT
  sqlc.embed(category),
  sqlc.embed(profile)
FROM
  category JOIN profile on category.profile_id = profile.id
WHERE
  profile.id = @profile_id
;

-- name: UpsertCategory :exec
INSERT INTO category (
  id,
  name,
  is_memo,
  is_interest_income,
  is_dividend_income,
  is_capital_acquisition,
  is_capital_disposal,
  is_capital_event_fee,
  is_synthetic_asset_update,
  profile_id,
  active
) VALUES (
  @id,
  @name,
  @is_memo,
  @is_interest_income,
  @is_dividend_income,
  @is_capital_acquisition,
  @is_capital_disposal,
  @is_capital_event_fee,
  @is_synthetic_asset_update,
  @profile_id,
  @active
) ON CONFLICT (id) DO UPDATE SET
  id = @id,
  name = @name,
  is_memo = @is_memo,
  is_interest_income = @is_interest_income,
  is_dividend_income = @is_dividend_income,
  is_capital_acquisition = @is_capital_acquisition,
  is_capital_disposal = @is_capital_disposal,
  is_capital_event_fee = @is_capital_event_fee,
  is_synthetic_asset_update = @is_synthetic_asset_update,
  profile_id = @profile_id,
  active = @active
;
