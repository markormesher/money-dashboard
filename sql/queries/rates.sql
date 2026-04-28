-- name: UpsertRate :exec
INSERT INTO rate (
  id, asset_id, currency_id, "date", rate
) VALUES (
  @id, @asset_id, @currency_id, @date, @rate
) ON CONFLICT (asset_id, currency_id, "date") DO UPDATE SET
  rate = @rate
;

-- name: GetLatestRates :many
SELECT
  DISTINCT ON (asset_id, currency_id) *
FROM
  rate
ORDER BY asset_id, currency_id, "date" DESC;

-- name: GetHistoricRate :one
SELECT * FROM rate
WHERE
  (
    asset_id = @asset_or_currencey_id
    OR currency_id = @asset_or_currencey_id
  )
  AND "date" <= @date
ORDER BY "date" DESC
LIMIT 1;

-- name: GetHistoricAverageRates :many
SELECT
  asset_id,
  currency_id,
  CAST(AVG(rate) AS NUMERIC(20, 10)) AS rate
FROM
  rate
WHERE
  date >= NOW() - INTERVAL '90 days'
GROUP BY asset_id, currency_id
;
