-- name: GetUserById :one
SELECT * FROM usr WHERE id = @id AND deleted = FALSE;
