import Bluebird = require("bluebird");
import Express = require('express');
import { NextFunction, Request, Response } from 'express';
import * as Moment from "moment";
import { requireUser } from "../helpers/auth-helper";
import { Account } from "../models/Account";
import { User } from "../models/User";
import { getAccountBalances } from "../statistics/account-statistics";

const router = Express.Router();

router.get('/', requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;

	const now = Moment();
	const dashboardRangeStart = now.clone().subtract(1, 'month').startOf('month').toDate();
	const dashboardRangeEnd = now.clone().subtract(1, 'month').endOf('month').toDate();

	Bluebird
			.all([
				getAccountBalances(user),
			])
			.spread((
					accountBalances: [Account, number],
			) => {
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
