-- name: GetEnvelopeAllocationById :one
SELECT
  sqlc.embed(envelope_allocation),
  sqlc.embed(category),
  sqlc.embed(envelope),
  sqlc.embed(profile)
FROM
  envelope_allocation
    JOIN category ON envelope_allocation.category_id = category.id
    JOIN envelope ON envelope_allocation.envelope_id = envelope.id
    JOIN profile ON envelope_allocation.profile_id = profile.id
WHERE
  envelope_allocation.id = @envelope_allocation_id
  AND profile.id = @profile_id
  AND envelope_allocation.deleted = FALSE
;

-- name: GetAllEnvelopeAllocations :many
SELECT
  sqlc.embed(envelope_allocation),
  sqlc.embed(category),
  sqlc.embed(envelope),
  sqlc.embed(profile)
FROM
  envelope_allocation
    JOIN category ON envelope_allocation.category_id = category.id
    JOIN envelope ON envelope_allocation.envelope_id = envelope.id
    JOIN profile ON envelope_allocation.profile_id = profile.id
WHERE
  profile.id = @profile_id
  AND envelope_allocation.deleted = FALSE
;

-- name: UpsertEnvelopeAllocation :exec
INSERT INTO envelope_allocation (
  id,
  start_date,
  category_id,
  envelope_id,
  profile_id,
  deleted
) VALUES (
  @id,
  @start_date,
  @category_id,
  @envelope_id,
  @profile_id,
  @deleted
) ON CONFLICT (id) DO UPDATE SET
  id = @id,
  start_date = @start_date,
  category_id = @category_id,
  envelope_id = @envelope_id,
  profile_id = @profile_id,
  deleted = @deleted
;
