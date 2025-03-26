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

func (db *DB) GetEnvelopeById(ctx context.Context, id uuid.UUID, profileID uuid.UUID) (schema.Envelope, bool, error) {
	row, err := db.queries.GetEnvelopeById(ctx, database_gen.GetEnvelopeByIdParams{
		EnvelopeID: id,
		ProfileID:  profileID,
	})
	if errors.Is(err, pgx.ErrNoRows) {
		return schema.Envelope{}, false, nil
	} else if err != nil {
		return schema.Envelope{}, false, err
	}

	envelope := conversion.EnvelopeToCore(row.Envelope)

	profile := conversion.ProfileToCore(row.Profile)
	envelope.Profile = &profile

	return envelope, true, nil
}

func (db *DB) GetAllEnvelopes(ctx context.Context, profileID uuid.UUID) ([]schema.Envelope, error) {
	rows, err := db.queries.GetAllEnvelopes(ctx, profileID)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	envelopes := make([]schema.Envelope, len(rows))
	for i, row := range rows {
		envelope := conversion.EnvelopeToCore(row.Envelope)

		profile := conversion.ProfileToCore(row.Profile)
		envelope.Profile = &profile

		envelopes[i] = envelope
	}

	return envelopes, nil
}

func (db *DB) UpsertEnvelope(ctx context.Context, envelope schema.Envelope, profileID uuid.UUID) error {
	return db.queries.UpsertEnvelope(ctx, database_gen.UpsertEnvelopeParams{
		ID:        envelope.ID,
		Name:      envelope.Name,
		Active:    envelope.Active,
		ProfileID: profileID,
	})
}
