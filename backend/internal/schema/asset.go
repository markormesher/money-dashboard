package schema

import (
	"fmt"
	"unicode/utf8"

	"github.com/google/uuid"
)

type Asset struct {
	ID                   uuid.UUID
	Name                 string
	Notes                string
	DisplayPrecision     int32
	CalculationPrecision int32
	Active               bool
	Currency             *Currency
}

func (a *Asset) Validate() error {
	if utf8.RuneCountInString(a.Name) < 1 {
		return fmt.Errorf("asset name must be at least 1 character")
	}

	if a.DisplayPrecision < 0 {
		return fmt.Errorf("asset display precision must be 0 or greater")
	}

	if a.CalculationPrecision < 0 {
		return fmt.Errorf("asset calculation precision must be 0 or greater")
	}

	if a.Currency == nil {
		return fmt.Errorf("asset currency must be selected")
	}

	return nil
}
