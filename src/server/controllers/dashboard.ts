import * as Bluebird from "bluebird";
import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import * as Moment from "moment";
import { requireUser } from "../middleware/auth-middleware";
import { User } from "../models/User";
import { getAccountBalances } from "../statistics/account-statistics";
import { getBudgetBalances } from "../statistics/budget-statistics";
import { getMemoCategoryBalances } from "../statistics/category-statistics";

const dashboardRouter = Express.Router();

dashboardRouter.get("/old-index", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;

	const now = Moment();
	const dashboardRangeStart = now.clone().startOf("month").toDate();
	const dashboardRangeEnd = now.clone().endOf("month").toDate();

	Bluebird
			.all([
				getAccountBalances(user),
				getBudgetBalances(user, dashboardRangeStart, dashboardRangeEnd),
				getMemoCategoryBalances(user),
			])
			.spread((accountBalances, budgetBalances, memoCategoryBalances) => {
				res.render("dashboard/index", {
					_: {
						activePage: "dashboard",
					},
					accountBalances,
					budgetBalances,
					memoCategoryBalances,
				});
			})
			.catch(next);
});

export {
	dashboardRouter,
};
