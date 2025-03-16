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

func (db *DB) UpsertRate(ctx context.Context, rate schema.Rate) error {
	var assetId, currencyId *uuid.UUID
	if rate.AssetID != uuid.Nil {
		assetId = &rate.AssetID
	}
	if rate.CurrencyID != uuid.Nil {
		currencyId = &rate.CurrencyID
	}

	return db.queries.UpsertRate(ctx, database_gen.UpsertRateParams{
		ID:         rate.ID,
		AssetID:    assetId,
		CurrencyID: currencyId,
		Date:       rate.Date,
		Rate:       rate.Rate,
	})
}

func (db *DB) GetLatestRates(ctx context.Context) ([]schema.Rate, error) {
	rows, err := db.queries.GetLatestRates(ctx)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	currencies := conversiontools.ConvertSlice(rows, conversion.RateToCore)
	return currencies, nil
}

func (db *DB) GetHistoricRate(ctx context.Context, assetOrCurrencyID uuid.UUID, date time.Time) (schema.Rate, error) {
	row, err := db.queries.GetHistoricRate(ctx, database_gen.GetHistoricRateParams{
		AssetOrCurrenceyID: &assetOrCurrencyID,
		Date:               date,
	})
	if errors.Is(err, pgx.ErrNoRows) {
		return schema.Rate{}, fmt.Errorf("no rate data")
	} else if err != nil {
		return schema.Rate{}, err
	}

	rate := conversion.RateToCore(row)
	return rate, nil
}
