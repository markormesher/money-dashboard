package core

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (c *Core) GetAssetById(ctx context.Context, id uuid.UUID) (schema.Asset, bool, error) {
	return c.DB.GetAssetById(ctx, id)
}

func (c *Core) GetAllAssets(ctx context.Context) ([]schema.Asset, error) {
	return c.DB.GetAllAssets(ctx)
}

func (c *Core) UpsertAsset(ctx context.Context, asset schema.Asset) error {
	if err := asset.Validate(); err != nil {
		return fmt.Errorf("invalid value: %w", err)
	}

	if asset.ID == uuid.Nil {
		asset.ID = uuid.New()
	}

	return c.DB.UpsertAsset(ctx, asset)
}

func (c *Core) GetLatestAssetPrices(ctx context.Context) ([]schema.AssetPrice, error) {
	return c.DB.GetLatestAssetPrices(ctx)
}

func (c *Core) UpsertAssetPrice(ctx context.Context, price schema.AssetPrice) error {
	if err := price.Validate(); err != nil {
		return fmt.Errorf("invalid value: %w", err)
	}

	if price.ID == uuid.Nil {
		price.ID = uuid.New()
	}

	return c.DB.UpsertAssetPrice(ctx, price)
}
