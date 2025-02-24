package database

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/markormesher/money-dashboard/internal/conversiontools"
	"github.com/markormesher/money-dashboard/internal/database/conversion"
	"github.com/markormesher/money-dashboard/internal/database_gen"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (db *DB) GetCurrencyById(ctx context.Context, id uuid.UUID) (schema.Currency, bool, error) {
	row, err := db.queries.GetCurrencyById(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return schema.Currency{}, false, nil
	} else if err != nil {
		return schema.Currency{}, false, err
	}

	currency := conversion.CurrencyToCore(row)
	return currency, true, nil
}

func (db *DB) GetAllCurrencies(ctx context.Context) ([]schema.Currency, error) {
	rows, err := db.queries.GetAllCurrencies(ctx)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	currencies := conversiontools.ConvertSlice(rows, conversion.CurrencyToCore)
	return currencies, nil
}

func (db *DB) UpsertCurrency(ctx context.Context, currency schema.Currency) error {
	return db.queries.UpsertCurrency(ctx, database_gen.UpsertCurrencyParams{
		ID:                   currency.ID,
		Code:                 currency.Code,
		Symbol:               currency.Symbol,
		DisplayPrecision:     currency.DisplayPrecision,
		CalculationPrecision: currency.CalculationPrecision,
		Active:               currency.Active,
	})
}

func (db *DB) UpsertCurrencyRate(ctx context.Context, rate schema.CurrencyRate) error {
	return db.queries.UpsertCurrencyRate(ctx, database_gen.UpsertCurrencyRateParams{
		ID:         rate.ID,
		CurrencyID: rate.CurrencyID,
		Date:       rate.Date,
		Rate:       rate.Rate,
	})
}

func (db *DB) GetLatestCurrencyRates(ctx context.Context) ([]schema.CurrencyRate, error) {
	rows, err := db.queries.GetLatestCurrencyRates(ctx)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	currencies := conversiontools.ConvertSlice(rows, conversion.CurrencyRateToCore)
	return currencies, nil
}

func (db *DB) GetCurrencyRate(ctx context.Context, currencyID uuid.UUID, date time.Time) (schema.CurrencyRate, error) {
	row, err := db.queries.GetCurrencyRate(ctx, database_gen.GetCurrencyRateParams{
		CurrencyID: currencyID,
		Date:       date,
	})
	if errors.Is(err, pgx.ErrNoRows) {
		return schema.CurrencyRate{}, fmt.Errorf("no rate data")
	} else if err != nil {
		return schema.CurrencyRate{}, err
	}

	rate := conversion.CurrencyRateToCore(row)
	return rate, nil
}
