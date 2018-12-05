import { cleanUuid } from "../db/utils";
import { DbProfile } from "../models/db/DbProfile";
import { DbUser } from "../models/db/DbUser";
import { getUser } from "./user-manager";

function getProfile(user: DbUser, profileId: string): Promise<DbProfile> {
	return DbProfile
			.createQueryBuilder("profile")
			.leftJoinAndSelect("profile.users", "users")
			.where("profile.id = :profileId")
			.setParameters({
				profileId: cleanUuid(profileId),
			})
			.getOne()
			.then((profile) => {
				if (profile && user && !profile.users.some((u) => u.id === user.id)) {
					throw new Error("DbUser does not own this profile");
				} else {
					return profile;
				}
			});
}

function createProfileAndAddToUser(user: DbUser, profileName: string): Promise<DbUser> {
	return DbProfile
			.create({ name: profileName })
			.save()
			.then((profile) => {
				user.profiles = user.profiles || [];
				user.profiles.push(profile);
				return user.save();
			});
}

function saveProfile(user: DbUser, profileId: string, properties: Partial<DbProfile>): Promise<DbProfile> {
	return getProfile(user, profileId)
			.then((profile) => {
				profile = DbProfile.getRepository().merge(profile || new DbProfile(), properties);
				profile.users = profile.users || [];
				if (profile.users.findIndex((u) => u.id === user.id) < 0) {
					profile.users.push(user);
				}
				return profile.save();
			});
}

function deleteProfile(user: DbUser, profileId: string): Promise<DbProfile> {
	return getProfile(user, profileId)
			.then((profile) => {
				if (!profile) {
					throw new Error("That profile does not exist");
				} else if (user.profiles.length <= 1) {
					throw new Error("Cannot delete a user's last profile");
				} else {
					return profile;
				}
			})
			.then((profile) => profile.remove());
}

function setActiveProfileForUser(user: DbUser, profileId: string): Promise<DbUser> {
	return getUser(user.id)
			.then((u) => {
				u.activeProfile = user.profiles.find((p) => p.id === profileId) || user.profiles[0];
				return u.save();
			});
}

export {
	getProfile,
	createProfileAndAddToUser,
	saveProfile,
	deleteProfile,
	setActiveProfileForUser,
};
