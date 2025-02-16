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

	// goverter:ignore Currency
	AssetToCore(source database_gen.Asset) schema.Asset

	// goverter:ignore Profile
	AccountToCore(source database_gen.Account) schema.Account

	AssetPriceToCore(source database_gen.AssetPrice) schema.AssetPrice

	// goverter:ignore Profile
	CategoryToCore(source database_gen.Category) schema.Category

	CurrencyToCore(source database_gen.Currency) schema.Currency

	CurrencyRateToCore(source database_gen.CurrencyRate) schema.CurrencyRate

	// goverter:ignore Currency Asset Account Profile
	HoldingToCore(source database_gen.Holding) schema.Holding

	ProfileToCore(source database_gen.Profile) schema.Profile

	// goverter:ignore ActiveProfile
	UserToCore(source database_gen.Usr) schema.User

	// goverter:ignore User Profile
	UserProfileRoleToCore(source database_gen.UserProfileRole) schema.UserProfileRole
}
