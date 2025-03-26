package schema

import (
	"fmt"
	"unicode/utf8"

	"github.com/google/uuid"
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
