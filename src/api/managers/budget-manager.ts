import * as Moment from "moment";
import { SelectQueryBuilder } from "typeorm";
import { IBudgetBalance } from "../../commons/models/IBudgetBalance";
import { DbBudget } from "../db/models/DbBudget";
import { DbUser } from "../db/models/DbUser";
import { MomentDateTransformer } from "../db/MomentDateTransformer";
import { cleanUuid } from "../db/utils";
import { StatusError } from "../helpers/StatusError";
import { getTransactionQueryBuilder } from "./transaction-manager";

interface IBudgetQueryBuilderOptions {
	readonly withCategory?: boolean;
	readonly withProfile?: boolean;
}

function getBudgetQueryBuilder(options: IBudgetQueryBuilderOptions = {}): SelectQueryBuilder<DbBudget> {
	let builder = DbBudget.createQueryBuilder("budget");

	if (options.withCategory) {
		builder = builder.leftJoinAndSelect("budget.category", "category");
	}

	if (options.withProfile) {
		builder = builder.leftJoinAndSelect("budget.profile", "profile");
	}

	return builder;
}

function getBudget(user: DbUser, budgetId: string, options?: IBudgetQueryBuilderOptions): Promise<DbBudget> {
	return getBudgetQueryBuilder(options)
			.where("budget.id = :budgetId")
			.andWhere("budget.profile_id = :profileId")
			.andWhere("budget.deleted = FALSE")
			.setParameters({
				budgetId: cleanUuid(budgetId),
				profileId: user.activeProfile.id,
			})
			.getOne();
}

function getAllBudgets(user: DbUser, currentOnly: boolean): Promise<DbBudget[]> {
	let query = getBudgetQueryBuilder({ withCategory: true })
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
					return getTransactionQueryBuilder()
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
					throw new StatusError(404, "That budget does not exist");
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
			.all(budgetsIds.map((id) => getBudget(user, id, { withCategory: true, withProfile: true })))
			.then((budgets: DbBudget[]) => {
				if (budgets.some((b) => !b)) {
					throw new StatusError(404, "One or more budgets did not exist");
				} else {
					return budgets;
				}
			})
			.then((budgets: DbBudget[]) => {
				return budgets.map((budget) => {
					const clonedBudget = budget.clone();
					clonedBudget.startDate = startDate;
					clonedBudget.endDate = endDate;
					return clonedBudget;
				});
			})
			.then((clonedBudgets: DbBudget[]) => {
				return Promise.all(clonedBudgets.map((b) => b.save()));
			});
}

export {
	getBudgetQueryBuilder,
	getBudget,
	getAllBudgets,
	getBudgetBalances,
	saveBudget,
	deleteBudget,
	cloneBudgets,
};
