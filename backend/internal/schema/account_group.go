package schema

import (
	"fmt"
	"unicode/utf8"

	"github.com/google/uuid"
)

type AccountGroup struct {
	ID           uuid.UUID
	Name         string
	DisplayOrder int32
	Profile      *Profile
}

func (g *AccountGroup) Validate() error {
	if utf8.RuneCountInString(g.Name) < 1 {
		return fmt.Errorf("account group name must be at least 1 character")
	}

	return nil
}
