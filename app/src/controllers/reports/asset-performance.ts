import Bluebird = require("bluebird");
import Express = require("express");
import { NextFunction, Request, Response } from "express";
import * as sequelize from "sequelize";
import { Op } from "sequelize";

import { requireUser } from "../../helpers/auth-helper";
import { getAllAccounts } from "../../managers/account-manager";
import { Category } from "../../models/Category";
import { Transaction } from "../../models/Transaction";
import { User } from "../../models/User";

const router = Express.Router();

router.get("/", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;

	getAllAccounts(user, false)
			.then((accounts) => {
				const assets = accounts.filter(a => a.type == "asset");

				res.render("reports/asset-performance", {
					_: {
						title: "Asset Performance",
						activePage: "reports/asset-performance",
					},
					assets
				});
			})
			.catch(next);
});

router.get("/data", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;

	const startDate = req.query.startDate;
	const endDate = req.query.endDate;
	const dateField: "effectiveDate" | "transactionDate" = req.query.dateField;
	const account: string = req.query.account || '';

	const getTransactionsBeforeRange = Transaction.findAll({
		where: {
			profileId: user.activeProfile.id,
			accountId: account,
			[dateField]: {
				[Op.lt]: startDate
			}
		},
		include: [{
			model: Category
		}],
	});
	const getTransactionsInRange = Transaction.findAll({
		where: {
			profileId: user.activeProfile.id,
			accountId: account,
			[dateField]: {
				[Op.gte]: startDate,
				[Op.lte]: endDate,
			}
		},
		include: [{
			model: Category
		}],
		order: [[dateField, "ASC"]],
	});

	Bluebird
			.all([
				getTransactionsBeforeRange,
				getTransactionsInRange
			])
			.spread((transactionsBeforeRange: Transaction[], transactionsInRange: Transaction[]) => {
				const dataInclGrowth: { x: number, y: number }[] = [];
				const dataExclGrowth: { x: number, y: number }[] = [];

				let runningTotalInclGrowth = transactionsBeforeRange
						.map(t => t.amount)
						.reduce((a, b) => a + b, 0);
				let runningTotalExclGrowth = transactionsBeforeRange
						.filter(t => !t.category.isAssetGrowthCategory)
						.map(t => t.amount)
						.reduce((a, b) => a + b, 0);

				let lastDate = 0;

				const takeValues = () => {
					dataInclGrowth.push({ x: lastDate, y: runningTotalInclGrowth });
					dataExclGrowth.push({ x: lastDate, y: runningTotalExclGrowth });
				};

				transactionsInRange.forEach((transaction: Transaction) => {
					const date = new Date(transaction[dateField]).getTime();
					if (lastDate > 0 && lastDate != date) {
						takeValues();
					}

					lastDate = date;
					runningTotalInclGrowth += transaction.amount;
					if (!transaction.category.isAssetGrowthCategory) {
						runningTotalExclGrowth += transaction.amount;
					}
				});

				if (lastDate > 0) {
					takeValues();
				}

				res.json({ dataInclGrowth, dataExclGrowth });
			})
			.catch(next);
});


export = router;
