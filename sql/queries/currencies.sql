-- name: GetCurrencyById :one
SELECT * FROM currency WHERE currency.id = $1;

-- name: GetAllCurrencies :many
SELECT * FROM currency;

-- name: UpsertCurrency :exec
INSERT INTO currency (
  id, code, symbol, display_precision, calculation_precision, active
) VALUES (
  @id, @code, @symbol, @display_precision, @calculation_precision, @active
) ON CONFLICT (id) DO UPDATE SET
  code = @code,
  symbol = @symbol,
  display_precision = @display_precision,
  calculation_precision = @calculation_precision,
  active = @active
;

-- name: UpsertCurrencyRate :exec
INSERT INTO currency_rate (
  id, currency_id, "date", rate
) VALUES (
  @id, @currency_id, @date, @rate
) ON CONFLICT (currency_id, "date") DO UPDATE SET
  rate = @rate
;

-- name: GetLatestCurrencyRates :many
SELECT DISTINCT ON (currency_id) * FROM currency_rate ORDER BY currency_id, "date" DESC;

-- name: GetCurrencyRate :one
SELECT * FROM currency_rate
WHERE
  currency_id = @currency_id
  AND
  "date" <= @date
ORDER BY "date" DESC
LIMIT 1;
