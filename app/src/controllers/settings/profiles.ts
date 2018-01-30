import Express = require('express');

import {Op, ValidationError, WhereOptions} from 'sequelize'
import {NextFunction, Request, Response} from 'express';
import AuthHelper = require('../../helpers/auth-helper');
import ProfileManager = require('../../managers/profile-manager');
import {Profile} from '../../models/Profile';
import {getData} from "../../helpers/datatable-helper";

const router = Express.Router();

router.get('/', AuthHelper.requireUser, (req: Request, res: Response) => {
	res.render('settings/profiles/index', {
		_: {
			title: 'Profiles',
			activePage: 'settings/profiles'
		}
	});
});

router.get('/table-data', AuthHelper.requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	const searchTerm = req.query['search']['value'];
	const countQuery: WhereOptions<Profile> = {
		userId: user.id
	};
	const dataQuery: WhereOptions<Profile> = {
		userId: user.id,
		name: {[Op.iLike]: `%${searchTerm}%`}
	};

	getData(Profile, req, countQuery, dataQuery)
			.then((response) => res.json(response))
			.catch(next);
});

router.get('/edit/:profileId?', AuthHelper.requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	const profileId = req.params['profileId'];
	ProfileManager
			.getById(profileId, user)
			.then((profile) => {
				if (profile) {
					return profile;
				} else {
					return new Profile();
				}
			})
			.then((profile) => {
				res.render('settings/profiles/edit', {
					_: {
						activePage: 'settings/profiles',
						title: profileId ? 'Edit Profile' : 'New Profile'
					},
					profile: profile
				});
			})
			.catch(next);
});

router.post('/edit/:profileId', AuthHelper.requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	const profileId = req.params['profileId'];
	ProfileManager
			.getById(profileId)
			.then((profile) => {
				if (profile) {
					return profile;
				} else {
					return new Profile();
				}
			})
			.then((profile) => {
				// update and save profile
				profile.name = req.body['name'];
				profile.active = profile.active || false;
				profile.userId = user.id;
				return profile.save();
			})
			.then(() => {
				res.flash('success', 'Profile saved.');
				res.redirect('/settings/profiles');
			})
			.catch(next);
});

router.get('/delete/:profileId', AuthHelper.requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	const profileId = req.params['profileId'];

	if (user.profiles.length <= 1) {
		res.redirect('/settings/profiles');
		return;
	}

	ProfileManager
			.getById(profileId)
			.then((profile) => {
				// check that the profile exists and is owned by this user
				if (!profile || profile.userId !== user.id) {
					throw new Error("Profile cannot be selected");
				} else {
					return profile;
				}
			})
			.then((profile) => {
				res.render('crud/delete', {
					_: {
						activePage: 'settings/profiles',
						title: 'Delete Profile',
					},
					label: profile.name,
					returnUrl: '/settings/profiles',
					deleteUrl: '/settings/profiles/delete/' + profile.id + '/confirmed'
				});
			})
			.catch(next);
});

router.get('/delete/:profileId/confirmed', AuthHelper.requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	const profileId = req.params['profileId'];

	if (user.profiles.length <= 1) {
		res.redirect('/settings/profiles');
		return;
	}

	ProfileManager
			.getById(profileId, user)
			.then((profile) => {
				if (!profile) {
					throw new Error('That profile does not exist');
				} else {
					return profile;
				}
			})
			.then((profile) => {
				return profile.destroy();
			})
			.then(() => {
				res.redirect('/settings/profiles')
			})
			.catch(next);
});

router.get('/select/:profileId', AuthHelper.requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	const profileId = req.params['profileId'];
	ProfileManager
			.getById(profileId, user)
			.then((profile) => {
				if (!profile) {
					throw new Error('That profile does not exist');
				} else {
					return profile;
				}
			})
			.then((profile) => {
				return ProfileManager.setActiveProfile(user, profile);
			})
			.then(() => {
				res.redirect(req.get('Referrer') || '/')
			})
			.catch(next);
});

export = router;
