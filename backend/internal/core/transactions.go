package core

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (c *Core) GetTransactionById(ctx context.Context, profile schema.Profile, id uuid.UUID) (schema.Transaction, bool, error) {
	return c.DB.GetTransactionById(ctx, id, profile.ID)
}

func (c *Core) GetTransactionPage(ctx context.Context, profile schema.Profile, page int32, perPage int32, searchPattern string) (schema.TransactionPage, error) {
	total, err := c.DB.GetTransactionPageTotal(ctx, profile.ID)
	if err != nil {
		return schema.TransactionPage{}, err
	}

	filteredTotal, err := c.DB.GetTransactionPageFilteredTotal(ctx, profile.ID, searchPattern)
	if err != nil {
		return schema.TransactionPage{}, err
	}

	filteredEntites, err := c.DB.GetTransactionPageFilteredEntities(ctx, profile.ID, page, perPage, searchPattern)
	if err != nil {
		return schema.TransactionPage{}, err
	}

	return schema.TransactionPage{
		Total:            total,
		FilteredTotal:    filteredTotal,
		FilteredEntities: filteredEntites,
	}, nil
}

func (c *Core) UpsertTransaction(ctx context.Context, profile schema.Profile, transaction schema.Transaction) error {
	if err := transaction.Validate(); err != nil {
		return fmt.Errorf("invalid value: %w", err)
	}

	if transaction.ID == uuid.Nil {
		transaction.ID = uuid.New()
	} else {
		_, ok, err := c.GetTransactionById(ctx, profile, transaction.ID)
		if err != nil {
			return err
		} else if !ok {
			return fmt.Errorf("no such transaction")
		}
	}

	return c.DB.UpsertTransaction(ctx, transaction, profile.ID)
}
