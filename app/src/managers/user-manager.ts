import Bluebird = require("bluebird");

import { User } from "../models/User";
import { createProfileAndAddToUser } from "./profile-manager";

class GoogleProfile {
	public id: string;
	public displayName: string;
	public photos: Array<{ value: string }>;
}

function getUser(id: string): Bluebird<User> {
	return User.findOne({
		where: { id },
	}).then((user) => {
		if (user) {
			user.profiles.sort((a, b) => a.name.localeCompare(b.name));
		}
		return user;
	});
}

function getOrRegisterUserWithGoogleProfile(googleProfile: GoogleProfile): Bluebird<User> {
	// retrieve or create the user account
	return User.findOrCreate({
		where: {
			googleId: googleProfile.id,
		},
	}).spread((user: User) => {
		// the return from findOrCreate is [User, boolean] but we only want the user
		return Bluebird.resolve(user);
	}).then((user: User) => {
		// make sure the user has a profile
		if (!user.profiles || user.profiles.length === 0) {
			return createProfileAndAddToUser(user, "Default Profile");
		} else {
			return user;
		}
	}).then((user: User) => {
		// update details according to google profile
		user.displayName = googleProfile.displayName;
		user.image = googleProfile.photos.length > 0 ? googleProfile.photos[0].value : null;
		return user.save();
	});
}

export {
	getUser,
	getOrRegisterUserWithGoogleProfile,
};
