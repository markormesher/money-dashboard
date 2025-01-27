//go:build !goverter

package database

import (
	"context"

	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/database/conversion"
	"github.com/markormesher/money-dashboard/internal/schema"
	"github.com/markormesher/money-dashboard/internal/uuidtools"
)

func (db *DB) GetUserById(ctx context.Context, id uuid.UUID) (schema.User, error) {
	res, err := db.queries.GetUserById(ctx, uuidtools.ConvertNormalUUIDToPostgres(id))
	if err != nil {
		return schema.User{}, err
	}

	return conversion.UserToCore(res), nil
}
