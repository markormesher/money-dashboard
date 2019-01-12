import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import * as Moment from "moment";
import { IAssetPerformanceData } from "../../../commons/models/IAssetPerformanceData";
import { DateModeOption } from "../../../commons/models/ITransaction";
import { NULL_UUID } from "../../../commons/utils/entities";
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
	const accountId: string = req.query.accountId || "";
	const zeroBasis: boolean = req.query.zeroBasis === "true";

	const showAllAssets = accountId === NULL_UUID;

	let getTransactionsBeforeRange = getTransactionQueryBuilder({ withAccount: true, withCategory: true })
			.where("transaction.profile_id = :profileId")
			.andWhere(`transaction.${dateField} < :startDate`)
			.setParameters({
				profileId: user.activeProfile.id,
				startDate: MomentDateTransformer.toDbFormat(startDate),
			});

	if (showAllAssets) {
		getTransactionsBeforeRange = getTransactionsBeforeRange
				.andWhere("account.type = 'asset'");
	} else {
		getTransactionsBeforeRange = getTransactionsBeforeRange
				.andWhere("account.id = :accountId")
				.setParameters({
					accountId,
				});
	}

	let getTransactionsInRange = getTransactionQueryBuilder({ withAccount: true, withCategory: true })
			.where("transaction.profile_id = :profileId")
			.andWhere(`transaction.${dateField} >= :startDate`)
			.andWhere(`transaction.${dateField} <= :endDate`)
			.orderBy(`transaction.${dateField}`, "ASC")
			.setParameters({
				profileId: user.activeProfile.id,
				startDate: MomentDateTransformer.toDbFormat(startDate),
				endDate: MomentDateTransformer.toDbFormat(endDate),
			});

	if (showAllAssets) {
		getTransactionsInRange = getTransactionsInRange
				.andWhere("account.type = 'asset'");
	} else {
		getTransactionsInRange = getTransactionsInRange
				.andWhere("account.id = :accountId")
				.setParameters({
					accountId,
				});
	}

	Promise
			.all([
				getTransactionsBeforeRange.getMany(),
				getTransactionsInRange.getMany(),
			])
			.then(([transactionsBeforeRange, transactionsInRange]) => {
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

				transactionsInRange.forEach((transaction: DbTransaction) => {
					const rawDate = dateMode === "effective" ? transaction.effectiveDate : transaction.transactionDate;
					const date = rawDate.unix() * 1000;
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
	router,
};
