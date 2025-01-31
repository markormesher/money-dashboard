package core

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/markormesher/money-dashboard/internal/schema"
)

func (c *Core) GetOrCreateUser(ctx context.Context, externalUsername string, displayName string) (schema.User, error) {
	user, ok, err := c.DB.GetUserByExternalUsername(ctx, externalUsername)
	if err != nil {
		return schema.User{}, err
	}

	// create a new user if one did not exist
	if !ok {
		return c.createNewUserAndDefaultProfile(ctx, externalUsername, displayName)
	}

	// update the existing user if necessary
	if user.DisplayName != displayName {
		user.DisplayName = displayName
		err := c.DB.UpsertUser(ctx, user)
		if err != nil {
			return schema.User{}, err
		}
	}

	return user, nil
}

func (c *Core) createNewUserAndDefaultProfile(ctx context.Context, externalUsername string, displayName string) (schema.User, error) {
	// create the user
	user := schema.User{
		ID:               uuid.New(),
		DisplayName:      displayName,
		ExternalUsername: externalUsername,
	}
	err := c.DB.UpsertUser(ctx, user)
	if err != nil {
		return schema.User{}, err
	}

	// create the profile
	profile := schema.Profile{
		ID:   uuid.New(),
		Name: "Default",
	}
	err = c.DB.UpsertProfile(ctx, profile)
	if err != nil {
		return schema.User{}, err
	}

	// make the user the owner of the profile
	role := schema.UserProfileRole{
		User:    &user,
		Profile: &profile,
		Role:    "owner",
	}
	err = c.DB.UpsertUserProfileRole(ctx, role)
	if err != nil {
		return schema.User{}, err
	}

	// set the profile as the active profile
	err = c.SetActiveProfile(ctx, user, profile.ID)
	if err != nil {
		return schema.User{}, err
	}
	user.ActiveProfile = &profile

	return user, nil
}

func (c *Core) GetProfiles(ctx context.Context, user schema.User) ([]schema.Profile, error) {
	return c.DB.GetUserProfiles(ctx, user.ID)
}

func (c *Core) SetActiveProfile(ctx context.Context, user schema.User, profileID uuid.UUID) error {
	profiles, err := c.DB.GetUserProfiles(ctx, user.ID)
	if err != nil {
		return err
	}

	hasAccess := false
	for _, p := range profiles {
		if p.ID == profileID {
			hasAccess = true
			break
		}
	}

	if !hasAccess {
		return fmt.Errorf("profile does not exist")
	}

	return c.DB.SetActiveProfile(ctx, user.ID, profileID)
}
