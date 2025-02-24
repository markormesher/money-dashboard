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
