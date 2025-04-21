-- name: GetTransactionById :one
SELECT
  sqlc.embed(transaction),
  sqlc.embed(holding),
  sqlc.embed(category),
  sqlc.embed(profile)
FROM
  transaction
    JOIN holding on transaction.holding_id = holding.id
    JOIN category on transaction.category_id = category.id
    JOIN profile on transaction.profile_id = profile.id
WHERE
  transaction.id = @transaction_id
  AND transaction.profile_id = @profile_id
  AND transaction.deleted = FALSE
;

-- name: GetTransactionDateRange :one
SELECT
  MIN(date)::DATE AS min_date,
  MAX(date)::DATE AS max_date
FROM
  transaction
WHERE
  transaction.profile_id = @profile_id
  AND transaction.deleted = FALSE
;

-- name: GetTransactionPageTotal :one
SELECT
  count(*)
FROM
  transaction
WHERE
  transaction.profile_id = @profile_id
  AND transaction.deleted = FALSE
;

-- making updates here? don't forget to update BOTH filtered queries
-- name: GetTransactionPageFilteredTotal :one
SELECT
  count(*)
FROM
  transaction
    JOIN category on transaction.category_id = category.id
    JOIN profile on transaction.profile_id = profile.id

    -- holding fields
    JOIN holding on transaction.holding_id = holding.id
    JOIN account ON holding.account_id = account.id
    LEFT JOIN nullable_holding_asset ON holding.id = nullable_holding_asset.holding_id
    LEFT JOIN nullable_holding_currency ON holding.id = nullable_holding_currency.holding_id
WHERE
  (
    transaction.payee ~* @search_pattern
    OR transaction.notes ~* @search_pattern
    OR category.name ~* @search_pattern
    OR holding.name ~* @search_pattern
    OR account.name ~* @search_pattern
  )
  AND transaction.profile_id = @profile_id
  AND transaction.deleted = FALSE
;

-- making updates here? don't forget to update BOTH filtered queries
-- name: GetTransactionPageFilteredEntities :many
SELECT
  sqlc.embed(transaction),
  sqlc.embed(category),
  sqlc.embed(profile),

  -- holding fields
  sqlc.embed(holding),
  sqlc.embed(account),
  sqlc.embed(nullable_holding_asset),
  sqlc.embed(nullable_holding_currency)
FROM
  transaction
    JOIN category on transaction.category_id = category.id
    JOIN profile on transaction.profile_id = profile.id

    -- holding fields
    JOIN holding on transaction.holding_id = holding.id
    JOIN account ON holding.account_id = account.id
    LEFT JOIN nullable_holding_asset ON holding.id = nullable_holding_asset.holding_id
    LEFT JOIN nullable_holding_currency ON holding.id = nullable_holding_currency.holding_id
WHERE
  (
    transaction.payee ~* @search_pattern
    OR transaction.notes ~* @search_pattern
    OR category.name ~* @search_pattern
    OR holding.name ~* @search_pattern
    OR account.name ~* @search_pattern
  )
  AND transaction.profile_id = @profile_id
  AND transaction.deleted = FALSE
ORDER BY
  "date" DESC,
  creation_date DESC
LIMIT $1
OFFSET $2
;

-- name: UpsertTransaction :exec
INSERT INTO transaction (
  id,
  "date",
  budget_date,
  creation_date,
  payee,
  notes,
  amount,
  unit_value,
  holding_id,
  category_id,
  profile_id,
  deleted
) VALUES (
  @id,
  @date,
  @budget_date,
  @creation_date,
  @payee,
  @notes,
  @amount,
  @unit_value,
  @holding_id,
  @category_id,
  @profile_id,
  @deleted
) ON CONFLICT (id) DO UPDATE SET
  -- note: creation_date deliberately not changed here
  id = @id,
  "date" = @date,
  budget_date = @budget_date,
  payee = @payee,
  notes = @notes,
  amount = @amount,
  unit_value = @unit_value,
  holding_id = @holding_id,
  category_id = @category_id,
  profile_id = @profile_id,
  deleted = @deleted
;

-- name: DeleteTransaction :exec
UPDATE transaction SET deleted = TRUE WHERE id = @id AND profile_id = @profile_id;

-- name: GetPayees :many
SELECT
  DISTINCT(payee) AS payee
FROM
  transaction
WHERE
  transaction.profile_id = @profile_id
  AND transaction.deleted = FALSE
;
