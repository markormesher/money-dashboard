package conversion

import (
	mdv4 "github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4"
	"github.com/markormesher/money-dashboard/internal/schema"
)

// goverter:converter
// goverter:output:format function
// goverter:output:file ./generated.go
// goverter:output:package github.com/markormesher/money-dashboard/internal/api/conversion
// goverter:extend github.com/markormesher/money-dashboard/internal/uuidtools:ConvertStringUUIDToNormal
// goverter:extend github.com/markormesher/money-dashboard/internal/uuidtools:ConvertNormalUUIDToString
// goverter:matchIgnoreCase yes
type converterSpec interface {
	UserToCore(source *mdv4.User) *schema.User

	// goverter:ignore state sizeCache unknownFields
	UserFromCore(source schema.User) *mdv4.User
}
