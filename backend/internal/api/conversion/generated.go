// Code generated by github.com/jmattheis/goverter, DO NOT EDIT.
//go:build !goverter

package conversion

import (
	v4 "github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4"
	schema "github.com/markormesher/money-dashboard/internal/schema"
)

func AccountFromCore(source schema.Account) *v4.Account {
	var mdv4Account v4.Account
	mdv4Account.Id = ConvertUUIDToString(source.ID)
	mdv4Account.Name = source.Name
	mdv4Account.Notes = source.Notes
	mdv4Account.IsIsa = source.IsIsa
	mdv4Account.IsPension = source.IsPension
	mdv4Account.ExcludeFromEnvelopes = source.ExcludeFromEnvelopes
	mdv4Account.Active = source.Active
	mdv4Account.Profile = pSchemaProfileToPMdv4Profile(source.Profile)
	return &mdv4Account
}
func AccountToCore(source *v4.Account) schema.Account {
	var schemaAccount schema.Account
	if source != nil {
		var schemaAccount2 schema.Account
		schemaAccount2.ID = ConvertStringToUUID((*source).Id)
		schemaAccount2.Name = (*source).Name
		schemaAccount2.Notes = (*source).Notes
		schemaAccount2.IsIsa = (*source).IsIsa
		schemaAccount2.IsPension = (*source).IsPension
		schemaAccount2.ExcludeFromEnvelopes = (*source).ExcludeFromEnvelopes
		schemaAccount2.Profile = pMdv4ProfileToPSchemaProfile((*source).Profile)
		schemaAccount2.Active = (*source).Active
		schemaAccount = schemaAccount2
	}
	return schemaAccount
}
func AssetFromCore(source schema.Asset) *v4.Asset {
	var mdv4Asset v4.Asset
	mdv4Asset.Id = ConvertUUIDToString(source.ID)
	mdv4Asset.Name = source.Name
	mdv4Asset.Notes = source.Notes
	mdv4Asset.DisplayPrecision = source.DisplayPrecision
	mdv4Asset.CalculationPrecision = source.CalculationPrecision
	mdv4Asset.Active = source.Active
	mdv4Asset.Currency = pSchemaCurrencyToPMdv4Currency(source.Currency)
	return &mdv4Asset
}
func AssetPriceFromCore(source schema.AssetPrice) *v4.AssetPrice {
	var mdv4AssetPrice v4.AssetPrice
	mdv4AssetPrice.Id = ConvertUUIDToString(source.ID)
	mdv4AssetPrice.AssetId = ConvertUUIDToString(source.AssetID)
	mdv4AssetPrice.Date = ConvertTimeToInt(source.Date)
	mdv4AssetPrice.Price = ConvertDecimalToFloat(source.Price)
	return &mdv4AssetPrice
}
func AssetPriceToCore(source *v4.AssetPrice) schema.AssetPrice {
	var schemaAssetPrice schema.AssetPrice
	if source != nil {
		var schemaAssetPrice2 schema.AssetPrice
		schemaAssetPrice2.ID = ConvertStringToUUID((*source).Id)
		schemaAssetPrice2.AssetID = ConvertStringToUUID((*source).AssetId)
		schemaAssetPrice2.Date = ConvertIntToTime((*source).Date)
		schemaAssetPrice2.Price = ConvertFloatToDecimal((*source).Price)
		schemaAssetPrice = schemaAssetPrice2
	}
	return schemaAssetPrice
}
func AssetToCore(source *v4.Asset) schema.Asset {
	var schemaAsset schema.Asset
	if source != nil {
		var schemaAsset2 schema.Asset
		schemaAsset2.ID = ConvertStringToUUID((*source).Id)
		schemaAsset2.Name = (*source).Name
		schemaAsset2.Notes = (*source).Notes
		schemaAsset2.DisplayPrecision = (*source).DisplayPrecision
		schemaAsset2.CalculationPrecision = (*source).CalculationPrecision
		schemaAsset2.Active = (*source).Active
		schemaAsset2.Currency = pMdv4CurrencyToPSchemaCurrency((*source).Currency)
		schemaAsset = schemaAsset2
	}
	return schemaAsset
}
func CategoryFromCore(source schema.Category) *v4.Category {
	var mdv4Category v4.Category
	mdv4Category.Id = ConvertUUIDToString(source.ID)
	mdv4Category.Name = source.Name
	mdv4Category.IsMemo = source.IsMemo
	mdv4Category.IsInterestIncome = source.IsInterestIncome
	mdv4Category.IsDividendIncome = source.IsDividendIncome
	mdv4Category.IsCapitalAcquisition = source.IsCapitalAcquisition
	mdv4Category.IsCapitalDisposal = source.IsCapitalDisposal
	mdv4Category.IsCapitalEventFee = source.IsCapitalEventFee
	mdv4Category.Active = source.Active
	mdv4Category.Profile = pSchemaProfileToPMdv4Profile(source.Profile)
	return &mdv4Category
}
func CategoryToCore(source *v4.Category) schema.Category {
	var schemaCategory schema.Category
	if source != nil {
		var schemaCategory2 schema.Category
		schemaCategory2.ID = ConvertStringToUUID((*source).Id)
		schemaCategory2.Name = (*source).Name
		schemaCategory2.IsMemo = (*source).IsMemo
		schemaCategory2.IsInterestIncome = (*source).IsInterestIncome
		schemaCategory2.IsDividendIncome = (*source).IsDividendIncome
		schemaCategory2.IsCapitalAcquisition = (*source).IsCapitalAcquisition
		schemaCategory2.IsCapitalDisposal = (*source).IsCapitalDisposal
		schemaCategory2.IsCapitalEventFee = (*source).IsCapitalEventFee
		schemaCategory2.Profile = pMdv4ProfileToPSchemaProfile((*source).Profile)
		schemaCategory2.Active = (*source).Active
		schemaCategory = schemaCategory2
	}
	return schemaCategory
}
func CurrencyFromCore(source schema.Currency) *v4.Currency {
	var mdv4Currency v4.Currency
	mdv4Currency.Id = ConvertUUIDToString(source.ID)
	mdv4Currency.Code = source.Code
	mdv4Currency.Symbol = source.Symbol
	mdv4Currency.DisplayPrecision = source.DisplayPrecision
	mdv4Currency.CalculationPrecision = source.CalculationPrecision
	mdv4Currency.Active = source.Active
	return &mdv4Currency
}
func CurrencyRateFromCore(source schema.CurrencyRate) *v4.CurrencyRate {
	var mdv4CurrencyRate v4.CurrencyRate
	mdv4CurrencyRate.Id = ConvertUUIDToString(source.ID)
	mdv4CurrencyRate.CurrencyId = ConvertUUIDToString(source.CurrencyID)
	mdv4CurrencyRate.Date = ConvertTimeToInt(source.Date)
	mdv4CurrencyRate.Rate = ConvertDecimalToFloat(source.Rate)
	return &mdv4CurrencyRate
}
func CurrencyRateToCore(source *v4.CurrencyRate) schema.CurrencyRate {
	var schemaCurrencyRate schema.CurrencyRate
	if source != nil {
		var schemaCurrencyRate2 schema.CurrencyRate
		schemaCurrencyRate2.ID = ConvertStringToUUID((*source).Id)
		schemaCurrencyRate2.CurrencyID = ConvertStringToUUID((*source).CurrencyId)
		schemaCurrencyRate2.Date = ConvertIntToTime((*source).Date)
		schemaCurrencyRate2.Rate = ConvertFloatToDecimal((*source).Rate)
		schemaCurrencyRate = schemaCurrencyRate2
	}
	return schemaCurrencyRate
}
func CurrencyToCore(source *v4.Currency) schema.Currency {
	var schemaCurrency schema.Currency
	if source != nil {
		var schemaCurrency2 schema.Currency
		schemaCurrency2.ID = ConvertStringToUUID((*source).Id)
		schemaCurrency2.Code = (*source).Code
		schemaCurrency2.Symbol = (*source).Symbol
		schemaCurrency2.DisplayPrecision = (*source).DisplayPrecision
		schemaCurrency2.CalculationPrecision = (*source).CalculationPrecision
		schemaCurrency2.Active = (*source).Active
		schemaCurrency = schemaCurrency2
	}
	return schemaCurrency
}
func HoldingFromCore(source schema.Holding) *v4.Holding {
	var mdv4Holding v4.Holding
	mdv4Holding.Id = ConvertUUIDToString(source.ID)
	mdv4Holding.Name = source.Name
	mdv4Holding.Active = source.Active
	mdv4Holding.Currency = pSchemaCurrencyToPMdv4Currency(source.Currency)
	mdv4Holding.Asset = pSchemaAssetToPMdv4Asset(source.Asset)
	mdv4Holding.Account = pSchemaAccountToPMdv4Account(source.Account)
	mdv4Holding.Profile = pSchemaProfileToPMdv4Profile(source.Profile)
	return &mdv4Holding
}
func HoldingToCore(source *v4.Holding) schema.Holding {
	var schemaHolding schema.Holding
	if source != nil {
		var schemaHolding2 schema.Holding
		schemaHolding2.ID = ConvertStringToUUID((*source).Id)
		schemaHolding2.Name = (*source).Name
		schemaHolding2.Currency = pMdv4CurrencyToPSchemaCurrency((*source).Currency)
		schemaHolding2.Asset = pMdv4AssetToPSchemaAsset((*source).Asset)
		schemaHolding2.Account = pMdv4AccountToPSchemaAccount((*source).Account)
		schemaHolding2.Profile = pMdv4ProfileToPSchemaProfile((*source).Profile)
		schemaHolding2.Active = (*source).Active
		schemaHolding = schemaHolding2
	}
	return schemaHolding
}
func ProfileFromCore(source schema.Profile) *v4.Profile {
	var mdv4Profile v4.Profile
	mdv4Profile.Id = ConvertUUIDToString(source.ID)
	mdv4Profile.Name = source.Name
	mdv4Profile.Deleted = source.Deleted
	return &mdv4Profile
}
func ProfileToCore(source *v4.Profile) schema.Profile {
	var schemaProfile schema.Profile
	if source != nil {
		var schemaProfile2 schema.Profile
		schemaProfile2.ID = ConvertStringToUUID((*source).Id)
		schemaProfile2.Name = (*source).Name
		schemaProfile2.Deleted = (*source).Deleted
		schemaProfile = schemaProfile2
	}
	return schemaProfile
}
func UserFromCore(source schema.User) *v4.User {
	var mdv4User v4.User
	mdv4User.Id = ConvertUUIDToString(source.ID)
	mdv4User.ExternalUsername = source.ExternalUsername
	mdv4User.DisplayName = source.DisplayName
	mdv4User.Deleted = source.Deleted
	mdv4User.ActiveProfile = pSchemaProfileToPMdv4Profile(source.ActiveProfile)
	return &mdv4User
}
func UserToCore(source *v4.User) schema.User {
	var schemaUser schema.User
	if source != nil {
		var schemaUser2 schema.User
		schemaUser2.ID = ConvertStringToUUID((*source).Id)
		schemaUser2.ExternalUsername = (*source).ExternalUsername
		schemaUser2.DisplayName = (*source).DisplayName
		schemaUser2.Deleted = (*source).Deleted
		schemaUser2.ActiveProfile = pMdv4ProfileToPSchemaProfile((*source).ActiveProfile)
		schemaUser = schemaUser2
	}
	return schemaUser
}
func pMdv4AccountToPSchemaAccount(source *v4.Account) *schema.Account {
	var pSchemaAccount *schema.Account
	if source != nil {
		var schemaAccount schema.Account
		schemaAccount.ID = ConvertStringToUUID((*source).Id)
		schemaAccount.Name = (*source).Name
		schemaAccount.Notes = (*source).Notes
		schemaAccount.IsIsa = (*source).IsIsa
		schemaAccount.IsPension = (*source).IsPension
		schemaAccount.ExcludeFromEnvelopes = (*source).ExcludeFromEnvelopes
		schemaAccount.Profile = pMdv4ProfileToPSchemaProfile((*source).Profile)
		schemaAccount.Active = (*source).Active
		pSchemaAccount = &schemaAccount
	}
	return pSchemaAccount
}
func pMdv4AssetToPSchemaAsset(source *v4.Asset) *schema.Asset {
	var pSchemaAsset *schema.Asset
	if source != nil {
		var schemaAsset schema.Asset
		schemaAsset.ID = ConvertStringToUUID((*source).Id)
		schemaAsset.Name = (*source).Name
		schemaAsset.Notes = (*source).Notes
		schemaAsset.DisplayPrecision = (*source).DisplayPrecision
		schemaAsset.CalculationPrecision = (*source).CalculationPrecision
		schemaAsset.Active = (*source).Active
		schemaAsset.Currency = pMdv4CurrencyToPSchemaCurrency((*source).Currency)
		pSchemaAsset = &schemaAsset
	}
	return pSchemaAsset
}
func pMdv4CurrencyToPSchemaCurrency(source *v4.Currency) *schema.Currency {
	var pSchemaCurrency *schema.Currency
	if source != nil {
		var schemaCurrency schema.Currency
		schemaCurrency.ID = ConvertStringToUUID((*source).Id)
		schemaCurrency.Code = (*source).Code
		schemaCurrency.Symbol = (*source).Symbol
		schemaCurrency.DisplayPrecision = (*source).DisplayPrecision
		schemaCurrency.CalculationPrecision = (*source).CalculationPrecision
		schemaCurrency.Active = (*source).Active
		pSchemaCurrency = &schemaCurrency
	}
	return pSchemaCurrency
}
func pMdv4ProfileToPSchemaProfile(source *v4.Profile) *schema.Profile {
	var pSchemaProfile *schema.Profile
	if source != nil {
		var schemaProfile schema.Profile
		schemaProfile.ID = ConvertStringToUUID((*source).Id)
		schemaProfile.Name = (*source).Name
		schemaProfile.Deleted = (*source).Deleted
		pSchemaProfile = &schemaProfile
	}
	return pSchemaProfile
}
func pSchemaAccountToPMdv4Account(source *schema.Account) *v4.Account {
	var pMdv4Account *v4.Account
	if source != nil {
		var mdv4Account v4.Account
		mdv4Account.Id = ConvertUUIDToString((*source).ID)
		mdv4Account.Name = (*source).Name
		mdv4Account.Notes = (*source).Notes
		mdv4Account.IsIsa = (*source).IsIsa
		mdv4Account.IsPension = (*source).IsPension
		mdv4Account.ExcludeFromEnvelopes = (*source).ExcludeFromEnvelopes
		mdv4Account.Active = (*source).Active
		mdv4Account.Profile = pSchemaProfileToPMdv4Profile((*source).Profile)
		pMdv4Account = &mdv4Account
	}
	return pMdv4Account
}
func pSchemaAssetToPMdv4Asset(source *schema.Asset) *v4.Asset {
	var pMdv4Asset *v4.Asset
	if source != nil {
		var mdv4Asset v4.Asset
		mdv4Asset.Id = ConvertUUIDToString((*source).ID)
		mdv4Asset.Name = (*source).Name
		mdv4Asset.Notes = (*source).Notes
		mdv4Asset.DisplayPrecision = (*source).DisplayPrecision
		mdv4Asset.CalculationPrecision = (*source).CalculationPrecision
		mdv4Asset.Active = (*source).Active
		mdv4Asset.Currency = pSchemaCurrencyToPMdv4Currency((*source).Currency)
		pMdv4Asset = &mdv4Asset
	}
	return pMdv4Asset
}
func pSchemaCurrencyToPMdv4Currency(source *schema.Currency) *v4.Currency {
	var pMdv4Currency *v4.Currency
	if source != nil {
		var mdv4Currency v4.Currency
		mdv4Currency.Id = ConvertUUIDToString((*source).ID)
		mdv4Currency.Code = (*source).Code
		mdv4Currency.Symbol = (*source).Symbol
		mdv4Currency.DisplayPrecision = (*source).DisplayPrecision
		mdv4Currency.CalculationPrecision = (*source).CalculationPrecision
		mdv4Currency.Active = (*source).Active
		pMdv4Currency = &mdv4Currency
	}
	return pMdv4Currency
}
func pSchemaProfileToPMdv4Profile(source *schema.Profile) *v4.Profile {
	var pMdv4Profile *v4.Profile
	if source != nil {
		var mdv4Profile v4.Profile
		mdv4Profile.Id = ConvertUUIDToString((*source).ID)
		mdv4Profile.Name = (*source).Name
		mdv4Profile.Deleted = (*source).Deleted
		pMdv4Profile = &mdv4Profile
	}
	return pMdv4Profile
}
