import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import * as Moment from "moment";
import { IBalanceHistoryData } from "../../../commons/models/IBalanceHistoryData";
import { DateModeOption } from "../../../commons/models/ITransaction";
import { DbTransaction } from "../../db/models/DbTransaction";
import { DbUser } from "../../db/models/DbUser";
import { MomentDateTransformer } from "../../db/MomentDateTransformer";
import { getTransactionQueryBuilder } from "../../managers/transaction-manager";
import { requireUser } from "../../middleware/auth-middleware";

const router = Express.Router();

router.get("/data", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	const startDate = Moment(req.query.startDate).startOf("day");
	const endDate = Moment(req.query.endDate).endOf("day");
	const dateMode: DateModeOption = req.query.dateMode;
	const dateField = `${dateMode}Date`;

	const getSumBeforeRange = getTransactionQueryBuilder()
			.select("SUM(transaction.amount)", "balance")
			.where("transaction.profile_id = :profileId")
			.andWhere(`transaction.${dateField} < :startDate`)
			.setParameters({
				profileId: user.activeProfile.id,
				startDate: MomentDateTransformer.toDbFormat(startDate),
			})
			.getRawOne() as Promise<{ balance: number }>;

	const getTransactionsInRange = getTransactionQueryBuilder()
			.where("transaction.profile_id = :profileId")
			.andWhere(`transaction.${dateField} >= :startDate`)
			.andWhere(`transaction.${dateField} <= :endDate`)
			.orderBy(`transaction.${dateField}`, "ASC")
			.setParameters({
				profileId: user.activeProfile.id,
				startDate: MomentDateTransformer.toDbFormat(startDate),
				endDate: MomentDateTransformer.toDbFormat(endDate),
			})
			.getMany();

	Promise
			.all([
				getSumBeforeRange,
				getTransactionsInRange,
			])
			.then(([sumBeforeRange, transactionsInRange]) => {
				const data: Array<{ x: number, y: number }> = [];

				let lastDate = 0;
				let runningTotal = sumBeforeRange.balance;

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

				transactionsInRange.forEach((transaction: DbTransaction) => {
					const rawDate = dateMode === "effective" ? transaction.effectiveDate : transaction.transactionDate;
					const date = rawDate.unix() * 1000;
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
