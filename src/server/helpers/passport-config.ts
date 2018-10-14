import { PassportStatic as Passport } from "passport";
import { Strategy as GoogleStrategy, StrategyOptionsWithRequest } from "passport-google-oauth2";

import { getOrRegisterUserWithGoogleProfile, getUser } from "../managers/user-manager";
import { Profile } from "../models/Profile";
import { User } from "../models/User";
import { getConstants, getSecret } from "./config-loader";

function init(passport: Passport) {

	const googleConfig: StrategyOptionsWithRequest = {
		clientID: getSecret("google.client.id"),
		clientSecret: getSecret("google.client.secret"),
		callbackURL: getConstants().host + "/auth/google/callback",
		passReqToCallback: true,
	};

	passport.serializeUser((user: User, callback) => {
		const userId = user.id;
		const profileId = user.activeProfile ? user.activeProfile.id : null;
		callback(null, JSON.stringify([userId, profileId]));
	});

	passport.deserializeUser((serialised: string, callback) => {
		if (!serialised) {
			return callback(null, null);
		}

		const userAndProfileId = JSON.parse(serialised) as string[];
		if (userAndProfileId.length !== 2) {
			return callback(new Error("Invalid user serialisation"));
		}

		const userId = userAndProfileId[0];
		const profileId = userAndProfileId[1];

		getUser(userId)
				.then((user) => {
					if (!user) {
						throw new Error("Could not find user");
					}

					user.activeProfile = user.profiles.filter((p: Profile) => !profileId || p.id === profileId)[0];
					if (!user.activeProfile) {
						user.activeProfile = user.profiles[0];
					}
					callback(null, user);
				})
				.catch(callback);
	});

	passport.use(new GoogleStrategy(googleConfig, (request, accessToken, refreshToken, profile, callback) => {
		getOrRegisterUserWithGoogleProfile(profile)
				.then((user) => callback(null, user))
				.catch(callback);
	}));
}

export { init };
