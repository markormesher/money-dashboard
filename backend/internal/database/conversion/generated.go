// Code generated by github.com/jmattheis/goverter, DO NOT EDIT.
//go:build !goverter

package conversion

import (
	uuid "github.com/google/uuid"
	databasegen "github.com/markormesher/money-dashboard/internal/database_gen"
	schema "github.com/markormesher/money-dashboard/internal/schema"
)

func CurrencyFromCore(source schema.Currency) databasegen.Currency {
	var database_genCurrency databasegen.Currency
	database_genCurrency.ID = source.ID
	database_genCurrency.Code = source.Code
	database_genCurrency.Symbol = source.Symbol
	database_genCurrency.DisplayPrecision = source.DisplayPrecision
	database_genCurrency.Active = source.Active
	database_genCurrency.CalculationPrecision = source.CalculationPrecision
	return database_genCurrency
}
func CurrencyRateFromCore(source schema.CurrencyRate) databasegen.CurrencyRate {
	var database_genCurrencyRate databasegen.CurrencyRate
	database_genCurrencyRate.ID = uuidUUIDToUuidUUID(source.ID)
	database_genCurrencyRate.CurrencyID = uuidUUIDToUuidUUID(source.CurrencyID)
	database_genCurrencyRate.Date = source.Date
	database_genCurrencyRate.Rate = source.Rate
	return database_genCurrencyRate
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
func ProfileFromCore(source schema.Profile) databasegen.Profile {
	var database_genProfile databasegen.Profile
	database_genProfile.ID = uuidUUIDToUuidUUID(source.ID)
	database_genProfile.Name = source.Name
	database_genProfile.Deleted = source.Deleted
	return database_genProfile
}
func ProfileToCore(source databasegen.Profile) schema.Profile {
	var schemaProfile schema.Profile
	schemaProfile.ID = uuidUUIDToUuidUUID(source.ID)
	schemaProfile.Name = source.Name
	schemaProfile.Deleted = source.Deleted
	return schemaProfile
}
func UserFromCore(source schema.User) databasegen.Usr {
	var database_genUsr databasegen.Usr
	database_genUsr.ID = uuidUUIDToUuidUUID(source.ID)
	database_genUsr.ExternalUsername = source.ExternalUsername
	database_genUsr.DisplayName = source.DisplayName
	database_genUsr.Deleted = source.Deleted
	return database_genUsr
}
func UserToCore(source databasegen.Usr) schema.User {
	var schemaUser schema.User
	schemaUser.ID = uuidUUIDToUuidUUID(source.ID)
	schemaUser.ExternalUsername = source.ExternalUsername
	schemaUser.DisplayName = source.DisplayName
	schemaUser.Deleted = source.Deleted
	return schemaUser
}
func UserprofileRoleFromCore(source schema.UserProfileRole) databasegen.UserProfileRole {
	var database_genUserProfileRole databasegen.UserProfileRole
	database_genUserProfileRole.Role = source.Role
	return database_genUserProfileRole
}
func UserprofileRoleToCore(source databasegen.UserProfileRole) schema.UserProfileRole {
	var schemaUserProfileRole schema.UserProfileRole
	schemaUserProfileRole.Role = source.Role
	return schemaUserProfileRole
}
func uuidUUIDToUuidUUID(source uuid.UUID) uuid.UUID {
	return source
}
