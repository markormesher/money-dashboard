-- name: GetUserById :one
SELECT * FROM usr WHERE usr.id = $1 AND usr.deleted = FALSE;

-- name: GetUserByExternalUsername :one
SELECT * FROM usr WHERE usr.external_username = $1 AND usr.deleted = FALSE;

-- name: UpsertUser :exec
INSERT INTO usr (
  id, external_username, display_name
) VALUES (
  @id, @external_username, @display_name
) ON CONFLICT (id) DO UPDATE SET
  external_username = @external_username,
  display_name = @display_name
;

-- name: SetActiveProfile :exec
UPDATE
  usr
SET
  active_profile_id = @active_profile_id
WHERE
  usr.id = @id
;
