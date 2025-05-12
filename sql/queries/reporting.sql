-- name: GetHoldingBalancesAsOfDate :many
SELECT
  CAST(SUM(transaction.amount) AS NUMERIC(20, 10)) AS balance,
  transaction.holding_id
FROM
  transaction
WHERE
  transaction.profile_id = @profile_id
  AND transaction.date <= @max_date
  AND transaction.deleted = FALSE
GROUP BY transaction.holding_id
;

-- name: GetHoldingBalancesChangesBetweenDates :many
SELECT
  transaction.date,
  CAST(SUM(transaction.amount) AS NUMERIC(20, 10)) AS balance,
  transaction.holding_id
FROM
  transaction
WHERE
  transaction.profile_id = @profile_id
  AND transaction.date >= @start_date
  AND transaction.date <= @end_date
  AND transaction.deleted = FALSE
GROUP BY transaction.date, transaction.holding_id
;

-- name: GetMemoBalances :many
SELECT
  CAST(SUM(transaction.amount) AS NUMERIC(20, 10)) AS balance,
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

-- name: GetInterestIncomeSumsPerHolding :many
SELECT
  CAST(SUM(transaction.amount) AS NUMERIC(20, 10)) AS balance,
  transaction.holding_id
FROM
  transaction
    JOIN category on transaction.category_id = category.id
    JOIN holding on transaction.holding_id = holding.id
    JOIN account ON holding.account_id = account.id
WHERE
  transaction.profile_id = @profile_id
  AND transaction.date >= @min_date
  AND transaction.date <= @max_date
  AND transaction.deleted = FALSE
  AND category.is_interest_income = TRUE
  AND account.is_isa = FALSE
  AND account.is_pension = FALSE
GROUP BY transaction.holding_id
;

-- name: GetDividendIncomeSumsPerHolding :many
SELECT
  CAST(SUM(transaction.amount) AS NUMERIC(20, 10)) AS balance,
  transaction.holding_id
FROM
  transaction
    JOIN category on transaction.category_id = category.id
    JOIN holding on transaction.holding_id = holding.id
    JOIN account ON holding.account_id = account.id
WHERE
  transaction.profile_id = @profile_id
  AND transaction.date >= @min_date
  AND transaction.date <= @max_date
  AND transaction.deleted = FALSE
  AND category.is_dividend_income = TRUE
  AND account.is_isa = FALSE
  AND account.is_pension = FALSE
GROUP BY transaction.holding_id
;

-- name: GetTaxableCapitalTransactions :many
SELECT
  transaction.*
FROM
  transaction
    JOIN category on transaction.category_id = category.id
    JOIN holding on transaction.holding_id = holding.id
    JOIN account ON holding.account_id = account.id
WHERE
  transaction.profile_id = @profile_id
  AND transaction.date >= @min_date
  AND transaction.date <= @max_date
  AND transaction.deleted = FALSE
  AND (
    category.is_capital_event = TRUE
    OR category.is_capital_event_fee = TRUE
  )
  AND account.is_isa = FALSE
  AND account.is_pension = FALSE
;
