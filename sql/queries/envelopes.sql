-- name: GetEnvelopeById :one
SELECT
  sqlc.embed(envelope),
  sqlc.embed(profile)
FROM
  envelope
    JOIN profile ON envelope.profile_id = profile.id
WHERE
  envelope.id = @envelope_id
  AND profile.id = @profile_id
;

-- name: GetAllEnvelopes :many
SELECT
  sqlc.embed(envelope),
  sqlc.embed(profile)
FROM
  envelope
    JOIN profile ON envelope.profile_id = profile.id
WHERE
  profile.id = @profile_id
;

-- name: UpsertEnvelope :exec
INSERT INTO envelope (
  id,
  name,
  profile_id,
  active
) VALUES (
  @id,
  @name,
  @profile_id,
  @active
) ON CONFLICT (id) DO UPDATE SET
  id = @id,
  name = @name,
  profile_id = @profile_id,
  active = @active
;
