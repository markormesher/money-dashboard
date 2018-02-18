import {PassportStatic as Passport} from 'passport';
import {Strategy as GoogleStrategy, StrategyOptionsWithRequest} from 'passport-google-oauth2';
import ConfigLoader = require('./config-loader');

import {User} from '../models/User';
import UserManager = require('../managers/user-manager');

function init(passport: Passport) {

	const googleConfig: StrategyOptionsWithRequest = {
		clientID: ConfigLoader.getSecret('google.client.id'),
		clientSecret: ConfigLoader.getSecret('google.client.secret'),
		callbackURL: ConfigLoader.getConstants().host + '/auth/google/callback',
		passReqToCallback: true
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
			return callback(new Error('Invalid user serialisation'));
		}

		const userId = userAndProfileId[0];
		const profileId = userAndProfileId[1];

		UserManager.getById(userId)
				.then(user => {
					user.activeProfile = user.profiles.find(p => !profileId || p.id === profileId);
					if (!user.activeProfile) {
						user.activeProfile = user.profiles[0];
					}
					callback(null, user)
				})
				.catch(callback);
	});

	passport.use(new GoogleStrategy(googleConfig, (request, accessToken, refreshToken, profile, callback) => {
		UserManager.getOrRegisterWithGoogleProfile(profile)
				.then(user => callback(null, user))
				.catch(callback);
	}));
}

export {init};
