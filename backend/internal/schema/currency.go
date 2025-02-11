package schema

import (
	"fmt"
	"time"
	"unicode/utf8"

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
	if utf8.RuneCountInString(c.Code) < 2 || utf8.RuneCountInString(c.Code) > 6 {
		return fmt.Errorf("currency code must be between 2 and 6 characters")
	}

	if utf8.RuneCountInString(c.Symbol) < 1 || utf8.RuneCountInString(c.Symbol) > 2 {
		return fmt.Errorf("currency symbol must be between 2 and 6 characters")
	}

	if c.DisplayPrecision < 0 {
		return fmt.Errorf("currency display precision must be 0 or greater")
	}

	if c.CalculationPrecision < 0 {
		return fmt.Errorf("currency calculation precision must be 0 or greater")
	}

	return nil
}

type CurrencyRate struct {
	ID         uuid.UUID
	CurrencyID uuid.UUID
	Date       time.Time
	Rate       decimal.Decimal
}

func (r *CurrencyRate) Validate() error {
	if r.Date.After(time.Now()) {
		return fmt.Errorf("currency rate must not be in the future")
	}

	if r.Date.Before(PlatformMinimumDate) {
		return fmt.Errorf("currency rate must not be before the platform minimum date")
	}

	if r.Rate.IsNeg() {
		return fmt.Errorf("currency rate must be greater than 0")
	}

	return nil
}
