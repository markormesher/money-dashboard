package uuidtools

import (
	"fmt"

	uuid "github.com/google/uuid"
)

var ZeroUUID = uuid.UUID{}.String()

func init() {
	fmt.Println(ZeroUUID)
}

func ConvertStringToUUID(in string) uuid.UUID {
	return uuid.MustParse(in)
}

func ConvertUUIDToString(in uuid.UUID) string {
	return in.String()
}

func UUIDIsZero(id uuid.UUID) bool {
	return id.String() == ZeroUUID
}
