import { PassportStatic as Passport } from "passport";
import { Strategy as GoogleStrategy, StrategyOptionsWithRequest } from "passport-google-oauth2";
import { getConstants, getSecret } from "../../commons/config-loader";
import { getOrRegisterUserWithGoogleProfile, getUser } from "../managers/user-manager";
import { IUser } from "../models/IUser";

function init(passport: Passport): void {

	const googleConfig: StrategyOptionsWithRequest = {
		clientID: getSecret("google.client.id"),
		clientSecret: getSecret("google.client.secret"),
		callbackURL: getConstants().host + "/api/auth/google/callback",
		passReqToCallback: true,
	};

	passport.serializeUser((user: IUser, callback) => {
		callback(null, user.id);
	});

	passport.deserializeUser((userId: string, callback: (error: any, user?: IUser) => void) => {
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
