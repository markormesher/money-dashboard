package schema

import (
	"fmt"
	"unicode/utf8"

	"github.com/google/uuid"
)

type Profile struct {
	ID      uuid.UUID
	Name    string
	Deleted bool
}

type UserProfileRole struct {
	User    *User
	Profile *Profile
	Role    string
}

func (p *Profile) Validate() error {
	if utf8.RuneCountInString(p.Name) < 1 {
		return fmt.Errorf("profile name must be set")
	}

	return nil
}
