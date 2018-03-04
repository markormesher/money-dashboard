import Bluebird = require("bluebird");
import Express = require('express');
import { NextFunction, Request, Response } from 'express';
import * as Moment from "moment";
import { requireUser } from "../helpers/auth-helper";
import { User } from "../models/User";
import { getAccountBalances } from "../statistics/account-statistics";
import { getBudgetBalances } from "../statistics/budget-statistics";

const router = Express.Router();

router.get('/', requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;

	const now = Moment();
	const dashboardRangeStart = now.clone().startOf('month').toDate();
	const dashboardRangeEnd = now.clone().endOf('month').toDate();

	Bluebird
			.all([
				getAccountBalances(user),
				getBudgetBalances(user, dashboardRangeStart, dashboardRangeEnd)
			])
			.spread((accountBalances, budgetBalances) => {
				res.render('dashboard/index', {
					_: {
						activePage: 'dashboard',
					},
					accountBalances: accountBalances,
					budgetBalances: budgetBalances,
				})
			})
			.catch(next);
});

export = router;
