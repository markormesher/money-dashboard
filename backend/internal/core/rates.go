package core

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/govalues/decimal"
	"github.com/markormesher/money-dashboard/internal/schema"
)

// we can be aggressive with caching rates. one rate entry takes up 88 bytes, so 20 years of data for 20 rates is ~13MiB.
var latestRates = make([]schema.Rate, 0)
var historicRateCache = MakeCache[string, schema.Rate](20 * 20 * 365)
var cacheWarmingLock sync.Mutex

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

	// rates are updated infrequently - we can be blunt and just rebuild the caches when there are edits
	c.clearRateCaches()
	go c.WarmRateCache(context.Background())

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

	return latestRates, nil
}

func (c *Core) getHistoricRate(ctx context.Context, assetOrCurrencyID uuid.UUID, date time.Time) (schema.Rate, error) {
	// base case for GBP
	if assetOrCurrencyID.String() == gbpCurrencyId {
		return schema.Rate{
			Rate: decimal.MustNew(1, 0),
		}, nil
	}

	cacheKey := rateCacheKey(assetOrCurrencyID, date)
	rate, ok := historicRateCache.Get(cacheKey)
	if !ok {
		dbRate, err := c.DB.GetHistoricRate(ctx, assetOrCurrencyID, date)
		if err != nil {
			return schema.Rate{}, fmt.Errorf("failed to load rate from database: %w", err)
		}

		historicRateCache.Put(cacheKey, dbRate)
		rate = dbRate
	}

	return rate, nil
}

func rateCacheKey(assetOrCurrencyID uuid.UUID, date time.Time) string {
	return fmt.Sprintf("%s-%d-%d-%d", assetOrCurrencyID.String(), date.Year(), date.Month(), date.Day())
}

func (c *Core) clearRateCaches() {
	latestRates = make([]schema.Rate, 0)
	historicRateCache.EvictAll()
}

func (c *Core) WarmRateCache(ctx context.Context) {
	locked := cacheWarmingLock.TryLock()
	if !locked {
		// someone else is already warming the cache
		return
	}

	defer cacheWarmingLock.Unlock()

	// pause before warming - we usually get multiple rate updates at once
	l.Info("warming rate cache in 30 seconds...")
	time.Sleep(time.Duration(30) * time.Second)
	l.Info("warming rate cache now")

	// gather IDs
	assets, err := c.GetAllAssets(ctx)
	if err != nil {
		l.Error("rate cache warming failed", "error", err)
		return
	}

	currencies, err := c.GetAllCurrencies(ctx)
	if err != nil {
		l.Error("rate cache warming failed", "error", err)
		return
	}

	ids := make([]uuid.UUID, 0)
	for _, a := range assets {
		ids = append(ids, a.ID)
	}
	for _, c := range currencies {
		ids = append(ids, c.ID)
	}

	// fill the caches, working backwards from today
	lastProgressReport := 0
	date := time.Now()
	for {
		for _, id := range ids {
			c.getHistoricRate(ctx, id, date)
		}

		// update progress, maybe
		if historicRateCache.Size()-lastProgressReport >= 1000 {
			lastProgressReport = historicRateCache.Size()
			l.Info("rate cache warming progress", "size", historicRateCache.Size())
		}

		// avoid slamming postgres too hard
		time.Sleep(time.Duration(200) * time.Millisecond)
		date = date.AddDate(0, 0, -1)

		if date.Before(schema.PlatformMinimumDate) {
			break
		}

		if historicRateCache.Size() >= historicRateCache.Capacity {
			break
		}
	}

	l.Info("rate cache warming finished", "size", historicRateCache.Size())
}
