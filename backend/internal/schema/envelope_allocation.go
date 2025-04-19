package schema

import (
	"fmt"
	"time"

	"github.com/google/uuid"
)

type EnvelopeAllocation struct {
	ID        uuid.UUID
	StartDate time.Time
	Category  *Category
	Envelope  *Envelope
	Profile   *Profile
	Deleted   bool
}

func (a *EnvelopeAllocation) Validate() error {
	if a.StartDate.Before(PlatformMinimumDate) {
		return fmt.Errorf("start date must not be before the platform minimum date")
	}

	if a.StartDate.After(PlatformMaximumDate) {
		return fmt.Errorf("start date must not be after the platform maximum date")
	}

	if a.Category == nil {
		return fmt.Errorf("allocation must be linked to a category")
	}

	if a.Envelope == nil {
		return fmt.Errorf("allocation must be linked to an envelope")
	}

	return nil
}
