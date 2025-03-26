package core

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (c *Core) GetEnvelopeAllocationById(ctx context.Context, profile schema.Profile, id uuid.UUID) (schema.EnvelopeAllocation, bool, error) {
	return c.DB.GetEnvelopeAllocationById(ctx, id, profile.ID)
}

func (c *Core) GetAllEnvelopeAllocations(ctx context.Context, profile schema.Profile) ([]schema.EnvelopeAllocation, error) {
	return c.DB.GetAllEnvelopeAllocations(ctx, profile.ID)
}

func (c *Core) UpsertEnvelopeAllocation(ctx context.Context, profile schema.Profile, envelopeAllocation schema.EnvelopeAllocation) error {
	if envelopeAllocation.ID == uuid.Nil {
		envelopeAllocation.ID = uuid.New()
	} else {
		_, ok, err := c.GetEnvelopeAllocationById(ctx, profile, envelopeAllocation.ID)
		if err != nil {
			return err
		} else if !ok {
			return fmt.Errorf("no such envelope allocation")
		}
	}

	envelopeAllocation.Profile = &profile

	if err := envelopeAllocation.Validate(); err != nil {
		return fmt.Errorf("invalid value: %w", err)
	}

	return c.DB.UpsertEnvelopeAllocation(ctx, envelopeAllocation, profile.ID)
}
