package core

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/govalues/decimal"
	"github.com/markormesher/money-dashboard/internal/schema"
)

// don't change this!
const gbpCurrencyId = "b3092a40-1802-46fd-9967-11c7ac3522c5"

// basic CRUD

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

	// rates are updated infrequently - we can be blunt and just wipe the caches when there are edits
	c.clearCurrencyCaches()

	return c.DB.UpsertCurrencyRate(ctx, rate)
}

// rate fetching (with caches)

var latestRates = make([]schema.CurrencyRate, 0)
var latestRateLookup = make(map[uuid.UUID]schema.CurrencyRate, 0)
var historicRateLookup = make(map[uuid.UUID]*Cache[time.Time, schema.CurrencyRate], 0)

func (c *Core) clearCurrencyCaches() {
	latestRates = make([]schema.CurrencyRate, 0)
	latestRateLookup = make(map[uuid.UUID]schema.CurrencyRate, 0)
	historicRateLookup = make(map[uuid.UUID]*Cache[time.Time, schema.CurrencyRate], 0)
}

func (c *Core) GetLatestCurrencyRates(ctx context.Context) ([]schema.CurrencyRate, error) {
	if len(latestRates) > 0 {
		return latestRates, nil
	}

	rates, err := c.DB.GetLatestCurrencyRates(ctx)
	if err != nil {
		return nil, err
	}

	// repopulate caches
	latestRates = rates
	for _, r := range rates {
		latestRateLookup[r.CurrencyID] = r
	}

	return latestRates, nil
}

func (c *Core) GetLatestCurrencyRate(ctx context.Context, currency schema.Currency) (schema.CurrencyRate, error) {
	// base case for GBP
	if currency.ID.String() == gbpCurrencyId {
		return schema.CurrencyRate{
			Rate: decimal.MustNew(1, 0),
		}, nil
	}

	// populate the latest-rate cache - it's a no-op if we've done it already
	_, err := c.GetLatestCurrencyRates(ctx)
	if err != nil {
		return schema.CurrencyRate{}, nil
	}

	rate, ok := latestRateLookup[currency.ID]
	if ok {
		return rate, nil
	}

	return schema.CurrencyRate{}, fmt.Errorf("no rate data for currency %s", currency.ID)
}

func (c *Core) GetCurrencyRate(ctx context.Context, currency schema.Currency, date time.Time) (schema.CurrencyRate, error) {
	// base case for GBP
	if currency.ID.String() == gbpCurrencyId {
		return schema.CurrencyRate{
			Rate: decimal.MustNew(1, 0),
		}, nil
	}

	// get the cache, or create one if we don't have one already
	cache, ok := historicRateLookup[currency.ID]
	if !ok {
		newCache := MakeCache[time.Time, schema.CurrencyRate](1000)
		cache = &newCache
		historicRateLookup[currency.ID] = &newCache
	}

	rate, ok := cache.Get(date)
	if ok {
		return rate, nil
	}

	rate, err := c.DB.GetCurrencyRate(ctx, currency.ID, date)
	if err != nil {
		return schema.CurrencyRate{}, err
	}

	cache.Put(date, rate)

	return rate, nil
}
