package core

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/govalues/decimal"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (c *Core) GetHoldingById(ctx context.Context, profile schema.Profile, id uuid.UUID) (schema.Holding, bool, error) {
	return c.DB.GetHoldingById(ctx, id, profile.ID)
}

func (c *Core) GetAllHoldings(ctx context.Context, profile schema.Profile) ([]schema.Holding, error) {
	return c.DB.GetAllHoldings(ctx, profile.ID)
}

func (c *Core) GetAllHoldingsAsMap(ctx context.Context, profile schema.Profile) (map[uuid.UUID]schema.Holding, error) {
	holdings, err := c.GetAllHoldings(ctx, profile)
	if err != nil {
		return nil, err
	}

	out := map[uuid.UUID]schema.Holding{}
	for _, h := range holdings {
		out[h.ID] = h
	}

	return out, nil
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

func (c *Core) ConvertNativeAmountToGbp(ctx context.Context, amount decimal.Decimal, holding schema.Holding) (decimal.Decimal, error) {
	var gbpAmount decimal.Decimal

	if holding.Currency != nil {
		rate, err := c.GetLatestCurrencyRate(ctx, *holding.Currency)
		if err != nil {
			return decimal.Zero, err
		}

		gbpAmount, err = amount.Mul(rate.Rate)
		if err != nil {
			return decimal.Zero, err
		}
	}

	if holding.Asset != nil {
		assetRate, err := c.GetLatestAssetRate(ctx, *holding.Asset)
		if err != nil {
			return decimal.Decimal{}, err
		}

		cashAmount, err := amount.Mul(assetRate.Rate)
		if err != nil {
			return decimal.Decimal{}, err
		}

		rate, err := c.GetLatestCurrencyRate(ctx, *holding.Asset.Currency)
		if err != nil {
			return decimal.Decimal{}, err
		}

		gbpAmount, err = cashAmount.Mul(rate.Rate)
		if err != nil {
			return decimal.Decimal{}, err
		}
	}

	return gbpAmount, nil
}
