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
	date      time.Time
	holdingID uuid.UUID

	qty                  decimal.Decimal
	avgOriginalUnitPrice decimal.Decimal
	avgGbpUnitPrice      decimal.Decimal

	qtyMatched decimal.Decimal
	matches    []CapitalEventMatch
}

func (ce CapitalEvent) availableToMatch() decimal.Decimal {
	// note: we need the absolute value of the event, because disposals are negative
	out, err := ce.qty.Abs().Sub(ce.qtyMatched)
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

type CaptialS104Pot struct {
	qty       decimal.Decimal
	unitPrice decimal.Decimal
}

func (c *Core) getCaptialReportForTaxReport(ctx context.Context, profile schema.Profile, startDate time.Time, endDate time.Time) ([]schema.TaxReportCapitalEvent, error) {
	// share matching and S104 pots don't are about tax year bounaries, so we need to
	// get the full history and build the full report, then return the events for the
	// year in question

	transactions, err := c.DB.GetTaxableCapitalTransactions(ctx, profile.ID)
	if err != nil {
		return nil, err
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

	events, err := c.convertCapitalTransactionsToEvents(ctx, transactions)
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

	for d := range events {
		disposal := &events[d]

		// is this actually a disposal?
		if !disposal.qty.IsNeg() {
			continue
		}

		// is there any work to do?
		if disposal.availableToMatch().IsZero() {
			continue
		}

		for a := range events {
			acquisition := &events[a]

			// is this actually an acqisition?
			if !acquisition.qty.IsPos() {
				continue
			}

			// is there any work to do?
			if acquisition.availableToMatch().IsZero() {
				continue
			}

			// is it for the right holding?
			if acquisition.holdingID != disposal.holdingID {
				continue
			}

			// is it for the right date?
			if acquisition.date != disposal.date {
				continue
			}

			// are we already past any potential same-day matches?
			if acquisition.date.After(disposal.date) {
				break
			}

			// ok, we actually have a match
			err := matchCapitalEvents(events, d, a, "Same-day")
			if err != nil {
				return nil, err
			}
		}
	}

	/*
		Step 3: as above, but now we match disposals against acquisitions in the following 30 days.

		---

		Disposals must be identified with acquisitions of shares of the same class,
		acquired by the same person in the same capacity, and acquired within the 30 days
		after the disposal.

		This rule has priority over all other identification rules except the 'same day'
		rule in TCGA92/S105(1).
	*/

	for d := range events {
		disposal := &events[d]

		// is this actually a disposal?
		if !disposal.qty.IsNeg() {
			continue
		}

		// is there any work to do?
		if disposal.availableToMatch().IsZero() {
			continue
		}

		for a := range events {
			acquisition := &events[a]

			// is this actually an acqisition?
			if !acquisition.qty.IsPos() {
				continue
			}

			// is there any work to do?
			if acquisition.availableToMatch().IsZero() {
				continue
			}

			// is it for the right holding?
			if acquisition.holdingID != disposal.holdingID {
				continue
			}

			// is it for the right date?
			daysAfterDisposal := acquisition.date.Sub(disposal.date).Hours() / 24
			if daysAfterDisposal < 0 {
				continue
			} else if daysAfterDisposal > 30 {
				break
			}

			// ok, we actually have a match
			err := matchCapitalEvents(events, d, a, "B&B")
			if err != nil {
				return nil, err
			}
		}
	}

	/*
		Step 4: walk through all remaining acquisitions and disposals and count them
		against the S104 pot.
	*/

	holdings, err := c.GetAllHoldingsAsMap(ctx, profile)
	if err != nil {
		return nil, err
	}

	pots := make(map[uuid.UUID]CaptialS104Pot, 0)

	for e := range events {
		event := &events[e]

		// is there any work to do?
		if event.availableToMatch().IsZero() {
			continue
		}

		pot, ok := pots[event.holdingID]
		if !ok {
			pots[event.holdingID] = CaptialS104Pot{}
		}

		// handle acquisitions - add them to the pot
		if event.qty.IsPos() {
			currentPotValue, err := pot.qty.Mul(pot.unitPrice)
			if err != nil {
				return nil, err
			}

			availableEventValue, err := event.availableToMatch().Mul(event.avgGbpUnitPrice)
			if err != nil {
				return nil, err
			}

			newPotQty, err := pot.qty.Add(event.availableToMatch())
			if err != nil {
				return nil, err
			}

			newPotValue, err := currentPotValue.Add(availableEventValue)
			if err != nil {
				return nil, err
			}

			newPotUnitPrice, err := newPotValue.Quo(newPotQty)
			if err != nil {
				return nil, err
			}

			pot.qty = newPotQty
			pot.unitPrice = newPotUnitPrice

			event.matches = append(event.matches, CapitalEventMatch{
				qty:   event.availableToMatch(),
				date:  time.Unix(0, 0),
				price: event.avgGbpUnitPrice,
				note:  "S104",
			})
		}

		// handle disposals - match them against the pot and decrease the pot size
		if event.qty.IsNeg() {
			newPotQty, err := pot.qty.Sub(event.availableToMatch())
			if err != nil {
				return nil, err
			}

			if newPotQty.IsNeg() {
				return nil, fmt.Errorf("S104 pot has gone negaive - this should not happen")
			}

			pot.qty = newPotQty

			event.matches = append(event.matches, CapitalEventMatch{
				qty:   event.availableToMatch(),
				date:  time.Unix(0, 0),
				price: pot.unitPrice,
				note:  "S104",
			})
		}

		// we used all remaining units, so we know these two are equal now
		event.qtyMatched = event.qty.Abs()

		pots[event.holdingID] = pot
	}

	// rebuild result

	out := make([]schema.TaxReportCapitalEvent, 0)

	for _, event := range events {
		if event.date.Before(startDate) || event.date.After(endDate) {
			continue
		}

		holding, ok := holdings[event.holdingID]
		if !ok {
			return nil, fmt.Errorf("unknown holding: %v", event.holdingID)
		}

		var eventType string
		if event.qty.IsNeg() {
			eventType = "disposal"
		} else {
			eventType = "acquisition"
		}

		outputEvent := schema.TaxReportCapitalEvent{
			Holding:              holding,
			Type:                 eventType,
			Date:                 event.date,
			Qty:                  event.qty,
			AvgOriginalUnitPrice: event.avgOriginalUnitPrice,
			AvgGbpUnitPrice:      event.avgGbpUnitPrice,
			QtyMatched:           event.qtyMatched,
		}

		for _, m := range event.matches {
			outputEvent.Matches = append(outputEvent.Matches, schema.TaxReportCapitalEventMatch{
				Qty:   m.qty,
				Date:  m.date,
				Price: m.price,
				Note:  m.note,
			})
		}

		sort.Slice(outputEvent.Matches, func(i, j int) bool {
			// always sort the 0-time S104 matches last
			if outputEvent.Matches[i].Date.Unix() == 0 {
				return false
			}

			// otherwise, sort by date as normal
			return outputEvent.Matches[i].Date.Before(outputEvent.Matches[j].Date)
		})

		out = append(out, outputEvent)
	}

	return out, nil
}

func truncateToDay(t time.Time) time.Time {
	return time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, t.Location())
}

func (c *Core) convertCapitalTransactionsToEvents(ctx context.Context, txns []schema.Transaction) ([]CapitalEvent, error) {
	makeKey := func(txn schema.Transaction) string {
		// this method is effectively the "group by" clause for merging transactions into events
		return fmt.Sprintf("%v/%v/%v", txn.Holding.ID, truncateToDay(txn.Date), txn.Amount.Sign())
	}

	type MergeState struct {
		date               time.Time
		holdingID          uuid.UUID
		qty                decimal.Decimal
		totalOriginalValue decimal.Decimal
		totalGbpValue      decimal.Decimal
	}

	mergeStates := make(map[string]MergeState, 0)

	for _, t := range txns {
		tDate := truncateToDay(t.Date)
		key := makeKey(t)

		mergeState, ok := mergeStates[key]
		if !ok {
			mergeState = MergeState{
				date:               tDate,
				holdingID:          t.Holding.ID,
				qty:                decimal.Zero,
				totalOriginalValue: decimal.Zero,
			}
		}

		// qty is easy - just add them up

		qty, err := mergeState.qty.Add(t.Amount)
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

		totalOriginalValue, err := mergeState.totalOriginalValue.Add(originalValue)
		if err != nil {
			return nil, err
		}

		totalGbpValue, err := mergeState.totalGbpValue.Add(gbpValue)
		if err != nil {
			return nil, err
		}

		// store the new merge state

		mergeState.qty = qty
		mergeState.totalOriginalValue = totalOriginalValue
		mergeState.totalGbpValue = totalGbpValue

		mergeStates[key] = mergeState
	}

	out := make([]CapitalEvent, 0)

	for _, mergedState := range mergeStates {
		avgOriginalUnitPrice, err := mergedState.totalOriginalValue.Quo(mergedState.qty)
		if err != nil {
			return nil, err
		}

		avgGbpUnitPrice, err := mergedState.totalGbpValue.Quo(mergedState.qty)
		if err != nil {
			return nil, err
		}

		out = append(out, CapitalEvent{
			date:                 mergedState.date,
			holdingID:            mergedState.holdingID,
			qty:                  mergedState.qty,
			avgOriginalUnitPrice: avgOriginalUnitPrice,
			avgGbpUnitPrice:      avgGbpUnitPrice,
		})
	}

	sort.Slice(out, func(a, b int) bool {
		return out[a].date.Before(out[b].date)
	})

	return out, nil
}

func matchCapitalEvents(events []CapitalEvent, disposalId int, acquisitionId int, note string) error {
	disposal := &events[disposalId]
	acquisition := &events[acquisitionId]

	var qtyMatched decimal.Decimal
	if acquisition.availableToMatch().Cmp(disposal.availableToMatch()) < 0 {
		qtyMatched = acquisition.availableToMatch()
	} else {
		qtyMatched = disposal.availableToMatch()
	}

	if qtyMatched.IsZero() {
		return nil
	}

	// work out the new matched quantities for each side
	disposalTotalMatched, err := disposal.qtyMatched.Add(qtyMatched)
	if err != nil {
		return err
	}
	disposal.qtyMatched = disposalTotalMatched

	acquisitionTotalMatched, err := acquisition.qtyMatched.Add(qtyMatched)
	if err != nil {
		return err
	}
	acquisition.qtyMatched = acquisitionTotalMatched

	// append match records
	disposal.matches = append(disposal.matches, CapitalEventMatch{
		qty:   qtyMatched,
		date:  acquisition.date,
		price: acquisition.avgGbpUnitPrice,
		note:  note,
	})

	acquisition.matches = append(acquisition.matches, CapitalEventMatch{
		qty:  qtyMatched,
		date: disposal.date,
		note: note,
	})

	return nil
}
