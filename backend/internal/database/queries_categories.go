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

func (db *DB) GetCategoryById(ctx context.Context, id uuid.UUID, profileID uuid.UUID) (schema.Category, bool, error) {
	row, err := db.queries.GetCategoryById(ctx, database_gen.GetCategoryByIdParams{
		CategoryID: id,
		ProfileID:  profileID,
	})
	if errors.Is(err, pgx.ErrNoRows) {
		return schema.Category{}, false, nil
	} else if err != nil {
		return schema.Category{}, false, err
	}

	category := conversion.CategoryToCore(row.Category)
	profile := conversion.ProfileToCore(row.Profile)
	category.Profile = &profile

	return category, true, nil
}

func (db *DB) GetAllCategoriesForProfile(ctx context.Context, profileID uuid.UUID) ([]schema.Category, error) {
	rows, err := db.queries.GetAllCategoriesForProfile(ctx, profileID)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	categories := make([]schema.Category, len(rows))
	for i, row := range rows {
		category := conversion.CategoryToCore(row.Category)
		profile := conversion.ProfileToCore(row.Profile)
		category.Profile = &profile

		categories[i] = category
	}

	return categories, nil
}

func (db *DB) UpsertCategory(ctx context.Context, category schema.Category) error {
	return db.queries.UpsertCategory(ctx, database_gen.UpsertCategoryParams{
		ID:                   category.ID,
		Name:                 category.Name,
		IsMemo:               category.IsMemo,
		IsInterestIncome:     category.IsInterestIncome,
		IsDividendIncome:     category.IsDividendIncome,
		IsCapitalAcquisition: category.IsCapitalAcquisition,
		IsCapitalDisposal:    category.IsCapitalDisposal,
		IsCapitalEventFee:    category.IsCapitalEventFee,
		ProfileID:            category.Profile.ID,
		Active:               category.Active,
	})
}
