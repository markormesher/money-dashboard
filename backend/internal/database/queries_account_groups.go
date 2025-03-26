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

func (db *DB) GetAccountGroupById(ctx context.Context, id uuid.UUID, profileID uuid.UUID) (schema.AccountGroup, bool, error) {
	row, err := db.queries.GetAccountGroupById(ctx, database_gen.GetAccountGroupByIdParams{
		AccountGroupID: id,
		ProfileID:      profileID,
	})
	if errors.Is(err, pgx.ErrNoRows) {
		return schema.AccountGroup{}, false, nil
	} else if err != nil {
		return schema.AccountGroup{}, false, err
	}

	accountGroup := conversion.AccountGroupToCore(row.AccountGroup)

	profile := conversion.ProfileToCore(row.Profile)
	accountGroup.Profile = &profile

	return accountGroup, true, nil
}

func (db *DB) GetAllAccountGroups(ctx context.Context, profileID uuid.UUID) ([]schema.AccountGroup, error) {
	rows, err := db.queries.GetAllAccountGroups(ctx, profileID)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	accountGroups := make([]schema.AccountGroup, len(rows))
	for i, row := range rows {
		accountGroup := conversion.AccountGroupToCore(row.AccountGroup)

		profile := conversion.ProfileToCore(row.Profile)
		accountGroup.Profile = &profile

		accountGroups[i] = accountGroup
	}

	return accountGroups, nil
}

func (db *DB) UpsertAccountGroup(ctx context.Context, accountGroup schema.AccountGroup, profileID uuid.UUID) error {
	return db.queries.UpsertAccountGroup(ctx, database_gen.UpsertAccountGroupParams{
		ID:           accountGroup.ID,
		Name:         accountGroup.Name,
		DisplayOrder: accountGroup.DisplayOrder,
		ProfileID:    profileID,
	})
}
