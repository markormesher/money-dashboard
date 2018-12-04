import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import * as Moment from "moment";
import { requireUser } from "../../middleware/auth-middleware";
import { DbTransaction } from "../../models/db/DbTransaction";
import { DbUser } from "../../models/db/DbUser";
import { MomentDateTransformer } from "../../models/helpers/MomentDateTransformer";
import { IAssetPerformanceData } from "../../models/IAssetPerformanceData";
import { DateModeOption } from "../../models/ITransaction";

const router = Express.Router();

router.get("/data", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	const startDate = Moment(req.query.startDate).startOf("day");
	const endDate = Moment(req.query.endDate).endOf("day");
	const dateMode: DateModeOption = req.query.dateMode;
	const dateField = `${dateMode}Date`;
	const accountId: string = req.query.accountId || "";
	const zeroBasis: boolean = req.query.zeroBasis === "true";

	const getTransactionsBeforeRange = DbTransaction
			.createQueryBuilder("transaction")
			.leftJoinAndSelect("transaction.category", "category")
			.leftJoin("transaction.account", "account")
			.where("transaction.profile_id = :profileId")
			.andWhere("account.id = :accountId")
			.andWhere(`transaction.${dateField} < :startDate`)
			.setParameters({
				accountId,
				profileId: user.activeProfile.id,
				startDate: MomentDateTransformer.toDbFormat(startDate),
			})
			.getMany();

	const getTransactionsInRange = DbTransaction
			.createQueryBuilder("transaction")
			.leftJoinAndSelect("transaction.category", "category")
			.leftJoin("transaction.account", "account")
			.where("transaction.profile_id = :profileId")
			.andWhere("account.id = :accountId")
			.andWhere(`transaction.${dateField} >= :startDate`)
			.andWhere(`transaction.${dateField} <= :endDate`)
			.orderBy(`transaction.${dateField}`, "ASC")
			.setParameters({
				accountId,
				profileId: user.activeProfile.id,
				startDate: MomentDateTransformer.toDbFormat(startDate),
				endDate: MomentDateTransformer.toDbFormat(endDate),
			})
			.getMany();

	Promise
			.all([
				getTransactionsBeforeRange,
				getTransactionsInRange,
			])
			.then((results) => {
				const transactionsBeforeRange = results[0];
				const transactionsInRange = results[1];

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
