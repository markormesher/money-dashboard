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

-- name: GetTransactionsForEnvelopeBalances :many
SELECT
  sqlc.embed(transaction),
  sqlc.embed(category),
  sqlc.embed(profile),
  sqlc.embed(account),
  transaction.holding_id
FROM
  transaction
    JOIN category on transaction.category_id = category.id
    JOIN profile on transaction.profile_id = profile.id
    JOIN holding on transaction.holding_id = holding.id -- not exposed - just used to join to accounts
    JOIN account ON holding.account_id = account.id
WHERE
  account.exclude_from_envelopes = FALSE
  AND transaction.profile_id = @profile_id
  AND transaction.deleted = FALSE
;
