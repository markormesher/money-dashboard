import * as Bluebird from "bluebird";

import { Profile } from "../models/Profile";
import { User } from "../models/User";

function getProfile(user: User, profileId: string): Bluebird<Profile> {
	return Profile
			.findOne({
				where: { id: profileId },
				include: [User],
			})
			.then((profile) => {
				if (profile && user && !profile.users.some((u) => u.id === user.id)) {
					throw new Error("User does not own this profile");
				} else {
					return profile;
				}
			});
}

function createProfileAndAddToUser(user: User, profileName: string): Bluebird<User> {
	return Profile
			.create({
				name: profileName,
			})
			.then((profile) => {
				return user.$add("profile", profile);
			})
			.then(() => {
				return user.reload({ include: [Profile] });
			});
}

function saveProfile(user: User, profileId: string, properties: Partial<Profile>): Bluebird<Profile> {
	return getProfile(user, profileId)
			.then((profile) => {
				profile = profile || new Profile();
				return profile.update(properties);
			})
			.then((profile) => {
				return profile.$add("user", user);
			});
}

function deleteProfile(user: User, profileId: string): Bluebird<void> {
	return getProfile(user, profileId)
			.then((profile) => {
				if (!profile) {
					throw new Error("That profile does not exist");
				} else if (user.profiles.length <= 1) {
					throw new Error("Cannot delete a user\"s last profile");
				} else {
					return profile;
				}
			})
			.then((profile) => profile.destroy());
}

export {
	getProfile,
	createProfileAndAddToUser,
	saveProfile,
	deleteProfile,
};