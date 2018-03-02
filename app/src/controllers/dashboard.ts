import Express = require('express');
import {NextFunction, Request, Response} from 'express';
import AuthHelper = require('../helpers/auth-helper');
import Bluebird = require("bluebird");
import AccountStatistics = require("../statistics/account-statistics");
import {User} from "../models/User";
import {Account} from "../models/Account";

const router = Express.Router();

router.get('/', AuthHelper.requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;

	Bluebird
			.all([
				AccountStatistics.getAccountBalances(user),
			])
			.spread((accountBalances: [Account, number]) => {
				res.render('dashboard/index', {
					_: {
						activePage: 'dashboard',
					},
					accountBalances: accountBalances,
				})
			})
			.catch(next);
});

export = router;
