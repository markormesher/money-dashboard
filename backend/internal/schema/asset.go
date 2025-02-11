package schema

import (
	"fmt"
	"time"
	"unicode/utf8"

	"github.com/google/uuid"
	"github.com/govalues/decimal"
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

type AssetPrice struct {
	ID      uuid.UUID
	AssetID uuid.UUID
	Date    time.Time
	Price   decimal.Decimal
}

func (p *AssetPrice) Validate() error {
	if p.Date.After(time.Now()) {
		return fmt.Errorf("asset price must not be in the future")
	}

	if p.Date.Before(PlatformMinimumDate) {
		return fmt.Errorf("asset price must not be before the platform minimum date")
	}

	if p.Price.IsNeg() {
		return fmt.Errorf("asset price must be greater than 0")
	}

	return nil
}
