import * as Moment from "moment";
import { IBudgetBalance } from "../../commons/models/IBudgetBalance";
import { DbBudget } from "../db/models/DbBudget";
import { DbTransaction } from "../db/models/DbTransaction";
import { DbUser } from "../db/models/DbUser";
import { MomentDateTransformer } from "../db/MomentDateTransformer";
import { cleanUuid } from "../db/utils";

function getBudget(
		user: DbUser,
		budgetId: string,
		mustExist: boolean = false,
		includeRelations: boolean = false,
): Promise<DbBudget> {
	let query = DbBudget.createQueryBuilder("budget");

	if (includeRelations) {
		query = query
				.leftJoinAndSelect("budget.category", "category")
				.leftJoinAndSelect("budget.profile", "profile");
	}

	return query.where("budget.id = :budgetId")
			.andWhere("budget.profile_id = :profileId")
			.andWhere("budget.deleted = FALSE")
			.setParameters({
				budgetId: cleanUuid(budgetId),
				profileId: user.activeProfile.id,
			})
			.getOne()
			.then((budget) => {
				if (!budget && mustExist) {
					throw new Error("That budget does not exist");
				} else {
					return budget;
				}
			});
}

function getAllBudgets(user: DbUser, currentOnly: boolean): Promise<DbBudget[]> {
	let query = DbBudget
			.createQueryBuilder("budget")
			.leftJoinAndSelect("budget.category", "category")
			.where("budget.profile_id = :profileId")
			.andWhere("budget.deleted = FALSE")
			.setParameters({
				profileId: user.activeProfile.id,
			});

	if (currentOnly) {
		query = query
				.andWhere("start_date <= :now AND end_date >= :now")
				.setParameters({
					now: MomentDateTransformer.toDbFormat(Moment().startOf("day")),
				});
	}

	return query.getMany();
}

function getBudgetBalances(user: DbUser, currentOnly: boolean): Promise<IBudgetBalance[]> {
	return getAllBudgets(user, currentOnly)
			.then((budgets: DbBudget[]) => {
				const getBalanceTasks = budgets.map((budget) => {
					return DbTransaction
							.createQueryBuilder("transaction")
							.select("SUM(transaction.amount)", "balance")
							.where("transaction.profile_id = :profileId")
							.andWhere("transaction.deleted = FALSE")
							.andWhere("transaction.category_id = :categoryId")
							.andWhere("transaction.effective_date >= :startDate")
							.andWhere("transaction.effective_date <= :endDate")
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
			.then(([budgets, balances]) => {
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
					budget.deleted = true;
					return budget.save();
				}
			});
}

function cloneBudgets(
		user: DbUser,
		budgetsIds: string[],
		startDate: Moment.Moment,
		endDate: Moment.Moment,
): Promise<DbBudget[]> {
	return Promise
			.all(budgetsIds.map((id) => getBudget(user, id, true, true)))
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
