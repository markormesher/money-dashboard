import * as Bluebird from "bluebird";
import { ChartDataSets } from "chart.js";
import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { requireUser } from "../../middleware/auth-middleware";
import { Category } from "../../models/Category";
import { DateModeOption, Transaction } from "../../models/Transaction";
import { User } from "../../models/User";

interface IAssetPerformanceData {
	readonly datasets: ChartDataSets[];
	readonly totalChangeInclGrowth: number;
	readonly totalChangeExclGrowth: number;
}

const router = Express.Router();

router.get("/data", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;

	const startDate = req.query.startDate;
	const endDate = req.query.endDate;
	const dateMode: DateModeOption = req.query.dateMode;
	const accountId: string = req.query.accountId || "";
	const zeroBasis: boolean = req.query.zeroBasis === "true";

	const dateField = `${dateMode}Date`;

	const getTransactionsBeforeRange = Transaction.findAll({
		where: {
			profileId: user.activeProfile.id,
			accountId,
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
			accountId,
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
					if (zeroBasis) {
						dataInclGrowth.push({ x: lastDate, y: runningTotalInclGrowth - runningTotalExclGrowth });
						dataExclGrowth.push({ x: lastDate, y: 0 });
					} else {
						dataInclGrowth.push({ x: lastDate, y: runningTotalInclGrowth });
						dataExclGrowth.push({ x: lastDate, y: runningTotalExclGrowth });
					}
				};

				transactionsInRange.forEach((transaction: Transaction) => {
					const rawDate = dateMode === "effective" ? transaction.effectiveDate : transaction.transactionDate;
					const date = new Date(rawDate).getTime();
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
					datasets: [
						{ label: "Including Growth", data: dataInclGrowth },
						{ label: "Excluding Growth", data: dataExclGrowth },
					],
					totalChangeInclGrowth,
					totalChangeExclGrowth,
				} as IAssetPerformanceData);
			})
			.catch(next);
});

export {
	IAssetPerformanceData,
	router,
};
