package schema

import (
	"time"

	"github.com/google/uuid"
	"github.com/govalues/decimal"
)

type Currency struct {
	ID                   uuid.UUID
	Code                 string
	Symbol               string
	DisplayPrecision     int32
	CalculationPrecision int32
	Active               bool
}

func (c *Currency) Validate() error {
	// TODO
	return nil
}

type CurrencyRate struct {
	ID         uuid.UUID
	CurrencyID uuid.UUID
	Date       time.Time
	Rate       decimal.Decimal
}

func (c *CurrencyRate) Validate() error {
	// TODO
	return nil
}
