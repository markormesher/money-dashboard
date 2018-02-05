import Express = require('express');

import {Op} from 'sequelize'
import {NextFunction, Request, Response} from 'express';
import AuthHelper = require('../../helpers/auth-helper');
import ProfileManager = require('../../managers/profile-manager');
import {Profile} from '../../models/Profile';
import {getData} from "../../helpers/datatable-helper";
import {IFindOptions} from "sequelize-typescript";
import {User} from "../../models/User";

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

	const countQuery: IFindOptions<Profile> = {
		include: [{
			model: User,
			where: {
				id: user.id
			}
		}]
	};
	const dataQuery: IFindOptions<Profile> = {
		where: {
			name: {[Op.iLike]: `%${searchTerm}%`}
		},
		include: [{
			model: User,
			where: {
				id: user.id
			}
		}]
	};

	getData(Profile, req, countQuery, dataQuery)
			.then((response) => res.json(response))
			.catch(next);
});

router.get('/edit/:profileId?', AuthHelper.requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	const profileId = req.params['profileId'];

	ProfileManager
			.getProfile(user, profileId)
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
	const properties: Partial<Profile> = {
		name: req.body['name']
	};

	ProfileManager
			.saveProfile(user, profileId, properties)
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

router.get('/select/:profileId', AuthHelper.requireUser, (req: Request, res: Response) => {
	const user = req.user;
	const profileId = req.params['profileId'];

	user.activeProfile = user.profiles.find((p: Profile) => p.id === profileId);
	req.login(user, () => res.redirect(req.get('Referrer') || '/'));
});

export = router;
