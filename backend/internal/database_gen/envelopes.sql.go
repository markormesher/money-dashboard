// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: envelopes.sql

package database_gen

import (
	"context"

	"github.com/google/uuid"
)

const getAllEnvelopes = `-- name: GetAllEnvelopes :many
SELECT
  envelope.id, envelope.name, envelope.profile_id, envelope.active,
  profile.id, profile.name, profile.deleted
FROM
  envelope
    JOIN profile ON envelope.profile_id = profile.id
WHERE
  profile.id = $1
`

type GetAllEnvelopesRow struct {
	Envelope Envelope
	Profile  Profile
}

func (q *Queries) GetAllEnvelopes(ctx context.Context, profileID uuid.UUID) ([]GetAllEnvelopesRow, error) {
	rows, err := q.db.Query(ctx, getAllEnvelopes, profileID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetAllEnvelopesRow
	for rows.Next() {
		var i GetAllEnvelopesRow
		if err := rows.Scan(
			&i.Envelope.ID,
			&i.Envelope.Name,
			&i.Envelope.ProfileID,
			&i.Envelope.Active,
			&i.Profile.ID,
			&i.Profile.Name,
			&i.Profile.Deleted,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getEnvelopeById = `-- name: GetEnvelopeById :one
SELECT
  envelope.id, envelope.name, envelope.profile_id, envelope.active,
  profile.id, profile.name, profile.deleted
FROM
  envelope
    JOIN profile ON envelope.profile_id = profile.id
WHERE
  envelope.id = $1
  AND profile.id = $2
`

type GetEnvelopeByIdParams struct {
	EnvelopeID uuid.UUID
	ProfileID  uuid.UUID
}

type GetEnvelopeByIdRow struct {
	Envelope Envelope
	Profile  Profile
}

func (q *Queries) GetEnvelopeById(ctx context.Context, arg GetEnvelopeByIdParams) (GetEnvelopeByIdRow, error) {
	row := q.db.QueryRow(ctx, getEnvelopeById, arg.EnvelopeID, arg.ProfileID)
	var i GetEnvelopeByIdRow
	err := row.Scan(
		&i.Envelope.ID,
		&i.Envelope.Name,
		&i.Envelope.ProfileID,
		&i.Envelope.Active,
		&i.Profile.ID,
		&i.Profile.Name,
		&i.Profile.Deleted,
	)
	return i, err
}

const upsertEnvelope = `-- name: UpsertEnvelope :exec
INSERT INTO envelope (
  id,
  name,
  profile_id,
  active
) VALUES (
  $1,
  $2,
  $3,
  $4
) ON CONFLICT (id) DO UPDATE SET
  id = $1,
  name = $2,
  profile_id = $3,
  active = $4
`

type UpsertEnvelopeParams struct {
	ID        uuid.UUID
	Name      string
	ProfileID uuid.UUID
	Active    bool
}

func (q *Queries) UpsertEnvelope(ctx context.Context, arg UpsertEnvelopeParams) error {
	_, err := q.db.Exec(ctx, upsertEnvelope,
		arg.ID,
		arg.Name,
		arg.ProfileID,
		arg.Active,
	)
	return err
}
