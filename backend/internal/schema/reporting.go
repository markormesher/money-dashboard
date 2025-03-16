package schema

import "github.com/govalues/decimal"

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
