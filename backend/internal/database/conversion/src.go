package conversion

import (
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/markormesher/money-dashboard/internal/database_gen"
	"github.com/markormesher/money-dashboard/internal/schema"
)

// goverter:converter
// goverter:output:format function
// goverter:output:file ./generated.go
// goverter:output:package github.com/markormesher/money-dashboard/internal/database/conversion
// goverter:matchIgnoreCase yes
// goverter:ignoreUnexported yes
// goverter:ignoreMissing yes
// goverter:skipCopySameType yes
// goverter:useZeroValueOnPointerInconsistency yes
// goverter:extend ConvertPgTextToPrimitive
// goverter:extend ConvertPgIntToPrimitive
// goverter:extend ConvertPgBoolToPrimitive
type converterSpec interface {
	AccountToCore(source database_gen.Account) schema.Account

	AccountGroupToCore(source database_gen.AccountGroup) schema.AccountGroup

	AssetToCore(source database_gen.Asset) schema.Asset

	CategoryToCore(source database_gen.Category) schema.Category

	CurrencyToCore(source database_gen.Currency) schema.Currency

	HoldingToCore(source database_gen.Holding) schema.Holding

	NullableHoldingCurrencyToCore(source database_gen.NullableHoldingCurrency) schema.Currency

	NullableHoldingAssetToCore(source database_gen.NullableHoldingAsset) schema.Asset

	NullableHoldingAssetCurrencyToCore(source database_gen.NullableHoldingAssetCurrency) schema.Currency

	ProfileToCore(source database_gen.Profile) schema.Profile

	RateToCore(source database_gen.Rate) schema.Rate

	TransactionToCore(source database_gen.Transaction) schema.Transaction

	UserToCore(source database_gen.Usr) schema.User

	UserProfileRoleToCore(source database_gen.UserProfileRole) schema.UserProfileRole
}

// utility methods to convert between db and core types

func ConvertPgTextToPrimitive(v pgtype.Text) string {
	return v.String
}

func ConvertPgIntToPrimitive(v pgtype.Int4) int32 {
	return v.Int32
}

func ConvertPgBoolToPrimitive(v pgtype.Bool) bool {
	return v.Bool
}
