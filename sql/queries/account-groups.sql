-- name: GetAccountGroupById :one
SELECT
  sqlc.embed(account_group),
  sqlc.embed(profile)
FROM
  account_group
    JOIN profile ON account_group.profile_id = profile.id
WHERE
  account_group.id = @account_group_id
  AND profile.id = @profile_id
;

-- name: GetAllAccountGroups :many
SELECT
  sqlc.embed(account_group),
  sqlc.embed(profile)
FROM
  account_group
    JOIN profile ON account_group.profile_id = profile.id
WHERE
  profile.id = @profile_id
;

-- name: UpsertAccountGroup :exec
INSERT INTO account_group (
  id,
  name,
  display_order,
  profile_id
) VALUES (
  @id,
  @name,
  @display_order,
  @profile_id
) ON CONFLICT (id) DO UPDATE SET
  id = @id,
  name = @name,
  display_order = @display_order,
  profile_id = @profile_id
;
