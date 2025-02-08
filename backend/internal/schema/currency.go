package schema

import (
	"time"

	"github.com/google/uuid"
)

type Currency struct {
	ID            uuid.UUID
	Code          string
	Symbol        string
	DecimalPlaces int32
	Deleted       bool
}

type CurrencyValue struct {
	ID       uuid.UUID
	Date     time.Time
	Value    float64
	Currency *Currency
}
