-- name: GetCurrencyById :one
SELECT * FROM currency WHERE currency.id = $1 AND currency.deleted = FALSE;

-- name: GetAllCurrencies :many
SELECT * FROM currency WHERE currency.deleted = FALSE;
