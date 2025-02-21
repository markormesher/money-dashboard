package core

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (c *Core) GetHoldingById(ctx context.Context, profile schema.Profile, id uuid.UUID) (schema.Holding, bool, error) {
	return c.DB.GetHoldingById(ctx, id, profile.ID)
}

func (c *Core) GetAllHoldings(ctx context.Context, profile schema.Profile) ([]schema.Holding, error) {
	return c.DB.GetAllHoldings(ctx, profile.ID)
}

func (c *Core) UpsertHolding(ctx context.Context, profile schema.Profile, holding schema.Holding) error {
	if err := holding.Validate(); err != nil {
		return fmt.Errorf("invalid value: %w", err)
	}

	if holding.ID == uuid.Nil {
		holding.ID = uuid.New()
	} else {
		_, ok, err := c.GetHoldingById(ctx, profile, holding.ID)
		if err != nil {
			return err
		} else if !ok {
			return fmt.Errorf("no such holding")
		}
	}

	return c.DB.UpsertHolding(ctx, holding, profile.ID)
}
