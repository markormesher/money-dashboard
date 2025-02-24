package database

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/markormesher/money-dashboard/internal/database/conversion"
	"github.com/markormesher/money-dashboard/internal/database_gen"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (db *DB) GetHoldingById(ctx context.Context, id uuid.UUID, profileID uuid.UUID) (schema.Holding, bool, error) {
	row, err := db.queries.GetHoldingById(ctx, database_gen.GetHoldingByIdParams{
		HoldingID: id,
		ProfileID: profileID,
	})
	if errors.Is(err, pgx.ErrNoRows) {
		return schema.Holding{}, false, nil
	} else if err != nil {
		return schema.Holding{}, false, err
	}

	holding := conversion.HoldingToCore(row.Holding)

	account := conversion.AccountToCore(row.Account)
	holding.Account = &account

	profile := conversion.ProfileToCore(row.Profile)
	holding.Profile = &profile

	currency := conversion.NullableHoldingCurrencyToCore(row.NullableHoldingCurrency)
	if currency.ID != uuid.Nil {
		holding.Currency = &currency
	}

	asset := conversion.NullableHoldingAssetToCore(row.NullableHoldingAsset)
	if asset.ID != uuid.Nil {
		holding.Asset = &asset

		assetCurency := conversion.NullableHoldingAssetCurrencyToCore(row.NullableHoldingAssetCurrency)
		if assetCurency.ID == uuid.Nil {
			return schema.Holding{}, false, fmt.Errorf("the asset for holding %s has no currency", holding.ID)
		}

		holding.Asset.Currency = &assetCurency
	}

	return holding, true, nil
}

func (db *DB) GetAllHoldings(ctx context.Context, profileID uuid.UUID) ([]schema.Holding, error) {
	rows, err := db.queries.GetAllHoldings(ctx, profileID)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	holdings := make([]schema.Holding, len(rows))
	for i, row := range rows {
		holding := conversion.HoldingToCore(row.Holding)

		account := conversion.AccountToCore(row.Account)
		holding.Account = &account

		profile := conversion.ProfileToCore(row.Profile)
		holding.Profile = &profile

		currency := conversion.NullableHoldingCurrencyToCore(row.NullableHoldingCurrency)
		if currency.ID != uuid.Nil {
			holding.Currency = &currency
		}

		asset := conversion.NullableHoldingAssetToCore(row.NullableHoldingAsset)
		if asset.ID != uuid.Nil {
			holding.Asset = &asset

			assetCurency := conversion.NullableHoldingAssetCurrencyToCore(row.NullableHoldingAssetCurrency)
			if assetCurency.ID == uuid.Nil {
				return nil, fmt.Errorf("the asset for holding %s has no currency", holding.ID)
			}

			holding.Asset.Currency = &assetCurency
		}

		holdings[i] = holding
	}

	return holdings, nil
}

func (db *DB) UpsertHolding(ctx context.Context, holding schema.Holding, profileID uuid.UUID) error {
	var currencyId, assetId *uuid.UUID
	if holding.Currency != nil {
		currencyId = &holding.Currency.ID
	}
	if holding.Asset != nil {
		assetId = &holding.Asset.ID
	}

	return db.queries.UpsertHolding(ctx, database_gen.UpsertHoldingParams{
		ID:         holding.ID,
		Name:       holding.Name,
		CurrencyID: currencyId,
		AssetID:    assetId,
		AccountID:  holding.Account.ID,
		ProfileID:  profileID,
		Active:     holding.Active,
	})
}
