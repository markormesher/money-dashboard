-- name: GetCurrencyById :one
SELECT * FROM currency WHERE currency.id = $1;

-- name: GetAllCurrencies :many
SELECT * FROM currency;

-- name: GetLatestCurrencyRates :many
SELECT DISTINCT ON (currency_id) * FROM currency_rates ORDER BY currency_id, "date" DESC;
