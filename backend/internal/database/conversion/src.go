package conversion

import (
	"github.com/markormesher/money-dashboard/internal/database_gen"
	"github.com/markormesher/money-dashboard/internal/schema"
)

// goverter:converter
// goverter:output:format function
// goverter:output:file ./generated.go
// goverter:output:package github.com/markormesher/money-dashboard/internal/database/conversion
// goverter:matchIgnoreCase yes
// goverter:skipCopySameType yes
type converterSpec interface {
	// goverter:ignore ActiveProfileID
	UserFromCore(source schema.User) database_gen.Usr
	// goverter:ignore ActiveProfile
	UserToCore(source database_gen.Usr) schema.User

	ProfileFromCore(source schema.Profile) database_gen.Profile
	ProfileToCore(source database_gen.Profile) schema.Profile

	// goverter:ignore UserID ProfileID
	UserprofileRoleFromCore(source schema.UserProfileRole) database_gen.UserProfileRole
	// goverter:ignore User Profile
	UserprofileRoleToCore(source database_gen.UserProfileRole) schema.UserProfileRole

	CurrencyFromCore(source schema.Currency) database_gen.Currency
	CurrencyToCore(source database_gen.Currency) schema.Currency

	CurrencyRateFromCore(source schema.CurrencyRate) database_gen.CurrencyRate
	CurrencyRateToCore(source database_gen.CurrencyRate) schema.CurrencyRate
}
