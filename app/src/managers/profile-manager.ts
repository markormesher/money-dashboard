import Bluebird = require('bluebird');
import { Profile } from '../models/Profile';
import { User } from '../models/User';

export type ProfileOrId = Profile | string;

function convertProfileOrIdToId(profileOrId: ProfileOrId): string {
	if (profileOrId instanceof Profile) {
		return (profileOrId as Profile).id;
	} else {
		return (profileOrId as string);
	}
}

function getProfile(user: User, profileOrId: ProfileOrId): Bluebird<Profile> {
	const profileId = convertProfileOrIdToId(profileOrId);
	return Profile
			.findOne({
				where: { id: profileId },
				include: [User]
			})
			.then((profile) => {
				if (profile && user && !profile.users.some((u) => u.id === user.id)) {
					throw new Error('User does not own this profile');
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
				return user.$add('profile', profile);
			})
			.then(() => {
				return user.reload({ include: [Profile] });
			});
}

function saveProfile(user: User, profileOrId: ProfileOrId, properties: Partial<Profile>): Bluebird<Profile> {
	return getProfile(user, profileOrId)
			.then((profile) => {
				profile = profile || new Profile();
				return profile.update(properties);
			})
			.then((profile) => {
				return profile.$add('user', user);
			});
}

function deleteProfile(user: User, profileOrId: ProfileOrId): Bluebird<void> {
	return getProfile(user, profileOrId)
			.then((profile) => {
				if (!profile) {
					throw new Error('That profile does not exist');
				} else if (user.profiles.length <= 1) {
					throw new Error('Cannot delete a user\'s last profile');
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
	deleteProfile
}
