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

type CategoryBalance struct {
	Category   schema.Category
	Asset      *schema.Asset
	Currency   *schema.Currency
	RawBalance decimal.Decimal
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
			assetRate, err := c.GetLatestAssetRate(ctx, *holding.Asset)
			if err != nil {
				return nil, err
			}

			cashBalance, err := gbpBalance.Mul(assetRate.Rate)
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

func (c *Core) GetNonZeroMemoBalances(ctx context.Context, profile schema.Profile) ([]CategoryBalance, error) {
	categoriesArr, err := c.DB.GetAllCategories(ctx, profile.ID)
	if err != nil {
		return nil, err
	}

	categories := map[uuid.UUID]schema.Category{}
	for _, c := range categoriesArr {
		categories[c.ID] = c
	}

	assetsArr, err := c.DB.GetAllAssets(ctx)
	if err != nil {
		return nil, err
	}

	assets := map[uuid.UUID]schema.Asset{}
	for _, a := range assetsArr {
		assets[a.ID] = a
	}

	currenciesArr, err := c.DB.GetAllCurrencies(ctx)
	if err != nil {
		return nil, err
	}

	currencies := map[uuid.UUID]schema.Currency{}
	for _, c := range currenciesArr {
		currencies[c.ID] = c
	}

	balances, err := c.DB.GetMemoBalances(ctx, profile.ID)
	if err != nil {
		return nil, err
	}

	outputBalances := make([]CategoryBalance, 0)

	for _, b := range balances {
		if b.Balance.IsZero() {
			continue
		}

		category, ok := categories[b.CategoryID]
		if !ok {
			return nil, fmt.Errorf("unknown category: %s", b.CategoryID)
		}

		out := CategoryBalance{
			Category:   category,
			RawBalance: b.Balance,
		}

		if b.AssetID != nil {
			asset, ok := assets[*b.AssetID]
			if !ok {
				return nil, fmt.Errorf("unknown asset: %s", b.AssetID)
			}
			out.Asset = &asset
		}

		if b.CurrencyID != nil {
			currency, ok := currencies[*b.CurrencyID]
			if !ok {
				return nil, fmt.Errorf("unknown currency: %s", b.CurrencyID)
			}
			out.Currency = &currency
		}

		outputBalances = append(outputBalances, out)
	}

	return outputBalances, nil
}
