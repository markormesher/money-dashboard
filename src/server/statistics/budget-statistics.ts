import * as Bluebird from "bluebird";
import * as Moment from "moment";
import * as sequelize from "sequelize";
import { Op } from "sequelize";

import { getAllBudgets } from "../managers/budget-manager";
import { ThinBudget } from "../model-thins/ThinBudget";
import { Budget } from "../models/Budget";
import { Transaction } from "../models/Transaction";
import { User } from "../models/User";

export interface IBudgetBalance {
	readonly budget: Budget | ThinBudget;
	readonly balance: number;
}

function getBudgetBalances(user: User, start: Date = null, end: Date = null): Bluebird<IBudgetBalance[]> {
	const now = Moment();
	const defaultStart = now.clone().startOf("month").toDate();
	const defaultEnd = now.clone().endOf("month").toDate();
	return getAllBudgets(user, start || defaultStart, end || defaultEnd)
			.then((budgets: Budget[]) => {
				const getBalanceTasks = budgets.map((budget) => {
					return Transaction.findOne({
						attributes: [[sequelize.fn("SUM", sequelize.col("amount")), "balance"]],
						where: {
							profileId: user.activeProfile.id,
							categoryId: budget.category.id,
							[Op.and]: [
								{ effectiveDate: { [Op.gte]: budget.startDate } },
								{ effectiveDate: { [Op.lte]: budget.endDate } },
							],
						},
					});
				});
				return [budgets, getBalanceTasks];
			})
			.spread((budgets: Budget[], balanceTasks: Array<Promise<Transaction>>) => {
				return [budgets, Bluebird.all(balanceTasks)];
			})
			.spread((budgets: Budget[], balances: Transaction[]) => {
				const result: IBudgetBalance[] = [];
				for (let i = 0; i < budgets.length; ++i) {
					result.push({
						budget: budgets[i],
						balance: Math.round(balances[i].getDataValue("balance") * 100) / 100,
					} as IBudgetBalance);
				}
				return result;
			});
}

export {
	getBudgetBalances,
};