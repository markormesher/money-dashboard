import {PassportStatic as Passport} from 'passport';
import {Strategy as GoogleStrategy, StrategyOptionsWithRequest} from 'passport-google-oauth2';
import ConfigLoader = require('./config-loader');

import {User} from '../models/User';
import UserManager = require('../managers/user-manager');

const init = (passport: Passport) => {

	const googleConfig: StrategyOptionsWithRequest = {
		clientID: ConfigLoader.getSecret('google.client.id'),
		clientSecret: ConfigLoader.getSecret('google.client.secret'),
		callbackURL: 'http://localhost:3006/auth/google/callback',
		passReqToCallback: true
	};

	passport.serializeUser((user: User, callback) => callback(null, user.id));

	passport.deserializeUser((userId: string, callback) => {
		UserManager.getById(userId)
				.then(user => callback(null, user))
				.catch(callback);
	});

	passport.use(new GoogleStrategy(googleConfig, (request, accessToken, refreshToken, profile, callback) => {
		UserManager.getOrRegisterWithGoogleProfile(profile)
				.then(user => callback(null, user))
				.catch(callback);
	}));
};

export {init};
