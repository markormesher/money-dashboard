// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: transactions.sql

package database_gen

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/govalues/decimal"
)

const deleteTransaction = `-- name: DeleteTransaction :exec
UPDATE transaction SET deleted = TRUE WHERE id = $1 AND profile_id = $2
`

type DeleteTransactionParams struct {
	ID        uuid.UUID
	ProfileID uuid.UUID
}

func (q *Queries) DeleteTransaction(ctx context.Context, arg DeleteTransactionParams) error {
	_, err := q.db.Exec(ctx, deleteTransaction, arg.ID, arg.ProfileID)
	return err
}

const getPayees = `-- name: GetPayees :many
SELECT
  DISTINCT(payee) AS payee
FROM
  transaction
WHERE
  transaction.profile_id = $1
  AND transaction.deleted = FALSE
`

func (q *Queries) GetPayees(ctx context.Context, profileID uuid.UUID) ([]string, error) {
	rows, err := q.db.Query(ctx, getPayees, profileID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []string
	for rows.Next() {
		var payee string
		if err := rows.Scan(&payee); err != nil {
			return nil, err
		}
		items = append(items, payee)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getTransactionById = `-- name: GetTransactionById :one
SELECT
  transaction.id, transaction.date, transaction.budget_date, transaction.creation_date, transaction.payee, transaction.notes, transaction.amount, transaction.unit_value, transaction.holding_id, transaction.category_id, transaction.profile_id, transaction.deleted,
  holding.id, holding.name, holding.currency_id, holding.asset_id, holding.account_id, holding.profile_id, holding.active,
  category.id, category.name, category.is_memo, category.is_interest_income, category.is_dividend_income, category.is_capital_acquisition, category.is_capital_disposal, category.is_capital_event_fee, category.profile_id, category.active, category.is_synthetic_asset_update,
  profile.id, profile.name, profile.deleted
FROM
  transaction
    JOIN holding on transaction.holding_id = holding.id
    JOIN category on transaction.category_id = category.id
    JOIN profile on transaction.profile_id = profile.id
WHERE
  transaction.id = $1
  AND transaction.profile_id = $2
  AND transaction.deleted = FALSE
`

type GetTransactionByIdParams struct {
	TransactionID uuid.UUID
	ProfileID     uuid.UUID
}

type GetTransactionByIdRow struct {
	Transaction Transaction
	Holding     Holding
	Category    Category
	Profile     Profile
}

func (q *Queries) GetTransactionById(ctx context.Context, arg GetTransactionByIdParams) (GetTransactionByIdRow, error) {
	row := q.db.QueryRow(ctx, getTransactionById, arg.TransactionID, arg.ProfileID)
	var i GetTransactionByIdRow
	err := row.Scan(
		&i.Transaction.ID,
		&i.Transaction.Date,
		&i.Transaction.BudgetDate,
		&i.Transaction.CreationDate,
		&i.Transaction.Payee,
		&i.Transaction.Notes,
		&i.Transaction.Amount,
		&i.Transaction.UnitValue,
		&i.Transaction.HoldingID,
		&i.Transaction.CategoryID,
		&i.Transaction.ProfileID,
		&i.Transaction.Deleted,
		&i.Holding.ID,
		&i.Holding.Name,
		&i.Holding.CurrencyID,
		&i.Holding.AssetID,
		&i.Holding.AccountID,
		&i.Holding.ProfileID,
		&i.Holding.Active,
		&i.Category.ID,
		&i.Category.Name,
		&i.Category.IsMemo,
		&i.Category.IsInterestIncome,
		&i.Category.IsDividendIncome,
		&i.Category.IsCapitalAcquisition,
		&i.Category.IsCapitalDisposal,
		&i.Category.IsCapitalEventFee,
		&i.Category.ProfileID,
		&i.Category.Active,
		&i.Category.IsSyntheticAssetUpdate,
		&i.Profile.ID,
		&i.Profile.Name,
		&i.Profile.Deleted,
	)
	return i, err
}

const getTransactionPageFilteredEntities = `-- name: GetTransactionPageFilteredEntities :many
SELECT
  transaction.id, transaction.date, transaction.budget_date, transaction.creation_date, transaction.payee, transaction.notes, transaction.amount, transaction.unit_value, transaction.holding_id, transaction.category_id, transaction.profile_id, transaction.deleted,
  category.id, category.name, category.is_memo, category.is_interest_income, category.is_dividend_income, category.is_capital_acquisition, category.is_capital_disposal, category.is_capital_event_fee, category.profile_id, category.active, category.is_synthetic_asset_update,
  profile.id, profile.name, profile.deleted,

  -- holding fields
  holding.id, holding.name, holding.currency_id, holding.asset_id, holding.account_id, holding.profile_id, holding.active,
  account.id, account.name, account.notes, account.is_isa, account.is_pension, account.exclude_from_envelopes, account.profile_id, account.active, account.account_group_id,
  nullable_holding_asset.holding_id, nullable_holding_asset.id, nullable_holding_asset.name, nullable_holding_asset.notes, nullable_holding_asset.display_precision, nullable_holding_asset.calculation_precision, nullable_holding_asset.currency_id, nullable_holding_asset.active,
  nullable_holding_currency.holding_id, nullable_holding_currency.id, nullable_holding_currency.code, nullable_holding_currency.symbol, nullable_holding_currency.display_precision, nullable_holding_currency.active, nullable_holding_currency.calculation_precision
FROM
  transaction
    JOIN category on transaction.category_id = category.id
    JOIN profile on transaction.profile_id = profile.id

    -- holding fields
    JOIN holding on transaction.holding_id = holding.id
    JOIN account ON holding.account_id = account.id
    LEFT JOIN nullable_holding_asset ON holding.id = nullable_holding_asset.holding_id
    LEFT JOIN nullable_holding_currency ON holding.id = nullable_holding_currency.holding_id
WHERE
  (
    transaction.payee ~* $3
    OR transaction.notes ~* $3
    OR category.name ~* $3
    OR holding.name ~* $3
    OR account.name ~* $3
  )
  AND transaction.profile_id = $4
  AND transaction.deleted = FALSE
ORDER BY
  "date" DESC,
  creation_date DESC
LIMIT $1
OFFSET $2
`

type GetTransactionPageFilteredEntitiesParams struct {
	Limit         int32
	Offset        int32
	SearchPattern string
	ProfileID     uuid.UUID
}

type GetTransactionPageFilteredEntitiesRow struct {
	Transaction             Transaction
	Category                Category
	Profile                 Profile
	Holding                 Holding
	Account                 Account
	NullableHoldingAsset    NullableHoldingAsset
	NullableHoldingCurrency NullableHoldingCurrency
}

// making updates here? don't forget to update BOTH filtered queries
func (q *Queries) GetTransactionPageFilteredEntities(ctx context.Context, arg GetTransactionPageFilteredEntitiesParams) ([]GetTransactionPageFilteredEntitiesRow, error) {
	rows, err := q.db.Query(ctx, getTransactionPageFilteredEntities,
		arg.Limit,
		arg.Offset,
		arg.SearchPattern,
		arg.ProfileID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetTransactionPageFilteredEntitiesRow
	for rows.Next() {
		var i GetTransactionPageFilteredEntitiesRow
		if err := rows.Scan(
			&i.Transaction.ID,
			&i.Transaction.Date,
			&i.Transaction.BudgetDate,
			&i.Transaction.CreationDate,
			&i.Transaction.Payee,
			&i.Transaction.Notes,
			&i.Transaction.Amount,
			&i.Transaction.UnitValue,
			&i.Transaction.HoldingID,
			&i.Transaction.CategoryID,
			&i.Transaction.ProfileID,
			&i.Transaction.Deleted,
			&i.Category.ID,
			&i.Category.Name,
			&i.Category.IsMemo,
			&i.Category.IsInterestIncome,
			&i.Category.IsDividendIncome,
			&i.Category.IsCapitalAcquisition,
			&i.Category.IsCapitalDisposal,
			&i.Category.IsCapitalEventFee,
			&i.Category.ProfileID,
			&i.Category.Active,
			&i.Category.IsSyntheticAssetUpdate,
			&i.Profile.ID,
			&i.Profile.Name,
			&i.Profile.Deleted,
			&i.Holding.ID,
			&i.Holding.Name,
			&i.Holding.CurrencyID,
			&i.Holding.AssetID,
			&i.Holding.AccountID,
			&i.Holding.ProfileID,
			&i.Holding.Active,
			&i.Account.ID,
			&i.Account.Name,
			&i.Account.Notes,
			&i.Account.IsIsa,
			&i.Account.IsPension,
			&i.Account.ExcludeFromEnvelopes,
			&i.Account.ProfileID,
			&i.Account.Active,
			&i.Account.AccountGroupID,
			&i.NullableHoldingAsset.HoldingID,
			&i.NullableHoldingAsset.ID,
			&i.NullableHoldingAsset.Name,
			&i.NullableHoldingAsset.Notes,
			&i.NullableHoldingAsset.DisplayPrecision,
			&i.NullableHoldingAsset.CalculationPrecision,
			&i.NullableHoldingAsset.CurrencyID,
			&i.NullableHoldingAsset.Active,
			&i.NullableHoldingCurrency.HoldingID,
			&i.NullableHoldingCurrency.ID,
			&i.NullableHoldingCurrency.Code,
			&i.NullableHoldingCurrency.Symbol,
			&i.NullableHoldingCurrency.DisplayPrecision,
			&i.NullableHoldingCurrency.Active,
			&i.NullableHoldingCurrency.CalculationPrecision,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getTransactionPageFilteredTotal = `-- name: GetTransactionPageFilteredTotal :one
SELECT
  count(*)
FROM
  transaction
    JOIN category on transaction.category_id = category.id
    JOIN profile on transaction.profile_id = profile.id

    -- holding fields
    JOIN holding on transaction.holding_id = holding.id
    JOIN account ON holding.account_id = account.id
    LEFT JOIN nullable_holding_asset ON holding.id = nullable_holding_asset.holding_id
    LEFT JOIN nullable_holding_currency ON holding.id = nullable_holding_currency.holding_id
WHERE
  (
    transaction.payee ~* $1
    OR transaction.notes ~* $1
    OR category.name ~* $1
    OR holding.name ~* $1
    OR account.name ~* $1
  )
  AND transaction.profile_id = $2
  AND transaction.deleted = FALSE
`

type GetTransactionPageFilteredTotalParams struct {
	SearchPattern string
	ProfileID     uuid.UUID
}

// making updates here? don't forget to update BOTH filtered queries
func (q *Queries) GetTransactionPageFilteredTotal(ctx context.Context, arg GetTransactionPageFilteredTotalParams) (int64, error) {
	row := q.db.QueryRow(ctx, getTransactionPageFilteredTotal, arg.SearchPattern, arg.ProfileID)
	var count int64
	err := row.Scan(&count)
	return count, err
}

const getTransactionPageTotal = `-- name: GetTransactionPageTotal :one
SELECT
  count(*)
FROM
  transaction
WHERE
  transaction.profile_id = $1
  AND transaction.deleted = FALSE
`

func (q *Queries) GetTransactionPageTotal(ctx context.Context, profileID uuid.UUID) (int64, error) {
	row := q.db.QueryRow(ctx, getTransactionPageTotal, profileID)
	var count int64
	err := row.Scan(&count)
	return count, err
}

const getTransactionsForEnvelopeCategories = `-- name: GetTransactionsForEnvelopeCategories :many
SELECT
  transaction.id, transaction.date, transaction.budget_date, transaction.creation_date, transaction.payee, transaction.notes, transaction.amount, transaction.unit_value, transaction.holding_id, transaction.category_id, transaction.profile_id, transaction.deleted,
  category.id, category.name, category.is_memo, category.is_interest_income, category.is_dividend_income, category.is_capital_acquisition, category.is_capital_disposal, category.is_capital_event_fee, category.profile_id, category.active, category.is_synthetic_asset_update,
  profile.id, profile.name, profile.deleted,

  -- holding fields
  holding.id, holding.name, holding.currency_id, holding.asset_id, holding.account_id, holding.profile_id, holding.active,
  account.id, account.name, account.notes, account.is_isa, account.is_pension, account.exclude_from_envelopes, account.profile_id, account.active, account.account_group_id,
  nullable_holding_asset.holding_id, nullable_holding_asset.id, nullable_holding_asset.name, nullable_holding_asset.notes, nullable_holding_asset.display_precision, nullable_holding_asset.calculation_precision, nullable_holding_asset.currency_id, nullable_holding_asset.active,
  nullable_holding_currency.holding_id, nullable_holding_currency.id, nullable_holding_currency.code, nullable_holding_currency.symbol, nullable_holding_currency.display_precision, nullable_holding_currency.active, nullable_holding_currency.calculation_precision
FROM
  transaction
    JOIN category on transaction.category_id = category.id
    JOIN profile on transaction.profile_id = profile.id

    -- holding fields
    JOIN holding on transaction.holding_id = holding.id
    JOIN account ON holding.account_id = account.id
    LEFT JOIN nullable_holding_asset ON holding.id = nullable_holding_asset.holding_id
    LEFT JOIN nullable_holding_currency ON holding.id = nullable_holding_currency.holding_id
WHERE
  account.exclude_from_envelopes = FALSE
  AND transaction.profile_id = $1
  AND transaction.deleted = FALSE
`

type GetTransactionsForEnvelopeCategoriesRow struct {
	Transaction             Transaction
	Category                Category
	Profile                 Profile
	Holding                 Holding
	Account                 Account
	NullableHoldingAsset    NullableHoldingAsset
	NullableHoldingCurrency NullableHoldingCurrency
}

func (q *Queries) GetTransactionsForEnvelopeCategories(ctx context.Context, profileID uuid.UUID) ([]GetTransactionsForEnvelopeCategoriesRow, error) {
	rows, err := q.db.Query(ctx, getTransactionsForEnvelopeCategories, profileID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetTransactionsForEnvelopeCategoriesRow
	for rows.Next() {
		var i GetTransactionsForEnvelopeCategoriesRow
		if err := rows.Scan(
			&i.Transaction.ID,
			&i.Transaction.Date,
			&i.Transaction.BudgetDate,
			&i.Transaction.CreationDate,
			&i.Transaction.Payee,
			&i.Transaction.Notes,
			&i.Transaction.Amount,
			&i.Transaction.UnitValue,
			&i.Transaction.HoldingID,
			&i.Transaction.CategoryID,
			&i.Transaction.ProfileID,
			&i.Transaction.Deleted,
			&i.Category.ID,
			&i.Category.Name,
			&i.Category.IsMemo,
			&i.Category.IsInterestIncome,
			&i.Category.IsDividendIncome,
			&i.Category.IsCapitalAcquisition,
			&i.Category.IsCapitalDisposal,
			&i.Category.IsCapitalEventFee,
			&i.Category.ProfileID,
			&i.Category.Active,
			&i.Category.IsSyntheticAssetUpdate,
			&i.Profile.ID,
			&i.Profile.Name,
			&i.Profile.Deleted,
			&i.Holding.ID,
			&i.Holding.Name,
			&i.Holding.CurrencyID,
			&i.Holding.AssetID,
			&i.Holding.AccountID,
			&i.Holding.ProfileID,
			&i.Holding.Active,
			&i.Account.ID,
			&i.Account.Name,
			&i.Account.Notes,
			&i.Account.IsIsa,
			&i.Account.IsPension,
			&i.Account.ExcludeFromEnvelopes,
			&i.Account.ProfileID,
			&i.Account.Active,
			&i.Account.AccountGroupID,
			&i.NullableHoldingAsset.HoldingID,
			&i.NullableHoldingAsset.ID,
			&i.NullableHoldingAsset.Name,
			&i.NullableHoldingAsset.Notes,
			&i.NullableHoldingAsset.DisplayPrecision,
			&i.NullableHoldingAsset.CalculationPrecision,
			&i.NullableHoldingAsset.CurrencyID,
			&i.NullableHoldingAsset.Active,
			&i.NullableHoldingCurrency.HoldingID,
			&i.NullableHoldingCurrency.ID,
			&i.NullableHoldingCurrency.Code,
			&i.NullableHoldingCurrency.Symbol,
			&i.NullableHoldingCurrency.DisplayPrecision,
			&i.NullableHoldingCurrency.Active,
			&i.NullableHoldingCurrency.CalculationPrecision,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const upsertTransaction = `-- name: UpsertTransaction :exec
INSERT INTO transaction (
  id,
  "date",
  budget_date,
  creation_date,
  payee,
  notes,
  amount,
  unit_value,
  holding_id,
  category_id,
  profile_id,
  deleted
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8,
  $9,
  $10,
  $11,
  $12
) ON CONFLICT (id) DO UPDATE SET
  -- note: creation_date deliberately not changed here
  id = $1,
  "date" = $2,
  budget_date = $3,
  payee = $5,
  notes = $6,
  amount = $7,
  unit_value = $8,
  holding_id = $9,
  category_id = $10,
  profile_id = $11,
  deleted = $12
`

type UpsertTransactionParams struct {
	ID           uuid.UUID
	Date         time.Time
	BudgetDate   time.Time
	CreationDate time.Time
	Payee        string
	Notes        string
	Amount       decimal.Decimal
	UnitValue    decimal.Decimal
	HoldingID    uuid.UUID
	CategoryID   uuid.UUID
	ProfileID    uuid.UUID
	Deleted      bool
}

func (q *Queries) UpsertTransaction(ctx context.Context, arg UpsertTransactionParams) error {
	_, err := q.db.Exec(ctx, upsertTransaction,
		arg.ID,
		arg.Date,
		arg.BudgetDate,
		arg.CreationDate,
		arg.Payee,
		arg.Notes,
		arg.Amount,
		arg.UnitValue,
		arg.HoldingID,
		arg.CategoryID,
		arg.ProfileID,
		arg.Deleted,
	)
	return err
}
