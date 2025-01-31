// Code generated by github.com/jmattheis/goverter, DO NOT EDIT.
//go:build !goverter

package conversion

import (
	v4 "github.com/markormesher/money-dashboard/internal/api_gen/moneydashboard/v4"
	schema "github.com/markormesher/money-dashboard/internal/schema"
	uuidtools "github.com/markormesher/money-dashboard/internal/uuidtools"
)

func ProfileFromCore(source schema.Profile) *v4.Profile {
	var mdv4Profile v4.Profile
	mdv4Profile.Id = uuidtools.ConvertUUIDToString(source.ID)
	mdv4Profile.Name = source.Name
	mdv4Profile.Deleted = source.Deleted
	return &mdv4Profile
}
func ProfileToCore(source *v4.Profile) schema.Profile {
	var schemaProfile schema.Profile
	if source != nil {
		var schemaProfile2 schema.Profile
		schemaProfile2.ID = uuidtools.ConvertStringToUUID((*source).Id)
		schemaProfile2.Name = (*source).Name
		schemaProfile2.Deleted = (*source).Deleted
		schemaProfile = schemaProfile2
	}
	return schemaProfile
}
func UserFromCore(source schema.User) *v4.User {
	var mdv4User v4.User
	mdv4User.Id = uuidtools.ConvertUUIDToString(source.ID)
	mdv4User.ExternalUsername = source.ExternalUsername
	mdv4User.DisplayName = source.DisplayName
	mdv4User.Deleted = source.Deleted
	mdv4User.ActiveProfile = pSchemaProfileToPMdv4Profile(source.ActiveProfile)
	return &mdv4User
}
func UserToCore(source *v4.User) schema.User {
	var schemaUser schema.User
	if source != nil {
		var schemaUser2 schema.User
		schemaUser2.ID = uuidtools.ConvertStringToUUID((*source).Id)
		schemaUser2.ExternalUsername = (*source).ExternalUsername
		schemaUser2.DisplayName = (*source).DisplayName
		schemaUser2.Deleted = (*source).Deleted
		schemaUser2.ActiveProfile = pMdv4ProfileToPSchemaProfile((*source).ActiveProfile)
		schemaUser = schemaUser2
	}
	return schemaUser
}
func pMdv4ProfileToPSchemaProfile(source *v4.Profile) *schema.Profile {
	var pSchemaProfile *schema.Profile
	if source != nil {
		var schemaProfile schema.Profile
		schemaProfile.ID = uuidtools.ConvertStringToUUID((*source).Id)
		schemaProfile.Name = (*source).Name
		schemaProfile.Deleted = (*source).Deleted
		pSchemaProfile = &schemaProfile
	}
	return pSchemaProfile
}
func pSchemaProfileToPMdv4Profile(source *schema.Profile) *v4.Profile {
	var pMdv4Profile *v4.Profile
	if source != nil {
		var mdv4Profile v4.Profile
		mdv4Profile.Id = uuidtools.ConvertUUIDToString((*source).ID)
		mdv4Profile.Name = (*source).Name
		mdv4Profile.Deleted = (*source).Deleted
		pMdv4Profile = &mdv4Profile
	}
	return pMdv4Profile
}
