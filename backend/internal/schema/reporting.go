package schema

import (
	"time"

	"github.com/govalues/decimal"
)

// SummaryBalance stores a balance groups by category, holding or both. If per-holding, asset/currency will be populated.
type SummaryBalance struct {
	Category *Category

	Holding  *Holding
	Asset    *Asset
	Currency *Currency

	RawBalance decimal.Decimal
	GbpBalance decimal.Decimal
}

type EnvelopeBalance struct {
	Envelope   Envelope
	GbpBalance decimal.Decimal
}

type BalanceHistoryEntry struct {
	Date       time.Time
	GbpBalance decimal.Decimal
}

type TaxReport struct {
	InterestIncome       []SummaryBalance
	DividendIncome       []SummaryBalance
	PensionContributions []SummaryBalance
	CapitalEvents        []TaxReportCapitalEvent
	S104Balances         []TaxReportS104Balance
}

type TaxReportCapitalEvent struct {
	Holding              Holding
	Type                 string
	Date                 time.Time
	Qty                  decimal.Decimal
	AvgOriginalUnitPrice decimal.Decimal
	AvgGbpUnitPrice      decimal.Decimal
	QtyMatched           decimal.Decimal
	Matches              []TaxReportCapitalEventMatch
}

type TaxReportCapitalEventMatch struct {
	Qty   decimal.Decimal
	Date  time.Time
	Price decimal.Decimal
	Note  string
}

type TaxReportS104Balance struct {
	Holding         Holding
	Qty             decimal.Decimal
	AvgGbpUnitPrice decimal.Decimal
}
