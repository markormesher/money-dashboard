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
