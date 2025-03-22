package core

import (
	"context"
	"fmt"
	"time"

	"github.com/govalues/decimal"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (c *Core) GetHoldingBalances(ctx context.Context, profile schema.Profile) ([]schema.HoldingBalance, error) {
	holdings, err := c.GetAllHoldingsAsMap(ctx, profile)
	if err != nil {
		return nil, err
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

		gbpBalance, err := c.ConvertNativeAmountToGbp(ctx, b.Balance, holding)
		if err != nil {
			return nil, err
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
	categories, err := c.GetAllCategoriesAsMap(ctx, profile)
	if err != nil {
		return nil, err
	}

	assets, err := c.GetAllAssetsAsMap(ctx)
	if err != nil {
		return nil, err
	}

	currencies, err := c.GetAllCurrenciesAsMap(ctx)
	if err != nil {
		return nil, err
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

	transactions, err := c.DB.GetTransactionsForEnvelopeBalances(ctx, profile.ID)
	if err != nil {
		return nil, err
	}

	holdings, err := c.GetAllHoldingsAsMap(ctx, profile)
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
		txn := t.Transaction

		holding, ok := holdings[t.HoldingID]
		if !ok {
			return nil, fmt.Errorf("unknown holding: %s", t.HoldingID)
		}

		gbpAmount, err := c.ConvertNativeAmountToGbp(ctx, txn.Amount, holding)
		if err != nil {
			return nil, err
		}

		envelope := getEnvelopeForCategory(envelopeAllocations, *txn.Category, txn.Date)
		if envelope != nil {
			newBalance, err := balances[envelope.ID.String()].Add(gbpAmount)
			if err != nil {
				return nil, err
			}

			balances[envelope.ID.String()] = newBalance
		} else {
			unallocatedBalance, err = unallocatedBalance.Add(gbpAmount)
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
