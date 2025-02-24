package core

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/govalues/decimal"
	"github.com/markormesher/money-dashboard/internal/schema"
)

type HoldingBalance struct {
	Holding    schema.Holding
	RawBalance decimal.Decimal
	GbpBalance decimal.Decimal
}

func (c *Core) GetHoldingBalances(ctx context.Context, profile schema.Profile) ([]HoldingBalance, error) {
	holdingsArr, err := c.DB.GetAllHoldings(ctx, profile.ID)
	if err != nil {
		return nil, err
	}

	holdings := map[uuid.UUID]schema.Holding{}
	for _, h := range holdingsArr {
		holdings[h.ID] = h
	}

	balances, err := c.DB.GetHoldingBalances(ctx, profile.ID)
	if err != nil {
		return nil, err
	}

	outputBalances := make([]HoldingBalance, len(balances))

	for i, b := range balances {
		holding, ok := holdings[b.HoldingID]
		if !ok {
			return nil, fmt.Errorf("unknown holding: %s", b.HoldingID)
		}

		gbpBalance := b.Balance

		if holding.Currency != nil {
			rate, err := c.GetLatestCurrencyRate(ctx, *holding.Currency)
			if err != nil {
				return nil, err
			}

			gbpBalance, err = gbpBalance.Mul(rate.Rate)
			if err != nil {
				return nil, err
			}
		}

		if holding.Asset != nil {
			price, err := c.GetLatestAssetPrice(ctx, *holding.Asset)
			if err != nil {
				return nil, err
			}

			cashBalance, err := gbpBalance.Mul(price.Price)
			if err != nil {
				return nil, err
			}

			rate, err := c.GetLatestCurrencyRate(ctx, *holding.Asset.Currency)
			if err != nil {
				return nil, err
			}

			gbpBalance, err = cashBalance.Mul(rate.Rate)
			if err != nil {
				return nil, err
			}
		}

		outputBalances[i] = HoldingBalance{
			Holding:    holding,
			RawBalance: b.Balance,
			GbpBalance: gbpBalance,
		}
	}

	return outputBalances, nil
}
