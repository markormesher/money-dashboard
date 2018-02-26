import Express = require('express');

import {Op} from 'sequelize'
import {NextFunction, Request, Response} from 'express';
import AuthHelper = require('../../helpers/auth-helper');
import AccountManager = require('../../managers/account-manager');
import {Account} from '../../models/Account';
import {getData} from "../../helpers/datatable-helper";
import {IFindOptions} from "sequelize-typescript";
import {User} from "../../models/User";

const router = Express.Router();

router.get('/', AuthHelper.requireUser, (req: Request, res: Response) => {
	res.render('settings/accounts/index', {
		_: {
			title: 'Accounts',
			activePage: 'settings/accounts'
		}
	});
});

router.get('/table-data', AuthHelper.requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const searchTerm = req.query['search']['value'];

	const countQuery: IFindOptions<Account> = {
		where: {
			profileId: user.activeProfile.id
		}
	};
	const dataQuery: IFindOptions<Account> = {
		where: {
			[Op.and]: {
				profileId: user.activeProfile.id,
				[Op.or]: {
					name: {
						[Op.iLike]: `%${searchTerm}%`
					},
					type: {
						[Op.iLike]: `%${searchTerm}%`
					}
				}
			}
		}
	};

	getData(Account, req, countQuery, dataQuery)
			.then((response) => res.json(response))
			.catch(next);
});

router.get('/edit/:accountId?', AuthHelper.requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const accountId = req.params['accountId'];

	AccountManager
			.getAccount(user, accountId)
			.then(account => {
				res.render('settings/accounts/edit', {
					_: {
						activePage: 'settings/account',
						title: accountId ? 'Edit Account' : 'New Account'
					},
					account: account || new Account()
				});
			})
			.catch(next);
});

router.post('/edit/:accountId', AuthHelper.requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const accountId = req.params['accountId'];
	const properties: Partial<Account> = {
		name: req.body['name'],
		type: req.body['type']
	};

	AccountManager
			.saveAccount(user, accountId, properties)
			.then(() => {
				res.flash('success', 'Account saved');
				res.redirect('/settings/accounts');
			})
			.catch(next);
});

router.post('/delete/:accountId', AuthHelper.requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const accountId = req.params['accountId'];

	AccountManager
			.deleteAccount(user, accountId)
			.then(() => res.status(200).end())
			.catch(next);
});

export = router;
