package core

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (c *Core) GetCategoryById(ctx context.Context, profile schema.Profile, id uuid.UUID) (schema.Category, bool, error) {
	return c.DB.GetCategoryById(ctx, id, profile.ID)
}

func (c *Core) GetAllCategories(ctx context.Context, profile schema.Profile) ([]schema.Category, error) {
	return c.DB.GetAllCategories(ctx, profile.ID)
}

func (c *Core) GetAllCategoriesAsMap(ctx context.Context, profile schema.Profile) (map[uuid.UUID]schema.Category, error) {
	categories, err := c.GetAllCategories(ctx, profile)
	if err != nil {
		return nil, err
	}

	out := map[uuid.UUID]schema.Category{}
	for _, c := range categories {
		out[c.ID] = c
	}

	return out, nil
}

func (c *Core) UpsertCategory(ctx context.Context, profile schema.Profile, category schema.Category) error {
	if err := category.Validate(); err != nil {
		return fmt.Errorf("invalid value: %w", err)
	}

	if category.ID == uuid.Nil {
		category.ID = uuid.New()
	} else {
		_, ok, err := c.GetCategoryById(ctx, profile, category.ID)
		if err != nil {
			return err
		} else if !ok {
			return fmt.Errorf("no such category")
		}
	}

	return c.DB.UpsertCategory(ctx, category, profile.ID)
}
