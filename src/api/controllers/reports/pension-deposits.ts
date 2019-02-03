import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import { IDetailedCategoryBalance } from "../../../commons/models/IDetailedCategoryBalance";
import { IPensionDepositsData } from "../../../commons/models/IPensionDepositsData";
import { DateModeOption, ITransaction } from "../../../commons/models/ITransaction";
import { getTaxYear, groupBy } from "../../../commons/utils/helpers";
import { DbUser } from "../../db/models/DbUser";
import { getTransactionQueryBuilder } from "../../managers/transaction-manager";
import { requireUser } from "../../middleware/auth-middleware";

const router = Express.Router();

router.get("/data", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	const dateMode: DateModeOption = req.query.dateMode;

	const getYear = (transaction: ITransaction) => {
		if (dateMode === "transaction") {
			return getTaxYear(transaction.transactionDate);
		} else {
			return getTaxYear(transaction.effectiveDate);
		}
	};

	getTransactionQueryBuilder({ withAccount: true, withCategory: true })
			.where("transaction.profile_id = :profileId")
			.andWhere("account.name ILIKE '%pension%'") // TODO: use specific account type
			.andWhere("transaction.deleted = FALSE")
			.setParameters({
				profileId: user.activeProfile.id,
			})
			.getMany()
			.then((transactions) => {
				if (!transactions || !transactions.length) {
					return null;
				}

				const allYears = transactions
						.map((t) => getYear(t))
						.filter((year, idx, arr) => arr.indexOf(year) === idx);
				const allCategories = transactions
						.map((t) => t.category)
						.filter((cat, idx, arr) => arr.findIndex((c) => c.id === cat.id) === idx);
				const yearData: { [key: number]: { [id: string]: IDetailedCategoryBalance } } = {};

				for (const year of allYears) {
					yearData[year] = {};
					const transactionsInYear = transactions.filter((t) => getYear(t) === year);
					const groupedTransactions = groupBy(transactionsInYear, (t) => t.category.id);
					Object.entries(groupedTransactions).map(([categoryId, transactionsForCategory]) => {
						const amounts = transactionsForCategory.map((t) => t.amount);
						yearData[year][categoryId] = {
							category: transactionsForCategory[0].category,
							balanceIn: amounts.filter((a) => a > 0).reduce((a, b) => a + b, 0),
							balanceOut: amounts.filter((a) => a < 0).reduce((a, b) => a + b, 0),
						} as IDetailedCategoryBalance;
					});
				}

				return {
					allYears,
					allCategories,
					yearData,
				} as IPensionDepositsData;
			})
			.then((data) => res.json(data))
			.catch(next);
});

export {
	router,
};
