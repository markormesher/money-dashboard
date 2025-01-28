//go:build !goverter

package database

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/markormesher/money-dashboard/internal/database/conversion"
	"github.com/markormesher/money-dashboard/internal/database_gen"
	"github.com/markormesher/money-dashboard/internal/schema"
	"github.com/markormesher/money-dashboard/internal/uuidtools"
)

func (db *DB) GetUserById(ctx context.Context, id uuid.UUID) (schema.User, bool, error) {
	res, err := db.queries.GetUserById(ctx, uuidtools.ConvertNormalUUIDToPostgres(id))
	if errors.Is(err, pgx.ErrNoRows) {
		return schema.User{}, false, nil
	} else if err != nil {
		return schema.User{}, false, err
	}

	return conversion.UserToCore(res), true, nil
}

func (db *DB) GetUserByExternalUsername(ctx context.Context, externalUsername string) (schema.User, bool, error) {
	res, err := db.queries.GetUserByExternalUsername(ctx, externalUsername)
	if errors.Is(err, pgx.ErrNoRows) {
		return schema.User{}, false, nil
	} else if err != nil {
		return schema.User{}, false, nil
	}

	return conversion.UserToCore(res), true, nil
}

func (db *DB) UpsertUser(ctx context.Context, user schema.User) (schema.User, error) {
	res, err := db.queries.UpsertUser(ctx, database_gen.UpsertUserParams{
		ID:               uuidtools.ConvertNormalUUIDToPostgres(user.ID),
		ExternalUsername: user.ExternalUsername,
		DisplayName:      user.DisplayName,
	})
	if err != nil {
		return schema.User{}, err
	}

	return conversion.UserToCore(res), nil
}
