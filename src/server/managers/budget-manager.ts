import * as Moment from "moment";
import { DeepPartial } from "typeorm";
import { DbBudget } from "../models/db/DbBudget";
import { DbTransaction } from "../models/db/DbTransaction";
import { DbUser } from "../models/db/DbUser";
import { MomentDateTransformer } from "../models/helpers/MomentDateTransformer";
import { IBudgetBalance } from "../models/IBudgetBalance";

function getBudget(user: DbUser, budgetId: string, mustExist: boolean = false): Promise<DbBudget> {
	return DbBudget
			.findOne(budgetId)
			.then((budget) => {
				if (!budget && mustExist) {
					throw new Error("That budget does not exist");
				} else if (budget && user && budget.profile.id !== user.activeProfile.id) {
					throw new Error("DbUser does not own this budget");
				} else {
					return budget;
				}
			});
}

function getAllBudgets(user: DbUser, currentOnly: boolean): Promise<DbBudget[]> {
	let idFinder = DbBudget
			.createQueryBuilder("budget")
			.where("1=1 AND profile_id = :profileId", { profileId: user.activeProfile.id });

	if (currentOnly) {
		idFinder = idFinder.andWhere(
				"start_date <= :now AND end_date >= :now",
				{
					now: MomentDateTransformer.toDbFormat(Moment()),
				},
		);
	}

	// TODO: this "get things then get again by ID" logic could be useful elsewhere
	return idFinder
			.getMany()
			.then((results) => {
				const ids = results.map((r) => r.id);
				return DbBudget.findByIds(ids);
			});
}

function getBudgetBalances(user: DbUser, currentOnly: boolean): Promise<IBudgetBalance[]> {
	return getAllBudgets(user, currentOnly)
			.then((budgets: DbBudget[]) => {
				const getBalanceTasks = budgets.map((budget) => {
					return DbTransaction
							.createQueryBuilder()
							.select("SUM(amount)", "balance")
							.where("profile_id = :profileId")
							.andWhere("category_id = :categoryId")
							.andWhere("effective_date >= :startDate")
							.andWhere("effective_date <= :endDate")
							.setParameters({
								profileId: user.activeProfile.id,
								categoryId: budget.category.id,
								startDate: MomentDateTransformer.toDbFormat(budget.startDate),
								endDate: MomentDateTransformer.toDbFormat(budget.endDate),
							})
							.getRawOne() as Promise<{ balance: number }>;
				});
				return Promise.all([
					budgets,
					Promise.all(getBalanceTasks),
				]);
			})
			.then((results) => {
				const budgets = results[0];
				const balances = results[1];
				const output: IBudgetBalance[] = [];
				for (let i = 0; i < budgets.length; ++i) {
					output.push({
						budget: budgets[i],
						balance: Math.round((balances[i].balance || 0) * 100) / 100,
					} as IBudgetBalance);
				}
				return output;
			});
}

function saveBudget(user: DbUser, budgetId: string, properties: Partial<DbBudget>): Promise<DbBudget> {
	return getBudget(user, budgetId)
			.then((budget) => {
				budget = DbBudget.getRepository().merge(budget || new DbBudget(), properties);
				budget.profile = user.activeProfile;
				return budget.save();
			});
}

function deleteBudget(user: DbUser, budgetId: string): Promise<DbBudget> {
	return getBudget(user, budgetId)
			.then((budget) => {
				if (!budget) {
					throw new Error("That budget does not exist");
				} else {
					return budget;
				}
			})
			.then((budget) => budget.remove());
}

function cloneBudgets(
		user: DbUser,
		budgetsIds: string[],
		startDate: Moment.Moment,
		endDate: Moment.Moment,
): Promise<DbBudget[]> {
	return Promise
			.all(budgetsIds.map((id) => getBudget(user, id, true)))
			.then((budgets: DbBudget[]) => {
				return budgets.map((budget) => {
					const clonedNewBudget = budget.clone();
					clonedNewBudget.startDate = startDate;
					clonedNewBudget.endDate = endDate;
					return clonedNewBudget;
				});
			})
			.then((clonedNewBudgets: DbBudget[]) => {
				return Promise.all(clonedNewBudgets.map((b) => b.save()));
			});
}

export {
	getBudget,
	getAllBudgets,
	getBudgetBalances,
	saveBudget,
	deleteBudget,
	cloneBudgets,
};
