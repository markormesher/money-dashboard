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
	mdv4Account.AccountGroup = pSchemaAccountGroupToPMdv4AccountGroup(source.AccountGroup)
	return &mdv4Account
}
func AccountGroupFromCore(source schema.AccountGroup) *v4.AccountGroup {
	var mdv4AccountGroup v4.AccountGroup
	mdv4AccountGroup.Id = ConvertUUIDToString(source.ID)
	mdv4AccountGroup.Name = source.Name
	mdv4AccountGroup.DisplayOrder = source.DisplayOrder
	return &mdv4AccountGroup
}
func AccountGroupToCore(source *v4.AccountGroup) schema.AccountGroup {
	var schemaAccountGroup schema.AccountGroup
	if source != nil {
		var schemaAccountGroup2 schema.AccountGroup
		schemaAccountGroup2.ID = ConvertStringToUUID((*source).Id)
		schemaAccountGroup2.Name = (*source).Name
		schemaAccountGroup2.DisplayOrder = (*source).DisplayOrder
		schemaAccountGroup = schemaAccountGroup2
	}
	return schemaAccountGroup
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
		schemaAccount2.AccountGroup = pMdv4AccountGroupToPSchemaAccountGroup((*source).AccountGroup)
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
func CategoryBalanceFromCore(source schema.CategoryBalance) *v4.CategoryBalance {
	var mdv4CategoryBalance v4.CategoryBalance
	mdv4CategoryBalance.Category = CategoryFromCore(source.Category)
	mdv4CategoryBalance.Asset = pSchemaAssetToPMdv4Asset(source.Asset)
	mdv4CategoryBalance.Currency = pSchemaCurrencyToPMdv4Currency(source.Currency)
	mdv4CategoryBalance.RawBalance = ConvertDecimalToFloat(source.RawBalance)
	return &mdv4CategoryBalance
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
	mdv4Category.IsSyntheticAssetUpdate = source.IsSyntheticAssetUpdate
	mdv4Category.Active = source.Active
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
		schemaCategory2.IsSyntheticAssetUpdate = (*source).IsSyntheticAssetUpdate
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
func EnvelopeAllocationFromCore(source schema.EnvelopeAllocation) *v4.EnvelopeAllocation {
	var mdv4EnvelopeAllocation v4.EnvelopeAllocation
	mdv4EnvelopeAllocation.Id = ConvertUUIDToString(source.ID)
	mdv4EnvelopeAllocation.StartDate = ConvertTimeToInt(source.StartDate)
	mdv4EnvelopeAllocation.Category = pSchemaCategoryToPMdv4Category(source.Category)
	mdv4EnvelopeAllocation.Envelope = pSchemaEnvelopeToPMdv4Envelope(source.Envelope)
	return &mdv4EnvelopeAllocation
}
func EnvelopeAllocationToCore(source *v4.EnvelopeAllocation) schema.EnvelopeAllocation {
	var schemaEnvelopeAllocation schema.EnvelopeAllocation
	if source != nil {
		var schemaEnvelopeAllocation2 schema.EnvelopeAllocation
		schemaEnvelopeAllocation2.ID = ConvertStringToUUID((*source).Id)
		schemaEnvelopeAllocation2.StartDate = ConvertIntToTime((*source).StartDate)
		schemaEnvelopeAllocation2.Category = pMdv4CategoryToPSchemaCategory((*source).Category)
		schemaEnvelopeAllocation2.Envelope = pMdv4EnvelopeToPSchemaEnvelope((*source).Envelope)
		schemaEnvelopeAllocation = schemaEnvelopeAllocation2
	}
	return schemaEnvelopeAllocation
}
func EnvelopeBalanceFromCore(source schema.EnvelopeBalance) *v4.EnvelopeBalance {
	var mdv4EnvelopeBalance v4.EnvelopeBalance
	mdv4EnvelopeBalance.Envelope = EnvelopeFromCore(source.Envelope)
	mdv4EnvelopeBalance.GbpBalance = ConvertDecimalToFloat(source.GbpBalance)
	return &mdv4EnvelopeBalance
}
func EnvelopeFromCore(source schema.Envelope) *v4.Envelope {
	var mdv4Envelope v4.Envelope
	mdv4Envelope.Id = ConvertUUIDToString(source.ID)
	mdv4Envelope.Name = source.Name
	mdv4Envelope.Active = source.Active
	return &mdv4Envelope
}
func EnvelopeToCore(source *v4.Envelope) schema.Envelope {
	var schemaEnvelope schema.Envelope
	if source != nil {
		var schemaEnvelope2 schema.Envelope
		schemaEnvelope2.ID = ConvertStringToUUID((*source).Id)
		schemaEnvelope2.Name = (*source).Name
		schemaEnvelope2.Active = (*source).Active
		schemaEnvelope = schemaEnvelope2
	}
	return schemaEnvelope
}
func EnvelopeTransferFromCore(source schema.EnvelopeTransfer) *v4.EnvelopeTransfer {
	var mdv4EnvelopeTransfer v4.EnvelopeTransfer
	mdv4EnvelopeTransfer.Id = ConvertUUIDToString(source.ID)
	mdv4EnvelopeTransfer.Date = ConvertTimeToInt(source.Date)
	mdv4EnvelopeTransfer.Notes = source.Notes
	mdv4EnvelopeTransfer.Amount = ConvertDecimalToFloat(source.Amount)
	mdv4EnvelopeTransfer.FromEnvelope = pSchemaEnvelopeToPMdv4Envelope(source.FromEnvelope)
	mdv4EnvelopeTransfer.ToEnvelope = pSchemaEnvelopeToPMdv4Envelope(source.ToEnvelope)
	return &mdv4EnvelopeTransfer
}
func EnvelopeTransferToCore(source *v4.EnvelopeTransfer) schema.EnvelopeTransfer {
	var schemaEnvelopeTransfer schema.EnvelopeTransfer
	if source != nil {
		var schemaEnvelopeTransfer2 schema.EnvelopeTransfer
		schemaEnvelopeTransfer2.ID = ConvertStringToUUID((*source).Id)
		schemaEnvelopeTransfer2.Date = ConvertIntToTime((*source).Date)
		schemaEnvelopeTransfer2.Amount = ConvertFloatToDecimal((*source).Amount)
		schemaEnvelopeTransfer2.FromEnvelope = pMdv4EnvelopeToPSchemaEnvelope((*source).FromEnvelope)
		schemaEnvelopeTransfer2.ToEnvelope = pMdv4EnvelopeToPSchemaEnvelope((*source).ToEnvelope)
		schemaEnvelopeTransfer2.Notes = (*source).Notes
		schemaEnvelopeTransfer = schemaEnvelopeTransfer2
	}
	return schemaEnvelopeTransfer
}
func HoldingBalanceFromCore(source schema.HoldingBalance) *v4.HoldingBalance {
	var mdv4HoldingBalance v4.HoldingBalance
	mdv4HoldingBalance.Holding = HoldingFromCore(source.Holding)
	mdv4HoldingBalance.RawBalance = ConvertDecimalToFloat(source.RawBalance)
	mdv4HoldingBalance.GbpBalance = ConvertDecimalToFloat(source.GbpBalance)
	return &mdv4HoldingBalance
}
func HoldingFromCore(source schema.Holding) *v4.Holding {
	var mdv4Holding v4.Holding
	mdv4Holding.Id = ConvertUUIDToString(source.ID)
	mdv4Holding.Name = source.Name
	mdv4Holding.Active = source.Active
	mdv4Holding.Currency = pSchemaCurrencyToPMdv4Currency(source.Currency)
	mdv4Holding.Asset = pSchemaAssetToPMdv4Asset(source.Asset)
	mdv4Holding.Account = pSchemaAccountToPMdv4Account(source.Account)
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
func RateFromCore(source schema.Rate) *v4.Rate {
	var mdv4Rate v4.Rate
	mdv4Rate.Id = ConvertUUIDToString(source.ID)
	mdv4Rate.AssetId = ConvertUUIDToString(source.AssetID)
	mdv4Rate.CurrencyId = ConvertUUIDToString(source.CurrencyID)
	mdv4Rate.Date = ConvertTimeToInt(source.Date)
	mdv4Rate.Rate = ConvertDecimalToFloat(source.Rate)
	return &mdv4Rate
}
func RateToCore(source *v4.Rate) schema.Rate {
	var schemaRate schema.Rate
	if source != nil {
		var schemaRate2 schema.Rate
		schemaRate2.ID = ConvertStringToUUID((*source).Id)
		schemaRate2.AssetID = ConvertStringToUUID((*source).AssetId)
		schemaRate2.CurrencyID = ConvertStringToUUID((*source).CurrencyId)
		schemaRate2.Date = ConvertIntToTime((*source).Date)
		schemaRate2.Rate = ConvertFloatToDecimal((*source).Rate)
		schemaRate = schemaRate2
	}
	return schemaRate
}
func TransactionFromCore(source schema.Transaction) *v4.Transaction {
	var mdv4Transaction v4.Transaction
	mdv4Transaction.Id = ConvertUUIDToString(source.ID)
	mdv4Transaction.Date = ConvertTimeToInt(source.Date)
	mdv4Transaction.BudgetDate = ConvertTimeToInt(source.BudgetDate)
	mdv4Transaction.CreationDate = ConvertTimeToInt(source.CreationDate)
	mdv4Transaction.Payee = source.Payee
	mdv4Transaction.Notes = source.Notes
	mdv4Transaction.Amount = ConvertDecimalToFloat(source.Amount)
	mdv4Transaction.UnitValue = ConvertDecimalToFloat(source.UnitValue)
	mdv4Transaction.Deleted = source.Deleted
	mdv4Transaction.Holding = pSchemaHoldingToPMdv4Holding(source.Holding)
	mdv4Transaction.Category = pSchemaCategoryToPMdv4Category(source.Category)
	return &mdv4Transaction
}
func TransactionToCore(source *v4.Transaction) schema.Transaction {
	var schemaTransaction schema.Transaction
	if source != nil {
		var schemaTransaction2 schema.Transaction
		schemaTransaction2.ID = ConvertStringToUUID((*source).Id)
		schemaTransaction2.Date = ConvertIntToTime((*source).Date)
		schemaTransaction2.BudgetDate = ConvertIntToTime((*source).BudgetDate)
		schemaTransaction2.CreationDate = ConvertIntToTime((*source).CreationDate)
		schemaTransaction2.Payee = (*source).Payee
		schemaTransaction2.Notes = (*source).Notes
		schemaTransaction2.Amount = ConvertFloatToDecimal((*source).Amount)
		schemaTransaction2.UnitValue = ConvertFloatToDecimal((*source).UnitValue)
		schemaTransaction2.Holding = pMdv4HoldingToPSchemaHolding((*source).Holding)
		schemaTransaction2.Category = pMdv4CategoryToPSchemaCategory((*source).Category)
		schemaTransaction2.Deleted = (*source).Deleted
		schemaTransaction = schemaTransaction2
	}
	return schemaTransaction
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
func pMdv4AccountGroupToPSchemaAccountGroup(source *v4.AccountGroup) *schema.AccountGroup {
	var pSchemaAccountGroup *schema.AccountGroup
	if source != nil {
		var schemaAccountGroup schema.AccountGroup
		schemaAccountGroup.ID = ConvertStringToUUID((*source).Id)
		schemaAccountGroup.Name = (*source).Name
		schemaAccountGroup.DisplayOrder = (*source).DisplayOrder
		pSchemaAccountGroup = &schemaAccountGroup
	}
	return pSchemaAccountGroup
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
		schemaAccount.AccountGroup = pMdv4AccountGroupToPSchemaAccountGroup((*source).AccountGroup)
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
func pMdv4CategoryToPSchemaCategory(source *v4.Category) *schema.Category {
	var pSchemaCategory *schema.Category
	if source != nil {
		var schemaCategory schema.Category
		schemaCategory.ID = ConvertStringToUUID((*source).Id)
		schemaCategory.Name = (*source).Name
		schemaCategory.IsMemo = (*source).IsMemo
		schemaCategory.IsInterestIncome = (*source).IsInterestIncome
		schemaCategory.IsDividendIncome = (*source).IsDividendIncome
		schemaCategory.IsCapitalAcquisition = (*source).IsCapitalAcquisition
		schemaCategory.IsCapitalDisposal = (*source).IsCapitalDisposal
		schemaCategory.IsCapitalEventFee = (*source).IsCapitalEventFee
		schemaCategory.IsSyntheticAssetUpdate = (*source).IsSyntheticAssetUpdate
		schemaCategory.Active = (*source).Active
		pSchemaCategory = &schemaCategory
	}
	return pSchemaCategory
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
func pMdv4EnvelopeToPSchemaEnvelope(source *v4.Envelope) *schema.Envelope {
	var pSchemaEnvelope *schema.Envelope
	if source != nil {
		var schemaEnvelope schema.Envelope
		schemaEnvelope.ID = ConvertStringToUUID((*source).Id)
		schemaEnvelope.Name = (*source).Name
		schemaEnvelope.Active = (*source).Active
		pSchemaEnvelope = &schemaEnvelope
	}
	return pSchemaEnvelope
}
func pMdv4HoldingToPSchemaHolding(source *v4.Holding) *schema.Holding {
	var pSchemaHolding *schema.Holding
	if source != nil {
		var schemaHolding schema.Holding
		schemaHolding.ID = ConvertStringToUUID((*source).Id)
		schemaHolding.Name = (*source).Name
		schemaHolding.Currency = pMdv4CurrencyToPSchemaCurrency((*source).Currency)
		schemaHolding.Asset = pMdv4AssetToPSchemaAsset((*source).Asset)
		schemaHolding.Account = pMdv4AccountToPSchemaAccount((*source).Account)
		schemaHolding.Active = (*source).Active
		pSchemaHolding = &schemaHolding
	}
	return pSchemaHolding
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
func pSchemaAccountGroupToPMdv4AccountGroup(source *schema.AccountGroup) *v4.AccountGroup {
	var pMdv4AccountGroup *v4.AccountGroup
	if source != nil {
		var mdv4AccountGroup v4.AccountGroup
		mdv4AccountGroup.Id = ConvertUUIDToString((*source).ID)
		mdv4AccountGroup.Name = (*source).Name
		mdv4AccountGroup.DisplayOrder = (*source).DisplayOrder
		pMdv4AccountGroup = &mdv4AccountGroup
	}
	return pMdv4AccountGroup
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
		mdv4Account.AccountGroup = pSchemaAccountGroupToPMdv4AccountGroup((*source).AccountGroup)
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
func pSchemaCategoryToPMdv4Category(source *schema.Category) *v4.Category {
	var pMdv4Category *v4.Category
	if source != nil {
		var mdv4Category v4.Category
		mdv4Category.Id = ConvertUUIDToString((*source).ID)
		mdv4Category.Name = (*source).Name
		mdv4Category.IsMemo = (*source).IsMemo
		mdv4Category.IsInterestIncome = (*source).IsInterestIncome
		mdv4Category.IsDividendIncome = (*source).IsDividendIncome
		mdv4Category.IsCapitalAcquisition = (*source).IsCapitalAcquisition
		mdv4Category.IsCapitalDisposal = (*source).IsCapitalDisposal
		mdv4Category.IsCapitalEventFee = (*source).IsCapitalEventFee
		mdv4Category.IsSyntheticAssetUpdate = (*source).IsSyntheticAssetUpdate
		mdv4Category.Active = (*source).Active
		pMdv4Category = &mdv4Category
	}
	return pMdv4Category
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
func pSchemaEnvelopeToPMdv4Envelope(source *schema.Envelope) *v4.Envelope {
	var pMdv4Envelope *v4.Envelope
	if source != nil {
		var mdv4Envelope v4.Envelope
		mdv4Envelope.Id = ConvertUUIDToString((*source).ID)
		mdv4Envelope.Name = (*source).Name
		mdv4Envelope.Active = (*source).Active
		pMdv4Envelope = &mdv4Envelope
	}
	return pMdv4Envelope
}
func pSchemaHoldingToPMdv4Holding(source *schema.Holding) *v4.Holding {
	var pMdv4Holding *v4.Holding
	if source != nil {
		var mdv4Holding v4.Holding
		mdv4Holding.Id = ConvertUUIDToString((*source).ID)
		mdv4Holding.Name = (*source).Name
		mdv4Holding.Active = (*source).Active
		mdv4Holding.Currency = pSchemaCurrencyToPMdv4Currency((*source).Currency)
		mdv4Holding.Asset = pSchemaAssetToPMdv4Asset((*source).Asset)
		mdv4Holding.Account = pSchemaAccountToPMdv4Account((*source).Account)
		pMdv4Holding = &mdv4Holding
	}
	return pMdv4Holding
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
