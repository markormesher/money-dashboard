package core

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/govalues/decimal"
	"github.com/markormesher/money-dashboard/internal/schema"
)

var latestRates = make([]schema.Rate, 0)
var latestRateLookup = make(map[uuid.UUID]schema.Rate, 0)
var historicRateLookup = make(map[uuid.UUID]*Cache[time.Time, schema.Rate], 0)

func (c *Core) clearCaches() {
	latestRates = make([]schema.Rate, 0)
	latestRateLookup = make(map[uuid.UUID]schema.Rate, 0)
	historicRateLookup = make(map[uuid.UUID]*Cache[time.Time, schema.Rate], 0)
}

func (c *Core) UpsertRate(ctx context.Context, rate schema.Rate) error {
	if err := rate.Validate(); err != nil {
		return fmt.Errorf("invalid value: %w", err)
	}

	if rate.CurrencyID.String() == gbpCurrencyId {
		return fmt.Errorf("cannot set rates for the base currency")
	}

	if rate.ID == uuid.Nil {
		rate.ID = uuid.New()
	}

	// rates are updated infrequently - we can be blunt and just wipe the caches when there are edits
	c.clearCaches()

	return c.DB.UpsertRate(ctx, rate)
}

func (c *Core) GetLatestRates(ctx context.Context) ([]schema.Rate, error) {
	if len(latestRates) > 0 {
		return latestRates, nil
	}

	rates, err := c.DB.GetLatestRates(ctx)
	if err != nil {
		return nil, err
	}

	// repopulate the cache
	latestRates = rates
	for _, r := range rates {
		switch {
		case r.CurrencyID != uuid.Nil:
			latestRateLookup[r.CurrencyID] = r
		case r.AssetID != uuid.Nil:
			latestRateLookup[r.AssetID] = r
		}
	}

	return latestRates, nil
}

func (c *Core) GetLatestCurrencyRate(ctx context.Context, currency schema.Currency) (schema.Rate, error) {
	return c.getLatestRate(ctx, currency.ID)
}

func (c *Core) GetLatestAssetRate(ctx context.Context, asset schema.Asset) (schema.Rate, error) {
	return c.getLatestRate(ctx, asset.ID)
}

func (c *Core) getLatestRate(ctx context.Context, assetOrCurrencyID uuid.UUID) (schema.Rate, error) {
	// base case for GBP
	if assetOrCurrencyID.String() == gbpCurrencyId {
		return schema.Rate{
			Rate: decimal.MustNew(1, 0),
		}, nil
	}

	// populate the latest-rate cache - it's a no-op if we've done it already
	_, err := c.GetLatestRates(ctx)
	if err != nil {
		return schema.Rate{}, err
	}

	rate, ok := latestRateLookup[assetOrCurrencyID]
	if ok {
		return rate, nil
	}

	return schema.Rate{}, fmt.Errorf("no rate data for asset/currency %s", assetOrCurrencyID)
}
