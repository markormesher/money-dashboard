import Bluebird = require('bluebird');
import {User} from '../models/User';
import {Profile} from '../models/Profile';

function getById(id: string): Bluebird<Profile> {
	return Profile.findOne({where: {id: id}});
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
	return Profile.update({active: false}, {where: {userId: user.id}})
			.then(() => {
				return profile.update({active: true});
			})
			.then(() => {
				return user;
			});
}

export {
	getById,
	createAndAddToUser,
	setActiveProfile
}
