package uuidtools

import (
	uuid "github.com/google/uuid"
)

var ZeroUUID = uuid.UUID{}.String()

func UUIDIsZero(id uuid.UUID) bool {
	return id.String() == ZeroUUID
}
