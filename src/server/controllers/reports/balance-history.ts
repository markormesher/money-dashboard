import * as Bluebird from "bluebird";
import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import * as Moment from "moment";
import * as sequelize from "sequelize";
import { Op } from "sequelize";
import { requireUser } from "../../middleware/auth-middleware";
import { IBalanceHistoryData } from "../../model-thins/IBalanceHistoryData";
import { DateModeOption, Transaction } from "../../models/Transaction";
import { User } from "../../models/User";

const router = Express.Router();

router.get("/data", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;

	const startDate = Moment(req.query.startDate).startOf("day").toISOString();
	const endDate = Moment(req.query.endDate).endOf("day").toISOString();
	const dateMode: DateModeOption = req.query.dateMode;

	const dateField = `${dateMode}Date`;

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
					const rawDate = dateMode === "effective" ? transaction.effectiveDate : transaction.transactionDate;
					const date = new Date(rawDate).getTime();
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
					datasets: [{ label: "Balance", data }],
					minTotal,
					minDate,
					maxTotal,
					maxDate,
					changeAbsolute,
				} as IBalanceHistoryData);
			})
			.catch(next);
});

export {
	router,
};
