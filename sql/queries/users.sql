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

-- name: GetProfileById :one
SELECT * FROM profile WHERE profile.id = $1 AND profile.deleted = FALSE;

-- name: GetUserProfiles :many
SELECT * FROM profile
WHERE
  profile.id IN (SELECT profile_id FROM user_profile_role WHERE user_id = $1)
  AND
  profile.deleted = FALSE
;

-- name: UpsertProfile :exec
INSERT INTO profile (
  id, name
) VALUES (
  @id, @name
) ON CONFLICT (id) DO UPDATE SET
  name = @name
;

-- name: SetActiveProfile :exec
UPDATE
  usr
SET
  active_profile_id = @active_profile_id
WHERE
  usr.id = @id
;

-- name: UpsertUserProfileRole :exec
INSERT INTO user_profile_role (
  user_id, profile_id, role
) VALUES (
  @user_id, @profile_id, @role
) ON CONFLICT (user_id, profile_id) DO UPDATE SET
  role = @role
;
