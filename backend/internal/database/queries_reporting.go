package database

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/govalues/decimal"
	"github.com/jackc/pgx/v5"
	"github.com/markormesher/money-dashboard/internal/conversiontools"
	"github.com/markormesher/money-dashboard/internal/database/conversion"
	"github.com/markormesher/money-dashboard/internal/database_gen"
	"github.com/markormesher/money-dashboard/internal/schema"
)

type HoldingBalance struct {
	Date      time.Time
	Balance   decimal.Decimal
	HoldingID uuid.UUID
}

type CategoryBalance struct {
	Balance    decimal.Decimal
	CategoryID uuid.UUID
	AssetID    *uuid.UUID
	CurrencyID *uuid.UUID
}

type TransactionWithHoldingId struct {
	Transaction schema.Transaction
	HoldingID   uuid.UUID
}

func (db *DB) GetHoldingBalancesAsOfDate(ctx context.Context, profileID uuid.UUID, maxDate time.Time) ([]HoldingBalance, error) {
	rows, err := db.queries.GetHoldingBalancesAsOfDate(ctx, database_gen.GetHoldingBalancesAsOfDateParams{
		ProfileID: profileID,
		MaxDate:   maxDate,
	})
	if errors.Is(err, pgx.ErrNoRows) {
		return []HoldingBalance{}, nil
	} else if err != nil {
		return nil, err
	}

	output := make([]HoldingBalance, len(rows))

	for i, row := range rows {
		output[i] = HoldingBalance{
			Balance:   row.Balance,
			HoldingID: row.HoldingID,
		}
	}

	return output, nil
}

func (db *DB) GetHoldingBalancesChangesBetweenDates(ctx context.Context, profileID uuid.UUID, startDate time.Time, endDate time.Time) ([]HoldingBalance, error) {
	rows, err := db.queries.GetHoldingBalancesChangesBetweenDates(ctx, database_gen.GetHoldingBalancesChangesBetweenDatesParams{
		ProfileID: profileID,
		StartDate: startDate,
		EndDate:   endDate,
	})
	if errors.Is(err, pgx.ErrNoRows) {
		return []HoldingBalance{}, nil
	} else if err != nil {
		return nil, err
	}

	output := make([]HoldingBalance, len(rows))

	for i, row := range rows {
		output[i] = HoldingBalance{
			Date:      row.Date,
			Balance:   row.Balance,
			HoldingID: row.HoldingID,
		}
	}

	return output, nil
}

func (db *DB) GetMemoBalances(ctx context.Context, profileID uuid.UUID) ([]CategoryBalance, error) {
	rows, err := db.queries.GetMemoBalances(ctx, profileID)
	if errors.Is(err, pgx.ErrNoRows) {
		return []CategoryBalance{}, nil
	} else if err != nil {
		return nil, err
	}

	output := make([]CategoryBalance, len(rows))

	for i, row := range rows {
		output[i] = CategoryBalance{
			Balance:    row.Balance,
			CategoryID: row.CategoryID,
			AssetID:    row.AssetID,
			CurrencyID: row.CurrencyID,
		}
	}

	return output, nil
}

func (db *DB) GetTransactionsForEnvelopeBalances(ctx context.Context, profileID uuid.UUID) ([]TransactionWithHoldingId, error) {
	rows, err := db.queries.GetTransactionsForEnvelopeBalances(ctx, profileID)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	transactions := make([]TransactionWithHoldingId, len(rows))
	for i, row := range rows {
		transaction := conversion.TransactionToCore(row.Transaction)

		category := conversion.CategoryToCore(row.Category)
		transaction.Category = &category

		profile := conversion.ProfileToCore(row.Profile)
		transaction.Profile = &profile

		transactions[i] = TransactionWithHoldingId{
			Transaction: transaction,
			HoldingID:   row.HoldingID,
		}
	}

	return transactions, nil
}

func (db *DB) GetTaxableInterestIncomePerHolding(ctx context.Context, profileID uuid.UUID, minDate time.Time, maxDate time.Time) ([]HoldingBalance, error) {
	rows, err := db.queries.GetTaxableInterestIncomePerHolding(ctx, database_gen.GetTaxableInterestIncomePerHoldingParams{
		ProfileID: profileID,
		MinDate:   minDate,
		MaxDate:   maxDate,
	})
	if errors.Is(err, pgx.ErrNoRows) {
		return []HoldingBalance{}, nil
	} else if err != nil {
		return nil, err
	}

	output := make([]HoldingBalance, len(rows))

	for i, row := range rows {
		output[i] = HoldingBalance{
			Balance:   row.Balance,
			HoldingID: row.HoldingID,
		}
	}

	return output, nil
}

func (db *DB) GetTaxableDividendIncomePerHolding(ctx context.Context, profileID uuid.UUID, minDate time.Time, maxDate time.Time) ([]HoldingBalance, error) {
	rows, err := db.queries.GetTaxableDividendIncomePerHolding(ctx, database_gen.GetTaxableDividendIncomePerHoldingParams{
		ProfileID: profileID,
		MinDate:   minDate,
		MaxDate:   maxDate,
	})
	if errors.Is(err, pgx.ErrNoRows) {
		return []HoldingBalance{}, nil
	} else if err != nil {
		return nil, err
	}

	output := make([]HoldingBalance, len(rows))

	for i, row := range rows {
		output[i] = HoldingBalance{
			Balance:   row.Balance,
			HoldingID: row.HoldingID,
		}
	}

	return output, nil
}

func (db *DB) GetTaxableCapitalTransactions(ctx context.Context, profileID uuid.UUID, minDate time.Time, maxDate time.Time) ([]schema.Transaction, bool, error) {
	rows, err := db.queries.GetTaxableCapitalTransactions(ctx, database_gen.GetTaxableCapitalTransactionsParams{
		ProfileID: profileID,
		MinDate:   minDate,
		MaxDate:   maxDate,
	})
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, false, nil
	} else if err != nil {
		return nil, false, err
	}

	return conversiontools.ConvertSlice(rows, conversion.TransactionToCore), true, nil
}
