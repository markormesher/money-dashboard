package core

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/schema"
)

// don't change this!
const gbpCurrencyId = "b3092a40-1802-46fd-9967-11c7ac3522c5"

func (c *Core) GetCurrencyById(ctx context.Context, id uuid.UUID) (schema.Currency, bool, error) {
	return c.DB.GetCurrencyById(ctx, id)
}

func (c *Core) GetAllCurrencies(ctx context.Context) ([]schema.Currency, error) {
	return c.DB.GetAllCurrencies(ctx)
}

func (c *Core) UpsertCurrency(ctx context.Context, currency schema.Currency) error {
	if err := currency.Validate(); err != nil {
		return fmt.Errorf("invalid value: %w", err)
	}

	if currency.ID.String() == gbpCurrencyId {
		return fmt.Errorf("cannot edit the base currency")
	}

	if currency.ID == uuid.Nil {
		currency.ID = uuid.New()
	}

	return c.DB.UpsertCurrency(ctx, currency)
}

func (c *Core) GetLatestCurrencyRates(ctx context.Context) ([]schema.CurrencyRate, error) {
	return c.DB.GetLatestCurrencyRates(ctx)
}

func (c *Core) UpsertCurrencyRate(ctx context.Context, rate schema.CurrencyRate) error {
	if err := rate.Validate(); err != nil {
		return fmt.Errorf("invalid value: %w", err)
	}

	if rate.CurrencyID.String() == gbpCurrencyId {
		return fmt.Errorf("cannot set rates for the base currency")
	}

	if rate.ID == uuid.Nil {
		rate.ID = uuid.New()
	}

	return c.DB.UpsertCurrencyRate(ctx, rate)
}
