-- name: GetUserById :one
SELECT * FROM usr WHERE id = $1 AND deleted = FALSE;

-- name: GetUserByExternalUsername :one
SELECT * FROM usr WHERE external_username = $1 AND deleted = FALSE;

-- name: UpsertUser :one
INSERT INTO usr (
  id, external_username, display_name
) VALUES (
  @id, @external_username, @display_name
) ON CONFLICT (id) DO UPDATE SET
  external_username = @external_username,
  display_name = @display_name
RETURNING *;
