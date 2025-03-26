package database

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/markormesher/money-dashboard/internal/database/conversion"
	"github.com/markormesher/money-dashboard/internal/database_gen"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (db *DB) GetEnvelopeAllocationById(ctx context.Context, id uuid.UUID, profileID uuid.UUID) (schema.EnvelopeAllocation, bool, error) {
	row, err := db.queries.GetEnvelopeAllocationById(ctx, database_gen.GetEnvelopeAllocationByIdParams{
		EnvelopeAllocationID: id,
		ProfileID:            profileID,
	})
	if errors.Is(err, pgx.ErrNoRows) {
		return schema.EnvelopeAllocation{}, false, nil
	} else if err != nil {
		return schema.EnvelopeAllocation{}, false, err
	}

	envelopeAllocation := conversion.EnvelopeAllocationToCore(row.EnvelopeAllocation)

	category := conversion.CategoryToCore(row.Category)
	envelopeAllocation.Category = &category

	envelope := conversion.EnvelopeToCore(row.Envelope)
	envelopeAllocation.Envelope = &envelope

	profile := conversion.ProfileToCore(row.Profile)
	envelopeAllocation.Profile = &profile

	return envelopeAllocation, true, nil
}

func (db *DB) GetAllEnvelopeAllocations(ctx context.Context, profileID uuid.UUID) ([]schema.EnvelopeAllocation, error) {
	rows, err := db.queries.GetAllEnvelopeAllocations(ctx, profileID)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	envelopeAllocations := make([]schema.EnvelopeAllocation, len(rows))
	for i, row := range rows {
		envelopeAllocation := conversion.EnvelopeAllocationToCore(row.EnvelopeAllocation)

		category := conversion.CategoryToCore(row.Category)
		envelopeAllocation.Category = &category

		envelope := conversion.EnvelopeToCore(row.Envelope)
		envelopeAllocation.Envelope = &envelope

		profile := conversion.ProfileToCore(row.Profile)
		envelopeAllocation.Profile = &profile

		envelopeAllocations[i] = envelopeAllocation
	}

	return envelopeAllocations, nil
}

func (db *DB) UpsertEnvelopeAllocation(ctx context.Context, envelopeAllocation schema.EnvelopeAllocation, profileID uuid.UUID) error {
	return db.queries.UpsertEnvelopeAllocation(ctx, database_gen.UpsertEnvelopeAllocationParams{
		ID:         envelopeAllocation.ID,
		StartDate:  envelopeAllocation.StartDate,
		CategoryID: envelopeAllocation.Category.ID,
		EnvelopeID: envelopeAllocation.Envelope.ID,
		ProfileID:  profileID,
		Deleted:    envelopeAllocation.Deleted,
	})
}
