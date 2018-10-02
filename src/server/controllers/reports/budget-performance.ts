import Express = require("express");
import _ = require("lodash");
import { NextFunction, Request, Response } from "express";

import { requireUser } from "../../middleware/auth-middleware";
import { getAllBudgets } from "../../managers/budget-manager";
import { Budget } from "../../models/Budget";
import { User } from "../../models/User";
import { IBudgetBalance, getBudgetBalances } from "../../statistics/budget-statistics";

const router = Express.Router();

router.get("/old-index", requireUser, (req: Request, res: Response) => {
	res.render("reports/budget-performance", {
		_: {
			title: "Budget Performance",
			activePage: "reports/budget-performance",
		}
	});
});

router.get("/table-data", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;

	const startDate = req.query.startDate;
	const endDate = req.query.endDate;
	const rawOrder: { column: number, dir: string }[] = req.query.order;

	getBudgetBalances(user, startDate, endDate)
			.then((budgets) => {
				const budgetBuckets: [string, IBudgetBalance[]][] = _(budgets)
						.groupBy((b: IBudgetBalance) => b.budget.category.name)
						.toPairs()
						.value();

				if (rawOrder[0].dir == "asc") {
					budgetBuckets.sort((a, b) => a[0].localeCompare(b[0]));
				} else {
					budgetBuckets.sort((a, b) => b[0].localeCompare(a[0]));
				}

				res.json({
					recordsTotal: budgetBuckets.length,
					recordsFiltered: budgetBuckets.length,
					data: budgetBuckets
				});
			})
			.catch(next);
});

export = router;
