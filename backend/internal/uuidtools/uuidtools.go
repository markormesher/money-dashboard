package uuidtools

import (
	"encoding/hex"
	"fmt"

	uuid "github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

const ZeroUUID = "00000000-0000-0000-0000-000000000000"

func ConvertPostgresUUIDToNormal(in pgtype.UUID) uuid.UUID {
	return ConvertStringUUIDToNormal(in.String())
}

func ConvertNormalUUIDToPostgres(in uuid.UUID) pgtype.UUID {
	src := in.String()
	src = src[0:8] + src[9:13] + src[14:18] + src[19:23] + src[24:]

	buf, err := hex.DecodeString(src)
	if err != nil {
		panic(fmt.Sprintf("illegal UUID input: '%s'", src))
	}

	dst := [16]byte{}
	copy(dst[:], buf)

	return pgtype.UUID{
		Bytes: dst,
		Valid: true,
	}
}

func ConvertStringUUIDToNormal(in string) uuid.UUID {
	return uuid.MustParse(in)
}

func ConvertNormalUUIDToString(in uuid.UUID) string {
	return in.String()
}

func UUIDIsZero(id uuid.UUID) bool {
	return id.String() == ZeroUUID
}
