package database

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/markormesher/money-dashboard/internal/database/conversion"
	"github.com/markormesher/money-dashboard/internal/database_gen"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (db *DB) GetEnvelopeTransferById(ctx context.Context, id uuid.UUID, profileID uuid.UUID) (schema.EnvelopeTransfer, bool, error) {
	row, err := db.queries.GetEnvelopeTransferById(ctx, database_gen.GetEnvelopeTransferByIdParams{
		EnvelopeTransferID: id,
		ProfileID:          profileID,
	})
	if errors.Is(err, pgx.ErrNoRows) {
		return schema.EnvelopeTransfer{}, false, nil
	} else if err != nil {
		return schema.EnvelopeTransfer{}, false, err
	}

	envelopeTransfer := conversion.EnvelopeTransferToCore(row.EnvelopeTransfer)

	if row.NullableEnvelopeTranferFromEnvelope.ID != nil {
		fromEnvelope := conversion.NullableEnvelopeTranferFromEnvelopeToCore(row.NullableEnvelopeTranferFromEnvelope)
		envelopeTransfer.FromEnvelope = &fromEnvelope
	}

	if row.NullableEnvelopeTranferToEnvelope.ID != nil {
		toEnvelope := conversion.NullableEnvelopeTranferToEnvelopeToCore(row.NullableEnvelopeTranferToEnvelope)
		envelopeTransfer.ToEnvelope = &toEnvelope
	}

	profile := conversion.ProfileToCore(row.Profile)
	envelopeTransfer.Profile = &profile

	return envelopeTransfer, true, nil
}

func (db *DB) GetAllEnvelopeTransfers(ctx context.Context, profileID uuid.UUID) ([]schema.EnvelopeTransfer, error) {
	rows, err := db.queries.GetAllEnvelopeTransfers(ctx, profileID)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	envelopeTransfers := make([]schema.EnvelopeTransfer, len(rows))
	for i, row := range rows {
		envelopeTransfer := conversion.EnvelopeTransferToCore(row.EnvelopeTransfer)

		if row.NullableEnvelopeTranferFromEnvelope.ID != nil {
			fromEnvelope := conversion.NullableEnvelopeTranferFromEnvelopeToCore(row.NullableEnvelopeTranferFromEnvelope)
			envelopeTransfer.FromEnvelope = &fromEnvelope
		}

		if row.NullableEnvelopeTranferToEnvelope.ID != nil {
			toEnvelope := conversion.NullableEnvelopeTranferToEnvelopeToCore(row.NullableEnvelopeTranferToEnvelope)
			envelopeTransfer.ToEnvelope = &toEnvelope
		}

		profile := conversion.ProfileToCore(row.Profile)
		envelopeTransfer.Profile = &profile

		envelopeTransfers[i] = envelopeTransfer
	}

	return envelopeTransfers, nil
}

func (db *DB) GetEnvelopeTransferPageTotal(ctx context.Context, profileID uuid.UUID) (int32, error) {
	total, err := db.queries.GetEnvelopeTransferPageTotal(ctx, profileID)
	if err != nil {
		return 0, err
	}

	return int32(total), nil
}

func (db *DB) GetEnvelopeTransferPageFilteredTotal(ctx context.Context, profileID uuid.UUID, searchPattern string) (int32, error) {
	total, err := db.queries.GetEnvelopeTransferPageFilteredTotal(ctx, database_gen.GetEnvelopeTransferPageFilteredTotalParams{
		ProfileID:     profileID,
		SearchPattern: pgtype.Text{String: searchPattern, Valid: true},
	})
	if err != nil {
		return 0, err
	}

	return int32(total), nil
}

func (db *DB) GetEnvelopeTransferPageFilteredEntities(ctx context.Context, profileID uuid.UUID, page int32, perPage int32, searchPattern string) ([]schema.EnvelopeTransfer, error) {
	rows, err := db.queries.GetEnvelopeTransferPageFilteredEntities(ctx, database_gen.GetEnvelopeTransferPageFilteredEntitiesParams{
		ProfileID:     profileID,
		SearchPattern: pgtype.Text{String: searchPattern, Valid: true},
		Limit:         perPage,
		Offset:        (page - 1) * perPage,
	})
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	envelopeTransfers := make([]schema.EnvelopeTransfer, len(rows))
	for i, row := range rows {
		envelopeTransfer := conversion.EnvelopeTransferToCore(row.EnvelopeTransfer)

		if row.NullableEnvelopeTranferFromEnvelope.ID != nil {
			fromEnvelope := conversion.NullableEnvelopeTranferFromEnvelopeToCore(row.NullableEnvelopeTranferFromEnvelope)
			envelopeTransfer.FromEnvelope = &fromEnvelope
		}

		if row.NullableEnvelopeTranferToEnvelope.ID != nil {
			toEnvelope := conversion.NullableEnvelopeTranferToEnvelopeToCore(row.NullableEnvelopeTranferToEnvelope)
			envelopeTransfer.ToEnvelope = &toEnvelope
		}

		profile := conversion.ProfileToCore(row.Profile)
		envelopeTransfer.Profile = &profile

		envelopeTransfers[i] = envelopeTransfer
	}

	return envelopeTransfers, nil
}

func (db *DB) UpsertEnvelopeTransfer(ctx context.Context, envelopeTransfer schema.EnvelopeTransfer, profileID uuid.UUID) error {
	var fromEnvelopeID, toEnvelopeID *uuid.UUID
	if envelopeTransfer.FromEnvelope != nil {
		fromEnvelopeID = &envelopeTransfer.FromEnvelope.ID
	}
	if envelopeTransfer.ToEnvelope != nil {
		toEnvelopeID = &envelopeTransfer.ToEnvelope.ID
	}

	return db.queries.UpsertEnvelopeTransfer(ctx, database_gen.UpsertEnvelopeTransferParams{
		ID:             envelopeTransfer.ID,
		Date:           envelopeTransfer.Date,
		Notes:          envelopeTransfer.Notes,
		Amount:         envelopeTransfer.Amount,
		FromEnvelopeID: fromEnvelopeID,
		ToEnvelopeID:   toEnvelopeID,
		ProfileID:      profileID,
		Deleted:        envelopeTransfer.Deleted,
	})
}

func (db *DB) DeleteEnvelopeTransfer(ctx context.Context, id uuid.UUID, profileID uuid.UUID) error {
	return db.queries.DeleteEnvelopeTransfer(ctx, database_gen.DeleteEnvelopeTransferParams{
		ID:        id,
		ProfileID: profileID,
	})
}
