package database

import (
	"context"

	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (db *DB) GetUserById(ctx context.Context, id uuid.UUID) (schema.User, error) {
	res, err := db.queries.GetUserById(ctx, convertUUIDFromCore(id))
	if err != nil {
		return schema.User{}, err
	}

	return convertUserToCore(res)
}
