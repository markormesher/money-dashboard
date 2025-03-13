package schema

import (
	"fmt"
	"unicode/utf8"

	"github.com/google/uuid"
)

type Account struct {
	ID                   uuid.UUID
	Name                 string
	Notes                string
	IsIsa                bool
	IsPension            bool
	ExcludeFromEnvelopes bool
	AccountGroup         *AccountGroup
	Profile              *Profile
	Active               bool
}

func (a *Account) Validate() error {
	if utf8.RuneCountInString(a.Name) < 1 {
		return fmt.Errorf("account name must be at least 1 character")
	}

	if a.IsIsa && a.IsPension {
		return fmt.Errorf("account cannot be both an ISA and a pension")
	}

	return nil
}
