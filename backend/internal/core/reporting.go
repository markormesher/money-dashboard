package core

import (
	"context"
	"fmt"
	"math"
	"time"

	"github.com/google/uuid"
	"github.com/govalues/decimal"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (c *Core) GetHoldingBalances(ctx context.Context, profile schema.Profile) ([]schema.HoldingBalance, error) {
	holdings, err := c.GetAllHoldingsAsMap(ctx, profile)
	if err != nil {
		return nil, err
	}

	balances, err := c.DB.GetHoldingBalancesAsOfDate(ctx, profile.ID, schema.PlatformMaximumDate)
	if err != nil {
		return nil, err
	}

	outputBalances := make([]schema.HoldingBalance, len(balances))

	for i, b := range balances {
		holding, ok := holdings[b.HoldingID]
		if !ok {
			return nil, fmt.Errorf("unknown holding: %s", b.HoldingID)
		}

		gbpBalance, err := c.ConvertNativeAmountToGbp(ctx, b.Balance, holding, time.Now())
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

		gbpAmount, err := c.ConvertNativeAmountToGbp(ctx, txn.Amount, holding, time.Now())
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

func (c *Core) GetBalanceHistory(ctx context.Context, profile schema.Profile, startDate time.Time, endDate time.Time) ([]schema.BalanceHistoryEntry, error) {
	// clamp dates to the range the profile actually has transactions for
	minDate, maxDate, err := c.DB.GetTransactionDateRange(ctx, profile.ID)
	if err != nil {
		return nil, nil
	}

	if startDate.Before(minDate) {
		startDate = minDate
	}

	if endDate.After(maxDate) {
		endDate = maxDate
	}

	// days will be counter as 0 to N for most of the logic here
	days := int(math.Round(endDate.Sub(startDate).Hours()/24)) + 1
	if days <= 0 {
		return nil, fmt.Errorf("invalid date range")
	}

	// load in the data we need
	holdings, err := c.GetAllHoldingsAsMap(ctx, profile)
	if err != nil {
		return nil, err
	}

	initBalances, err := c.DB.GetHoldingBalancesAsOfDate(ctx, profile.ID, startDate)
	if err != nil {
		return nil, err
	}

	dailyChanges, err := c.DB.GetHoldingBalancesChangesBetweenDates(ctx, profile.ID, startDate.AddDate(0, 0, 1), endDate)
	if err != nil {
		return nil, err
	}

	// this array of maps stores, for each day 0 to N, the **changes** in balance per holding on that day
	diffs := make([]map[uuid.UUID]decimal.Decimal, days)

	// day zero: sum of holdings up to this point
	diffs[0] = make(map[uuid.UUID]decimal.Decimal, 0)
	for _, b := range initBalances {
		prev, _ := diffs[0][b.HoldingID]
		diffs[0][b.HoldingID], err = prev.Add(b.Balance)
		if err != nil {
			return nil, err
		}
	}

	// day 1+: sum of each day's changes
	for _, change := range dailyChanges {
		day := int(math.Round(change.Date.Sub(startDate).Hours() / 24))

		if diffs[day] == nil {
			diffs[day] = make(map[uuid.UUID]decimal.Decimal, 0)
		}

		prev, _ := diffs[day][change.HoldingID]
		diffs[day][change.HoldingID], err = prev.Add(change.Balance)
		if err != nil {
			return nil, err
		}
	}

	// generate running totals and GBP values
	runningTotal := make(map[uuid.UUID]decimal.Decimal, 0)
	output := make([]schema.BalanceHistoryEntry, days)

	for d := range days {
		date := startDate.AddDate(0, 0, d)
		gbpBalance := decimal.Decimal{}

		for holdingId, diff := range diffs[d] {
			prev, _ := runningTotal[holdingId]
			runningTotal[holdingId], err = prev.Add(diff)
			if err != nil {
				return nil, err
			}
		}

		for holdingId, total := range runningTotal {
			holding, ok := holdings[holdingId]
			if !ok {
				return nil, fmt.Errorf("unknown holding: %s", holdingId)
			}

			gbpTotal, err := c.ConvertNativeAmountToGbp(ctx, total, holding, date)
			if err != nil {
				return nil, err
			}

			gbpBalance, err = gbpBalance.Add(gbpTotal)
			if err != nil {
				return nil, err
			}
		}

		output[d].Date = truncateToDay(date)
		output[d].GbpBalance = gbpBalance
	}

	return output, nil
}

func truncateToDay(t time.Time) time.Time {
	return time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, t.Location())
}
