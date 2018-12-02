import { PassportStatic as Passport } from "passport";
import { Strategy as GoogleStrategy, StrategyOptionsWithRequest } from "passport-google-oauth2";
import { getOrRegisterUserWithGoogleProfile, getUser } from "../managers/user-manager";
import { User } from "../models/User";
import { getConstants, getSecret } from "./config-loader";

function init(passport: Passport): void {

	const googleConfig: StrategyOptionsWithRequest = {
		clientID: getSecret("google.client.id"),
		clientSecret: getSecret("google.client.secret"),
		callbackURL: getConstants().host + "/auth/google/callback",
		passReqToCallback: true,
	};

	passport.serializeUser((user: User, callback) => {
		callback(null, user.id);
	});

	passport.deserializeUser((userId: string, callback: (error: any, user?: User) => void) => {
		if (!userId) {
			return callback(null, null);
		}

		getUser(userId)
				.then((user) => {
					if (!user) {
						throw new Error("Could not find user");
					} else {
						callback(null, user);
					}
				})
				.catch(callback);
	});

	passport.use(new GoogleStrategy(googleConfig, (request, accessToken, refreshToken, profile, callback) => {
		getOrRegisterUserWithGoogleProfile(profile)
				.then((user) => callback(null, user))
				.catch(callback);
	}));
}

export {
	init,
};
