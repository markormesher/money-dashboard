package core

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (c *Core) GetHoldingById(ctx context.Context, id uuid.UUID, profileID uuid.UUID) (schema.Holding, bool, error) {
	return c.DB.GetHoldingById(ctx, id, profileID)
}

func (c *Core) GetAllHoldingsForProfile(ctx context.Context, profileID uuid.UUID) ([]schema.Holding, error) {
	return c.DB.GetAllHoldingsForProfile(ctx, profileID)
}

func (c *Core) UpsertHolding(ctx context.Context, holding schema.Holding, profileID uuid.UUID) error {
	if err := holding.Validate(); err != nil {
		return fmt.Errorf("invalid value: %w", err)
	}

	if holding.ID == uuid.Nil {
		holding.ID = uuid.New()
	} else {
		_, ok, err := c.GetHoldingById(ctx, holding.ID, profileID)
		if err != nil {
			return err
		} else if !ok {
			return fmt.Errorf("no such holding")
		}
	}

	return c.DB.UpsertHolding(ctx, holding, profileID)
}
