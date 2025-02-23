package database

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/markormesher/money-dashboard/internal/database/conversion"
	"github.com/markormesher/money-dashboard/internal/database_gen"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (db *DB) GetTransactionById(ctx context.Context, id uuid.UUID, profileID uuid.UUID) (schema.Transaction, bool, error) {
	row, err := db.queries.GetTransactionById(ctx, database_gen.GetTransactionByIdParams{
		TransactionID: id,
		ProfileID:     profileID,
	})
	if errors.Is(err, pgx.ErrNoRows) {
		return schema.Transaction{}, false, nil
	} else if err != nil {
		return schema.Transaction{}, false, err
	}

	transaction := conversion.TransactionToCore(row.Transaction)

	category := conversion.CategoryToCore(row.Category)
	transaction.Category = &category

	holding := conversion.HoldingToCore(row.Holding)
	transaction.Holding = &holding

	profile := conversion.ProfileToCore(row.Profile)
	transaction.Profile = &profile

	return transaction, true, nil
}

func (db *DB) GetTransactionPageTotal(ctx context.Context, profileID uuid.UUID) (int32, error) {
	total, err := db.queries.GetTransactionPageTotal(ctx, profileID)
	if err != nil {
		return 0, err
	}

	return int32(total), nil
}

func (db *DB) GetTransactionPageFilteredTotal(ctx context.Context, profileID uuid.UUID, searchPattern string) (int32, error) {
	total, err := db.queries.GetTransactionPageFilteredTotal(ctx, database_gen.GetTransactionPageFilteredTotalParams{
		ProfileID:     profileID,
		SearchPattern: searchPattern,
	})
	if err != nil {
		return 0, err
	}

	return int32(total), nil
}

func (db *DB) GetTransactionPageFilteredEntities(ctx context.Context, profileID uuid.UUID, page int32, perPage int32, searchPattern string) ([]schema.Transaction, error) {
	rows, err := db.queries.GetTransactionPageFilteredEntities(ctx, database_gen.GetTransactionPageFilteredEntitiesParams{
		ProfileID:     profileID,
		SearchPattern: searchPattern,
		Limit:         perPage,
		Offset:        (page - 1) * perPage,
	})
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	transactions := make([]schema.Transaction, len(rows))
	for i, row := range rows {
		transaction := conversion.TransactionToCore(row.Transaction)

		category := conversion.CategoryToCore(row.Category)
		transaction.Category = &category

		holding := conversion.HoldingToCore(row.Holding)
		transaction.Holding = &holding

		holdingAccount := conversion.AccountToCore(row.Account)
		transaction.Holding.Account = &holdingAccount

		if row.NullableHoldingAsset.ID != nil {
			holdingAsset := conversion.NullableHoldingAssetToCore(row.NullableHoldingAsset)
			transaction.Holding.Asset = &holdingAsset
		}

		if row.NullableHoldingCurrency.ID != nil {
			holdingCurrency := conversion.NullableHoldingCurrencyToCore(row.NullableHoldingCurrency)
			transaction.Holding.Currency = &holdingCurrency
		}

		profile := conversion.ProfileToCore(row.Profile)
		transaction.Profile = &profile

		transactions[i] = transaction
	}

	return transactions, nil
}

func (db *DB) UpsertTransaction(ctx context.Context, transaction schema.Transaction, profileID uuid.UUID) error {
	return db.queries.UpsertTransaction(ctx, database_gen.UpsertTransactionParams{
		ID:           transaction.ID,
		Date:         transaction.Date,
		BudgetDate:   transaction.BudgetDate,
		CreationDate: transaction.CreationDate,
		Payee:        transaction.Payee,
		Notes:        transaction.Notes,
		Amount:       transaction.Amount,
		UnitValue:    transaction.UnitValue,
		HoldingID:    transaction.Holding.ID,
		CategoryID:   transaction.Category.ID,
		ProfileID:    profileID,
		Deleted:      transaction.Deleted,
	})
}

func (db *DB) DeleteTransaction(ctx context.Context, id uuid.UUID, profileID uuid.UUID) error {
	return db.queries.DeleteTransaction(ctx, database_gen.DeleteTransactionParams{
		ID:        id,
		ProfileID: profileID,
	})
}
