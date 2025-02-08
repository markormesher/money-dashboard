-- name: GetCurrencyById :one
SELECT * FROM currency WHERE currency.id = $1;

-- name: GetAllCurrencies :many
SELECT * FROM currency;
