package schema

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/govalues/decimal"
)

type Rate struct {
	ID         uuid.UUID
	AssetID    uuid.UUID
	CurrencyID uuid.UUID
	Date       time.Time
	Rate       decimal.Decimal
}

func (r *Rate) Validate() error {
	if r.Date.After(time.Now()) {
		return fmt.Errorf("rate must not be in the future")
	}

	if r.Date.Before(PlatformMinimumDate) {
		return fmt.Errorf("rate must not be before the platform minimum date")
	}

	if r.Date.After(PlatformMaximumDate) {
		return fmt.Errorf("rate must not be after the platform maximum date")
	}

	if r.AssetID == uuid.Nil && r.CurrencyID == uuid.Nil {
		return fmt.Errorf("rate must specify an asset ID or currency ID")
	}

	if r.AssetID != uuid.Nil && r.CurrencyID != uuid.Nil {
		return fmt.Errorf("rate must not specify both an asset ID and currency ID")
	}

	if r.Rate.IsNeg() {
		return fmt.Errorf("rate must be greater than 0")
	}

	return nil
}
