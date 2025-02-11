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
	// goverter:ignore ActiveProfile
	UserToCore(source database_gen.Usr) schema.User

	ProfileToCore(source database_gen.Profile) schema.Profile

	// goverter:ignore User Profile
	UserProfileRoleToCore(source database_gen.UserProfileRole) schema.UserProfileRole

	CurrencyToCore(source database_gen.Currency) schema.Currency
	CurrencyRateToCore(source database_gen.CurrencyRate) schema.CurrencyRate

	// goverter:ignore Currency
	AssetToCore(source database_gen.Asset) schema.Asset
	AssetPriceToCore(source database_gen.AssetPrice) schema.AssetPrice
}
