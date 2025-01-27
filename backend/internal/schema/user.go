package schema

import (
	"github.com/google/uuid"
)

type User struct {
	ID               uuid.UUID
	ExternalUsername string
	DisplayName      string
	Deleted          bool
}
