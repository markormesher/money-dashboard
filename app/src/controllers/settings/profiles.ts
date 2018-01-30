import Express = require('express');

import {Op, WhereOptions} from 'sequelize'
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
			.getProfileById(profileId, user)
			.then((profile) => {
				res.render('settings/profiles/edit', {
					_: {
						activePage: 'settings/profiles',
						title: profileId ? 'Edit Profile' : 'New Profile'
					},
					profile: profile || new Profile()
				});
			})
			.catch(next);
});

router.post('/edit/:profileId', AuthHelper.requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	const profileId = req.params['profileId'];
	ProfileManager
			.getProfileById(profileId)
			.then((profile) => {
				profile = profile || new Profile();

				// update and save profile
				profile.name = req.body['name'];
				profile.active = profile.active || false;
				profile.userId = user.id;
				return profile.save();
			})
			.then(() => {
				res.flash('success', 'Profile saved');
				res.redirect('/settings/profiles');
			})
			.catch(next);
});

router.post('/delete/:profileId', AuthHelper.requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	const profileId = req.params['profileId'];

	ProfileManager
			.deleteProfile(user, profileId)
			.then(() => res.status(200).end())
			.catch(next);
});

router.get('/select/:profileId', AuthHelper.requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	const profileId = req.params['profileId'];

	ProfileManager
			.setActiveProfile(user, profileId)
			.then(() => res.redirect(req.get('Referrer') || '/'))
			.catch(next);
});

export = router;
