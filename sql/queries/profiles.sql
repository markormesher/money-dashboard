-- name: GetProfileById :one
SELECT * FROM profile
WHERE
  profile.id = @profile_id
  AND
  profile.id IN (SELECT profile_id FROM user_profile_role WHERE user_id = @user_id)
  AND
  profile.deleted = FALSE
;

-- name: GetAllProfiles :many
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

-- name: UpsertUserProfileRole :exec
INSERT INTO user_profile_role (
  user_id, profile_id, role
) VALUES (
  @user_id, @profile_id, @role
) ON CONFLICT (user_id, profile_id) DO UPDATE SET
  role = @role
;
