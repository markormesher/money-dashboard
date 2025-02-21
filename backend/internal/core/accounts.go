package core

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (c *Core) GetAccountById(ctx context.Context, profile schema.Profile, id uuid.UUID) (schema.Account, bool, error) {
	return c.DB.GetAccountById(ctx, id, profile.ID)
}

func (c *Core) GetAllAccounts(ctx context.Context, profile schema.Profile) ([]schema.Account, error) {
	return c.DB.GetAllAccounts(ctx, profile.ID)
}

func (c *Core) UpsertAccount(ctx context.Context, profile schema.Profile, account schema.Account) error {
	if account.ID == uuid.Nil {
		account.ID = uuid.New()
	} else {
		_, ok, err := c.GetAccountById(ctx, profile, account.ID)
		if err != nil {
			return err
		} else if !ok {
			return fmt.Errorf("no such account")
		}
	}

	account.Profile = &profile

	if err := account.Validate(); err != nil {
		return fmt.Errorf("invalid value: %w", err)
	}

	return c.DB.UpsertAccount(ctx, account, profile.ID)
}
