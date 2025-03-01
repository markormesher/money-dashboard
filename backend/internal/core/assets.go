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
