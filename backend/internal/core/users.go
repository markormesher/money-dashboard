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
		l.Info("creating a new user", "externalUsername", externalUsername)
		return c.createNewUser(ctx, externalUsername, displayName)
	}

	// update the existing user if necessary
	if user.DisplayName != displayName {
		l.Debug("updating user display name", "userId", user.ID)
		user.DisplayName = displayName
		err := c.DB.UpsertUser(ctx, user)
		if err != nil {
			return schema.User{}, err
		}
	}

	// load profiles for this user and create a default one if they don't have any
	profiles, err := c.DB.GetAllProfiles(ctx, user.ID)
	if err != nil {
		return schema.User{}, err
	}

	if len(profiles) == 0 {
		l.Info("user has no profiles - creating a default one", "userId", user.ID)
		defaultProfile, err := c.createDefaultProfile(ctx, user)
		if err != nil {
			return schema.User{}, err
		}

		profiles = append(profiles, defaultProfile)
	}

	// unset the active profile if the user no longer has a role on it
	if user.ActiveProfile != nil {
		hasAccess := false
		for _, p := range profiles {
			if p.ID == user.ActiveProfile.ID {
				hasAccess = true
				break
			}
		}

		if !hasAccess {
			l.Info("user no longer has access to their active profile - removing it", "userId", user.ID)
			user.ActiveProfile = nil
		}
	}

	// make sure a profile is set (it might have been removed earlier)
	if user.ActiveProfile == nil {
		l.Info("user has no active profile - picking one for them", "userId", user.ID)
		err := c.SetActiveProfile(ctx, user, profiles[0])
		if err != nil {
			return schema.User{}, err
		}
		user.ActiveProfile = &profiles[0]
	}

	return user, nil
}

func (c *Core) createNewUser(ctx context.Context, externalUsername string, displayName string) (schema.User, error) {
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
	profile, err := c.createDefaultProfile(ctx, user)
	if err != nil {
		return schema.User{}, err
	}

	// set the profile as the active profile
	err = c.SetActiveProfile(ctx, user, profile)
	if err != nil {
		return schema.User{}, err
	}
	user.ActiveProfile = &profile

	return user, nil
}

func (c *Core) SetActiveProfile(ctx context.Context, user schema.User, profile schema.Profile) error {
	profiles, err := c.DB.GetAllProfiles(ctx, user.ID)
	if err != nil {
		return err
	}

	hasAccess := false
	for _, p := range profiles {
		if p.ID == profile.ID {
			hasAccess = true
			break
		}
	}

	if !hasAccess {
		return fmt.Errorf("profile does not exist")
	}

	return c.DB.SetActiveProfile(ctx, user.ID, profile.ID)
}
