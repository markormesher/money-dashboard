-- name: GetHoldingBalances :many
SELECT
  CAST(SUM(transaction.amount) AS NUMERIC(19, 4)) AS balance,
  transaction.holding_id
FROM
  transaction
WHERE
  transaction.profile_id = @profile_id
  AND transaction.deleted = FALSE
GROUP BY transaction.holding_id
;

-- name: GetMemoBalances :many
SELECT
  CAST(SUM(transaction.amount) AS NUMERIC(19, 4)) AS balance,
  holding.asset_id,
  holding.currency_id,
  transaction.category_id
FROM
  transaction
    JOIN holding ON transaction.holding_id = holding.id
    JOIN category ON transaction.category_id = category.id
WHERE
  transaction.profile_id = @profile_id
  AND transaction.deleted = FALSE
  AND category.is_memo = TRUE
GROUP BY holding.asset_id, holding.currency_id, transaction.category_id
;
