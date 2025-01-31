package schema

import (
	"github.com/google/uuid"
)

type User struct {
	ID               uuid.UUID
	ExternalUsername string
	DisplayName      string
	Deleted          bool
	ActiveProfile    *Profile
}

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
