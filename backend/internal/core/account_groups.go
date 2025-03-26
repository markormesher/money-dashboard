package core

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (c *Core) GetAccountGroupById(ctx context.Context, profile schema.Profile, id uuid.UUID) (schema.AccountGroup, bool, error) {
	return c.DB.GetAccountGroupById(ctx, id, profile.ID)
}

func (c *Core) GetAllAccountGroups(ctx context.Context, profile schema.Profile) ([]schema.AccountGroup, error) {
	return c.DB.GetAllAccountGroups(ctx, profile.ID)
}

func (c *Core) UpsertAccountGroup(ctx context.Context, profile schema.Profile, accountGroup schema.AccountGroup) error {
	if accountGroup.ID == uuid.Nil {
		accountGroup.ID = uuid.New()
	} else {
		_, ok, err := c.GetAccountGroupById(ctx, profile, accountGroup.ID)
		if err != nil {
			return err
		} else if !ok {
			return fmt.Errorf("no such account group")
		}
	}

	accountGroup.Profile = &profile

	if err := accountGroup.Validate(); err != nil {
		return fmt.Errorf("invalid value: %w", err)
	}

	return c.DB.UpsertAccountGroup(ctx, accountGroup, profile.ID)
}
