package conversion

import (
	"github.com/markormesher/money-dashboard/internal/database_gen"
	"github.com/markormesher/money-dashboard/internal/schema"
)

// goverter:converter
// goverter:output:format function
// goverter:output:file ./generated.go
// goverter:output:package github.com/markormesher/money-dashboard/internal/database/conversion
// goverter:extend github.com/markormesher/money-dashboard/internal/uuidtools:ConvertPostgresUUIDToNormal
// goverter:extend github.com/markormesher/money-dashboard/internal/uuidtools:ConvertNormalUUIDToPostgres
// goverter:matchIgnoreCase yes
type converterSpec interface {
	UserToCore(source database_gen.Usr) schema.User
	UserFromCore(source schema.User) database_gen.Usr
}
