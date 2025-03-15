package schema

import (
	"fmt"
	"unicode/utf8"

	"github.com/google/uuid"
)

type Envelope struct {
	ID      uuid.UUID
	Name    string
	Profile *Profile
	Active  bool
}

func (e *Envelope) Validate() error {
	if utf8.RuneCountInString(e.Name) < 1 {
		return fmt.Errorf("envelope name must be at least 1 character")
	}

	return nil
}
