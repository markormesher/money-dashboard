import { SelectQueryBuilder } from "typeorm";
import { ICategoryBalance } from "../../commons/models/ICategoryBalance";
import { DbCategory } from "../db/models/DbCategory";
import { DbUser } from "../db/models/DbUser";
import { cleanUuid } from "../db/utils";
import { StatusError } from "../helpers/StatusError";
import { getTransactionQueryBuilder } from "./transaction-manager";

interface ICategoryQueryBuilderOptions {
	readonly withProfile?: boolean;
}

function getCategoryQueryBuilder(options: ICategoryQueryBuilderOptions = {}): SelectQueryBuilder<DbCategory> {
	let builder = DbCategory.createQueryBuilder("category");

	if (options.withProfile) {
		builder = builder.leftJoinAndSelect("category.profile", "profile");
	}

	return builder;
}

function getCategory(user: DbUser, categoryId?: string): Promise<DbCategory> {
	return getCategoryQueryBuilder()
			.where("category.id = :categoryId")
			.andWhere("category.profile_id = :profileId")
			.andWhere("category.deleted = FALSE")
			.setParameters({
				categoryId: cleanUuid(categoryId),
				profileId: user.activeProfile.id,
			})
			.getOne();
}

function getAllCategories(user: DbUser): Promise<DbCategory[]> {
	return getCategoryQueryBuilder()
			.where("category.profile_id = :profileId")
			.andWhere("category.deleted = FALSE")
			.setParameters({
				profileId: user.activeProfile.id,
			})
			.getMany();
}

function getMemoCategoryBalances(user: DbUser): Promise<ICategoryBalance[]> {
	const categoryBalanceQuery = getTransactionQueryBuilder({ withCategory: true })
			.select("transaction.category_id")
			.addSelect("SUM(amount)", "balance")
			.where("category.is_memo_category = TRUE")
			.andWhere("transaction.deleted = FALSE")
			.andWhere("category.deleted = FALSE")
			.groupBy("category_id")
			.getRawMany() as Promise<Array<{ category_id: string, balance: number }>>;

	return Promise
			.all([
				getAllCategories(user),
				categoryBalanceQuery,
			])
			.then(([categories, balances]) => {
				const balanceMap: { [key: string]: number } = {};
				balances.forEach((sum) => {
					balanceMap[sum.category_id] = Math.round(sum.balance * 100) / 100;
				});

				return categories
						.filter((category) => category.isMemoCategory)
						.map((category) => {
							return {
								category,
								balance: balanceMap[category.id] || 0,
							};
						})
						.sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));
			});
}

function saveCategory(user: DbUser, categoryId: string, properties: Partial<DbCategory>): Promise<DbCategory> {
	return getCategory(user, categoryId)
			.then((category) => {
				category = DbCategory.getRepository().merge(category || new DbCategory(), properties);
				category.profile = user.activeProfile;
				return category.save();
			});
}

function deleteCategory(user: DbUser, categoryId: string): Promise<DbCategory> {
	return getCategory(user, categoryId)
			.then((category) => {
				if (!category) {
					throw new StatusError(404, "That category does not exist");
				} else {
					category.deleted = true;
					return category.save();
				}
			});
}

export {
	getCategoryQueryBuilder,
	getCategory,
	getAllCategories,
	getMemoCategoryBalances,
	saveCategory,
	deleteCategory,
};
