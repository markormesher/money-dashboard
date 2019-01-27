import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import * as Moment from "moment";
import { IDataTableResponse } from "../../../commons/models/IDataTableResponse";
import { IDetailedAccountBalance } from "../../../commons/models/IDetailedAccountBalance";
import { DateModeOption } from "../../../commons/models/ITransaction";
import { getTaxYear } from "../../../commons/utils/helpers";
import { logger } from "../../../commons/utils/logging";
import { DbAccount } from "../../db/models/DbAccount";
import { DbUser } from "../../db/models/DbUser";
import { MomentDateTransformer } from "../../db/MomentDateTransformer";
import { getAllAccounts } from "../../managers/account-manager";
import { getTransactionQueryBuilder } from "../../managers/transaction-manager";
import { requireUser } from "../../middleware/auth-middleware";

const router = Express.Router();

router.get("/min-year", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	getTransactionQueryBuilder({ withAccount: true })
			.select("MIN(transaction.transaction_date)", "minTransactionDate")
			.addSelect("MIN(transaction.effective_date)", "minEffectiveDate")
			.where("account.name LIKE '%ISA%'")
			.andWhere("transaction.profile_id = :profileId")
			.andWhere("transaction.deleted = FALSE")
			.setParameters({
				profileId: user.activeProfile.id,
			})
			.getRawOne()
			.then(({ minTransactionDate, minEffectiveDate }) => {
				const minDate = MomentDateTransformer.fromDbFormat(Math.min(minEffectiveDate, minTransactionDate));
				res.json(getTaxYear(minDate));
			})
			.catch(next);
});

router.get("/table-data", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	const startDate: Moment.Moment = Moment(req.query.startDate);
	const endDate: Moment.Moment = Moment(req.query.endDate);
	const dateMode: DateModeOption = req.query.dateMode;
	const dateField = `${dateMode}Date`;

	const order: Array<[string, "ASC" | "DESC"]> = req.query.order || [];
	const start = parseInt(req.query.start, 10);
	const length = parseInt(req.query.length, 10);
	const searchTerm = req.query.searchTerm || "";

	const getAccounts = getAllAccounts(user, false);
	let getTransactions = getTransactionQueryBuilder({ withAccount: true, withCategory: true })
			.select("account.id", "accountId")
			.addSelect("SUM(CASE WHEN transaction.amount < 0 THEN transaction.amount ELSE 0 END) * -1", "balanceOut")
			.addSelect("SUM(CASE WHEN transaction.amount > 0 THEN transaction.amount ELSE 0 END)", "balanceIn")
			.where("transaction.profile_id = :profileId")
			.andWhere("account.name LIKE '%ISA%'")
			.andWhere("account.name LIKE :searchTerm")
			.andWhere("category.is_asset_growth_category = FALSE")
			.andWhere(`transaction.${dateField} >= :startDate`)
			.andWhere(`transaction.${dateField} <= :endDate`)
			.andWhere("transaction.deleted = FALSE")
			.groupBy("account.id")
			.skip(start)
			.take(length)
			.setParameters({
				profileId: user.activeProfile.id,
				startDate: MomentDateTransformer.toDbFormat(startDate.startOf("day")),
				endDate: MomentDateTransformer.toDbFormat(endDate.endOf("day")),
				searchTerm: `%${searchTerm}%`,
			});
	order.forEach((o) => getTransactions = getTransactions.addOrderBy(o[0], o[1]));

	Promise
			.all([
				getAccounts,
				getTransactions.getRawMany() as Promise<Array<{ accountId: string, balanceOut: number, balanceIn: number }>>,
			])
			.then(([accounts, balances]) => {
				const accountMap: { [key: string]: DbAccount } = {};
				accounts.forEach((a) => accountMap[a.id] = a);

				res.json({
					filteredRowCount: balances.length,
					totalRowCount: balances.length,
					data: balances.map((b) => ({
						account: accountMap[b.accountId],
						balanceOut: b.balanceOut,
						balanceIn: b.balanceIn,
					})),
				} as IDataTableResponse<IDetailedAccountBalance>);
			})
			.catch(next);
});

export {
	router,
};
