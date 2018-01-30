import Bluebird = require('bluebird');
import {User} from '../models/User';
import {Profile} from '../models/Profile';

function getById(id: string, user?: User): Bluebird<Profile> {
	return Profile
			.findOne({where: {id: id}})
			.then((profile) => {
				if (profile && user && profile.userId !== user.id) {
					throw new Error('User does not own this profile');
				} else {
					return profile;
				}
			});
}

function createAndAddToUser(name: string, user: User): Bluebird<User> {
	return Profile.create({
		name: name,
		userId: user.id
	}).then((profile) => {
		if (!user.profiles) {
			user.profiles = [];
		}
		user.profiles.push(profile);
		return user.save();
	});
}

function setActiveProfile(user: User, profile: Profile): Bluebird<User> {
	return Bluebird.resolve()
			.then(() => {
				if (profile.userId !== user.id) {
					throw new Error("Cannot set active profile");
				}
			}).then(() => {
				return Profile.update({active: false}, {where: {userId: user.id}});
			}).then(() => {
				return Profile.update({active: true}, {where: {id: profile.id}})
			}).then(() => {
				return user;
			});
}

export {
	getById,
	createAndAddToUser,
	setActiveProfile
}
