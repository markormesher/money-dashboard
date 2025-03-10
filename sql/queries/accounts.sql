-- name: GetAccountById :one
SELECT
  sqlc.embed(account),
  sqlc.embed(account_group),
  sqlc.embed(profile)
FROM
  account
    JOIN account_group ON account.account_group_id = account_group.id
    JOIN profile ON account.profile_id = profile.id
WHERE
  account.id = @account_id
  AND profile.id = @profile_id
;

-- name: GetAllAccounts :many
SELECT
  sqlc.embed(account),
  sqlc.embed(account_group),
  sqlc.embed(profile)
FROM
  account
    JOIN account_group ON account.account_group_id = account_group.id
    JOIN profile ON account.profile_id = profile.id
WHERE
  profile.id = @profile_id
;

-- name: UpsertAccount :exec
INSERT INTO account (
  id,
  name,
  notes,
  is_isa,
  is_pension,
  exclude_from_envelopes,
  account_group_id,
  profile_id,
  active
) VALUES (
  @id,
  @name,
  @notes,
  @is_isa,
  @is_pension,
  @exclude_from_envelopes,
  @account_group_id,
  @profile_id,
  @active
) ON CONFLICT (id) DO UPDATE SET
  id = @id,
  name = @name,
  notes = @notes,
  is_isa = @is_isa,
  is_pension = @is_pension,
  exclude_from_envelopes = @exclude_from_envelopes,
  account_group_id = @account_group_id,
  profile_id = @profile_id,
  active = @active
;
