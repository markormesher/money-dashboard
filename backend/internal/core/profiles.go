package core

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (c *Core) createDefaultProfile(ctx context.Context, user schema.User) (schema.Profile, error) {
	// create the profile
	profile := schema.Profile{
		ID:   uuid.New(),
		Name: "Default",
	}
	err := c.DB.UpsertProfile(ctx, profile)
	if err != nil {
		return schema.Profile{}, err
	}

	// make the user the owner of the profile
	role := schema.UserProfileRole{
		User:    &user,
		Profile: &profile,
		Role:    "owner",
	}
	err = c.DB.UpsertUserProfileRole(ctx, role)
	if err != nil {
		return schema.Profile{}, err
	}

	return profile, nil
}

func (c *Core) GetProfileById(ctx context.Context, user schema.User, id uuid.UUID) (schema.Profile, bool, error) {
	return c.DB.GetProfileById(ctx, id, user.ID)
}

func (c *Core) GetAllProfiles(ctx context.Context, user schema.User) ([]schema.Profile, error) {
	return c.DB.GetAllProfiles(ctx, user.ID)
}

func (c *Core) UpsertProfile(ctx context.Context, user schema.User, profile schema.Profile) error {
	if err := profile.Validate(); err != nil {
		return fmt.Errorf("invalid value: %w", err)
	}

	if profile.ID == uuid.Nil {
		profile.ID = uuid.New()
	} else {
		_, ok, err := c.GetProfileById(ctx, user, profile.ID)
		if err != nil {
			return err
		} else if !ok {
			return fmt.Errorf("no such profile")
		}
	}

	return c.DB.UpsertProfile(ctx, profile)
}
