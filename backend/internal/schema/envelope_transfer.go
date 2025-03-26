package schema

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/govalues/decimal"
)

type EnvelopeTransfer struct {
	ID           uuid.UUID
	Date         time.Time
	Amount       decimal.Decimal
	FromEnvelope *Envelope
	ToEnvelope   *Envelope
	Notes        string
	Profile      *Profile
	Deleted      bool
}

func (t *EnvelopeTransfer) Validate() error {
	if t.Date.Before(PlatformMinimumDate) {
		return fmt.Errorf("date must not be before the platform minimum date")
	}

	if t.Amount.IsZero() {
		return fmt.Errorf("the amount must not be zero")
	}

	if t.FromEnvelope == nil && t.ToEnvelope == nil {
		return fmt.Errorf("the to and from envelopes cannot both be blank")
	}

	return nil
}

type EnvelopeTransferPage struct {
	Total            int32
	FilteredTotal    int32
	FilteredEntities []EnvelopeTransfer
}
