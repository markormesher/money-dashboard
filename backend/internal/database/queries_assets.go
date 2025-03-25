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

func (db *DB) GetAssetById(ctx context.Context, id uuid.UUID) (schema.Asset, bool, error) {
	row, err := db.queries.GetAssetById(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return schema.Asset{}, false, nil
	} else if err != nil {
		return schema.Asset{}, false, err
	}

	asset := conversion.AssetToCore(row.Asset)

	currency := conversion.CurrencyToCore(row.Currency)
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
		asset := conversion.AssetToCore(row.Asset)

		currency := conversion.CurrencyToCore(row.Currency)
		asset.Currency = &currency

		assets[i] = asset
	}

	return assets, nil
}

func (db *DB) UpsertAsset(ctx context.Context, asset schema.Asset) error {
	return db.queries.UpsertAsset(ctx, database_gen.UpsertAssetParams{
		ID:               asset.ID,
		Name:             asset.Name,
		Notes:            asset.Notes,
		DisplayPrecision: asset.DisplayPrecision,
		CurrencyID:       asset.Currency.ID,
		Active:           asset.Active,
	})
}
