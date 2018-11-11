import * as Bluebird from "bluebird";
import { ChartDataSets } from "chart.js";
import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import * as sequelize from "sequelize";
import { Op } from "sequelize";
import { requireUser } from "../../middleware/auth-middleware";
import { Transaction } from "../../models/Transaction";
import { User } from "../../models/User";

interface IBalanceGraphData {
	readonly datasets: ChartDataSets[];
	readonly minTotal: number;
	readonly maxTotal: number;
	readonly minDate: number;
	readonly maxDate: number;
	readonly changeAbsolute: number;
}

const router = Express.Router();

router.get("/data", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;

	const startDate = req.query.startDate;
	const endDate = req.query.endDate;
	const dateField: "effectiveDate" | "transactionDate" = req.query.dateField;

	const getSumBeforeRange = Transaction.findOne({
		attributes: [[sequelize.fn("SUM", sequelize.col("amount")), "balance"]],
		where: {
			profileId: user.activeProfile.id,
			[dateField]: {
				[Op.lt]: startDate,
			},
		},
	});
	const getTransactionsInRange = Transaction.findAll({
		where: {
			profileId: user.activeProfile.id,
			[dateField]: {
				[Op.gte]: startDate,
				[Op.lte]: endDate,
			},
		},
		order: [[dateField, "ASC"]],
	});

	Bluebird
			.all([
				getSumBeforeRange,
				getTransactionsInRange,
			])
			.spread((sumBeforeRange: Transaction, transactionsInRange: Transaction[]) => {
				const data: Array<{ x: number, y: number }> = [];

				let lastDate = 0;
				let runningTotal = sumBeforeRange.getDataValue("balance") as number;

				let minTotal = Number.MAX_VALUE;
				let maxTotal = Number.MIN_VALUE;
				let minDate = 0;
				let maxDate = 0;

				const takeValues = () => {
					data.push({ x: lastDate, y: runningTotal });

					if (runningTotal < minTotal) {
						minTotal = runningTotal;
						minDate = lastDate;
					}

					if (runningTotal > maxTotal) {
						maxTotal = runningTotal;
						maxDate = lastDate;
					}
				};

				transactionsInRange.forEach((transaction: Transaction) => {
					const date = new Date(transaction[dateField]).getTime();
					if (lastDate > 0 && lastDate !== date) {
						takeValues();
					}

					lastDate = date;
					runningTotal += transaction.amount;
				});
				if (lastDate > 0) {
					takeValues();
				}

				let changeAbsolute = 0;
				if (data.length === 0) {
					minTotal = 0;
					maxTotal = 0;
					minDate = -1;
					maxDate = -1;
				} else {
					changeAbsolute = data[data.length - 1].y - data[0].y;
				}

				res.json({
					datasets: [{ data }],
					minTotal,
					minDate,
					maxTotal,
					maxDate,
					changeAbsolute,
				});
			})
			.catch(next);
});

export {
	router,
	IBalanceGraphData,
};
