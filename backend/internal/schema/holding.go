package schema

import (
	"fmt"
	"unicode/utf8"

	"github.com/google/uuid"
)

type Holding struct {
	ID       uuid.UUID
	Name     string
	Currency *Currency
	Asset    *Asset
	Account  *Account
	Profile  *Profile
	Active   bool
}

func (h *Holding) Validate() error {
	if utf8.RuneCountInString(h.Name) < 1 {
		return fmt.Errorf("holding name must be at least 1 character")
	}

	if h.Currency != nil && h.Asset != nil {
		return fmt.Errorf("holding cannot be linked to both a currency and an asset")
	}

	if h.Account == nil {
		return fmt.Errorf("holding must be linked to an account")
	}

	return nil
}
