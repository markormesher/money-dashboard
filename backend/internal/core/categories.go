package core

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (c *Core) GetCategoryById(ctx context.Context, id uuid.UUID, profileID uuid.UUID) (schema.Category, bool, error) {
	return c.DB.GetCategoryById(ctx, id, profileID)
}

func (c *Core) GetAllCategoriesForProfile(ctx context.Context, profileID uuid.UUID) ([]schema.Category, error) {
	return c.DB.GetAllCategoriesForProfile(ctx, profileID)
}

func (c *Core) UpsertCategory(ctx context.Context, category schema.Category, profileID uuid.UUID) error {
	if err := category.Validate(); err != nil {
		return fmt.Errorf("invalid value: %w", err)
	}

	if category.ID == uuid.Nil {
		category.ID = uuid.New()
	} else {
		_, ok, err := c.GetCategoryById(ctx, category.ID, profileID)
		if err != nil {
			return err
		} else if !ok {
			return fmt.Errorf("no such category")
		}
	}

	return c.DB.UpsertCategory(ctx, category, profileID)
}
