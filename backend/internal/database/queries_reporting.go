package database

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/govalues/decimal"
	"github.com/jackc/pgx/v5"
)

type HoldingBalance struct {
	Balance   decimal.Decimal
	HoldingID uuid.UUID
}

type CategoryBalance struct {
	Balance    decimal.Decimal
	CategoryID uuid.UUID
	AssetID    *uuid.UUID
	CurrencyID *uuid.UUID
}

func (db *DB) GetHoldingBalances(ctx context.Context, profileID uuid.UUID) ([]HoldingBalance, error) {
	rows, err := db.queries.GetHoldingBalances(ctx, profileID)
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
