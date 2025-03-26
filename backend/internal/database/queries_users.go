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

func (db *DB) GetUserById(ctx context.Context, id uuid.UUID) (schema.User, bool, error) {
	row, err := db.queries.GetUserById(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return schema.User{}, false, nil
	} else if err != nil {
		return schema.User{}, false, err
	}

	user := conversion.UserToCore(row)

	if row.ActiveProfileID != nil {
		profile, ok, err := db.GetProfileById(ctx, *row.ActiveProfileID, user.ID)
		if err != nil {
			return schema.User{}, true, err
		}

		if ok {
			user.ActiveProfile = &profile
		}
	}

	return user, true, nil
}

func (db *DB) GetUserByExternalUsername(ctx context.Context, externalUsername string) (schema.User, bool, error) {
	row, err := db.queries.GetUserByExternalUsername(ctx, externalUsername)
	if errors.Is(err, pgx.ErrNoRows) {
		return schema.User{}, false, nil
	} else if err != nil {
		return schema.User{}, false, err
	}

	user := conversion.UserToCore(row)

	if row.ActiveProfileID != nil {
		profile, ok, err := db.GetProfileById(ctx, *row.ActiveProfileID, user.ID)
		if err != nil {
			return schema.User{}, true, err
		}

		if ok {
			user.ActiveProfile = &profile
		}
	}

	return user, true, nil
}

func (db *DB) UpsertUser(ctx context.Context, user schema.User) error {
	return db.queries.UpsertUser(ctx, database_gen.UpsertUserParams{
		ID:               user.ID,
		ExternalUsername: user.ExternalUsername,
		DisplayName:      user.DisplayName,
	})
}

func (db *DB) SetActiveProfile(ctx context.Context, userID uuid.UUID, profileId uuid.UUID) error {
	return db.queries.SetActiveProfile(ctx, database_gen.SetActiveProfileParams{
		ID:              userID,
		ActiveProfileID: &profileId,
	})
}
