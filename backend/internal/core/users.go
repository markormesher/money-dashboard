package core

import (
	"context"

	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (c *Core) GetOrCreateUser(ctx context.Context, externalUsername string, displayName string) (schema.User, error) {
	user, ok, err := c.DB.GetUserByExternalUsername(ctx, externalUsername)
	if err != nil {
		return schema.User{}, err
	}

	// skeleton user if we're creating a new one
	if !ok {
		user = schema.User{
			ID:               uuid.New(),
			ExternalUsername: externalUsername,
		}
	}

	// always update the user display name, new or otherwise
	user.DisplayName = displayName
	user, err = c.DB.UpsertUser(ctx, user)
	if err != nil {
		return schema.User{}, err
	}

	return user, nil
}
