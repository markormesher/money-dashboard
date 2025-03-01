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
