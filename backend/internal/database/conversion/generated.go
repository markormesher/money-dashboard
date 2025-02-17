// Code generated by github.com/jmattheis/goverter, DO NOT EDIT.
//go:build !goverter

package conversion

import (
	uuid "github.com/google/uuid"
	decimal "github.com/govalues/decimal"
	databasegen "github.com/markormesher/money-dashboard/internal/database_gen"
	schema "github.com/markormesher/money-dashboard/internal/schema"
	"time"
)

func AccountToCore(source databasegen.Account) schema.Account {
	var schemaAccount schema.Account
	schemaAccount.ID = source.ID
	schemaAccount.Name = source.Name
	schemaAccount.Notes = source.Notes
	schemaAccount.IsIsa = source.IsIsa
	schemaAccount.IsPension = source.IsPension
	schemaAccount.ExcludeFromEnvelopes = source.ExcludeFromEnvelopes
	schemaAccount.Active = source.Active
	return schemaAccount
}
func AssetPriceToCore(source databasegen.AssetPrice) schema.AssetPrice {
	var schemaAssetPrice schema.AssetPrice
	schemaAssetPrice.ID = uuidUUIDToUuidUUID(source.ID)
	schemaAssetPrice.AssetID = uuidUUIDToUuidUUID(source.AssetID)
	schemaAssetPrice.Date = timeTimeToTimeTime(source.Date)
	schemaAssetPrice.Price = decimalDecimalToDecimalDecimal(source.Price)
	return schemaAssetPrice
}
func AssetToCore(source databasegen.Asset) schema.Asset {
	var schemaAsset schema.Asset
	schemaAsset.ID = uuidUUIDToUuidUUID(source.ID)
	schemaAsset.Name = source.Name
	schemaAsset.Notes = source.Notes
	schemaAsset.DisplayPrecision = source.DisplayPrecision
	schemaAsset.CalculationPrecision = source.CalculationPrecision
	schemaAsset.Active = source.Active
	return schemaAsset
}
func CategoryToCore(source databasegen.Category) schema.Category {
	var schemaCategory schema.Category
	schemaCategory.ID = uuidUUIDToUuidUUID(source.ID)
	schemaCategory.Name = source.Name
	schemaCategory.IsMemo = source.IsMemo
	schemaCategory.IsInterestIncome = source.IsInterestIncome
	schemaCategory.IsDividendIncome = source.IsDividendIncome
	schemaCategory.IsCapitalAcquisition = source.IsCapitalAcquisition
	schemaCategory.IsCapitalDisposal = source.IsCapitalDisposal
	schemaCategory.IsCapitalEventFee = source.IsCapitalEventFee
	schemaCategory.Active = source.Active
	return schemaCategory
}
func CurrencyRateToCore(source databasegen.CurrencyRate) schema.CurrencyRate {
	var schemaCurrencyRate schema.CurrencyRate
	schemaCurrencyRate.ID = uuidUUIDToUuidUUID(source.ID)
	schemaCurrencyRate.CurrencyID = uuidUUIDToUuidUUID(source.CurrencyID)
	schemaCurrencyRate.Date = source.Date
	schemaCurrencyRate.Rate = source.Rate
	return schemaCurrencyRate
}
func CurrencyToCore(source databasegen.Currency) schema.Currency {
	var schemaCurrency schema.Currency
	schemaCurrency.ID = uuidUUIDToUuidUUID(source.ID)
	schemaCurrency.Code = source.Code
	schemaCurrency.Symbol = source.Symbol
	schemaCurrency.DisplayPrecision = source.DisplayPrecision
	schemaCurrency.CalculationPrecision = source.CalculationPrecision
	schemaCurrency.Active = source.Active
	return schemaCurrency
}
func HoldingToCore(source databasegen.Holding) schema.Holding {
	var schemaHolding schema.Holding
	schemaHolding.ID = uuidUUIDToUuidUUID(source.ID)
	schemaHolding.Name = source.Name
	schemaHolding.Active = source.Active
	return schemaHolding
}
func NullableHoldingAssetToCore(source databasegen.NullableHoldingAsset) schema.Asset {
	var schemaAsset schema.Asset
	schemaAsset.ID = pUuidUUIDToUuidUUID(source.ID)
	schemaAsset.Name = ConvertPgTextToPrimitive(source.Name)
	schemaAsset.Notes = ConvertPgTextToPrimitive(source.Notes)
	schemaAsset.DisplayPrecision = ConvertPgIntToPrimitive(source.DisplayPrecision)
	schemaAsset.CalculationPrecision = ConvertPgIntToPrimitive(source.CalculationPrecision)
	schemaAsset.Active = ConvertPgBoolToPrimitive(source.Active)
	return schemaAsset
}
func NullableHoldingCurrencyToCore(source databasegen.NullableHoldingCurrency) schema.Currency {
	var schemaCurrency schema.Currency
	schemaCurrency.ID = pUuidUUIDToUuidUUID(source.ID)
	schemaCurrency.Code = ConvertPgTextToPrimitive(source.Code)
	schemaCurrency.Symbol = ConvertPgTextToPrimitive(source.Symbol)
	schemaCurrency.DisplayPrecision = ConvertPgIntToPrimitive(source.DisplayPrecision)
	schemaCurrency.CalculationPrecision = ConvertPgIntToPrimitive(source.CalculationPrecision)
	schemaCurrency.Active = ConvertPgBoolToPrimitive(source.Active)
	return schemaCurrency
}
func ProfileToCore(source databasegen.Profile) schema.Profile {
	var schemaProfile schema.Profile
	schemaProfile.ID = uuidUUIDToUuidUUID(source.ID)
	schemaProfile.Name = source.Name
	schemaProfile.Deleted = source.Deleted
	return schemaProfile
}
func TransactionToCore(source databasegen.Transaction) schema.Transaction {
	var schemaTransaction schema.Transaction
	schemaTransaction.ID = uuidUUIDToUuidUUID(source.ID)
	schemaTransaction.Date = timeTimeToTimeTime(source.Date)
	schemaTransaction.BudgetDate = timeTimeToTimeTime(source.BudgetDate)
	schemaTransaction.CreationDate = timeTimeToTimeTime(source.CreationDate)
	schemaTransaction.Payee = source.Payee
	schemaTransaction.Notes = source.Notes
	schemaTransaction.Amount = decimalDecimalToDecimalDecimal(source.Amount)
	schemaTransaction.UnitValue = decimalDecimalToDecimalDecimal(source.UnitValue)
	schemaTransaction.Deleted = source.Deleted
	return schemaTransaction
}
func UserProfileRoleToCore(source databasegen.UserProfileRole) schema.UserProfileRole {
	var schemaUserProfileRole schema.UserProfileRole
	schemaUserProfileRole.Role = source.Role
	return schemaUserProfileRole
}
func UserToCore(source databasegen.Usr) schema.User {
	var schemaUser schema.User
	schemaUser.ID = uuidUUIDToUuidUUID(source.ID)
	schemaUser.ExternalUsername = source.ExternalUsername
	schemaUser.DisplayName = source.DisplayName
	schemaUser.Deleted = source.Deleted
	return schemaUser
}
func decimalDecimalToDecimalDecimal(source decimal.Decimal) decimal.Decimal {
	return source
}
func pUuidUUIDToUuidUUID(source *uuid.UUID) uuid.UUID {
	var uuidUUID uuid.UUID
	if source != nil {
		uuidUUID = uuidUUIDToUuidUUID((*source))
	}
	return uuidUUID
}
func timeTimeToTimeTime(source time.Time) time.Time {
	return source
}
func uuidUUIDToUuidUUID(source uuid.UUID) uuid.UUID {
	return source
}
