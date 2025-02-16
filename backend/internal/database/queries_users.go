package database

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/markormesher/money-dashboard/internal/conversiontools"
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
		profile, ok, err := db.GetProfileById(ctx, *row.ActiveProfileID)
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
		profile, ok, err := db.GetProfileById(ctx, *row.ActiveProfileID)
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

func (db *DB) GetProfileById(ctx context.Context, id uuid.UUID) (schema.Profile, bool, error) {
	row, err := db.queries.GetProfileById(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return schema.Profile{}, false, nil
	} else if err != nil {
		return schema.Profile{}, false, err
	}

	profile := conversion.ProfileToCore(row)
	return profile, true, nil
}

func (db *DB) GetUserProfiles(ctx context.Context, userID uuid.UUID) ([]schema.Profile, error) {
	rows, err := db.queries.GetUserProfiles(ctx, userID)
	if errors.Is(err, pgx.ErrNoRows) {
		return []schema.Profile{}, nil
	} else if err != nil {
		return []schema.Profile{}, err
	}

	profiles := conversiontools.ConvertSlice(rows, conversion.ProfileToCore)
	return profiles, nil
}

func (db *DB) UpsertProfile(ctx context.Context, profile schema.Profile) error {
	return db.queries.UpsertProfile(ctx, database_gen.UpsertProfileParams{
		ID:   profile.ID,
		Name: profile.Name,
	})
}

func (db *DB) SetActiveProfile(ctx context.Context, userID uuid.UUID, profileId uuid.UUID) error {
	return db.queries.SetActiveProfile(ctx, database_gen.SetActiveProfileParams{
		ID:              userID,
		ActiveProfileID: &profileId,
	})
}

func (db *DB) UpsertUserProfileRole(ctx context.Context, role schema.UserProfileRole) error {
	if role.User == nil || role.Profile == nil {
		return fmt.Errorf("invalid role: user and/or profile are nil")
	}

	return db.queries.UpsertUserProfileRole(ctx, database_gen.UpsertUserProfileRoleParams{
		UserID:    role.User.ID,
		ProfileID: role.Profile.ID,
		Role:      role.Role,
	})
}
