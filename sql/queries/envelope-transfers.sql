-- name: GetEnvelopeTransferById :one
SELECT
  sqlc.embed(envelope_transfer),
  sqlc.embed(nullable_envelope_tranfer_from_envelope),
  sqlc.embed(nullable_envelope_tranfer_to_envelope),
  sqlc.embed(profile)
FROM
  envelope_transfer
    JOIN nullable_envelope_tranfer_from_envelope ON envelope_transfer.id = nullable_envelope_tranfer_from_envelope.envelope_transfer_id
    JOIN nullable_envelope_tranfer_to_envelope ON envelope_transfer.id = nullable_envelope_tranfer_to_envelope.envelope_transfer_id
    JOIN profile ON envelope_transfer.profile_id = profile.id
WHERE
  envelope_transfer.id = @envelope_transfer_id
  AND profile.id = @profile_id
  AND envelope_transfer.deleted = FALSE
;

-- name: GetAllEnvelopeTransfers :many
SELECT
  sqlc.embed(envelope_transfer),
  sqlc.embed(nullable_envelope_tranfer_from_envelope),
  sqlc.embed(nullable_envelope_tranfer_to_envelope),
  sqlc.embed(profile)
FROM
  envelope_transfer
    JOIN nullable_envelope_tranfer_from_envelope ON envelope_transfer.id = nullable_envelope_tranfer_from_envelope.envelope_transfer_id
    JOIN nullable_envelope_tranfer_to_envelope ON envelope_transfer.id = nullable_envelope_tranfer_to_envelope.envelope_transfer_id
    JOIN profile ON envelope_transfer.profile_id = profile.id
WHERE
  profile.id = @profile_id
  AND envelope_transfer.deleted = FALSE
;

-- name: GetEnvelopeTransferPageTotal :one
SELECT
  count(*)
FROM
  envelope_transfer
WHERE
  envelope_transfer.profile_id = @profile_id
  AND envelope_transfer.deleted = FALSE
;

-- making updates here? don't forget to update BOTH filtered queries
-- name: GetEnvelopeTransferPageFilteredTotal :one
SELECT
  count(*)
FROM
  envelope_transfer
    JOIN nullable_envelope_tranfer_from_envelope ON envelope_transfer.id = nullable_envelope_tranfer_from_envelope.envelope_transfer_id
    JOIN nullable_envelope_tranfer_to_envelope ON envelope_transfer.id = nullable_envelope_tranfer_to_envelope.envelope_transfer_id
    JOIN profile on envelope_transfer.profile_id = profile.id
WHERE
  (
    nullable_envelope_tranfer_from_envelope.name ~* @search_pattern
    OR nullable_envelope_tranfer_to_envelope.name ~* @search_pattern
    OR envelope_transfer.notes ~* @search_pattern
  )
  AND envelope_transfer.profile_id = @profile_id
  AND envelope_transfer.deleted = FALSE
;

-- making updates here? don't forget to update BOTH filtered queries
-- name: GetEnvelopeTransferPageFilteredEntities :many
SELECT
  sqlc.embed(envelope_transfer),
  sqlc.embed(nullable_envelope_tranfer_from_envelope),
  sqlc.embed(nullable_envelope_tranfer_to_envelope),
  sqlc.embed(profile)
FROM
  envelope_transfer
    JOIN nullable_envelope_tranfer_from_envelope ON envelope_transfer.id = nullable_envelope_tranfer_from_envelope.envelope_transfer_id
    JOIN nullable_envelope_tranfer_to_envelope ON envelope_transfer.id = nullable_envelope_tranfer_to_envelope.envelope_transfer_id
    JOIN profile on envelope_transfer.profile_id = profile.id
WHERE
  (
    nullable_envelope_tranfer_from_envelope.name ~* @search_pattern
    OR nullable_envelope_tranfer_to_envelope.name ~* @search_pattern
    OR envelope_transfer.notes ~* @search_pattern
  )
  AND envelope_transfer.profile_id = @profile_id
  AND envelope_transfer.deleted = FALSE
ORDER BY
  "date" DESC,
  nullable_envelope_tranfer_from_envelope.name DESC,
  nullable_envelope_tranfer_to_envelope.name DESC
LIMIT $1
OFFSET $2
;

-- name: UpsertEnvelopeTransfer :exec
INSERT INTO envelope_transfer (
  id,
  date,
  amount,
  from_envelope_id,
  to_envelope_id,
  notes,
  profile_id,
  deleted
) VALUES (
  @id,
  @date,
  @amount,
  @from_envelope_id,
  @to_envelope_id,
  @notes,
  @profile_id,
  @deleted
) ON CONFLICT (id) DO UPDATE SET
  id = @id,
  date = @date,
  amount = @amount,
  from_envelope_id = @from_envelope_id,
  to_envelope_id = @to_envelope_id,
  notes = @notes,
  profile_id = @profile_id,
  deleted = @deleted
;

-- name: DeleteEnvelopeTransfer :exec
UPDATE envelope_transfer SET deleted = TRUE WHERE id = @id AND profile_id = @profile_id;
