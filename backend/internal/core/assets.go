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

func (c *Core) GetAllAssetsAsMap(ctx context.Context) (map[uuid.UUID]schema.Asset, error) {
	assets, err := c.GetAllAssets(ctx)
	if err != nil {
		return nil, err
	}

	out := map[uuid.UUID]schema.Asset{}
	for _, a := range assets {
		out[a.ID] = a
	}

	return out, nil
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
