import Bluebird = require('bluebird');
import {User} from '../models/User';
import {Profile} from '../models/Profile';

function getProfileById(id: string, user?: User): Bluebird<Profile> {
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

function createAndAddToUser(user: User, profileName: string): Bluebird<User> {
	return Profile
			.create({
				name: profileName,
				userId: user.id
			})
			.then((profile) => {
				if (!user.profiles) {
					user.profiles = [];
				}
				user.profiles.push(profile);
				return user.save();
			});
}

function deleteProfile(user: User, profileId: string): Bluebird<void> {
	return getProfileById(profileId, user)
			.then((profile) => {
				if (!profile) {
					throw new Error('That profile does not exist');
				} else if (profile.active) {
					throw new Error('Cannot delete an active profile');
				} else if (user.profiles.length <= 1) {
					throw new Error('Cannot delete a user\'s last profile');
				} else {
					return profile;
				}
			})
			.then((profile) => profile.destroy());
}

function setActiveProfile(user: User, profileId: string): Bluebird<User> {
	return getProfileById(profileId, user)
			.then((profile) => {
				if (!profile) {
					throw new Error('That profile does not exist');
				} else {
					return;
				}
			})
			.then(() => {
				return Profile.update({active: false}, {where: {userId: user.id}});
			})
			.then(() => {
				return Profile.update({active: true}, {where: {id: profileId}})
			})
			.then(() => {
				return user;
			});
}

export {
	getProfileById,
	createAndAddToUser,
	deleteProfile,
	setActiveProfile
}
