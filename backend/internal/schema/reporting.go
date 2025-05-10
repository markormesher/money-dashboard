package schema

import (
	"time"

	"github.com/govalues/decimal"
)

type HoldingBalance struct {
	Holding    Holding
	RawBalance decimal.Decimal
	GbpBalance decimal.Decimal
}

type CategoryBalance struct {
	Category   Category
	Asset      *Asset
	Currency   *Currency
	RawBalance decimal.Decimal
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
	InterestIncome []HoldingBalance
	DividendIncome []HoldingBalance
}
