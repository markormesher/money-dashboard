package schema

import (
	"fmt"
	"unicode/utf8"

	"github.com/google/uuid"
)

type Category struct {
	ID                   uuid.UUID
	Name                 string
	IsMemo               bool
	IsInterestIncome     bool
	IsDividendIncome     bool
	IsCapitalAcquisition bool
	IsCapitalDisposal    bool
	IsCapitalEventFee    bool
	Profile              *Profile
	Active               bool
}

func (c *Category) Validate() error {
	if utf8.RuneCountInString(c.Name) < 1 {
		return fmt.Errorf("category name must be at least 1 character")
	}

	// TODO: feature combos

	return nil
}
