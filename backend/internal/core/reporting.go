package core

import (
	"context"
	"fmt"
	"math"
	"sort"
	"time"

	"github.com/google/uuid"
	"github.com/govalues/decimal"
	"github.com/markormesher/money-dashboard/internal/database"
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
		prev := diffs[0][b.HoldingID]
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

		prev := diffs[day][change.HoldingID]
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
			prev := runningTotal[holdingId]
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

func (c *Core) GetTaxReport(ctx context.Context, profile schema.Profile, taxYear int) (schema.TaxReport, error) {
	startDate := time.Date(taxYear, 4, 6, 0, 0, 0, 0, time.UTC)
	endDate := time.Date(taxYear+1, 4, 5, 0, 0, 0, 0, time.UTC)

	interestIncome, err := c.getInterestOrDividendIncomeForTaxReport(ctx, "interest", profile, startDate, endDate)
	if err != nil {
		return schema.TaxReport{}, err
	}

	dividendIncome, err := c.getInterestOrDividendIncomeForTaxReport(ctx, "dividend", profile, startDate, endDate)
	if err != nil {
		return schema.TaxReport{}, err
	}

	capitalEvents, err := c.getCaptialReportForTaxReport(ctx, profile, startDate, endDate)
	if err != nil {
		return schema.TaxReport{}, err
	}

	return schema.TaxReport{
		InterestIncome: interestIncome,
		DividendIncome: dividendIncome,
		CapitalEvents:  capitalEvents,
	}, nil
}

func (c *Core) getInterestOrDividendIncomeForTaxReport(ctx context.Context, which string, profile schema.Profile, startDate time.Time, endDate time.Time) ([]schema.HoldingBalance, error) {
	holdings, err := c.GetAllHoldingsAsMap(ctx, profile)
	if err != nil {
		return nil, err
	}

	output := make([]schema.HoldingBalance, 0)
	var data []database.HoldingBalance
	if which == "interest" {
		data, err = c.DB.GetTaxableInterestIncomePerHolding(ctx, profile.ID, startDate, endDate)
	} else {
		data, err = c.DB.GetTaxableDividendIncomePerHolding(ctx, profile.ID, startDate, endDate)
	}
	if err != nil {
		return nil, err
	}

	for _, b := range data {
		holding, ok := holdings[b.HoldingID]
		if !ok {
			return nil, fmt.Errorf("unknown holding: %s", b.HoldingID)
		}

		gbpBalance, err := c.ConvertNativeAmountToGbp(ctx, b.Balance, holding, time.Now())
		if err != nil {
			return nil, err
		}

		output = append(output, schema.HoldingBalance{
			Holding:    holding,
			RawBalance: b.Balance,
			GbpBalance: gbpBalance,
		})
	}

	return output, nil
}

type CapitalEvent struct {
	date time.Time

	qty                  decimal.Decimal
	avgOriginalUnitPrice decimal.Decimal
	avgGbpUnitPrice      decimal.Decimal

	qtyMatched decimal.Decimal
	matches    []CapitalEventMatch
}

func (ce CapitalEvent) availableToMatch() decimal.Decimal {
	out, err := ce.qty.Sub(ce.qtyMatched)
	if err != nil {
		panic("maths error: could not subtract: " + err.Error())
	}
	return out
}

type CapitalEventMatch struct {
	qty   decimal.Decimal
	date  time.Time
	price decimal.Decimal
	note  string
}

func (c *Core) getCaptialReportForTaxReport(ctx context.Context, profile schema.Profile, startDate time.Time, endDate time.Time) ([]schema.TaxReportCapitalEvent, error) {
	// share matching and S104 pots don't are about tax year bounaries, so we need to
	// get the full history and build the full report, then return the events for the
	// year in question

	transactions, err := c.DB.GetTaxableCapitalTransactions(ctx, profile.ID)
	if err != nil {
		return nil, err
	}

	// split transactions into acquisitions and disposals
	acquisitionTxns := make([]schema.Transaction, 0)
	disposalTxns := make([]schema.Transaction, 0)
	for _, t := range transactions {
		if t.Amount.IsPos() {
			acquisitionTxns = append(acquisitionTxns, t)
		} else {
			disposalTxns = append(disposalTxns, t)
		}
	}

	/*
		Step 1: convert all transactions into captial events by merging transactions that
		happened on the same day, and calculating the GBP vaue of each transaction as of the day
		it happened.

		---

		All shares of the same class in the same company acquired by the same person on the same
		day and in the same capacity are treated as though they were acquired by a single
		transaction, TCGA92/S105 (1)(a).

		All shares of the same class in the same company disposed of by the same person on the
		same day and in the same capacity are also treated as though they were disposed of by
		a single transaction, TCGA92/S105 (1)(a).
	*/

	acquisitionEventsPerHolding, err := c.convertCapitalTransactionsToEvents(ctx, acquisitionTxns)
	if err != nil {
		return nil, err
	}

	disposalEventsPerHolding, err := c.convertCapitalTransactionsToEvents(ctx, disposalTxns)
	if err != nil {
		return nil, err
	}

	/*
		Step 2: match disposals against any acquisitions that happened on the same day.

		---

		If there is an acquisition and a disposal on the same day the disposal is identified
		first against the acquisition on the same day, TCGA92/S105 (1)(b).

		If the number of shares disposed of exceeds the number acquired on the same day the
		excess shares will be identified in the normal way.

		If the number of shares acquired exceeds the number sold on the same day the surplus
		is added to the Section 104 holding, unless they are identified with disposals under
		the 'bed and breakfast' rule, see below.
	*/

	for holdingId, disposalEvents := range disposalEventsPerHolding {
		acquisitionEvents, ok := acquisitionEventsPerHolding[holdingId]
		if !ok {
			return nil, fmt.Errorf("cannot dispose of an asset that wasn't acquired (holding: %v)", holdingId)
		}

		for d := range disposalEvents {
			disposal := &disposalEvents[d]

			for a := range acquisitionEvents {
				acquisition := &acquisitionEvents[a]

				if acquisition.date == disposal.date {
					var qtyMatched decimal.Decimal
					if acquisition.availableToMatch().Cmp(disposal.availableToMatch()) < 0 {
						qtyMatched = acquisition.availableToMatch()
					} else {
						qtyMatched = disposal.availableToMatch()
					}

					if qtyMatched.IsZero() {
						break
					}

					// work out the new matched quantities for each side
					disposalTotalMatched, err := disposal.qtyMatched.Add(qtyMatched)
					if err != nil {
						return nil, err
					}
					disposal.qtyMatched = disposalTotalMatched

					acquisitionTotalMatched, err := acquisition.qtyMatched.Add(qtyMatched)
					if err != nil {
						return nil, err
					}
					acquisition.qtyMatched = acquisitionTotalMatched

					// append match records
					disposal.matches = append(disposal.matches, CapitalEventMatch{
						qty:   qtyMatched,
						date:  disposal.date,
						price: acquisition.avgGbpUnitPrice,
						note:  "Same-day",
					})

					acquisition.matches = append(acquisition.matches, CapitalEventMatch{
						qty:  qtyMatched,
						date: disposal.date,
						note: "Same-day",
					})

					break
				}
			}
		}
	}

	/*
		Step 3: as above, but now we match disposals against acquisitions in the last 30 days.

		---

		Disposals must be identified with acquisitions of shares of the same class,
		acquired by the same person in the same capacity, and acquired within the 30 days
		after the disposal.

		This rule has priority over all other identification rules except the 'same day'
		rule in TCGA92/S105(1).
	*/

	// TODO

	/*
		Step 4: walk through all remaining acquisitions and disposals and count them
		against the S104 pot.
	*/

	// TODO

	// rebuild result

	holdings, err := c.GetAllHoldingsAsMap(ctx, profile)
	if err != nil {
		return nil, err
	}

	out := make([]schema.TaxReportCapitalEvent, 0)

	for holdingId, acquisitions := range acquisitionEventsPerHolding {
		holding, ok := holdings[holdingId]
		if !ok {
			return nil, fmt.Errorf("unknown holding: %v", holdingId)
		}

		for _, acquisition := range acquisitions {
			evt := schema.TaxReportCapitalEvent{
				Holding:              holding,
				Type:                 "acquisition",
				Date:                 acquisition.date,
				Qty:                  acquisition.qty,
				AvgOriginalUnitPrice: acquisition.avgOriginalUnitPrice,
				AvgGbpUnitPrice:      acquisition.avgGbpUnitPrice,
				QtyMatched:           acquisition.qtyMatched,
			}

			for _, m := range acquisition.matches {
				evt.Matches = append(evt.Matches, schema.TaxReportCapitalEventMatch{
					Qty:   m.qty,
					Date:  m.date,
					Price: m.price,
					Note:  m.note,
				})
			}

			out = append(out, evt)
		}
	}

	for holdingId, disposals := range disposalEventsPerHolding {
		holding, ok := holdings[holdingId]
		if !ok {
			return nil, fmt.Errorf("unknown holding: %v", holdingId)
		}

		for _, disposal := range disposals {
			evt := schema.TaxReportCapitalEvent{
				Holding:              holding,
				Type:                 "disposal",
				Date:                 disposal.date,
				Qty:                  disposal.qty,
				AvgOriginalUnitPrice: disposal.avgOriginalUnitPrice,
				AvgGbpUnitPrice:      disposal.avgGbpUnitPrice,
				QtyMatched:           disposal.qtyMatched,
			}

			for _, m := range disposal.matches {
				evt.Matches = append(evt.Matches, schema.TaxReportCapitalEventMatch{
					Qty:   m.qty,
					Date:  m.date,
					Price: m.price,
					Note:  m.note,
				})
			}

			out = append(out, evt)
		}
	}

	return out, nil
}

func truncateToDay(t time.Time) time.Time {
	return time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, t.Location())
}

func (c *Core) convertCapitalTransactionsToEvents(ctx context.Context, txns []schema.Transaction) (map[uuid.UUID][]CapitalEvent, error) {
	sort.Slice(txns, func(a, b int) bool {
		return txns[a].Date.Before(txns[b].Date)
	})

	type MergeState struct {
		date               time.Time
		qty                decimal.Decimal
		totalOriginalValue decimal.Decimal
		totalGbpValue      decimal.Decimal
	}

	mergedStatesPerHolding := make(map[uuid.UUID][]MergeState, 0)

	for _, t := range txns {
		mergedStates, ok := mergedStatesPerHolding[t.Holding.ID]
		if !ok {
			mergedStates = make([]MergeState, 0)
		}

		tDate := truncateToDay(t.Date)

		if len(mergedStates) == 0 || mergedStates[len(mergedStates)-1].date != tDate {
			mergedStates = append(mergedStates, MergeState{
				date:               tDate,
				qty:                decimal.Zero,
				totalOriginalValue: decimal.Zero,
			})
		}

		// qty is easy - just add them up

		qty, err := mergedStates[len(mergedStates)-1].qty.Add(t.Amount.Abs())
		if err != nil {
			return nil, err
		}

		// total value is harder - we need to do it for the original currency and for GBP

		var currency schema.Currency
		if t.Holding.Currency != nil {
			currency = *t.Holding.Currency
		} else {
			currency = *t.Holding.Asset.Currency
		}

		rate, err := c.getHistoricRate(ctx, currency.ID, tDate)
		if err != nil {
			return nil, err
		}

		originalValue, err := t.Amount.Mul(t.UnitValue)
		if err != nil {
			return nil, err
		}

		gbpValue, err := originalValue.Mul(rate.Rate)
		if err != nil {
			return nil, err
		}

		totalOriginalValue, err := mergedStates[len(mergedStates)-1].totalOriginalValue.Add(originalValue)
		if err != nil {
			return nil, err
		}

		totalGbpValue, err := mergedStates[len(mergedStates)-1].totalGbpValue.Add(gbpValue)
		if err != nil {
			return nil, err
		}

		mergedStates[len(mergedStates)-1].qty = qty
		mergedStates[len(mergedStates)-1].totalOriginalValue = totalOriginalValue
		mergedStates[len(mergedStates)-1].totalGbpValue = totalGbpValue
		mergedStatesPerHolding[t.Holding.ID] = mergedStates
	}

	out := make(map[uuid.UUID][]CapitalEvent, 0)

	for holdingId, mergedStates := range mergedStatesPerHolding {
		holdingStates := make([]CapitalEvent, len(mergedStates))

		for i, mergedState := range mergedStates {
			avgOriginalUnitPrice, err := mergedState.totalOriginalValue.Quo(mergedState.qty)
			if err != nil {
				return nil, err
			}

			avgGbpUnitPrice, err := mergedState.totalGbpValue.Quo(mergedState.qty)
			if err != nil {
				return nil, err
			}

			holdingStates[i] = CapitalEvent{
				date:                 mergedState.date,
				qty:                  mergedState.qty,
				avgOriginalUnitPrice: avgOriginalUnitPrice,
				avgGbpUnitPrice:      avgGbpUnitPrice,
			}
		}

		out[holdingId] = holdingStates
	}

	return out, nil
}
