import * as Bluebird from "bluebird";
import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { getAllAccounts } from "../../managers/account-manager";
import { requireUser } from "../../middleware/auth-middleware";
import { Category } from "../../models/Category";
import { Transaction } from "../../models/Transaction";
import { User } from "../../models/User";

const assetPerformanceReportRouter = Express.Router();

assetPerformanceReportRouter.get("/old-index", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;

	getAllAccounts(user, false)
			.then((accounts) => {
				const assets = accounts.filter((a) => a.type === "asset");

				if (assets.length === 0) {
					// TODO res.flash("info", "None of your accounts are assets.");
					res.redirect("/");
					return;
				}

				res.render("reports/asset-performance", {
					_: {
						title: "Asset Performance",
						activePage: "reports/asset-performance",
					},
					assets,
				});
			})
			.catch(next);
});

assetPerformanceReportRouter.get("/data", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;

	const startDate = req.query.startDate;
	const endDate = req.query.endDate;
	const dateField: "effectiveDate" | "transactionDate" = req.query.dateField;
	const account: string = req.query.account || "";

	const getTransactionsBeforeRange = Transaction.findAll({
		where: {
			profileId: user.activeProfile.id,
			accountId: account,
			[dateField]: {
				[Op.lt]: startDate,
			},
		},
		include: [{
			model: Category,
		}],
	});
	const getTransactionsInRange = Transaction.findAll({
		where: {
			profileId: user.activeProfile.id,
			accountId: account,
			[dateField]: {
				[Op.gte]: startDate,
				[Op.lte]: endDate,
			},
		},
		include: [{
			model: Category,
		}],
		order: [[dateField, "ASC"]],
	});

	Bluebird
			.all([
				getTransactionsBeforeRange,
				getTransactionsInRange,
			])
			.spread((transactionsBeforeRange: Transaction[], transactionsInRange: Transaction[]) => {
				const dataInclGrowth: Array<{ x: number, y: number }> = [];
				const dataExclGrowth: Array<{ x: number, y: number }> = [];

				let runningTotalInclGrowth = transactionsBeforeRange
						.map((t) => t.amount)
						.reduce((a, b) => a + b, 0);
				let runningTotalExclGrowth = transactionsBeforeRange
						.filter((t) => !t.category.isAssetGrowthCategory)
						.map((t) => t.amount)
						.reduce((a, b) => a + b, 0);

				let lastDate = 0;

				let totalChangeInclGrowth = 0;
				let totalChangeExclGrowth = 0;

				const takeValues = () => {
					dataInclGrowth.push({ x: lastDate, y: runningTotalInclGrowth });
					dataExclGrowth.push({ x: lastDate, y: runningTotalExclGrowth });
				};

				transactionsInRange.forEach((transaction: Transaction) => {
					const date = transaction[dateField].getTime();
					if (lastDate > 0 && lastDate !== date) {
						takeValues();
					}

					lastDate = date;
					runningTotalInclGrowth += transaction.amount;
					totalChangeInclGrowth += transaction.amount;
					if (!transaction.category.isAssetGrowthCategory) {
						runningTotalExclGrowth += transaction.amount;
						totalChangeExclGrowth += transaction.amount;
					}
				});

				if (lastDate > 0) {
					takeValues();
				}

				res.json({
					dataInclGrowth,
					dataExclGrowth,
					totalChangeInclGrowth,
					totalChangeExclGrowth,
				});
			})
			.catch(next);
});

export {
	assetPerformanceReportRouter,
};
