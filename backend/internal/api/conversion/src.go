package conversion

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/govalues/decimal"
	mdv4 "github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4"
	"github.com/markormesher/money-dashboard/internal/schema"
)

// goverter:converter
// goverter:output:format function
// goverter:output:file ./generated.go
// goverter:output:package github.com/markormesher/money-dashboard/internal/api/conversion
// goverter:extend ConvertUUIDToString
// goverter:extend ConvertStringToUUID
// goverter:extend ConvertTimeToInt
// goverter:extend ConvertIntToTime
// goverter:extend ConvertDecimalToFloat
// goverter:extend ConvertFloatToDecimal
// goverter:matchIgnoreCase yes
// goverter:ignoreUnexported yes
// goverter:ignoreMissing yes
// goverter:useZeroValueOnPointerInconsistency yes
//
//lint:ignore U1000 this is "unused" directly but is used for code generation
type converterSpec interface {
	// core entites

	AccountFromCore(source schema.Account) *mdv4.Account
	AccountToCore(source *mdv4.Account) schema.Account

	AccountGroupFromCore(source schema.AccountGroup) *mdv4.AccountGroup
	AccountGroupToCore(source *mdv4.AccountGroup) schema.AccountGroup

	AssetFromCore(source schema.Asset) *mdv4.Asset
	AssetToCore(source *mdv4.Asset) schema.Asset

	CategoryFromCore(source schema.Category) *mdv4.Category
	CategoryToCore(source *mdv4.Category) schema.Category

	CurrencyFromCore(source schema.Currency) *mdv4.Currency
	CurrencyToCore(source *mdv4.Currency) schema.Currency

	EnvelopeFromCore(source schema.Envelope) *mdv4.Envelope
	EnvelopeToCore(source *mdv4.Envelope) schema.Envelope

	EnvelopeAllocationFromCore(source schema.EnvelopeAllocation) *mdv4.EnvelopeAllocation
	EnvelopeAllocationToCore(source *mdv4.EnvelopeAllocation) schema.EnvelopeAllocation

	EnvelopeTransferFromCore(source schema.EnvelopeTransfer) *mdv4.EnvelopeTransfer
	EnvelopeTransferToCore(source *mdv4.EnvelopeTransfer) schema.EnvelopeTransfer

	HoldingFromCore(source schema.Holding) *mdv4.Holding
	HoldingToCore(source *mdv4.Holding) schema.Holding

	ProfileFromCore(source schema.Profile) *mdv4.Profile
	ProfileToCore(source *mdv4.Profile) schema.Profile

	RateFromCore(source schema.Rate) *mdv4.Rate
	RateToCore(source *mdv4.Rate) schema.Rate

	TransactionFromCore(source schema.Transaction) *mdv4.Transaction
	TransactionToCore(source *mdv4.Transaction) schema.Transaction

	UserFromCore(source schema.User) *mdv4.User
	UserToCore(source *mdv4.User) schema.User

	// reporting

	HoldingBalanceFromCore(source schema.HoldingBalance) *mdv4.HoldingBalance
	CategoryBalanceFromCore(source schema.CategoryBalance) *mdv4.CategoryBalance
	EnvelopeBalanceFromCore(source schema.EnvelopeBalance) *mdv4.EnvelopeBalance
	BalanceHistoryEntryFromCore(source schema.BalanceHistoryEntry) *mdv4.BalanceHistoryEntry
	TaxReportFromCore(source schema.TaxReport) *mdv4.TaxReport
}

// utility methods to convert between core and api types

func ConvertUUIDToString(v uuid.UUID) string {
	return v.String()
}

func ConvertStringToUUID(v string) uuid.UUID {
	return uuid.MustParse(v)
}

func ConvertTimeToInt(v time.Time) int64 {
	return v.Unix()
}

func ConvertIntToTime(v int64) time.Time {
	return time.Unix(v, 0)
}

func ConvertDecimalToFloat(v decimal.Decimal) float64 {
	f, _ := v.Float64()
	return f
}

func ConvertFloatToDecimal(v float64) decimal.Decimal {
	d, err := decimal.NewFromFloat64(v)
	if err != nil {
		panic(fmt.Sprintf("unable to convert float %v to decimal: %v", v, err))
	}
	return d
}
