// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0

package database_gen

import (
	"time"

	"github.com/google/uuid"
	"github.com/govalues/decimal"
	"github.com/jackc/pgx/v5/pgtype"
)

type Account struct {
	ID                   uuid.UUID
	Name                 string
	Notes                string
	IsIsa                bool
	IsPension            bool
	ExcludeFromEnvelopes bool
	ProfileID            uuid.UUID
	Active               bool
}

type AccountOld struct {
	ID                 uuid.UUID
	Deleted            bool
	Name               string
	Type               string
	Active             bool
	ProfileID          uuid.UUID
	Note               pgtype.Text
	Tags               []string
	CurrencyCode       string
	StockTicker        pgtype.Text
	IncludeInEnvelopes pgtype.Bool
}

type Asset struct {
	ID                   uuid.UUID
	Name                 string
	Notes                string
	DisplayPrecision     int32
	CalculationPrecision int32
	CurrencyID           uuid.UUID
	Active               bool
}

type AssetPrice struct {
	ID      uuid.UUID
	AssetID uuid.UUID
	Date    time.Time
	Price   decimal.Decimal
}

type Budget struct {
	ID         uuid.UUID
	Deleted    bool
	Type       string
	Amount     float64
	StartDate  int64
	EndDate    int64
	CategoryID *uuid.UUID
	ProfileID  *uuid.UUID
}

type Category struct {
	ID                   uuid.UUID
	Name                 string
	IsMemo               bool
	IsInterestIncome     bool
	IsDividendIncome     bool
	IsCapitalAcquisition bool
	IsCapitalDisposal    bool
	IsCapitalEventFee    bool
	ProfileID            uuid.UUID
	Active               bool
}

type CategoryOld struct {
	ID                    uuid.UUID
	Name                  string
	IsMemoCategory        bool
	IsIncomeCategory      bool
	IsExpenseCategory     bool
	IsAssetGrowthCategory bool
	Deleted               bool
	ProfileID             *uuid.UUID
}

type Currency struct {
	ID                   uuid.UUID
	Code                 string
	Symbol               string
	DisplayPrecision     int32
	Active               bool
	CalculationPrecision int32
}

type CurrencyRate struct {
	ID         uuid.UUID
	CurrencyID uuid.UUID
	Date       time.Time
	Rate       decimal.Decimal
}

type Envelope struct {
	ID        uuid.UUID
	Deleted   bool
	Name      string
	ProfileID uuid.UUID
}

type EnvelopeAllocation struct {
	ID         uuid.UUID
	Deleted    bool
	StartDate  int64
	CategoryID uuid.UUID
	EnvelopeID uuid.UUID
	ProfileID  uuid.UUID
}

type EnvelopeTransfer struct {
	ID             uuid.UUID
	Deleted        bool
	Date           int64
	Amount         float64
	Note           pgtype.Text
	FromEnvelopeID *uuid.UUID
	ToEnvelopeID   *uuid.UUID
	ProfileID      uuid.UUID
}

type ExchangeRate struct {
	CurrencyCode string
	Date         int64
	RatePerGbp   float64
	UpdateTime   int64
}

type Holding struct {
	ID         uuid.UUID
	Name       string
	CurrencyID *uuid.UUID
	AssetID    *uuid.UUID
	AccountID  uuid.UUID
	ProfileID  uuid.UUID
	Active     bool
}

type Migration struct {
	MigrationInProgress bool
	LastMigration       int32
}

type NullableHoldingAsset struct {
	HoldingID            uuid.UUID
	ID                   *uuid.UUID
	Name                 pgtype.Text
	Notes                pgtype.Text
	DisplayPrecision     pgtype.Int4
	CalculationPrecision pgtype.Int4
	CurrencyID           *uuid.UUID
	Active               pgtype.Bool
}

type NullableHoldingCurrency struct {
	HoldingID            uuid.UUID
	ID                   *uuid.UUID
	Code                 pgtype.Text
	Symbol               pgtype.Text
	DisplayPrecision     pgtype.Int4
	Active               pgtype.Bool
	CalculationPrecision pgtype.Int4
}

type Profile struct {
	ID      uuid.UUID
	Name    string
	Deleted bool
}

type StockPrice struct {
	Ticker              string
	Date                int64
	RatePerBaseCurrency pgtype.Float8
}

type Transaction struct {
	ID              uuid.UUID
	TransactionDate int64
	EffectiveDate   int64
	Amount          float64
	Payee           string
	Note            pgtype.Text
	Deleted         bool
	AccountID       *uuid.UUID
	CategoryID      *uuid.UUID
	ProfileID       *uuid.UUID
	CreationDate    pgtype.Timestamp
}

type UserProfileRole struct {
	UserID    uuid.UUID
	ProfileID uuid.UUID
	Role      string
}

type Usr struct {
	ID               uuid.UUID
	ExternalUsername string
	DisplayName      string
	Deleted          bool
	ActiveProfileID  *uuid.UUID
}
