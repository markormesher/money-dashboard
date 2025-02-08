package conversion

import (
	mdv4 "github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4"
	"github.com/markormesher/money-dashboard/internal/schema"
)

// goverter:converter
// goverter:output:format function
// goverter:output:file ./generated.go
// goverter:output:package github.com/markormesher/money-dashboard/internal/api/conversion
// goverter:extend github.com/markormesher/money-dashboard/internal/uuidtools:ConvertUUIDToString
// goverter:extend github.com/markormesher/money-dashboard/internal/uuidtools:ConvertStringToUUID
// goverter:matchIgnoreCase yes
// goverter:ignoreUnexported yes
// goverter:useZeroValueOnPointerInconsistency yes
type converterSpec interface {
	UserFromCore(source schema.User) *mdv4.User
	UserToCore(source *mdv4.User) schema.User

	ProfileFromCore(source schema.Profile) *mdv4.Profile
	ProfileToCore(source *mdv4.Profile) schema.Profile

	CurrencyFromCore(source schema.Currency) *mdv4.Currency
	CurrencyToCore(source *mdv4.Currency) schema.Currency
}
