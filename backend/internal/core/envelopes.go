package core

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (c *Core) GetEnvelopeById(ctx context.Context, profile schema.Profile, id uuid.UUID) (schema.Envelope, bool, error) {
	return c.DB.GetEnvelopeById(ctx, id, profile.ID)
}

func (c *Core) GetAllEnvelopes(ctx context.Context, profile schema.Profile) ([]schema.Envelope, error) {
	return c.DB.GetAllEnvelopes(ctx, profile.ID)
}

func (c *Core) UpsertEnvelope(ctx context.Context, profile schema.Profile, envelope schema.Envelope) error {
	if envelope.ID == uuid.Nil {
		envelope.ID = uuid.New()
	} else {
		_, ok, err := c.GetEnvelopeById(ctx, profile, envelope.ID)
		if err != nil {
			return err
		} else if !ok {
			return fmt.Errorf("no such envelope")
		}
	}

	envelope.Profile = &profile

	if err := envelope.Validate(); err != nil {
		return fmt.Errorf("invalid value: %w", err)
	}

	return c.DB.UpsertEnvelope(ctx, envelope, profile.ID)
}
