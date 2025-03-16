package core

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/govalues/decimal"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (c *Core) GetHoldingBalances(ctx context.Context, profile schema.Profile) ([]schema.HoldingBalance, error) {
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

	outputBalances := make([]schema.HoldingBalance, len(balances))

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

		outputBalances[i] = schema.HoldingBalance{
			Holding:    holding,
			RawBalance: b.Balance,
			GbpBalance: gbpBalance,
		}
	}

	return outputBalances, nil
}

func (c *Core) GetNonZeroMemoBalances(ctx context.Context, profile schema.Profile) ([]schema.CategoryBalance, error) {
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

	outputBalances := make([]schema.CategoryBalance, 0)

	for _, b := range balances {
		if b.Balance.IsZero() {
			continue
		}

		category, ok := categories[b.CategoryID]
		if !ok {
			return nil, fmt.Errorf("unknown category: %s", b.CategoryID)
		}

		out := schema.CategoryBalance{
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

func (c *Core) GetEnvelopeBalances(ctx context.Context, profile schema.Profile) ([]schema.EnvelopeBalance, error) {
	// load all the data we're going to need
	envelopes, err := c.GetAllEnvelopes(ctx, profile)
	if err != nil {
		return nil, err
	}

	envelopeAllocations, err := c.GetAllEnvelopeAllocations(ctx, profile)
	if err != nil {
		return nil, err
	}

	envelopeTransfers, err := c.GetAllEnvelopeTransfers(ctx, profile)
	if err != nil {
		return nil, err
	}

	transactions, err := c.GetTransactionsForEnvelopeCategories(ctx, profile)
	if err != nil {
		return nil, err
	}

	// initalise balances at zero
	// we set up balances for envelopes AND allocations to catch the edge case where an envelope is deactivated but still has allocations
	unallocatedBalance := decimal.Zero
	balances := make(map[string]decimal.Decimal, len(envelopes))
	for _, e := range envelopes {
		balances[e.ID.String()] = decimal.Zero
	}
	for _, ea := range envelopeAllocations {
		balances[ea.Envelope.ID.String()] = decimal.Zero
	}

	// apply all balance transfers
	for _, t := range envelopeTransfers {
		if t.FromEnvelope != nil {
			newBalance, err := balances[t.FromEnvelope.ID.String()].Sub(t.Amount)
			if err != nil {
				return nil, err
			}

			balances[t.FromEnvelope.ID.String()] = newBalance
		} else {
			unallocatedBalance, err = unallocatedBalance.Sub(t.Amount)
			if err != nil {
				return nil, err
			}
		}

		if t.ToEnvelope != nil {
			newBalance, err := balances[t.ToEnvelope.ID.String()].Add(t.Amount)
			if err != nil {
				return nil, err
			}

			balances[t.ToEnvelope.ID.String()] = newBalance
		} else {
			unallocatedBalance, err = unallocatedBalance.Add(t.Amount)
			if err != nil {
				return nil, err
			}
		}
	}

	// apply all transactions
	for _, t := range transactions {
		envelope := getEnvelopeForCategory(envelopeAllocations, *t.Category, t.Date)
		if envelope != nil {
			newBalance, err := balances[envelope.ID.String()].Add(t.Amount)
			if err != nil {
				return nil, err
			}

			balances[envelope.ID.String()] = newBalance
		} else {
			unallocatedBalance, err = unallocatedBalance.Add(t.Amount)
			if err != nil {
				return nil, err
			}
		}
	}

	// build outputs
	outputs := []schema.EnvelopeBalance{}
	outputs = append(outputs, schema.EnvelopeBalance{
		Envelope:   schema.Envelope{}, // unallocated funds
		GbpBalance: unallocatedBalance,
	})
	for _, e := range envelopes {
		outputs = append(outputs, schema.EnvelopeBalance{
			Envelope:   e,
			GbpBalance: balances[e.ID.String()],
		})
	}

	return outputs, nil
}

func getEnvelopeForCategory(allocations []schema.EnvelopeAllocation, category schema.Category, date time.Time) *schema.Envelope {
	var bestAllocation *schema.EnvelopeAllocation
	for _, ea := range allocations {
		if ea.Category.ID != category.ID {
			continue
		}

		if ea.StartDate.After(date) {
			continue
		}

		if bestAllocation == nil || ea.StartDate.After(bestAllocation.StartDate) {
			bestAllocation = &ea
		}
	}

	if bestAllocation == nil {
		return nil
	} else {
		return bestAllocation.Envelope
	}
}
