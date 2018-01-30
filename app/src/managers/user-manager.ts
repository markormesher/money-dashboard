import Bluebird = require("bluebird");
import _ = require('lodash');

import ProfileManager = require('../managers/profile-manager');
import {User} from "../models/User";
import {Profile} from "../models/Profile";

function getById(id: string): Bluebird<User> {
	return User.findOne({
		include: [Profile],
		where: {
			id: id
		}
	}).then((user) => {
		if (user) {
			user.profiles.sort((a, b) => a.name.localeCompare(b.name))
		}
		return user;
	});
}

function getOrRegisterWithGoogleProfile(googleProfile: any): Bluebird<User> {
	// retrieve or create the user account
	return User.findOrCreate({
		include: [Profile],
		where: {
			googleId: googleProfile.id
		}
	}).spread((user: User) => {
		// the return from findOrCreate is [User, boolean] but we only want the user
		return Bluebird.resolve(user);
	}).then((user: User) => {
		// make sure the user has a profile
		if (!user.profiles || user.profiles.length === 0) {
			return ProfileManager.createAndAddToUser(user, 'Default Profile');
		} else {
			return user;
		}
	}).then((user: User) => {
		// make sure exactly one profile is active
		const activeProfileCount = _.sumBy(user.profiles, (profile) => profile.active ? 1 : 0);
		if (activeProfileCount !== 1) {
			return ProfileManager.setActiveProfile(user, user.profiles[0].id);
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
	getById,
	getOrRegisterWithGoogleProfile
}
