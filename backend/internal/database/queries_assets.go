package database

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/markormesher/money-dashboard/internal/conversiontools"
	"github.com/markormesher/money-dashboard/internal/database/conversion"
	"github.com/markormesher/money-dashboard/internal/database_gen"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (db *DB) GetAssetById(ctx context.Context, id uuid.UUID) (schema.Asset, bool, error) {
	row, err := db.queries.GetAssetById(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return schema.Asset{}, false, nil
	} else if err != nil {
		return schema.Asset{}, false, err
	}

	currency := conversion.CurrencyToCore(row.Currency)
	asset := conversion.AssetToCore(row.Asset)
	asset.Currency = &currency

	return asset, true, nil
}

func (db *DB) GetAllAssets(ctx context.Context) ([]schema.Asset, error) {
	rows, err := db.queries.GetAllAssets(ctx)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	assets := make([]schema.Asset, len(rows))
	for i, row := range rows {
		currency := conversion.CurrencyToCore(row.Currency)

		assets[i] = conversion.AssetToCore(row.Asset)
		assets[i].Currency = &currency
	}

	return assets, nil
}

func (db *DB) UpsertAsset(ctx context.Context, asset schema.Asset) error {
	return db.queries.UpsertAsset(ctx, database_gen.UpsertAssetParams{
		ID:                   asset.ID,
		Name:                 asset.Name,
		Notes:                asset.Notes,
		DisplayPrecision:     asset.DisplayPrecision,
		CalculationPrecision: asset.CalculationPrecision,
		CurrencyID:           asset.Currency.ID,
		Active:               asset.Active,
	})
}

func (db *DB) GetLatestAssetPrices(ctx context.Context) ([]schema.AssetPrice, error) {
	rows, err := db.queries.GetLatestAssetPrices(ctx)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	assets := conversiontools.ConvertSlice(rows, conversion.AssetPriceToCore)
	return assets, nil
}

func (db *DB) UpsertAssetPrice(ctx context.Context, price schema.AssetPrice) error {
	return db.queries.UpsertAssetPrice(ctx, database_gen.UpsertAssetPriceParams{
		ID:      price.ID,
		AssetID: price.AssetID,
		Date:    price.Date,
		Price:   price.Price,
	})
}
