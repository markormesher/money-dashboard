import { DbUser } from "../db/models/DbUser";
import { cleanUuid } from "../db/utils";
import { createProfileAndAddToUser } from "./profile-manager";

class GoogleProfile {
	public id: string;
	public displayName: string;
	public photos: Array<{ value: string }>;
}

function getUser(userId: string): Promise<DbUser> {
	return DbUser
			.createQueryBuilder("user")
			.leftJoinAndSelect("user.profiles", "profiles")
			.leftJoinAndSelect("user.activeProfile", "activeProfile")
			.where("user.id = :userId")
			.andWhere("user.deleted = FALSE")
			.setParameters({
				userId: cleanUuid(userId),
			})
			.getOne()
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
			.leftJoinAndSelect("user.profiles", "profiles")
			.leftJoinAndSelect("user.activeProfile", "activeProfile")
			.where("user.googleId = :googleId")
			.andWhere("user.deleted = FALSE")
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
					return createProfileAndAddToUser(user, "Default Profile");
				} else {
					return user;
				}
			})
			.then((user: DbUser) => {
				// make sure a profile is active
				if (!user.activeProfile) {
					if (!user.profiles || user.profiles.length === 0) {
						throw new Error("User has no profiles after profile creation stage");
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
