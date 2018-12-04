import { DbUser } from "../models/db/DbUser";
import { createProfileAndAddToUser } from "./profile-manager";

class GoogleProfile {
	public id: string;
	public displayName: string;
	public photos: Array<{ value: string }>;
}

function getUser(userId: string): Promise<DbUser> {
	return DbUser
			.findOne(userId)
			.then((user) => {
				if (user) {
					user.profiles.sort((a, b) => a.name.localeCompare(b.name));
				}
				return user;
			});
}

function getOrRegisterUserWithGoogleProfile(googleProfile: GoogleProfile): Promise<DbUser> {
	const googleId = googleProfile.id;
	return DbUser
			.createQueryBuilder("user")
			.where("user.google_id = :googleId")
			.setParameters({
				googleId,
			})
			.getOne()
			.then((user: DbUser) => {
				// make a user if we didn't find one
				if (!user) {
					return DbUser.create<DbUser>({ id: null, googleId: googleProfile.id }).save();
				} else {
					return user;
				}
			})
			.then((user: DbUser) => {
				// make sure the user has a profile
				if (!user.profiles || user.profiles.length === 0) {
					return createProfileAndAddToUser(user, "Default DbProfile");
				} else {
					return user;
				}
			})
			.then((user: DbUser) => {
				// make sure a profile is active
				if (!user.activeProfile) {
					if (!user.profiles || user.profiles.length === 0) {
						throw new Error("DbUser has no profiles after profile creation stage");
					}

					user.activeProfile = user.profiles[0];
					return user.save();
				} else {
					return user;
				}
			})
			.then((user: DbUser) => {
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
