package database

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/markormesher/money-dashboard/internal/conversiontools"
	"github.com/markormesher/money-dashboard/internal/database/conversion"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (db *DB) GetAllCurrencies(ctx context.Context) ([]schema.Currency, error) {
	res, err := db.queries.GetAllCurrencies(ctx)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	currencies := conversiontools.ConvertSlice(res, conversion.CurrencyToCore)
	return currencies, nil
}

func (db *DB) GetCurrencyById(ctx context.Context, id uuid.UUID) (schema.Currency, bool, error) {
	res, err := db.queries.GetCurrencyById(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return schema.Currency{}, false, nil
	} else if err != nil {
		return schema.Currency{}, false, err
	}

	currency := conversion.CurrencyToCore(res)
	return currency, true, nil
}

func (db *DB) GetLatestCurrencyRates(ctx context.Context) ([]schema.CurrencyRate, error) {
	res, err := db.queries.GetLatestCurrencyRates(ctx)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	currencies := conversiontools.ConvertSlice(res, conversion.CurrencyRateToCore)
	return currencies, nil
}
