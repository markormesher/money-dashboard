package core

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (c *Core) GetAccountById(ctx context.Context, id uuid.UUID, profileID uuid.UUID) (schema.Account, bool, error) {
	return c.DB.GetAccountById(ctx, id, profileID)
}

func (c *Core) GetAllAccountsForProfile(ctx context.Context, profileID uuid.UUID) ([]schema.Account, error) {
	return c.DB.GetAllAccountsForProfile(ctx, profileID)
}

func (c *Core) UpsertAccount(ctx context.Context, account schema.Account, profileID uuid.UUID) error {
	if err := account.Validate(); err != nil {
		return fmt.Errorf("invalid value: %w", err)
	}

	if account.ID == uuid.Nil {
		account.ID = uuid.New()
	} else {
		_, ok, err := c.GetAccountById(ctx, account.ID, profileID)
		if err != nil {
			return err
		} else if !ok {
			return fmt.Errorf("no such account")
		}
	}

	return c.DB.UpsertAccount(ctx, account, profileID)
}
