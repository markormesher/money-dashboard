// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: envelope-allocations.sql

package database_gen

import (
	"context"
	"time"

	"github.com/google/uuid"
)

const getAllEnvelopeAllocations = `-- name: GetAllEnvelopeAllocations :many
SELECT
  envelope_allocation.id, envelope_allocation.start_date, envelope_allocation.category_id, envelope_allocation.envelope_id, envelope_allocation.profile_id, envelope_allocation.deleted,
  category.id, category.name, category.is_memo, category.is_interest_income, category.is_dividend_income, category.is_capital_acquisition, category.is_capital_disposal, category.is_capital_event_fee, category.profile_id, category.active, category.is_synthetic_asset_update,
  envelope.id, envelope.name, envelope.profile_id, envelope.active,
  profile.id, profile.name, profile.deleted
FROM
  envelope_allocation
    JOIN category ON envelope_allocation.category_id = category.id
    JOIN envelope ON envelope_allocation.envelope_id = envelope.id
    JOIN profile ON envelope_allocation.profile_id = profile.id
WHERE
  profile.id = $1
  AND envelope_allocation.deleted = FALSE
`

type GetAllEnvelopeAllocationsRow struct {
	EnvelopeAllocation EnvelopeAllocation
	Category           Category
	Envelope           Envelope
	Profile            Profile
}

func (q *Queries) GetAllEnvelopeAllocations(ctx context.Context, profileID uuid.UUID) ([]GetAllEnvelopeAllocationsRow, error) {
	rows, err := q.db.Query(ctx, getAllEnvelopeAllocations, profileID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetAllEnvelopeAllocationsRow
	for rows.Next() {
		var i GetAllEnvelopeAllocationsRow
		if err := rows.Scan(
			&i.EnvelopeAllocation.ID,
			&i.EnvelopeAllocation.StartDate,
			&i.EnvelopeAllocation.CategoryID,
			&i.EnvelopeAllocation.EnvelopeID,
			&i.EnvelopeAllocation.ProfileID,
			&i.EnvelopeAllocation.Deleted,
			&i.Category.ID,
			&i.Category.Name,
			&i.Category.IsMemo,
			&i.Category.IsInterestIncome,
			&i.Category.IsDividendIncome,
			&i.Category.IsCapitalAcquisition,
			&i.Category.IsCapitalDisposal,
			&i.Category.IsCapitalEventFee,
			&i.Category.ProfileID,
			&i.Category.Active,
			&i.Category.IsSyntheticAssetUpdate,
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

const getEnvelopeAllocationById = `-- name: GetEnvelopeAllocationById :one
SELECT
  envelope_allocation.id, envelope_allocation.start_date, envelope_allocation.category_id, envelope_allocation.envelope_id, envelope_allocation.profile_id, envelope_allocation.deleted,
  category.id, category.name, category.is_memo, category.is_interest_income, category.is_dividend_income, category.is_capital_acquisition, category.is_capital_disposal, category.is_capital_event_fee, category.profile_id, category.active, category.is_synthetic_asset_update,
  envelope.id, envelope.name, envelope.profile_id, envelope.active,
  profile.id, profile.name, profile.deleted
FROM
  envelope_allocation
    JOIN category ON envelope_allocation.category_id = category.id
    JOIN envelope ON envelope_allocation.envelope_id = envelope.id
    JOIN profile ON envelope_allocation.profile_id = profile.id
WHERE
  envelope_allocation.id = $1
  AND profile.id = $2
  AND envelope_allocation.deleted = FALSE
`

type GetEnvelopeAllocationByIdParams struct {
	EnvelopeAllocationID uuid.UUID
	ProfileID            uuid.UUID
}

type GetEnvelopeAllocationByIdRow struct {
	EnvelopeAllocation EnvelopeAllocation
	Category           Category
	Envelope           Envelope
	Profile            Profile
}

func (q *Queries) GetEnvelopeAllocationById(ctx context.Context, arg GetEnvelopeAllocationByIdParams) (GetEnvelopeAllocationByIdRow, error) {
	row := q.db.QueryRow(ctx, getEnvelopeAllocationById, arg.EnvelopeAllocationID, arg.ProfileID)
	var i GetEnvelopeAllocationByIdRow
	err := row.Scan(
		&i.EnvelopeAllocation.ID,
		&i.EnvelopeAllocation.StartDate,
		&i.EnvelopeAllocation.CategoryID,
		&i.EnvelopeAllocation.EnvelopeID,
		&i.EnvelopeAllocation.ProfileID,
		&i.EnvelopeAllocation.Deleted,
		&i.Category.ID,
		&i.Category.Name,
		&i.Category.IsMemo,
		&i.Category.IsInterestIncome,
		&i.Category.IsDividendIncome,
		&i.Category.IsCapitalAcquisition,
		&i.Category.IsCapitalDisposal,
		&i.Category.IsCapitalEventFee,
		&i.Category.ProfileID,
		&i.Category.Active,
		&i.Category.IsSyntheticAssetUpdate,
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

const upsertEnvelopeAllocation = `-- name: UpsertEnvelopeAllocation :exec
INSERT INTO envelope_allocation (
  id,
  start_date,
  category_id,
  envelope_id,
  profile_id,
  deleted
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6
) ON CONFLICT (id) DO UPDATE SET
  id = $1,
  start_date = $2,
  category_id = $3,
  envelope_id = $4,
  profile_id = $5,
  deleted = $6
`

type UpsertEnvelopeAllocationParams struct {
	ID         uuid.UUID
	StartDate  time.Time
	CategoryID uuid.UUID
	EnvelopeID uuid.UUID
	ProfileID  uuid.UUID
	Deleted    bool
}

func (q *Queries) UpsertEnvelopeAllocation(ctx context.Context, arg UpsertEnvelopeAllocationParams) error {
	_, err := q.db.Exec(ctx, upsertEnvelopeAllocation,
		arg.ID,
		arg.StartDate,
		arg.CategoryID,
		arg.EnvelopeID,
		arg.ProfileID,
		arg.Deleted,
	)
	return err
}
