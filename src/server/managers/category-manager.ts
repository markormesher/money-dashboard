import { cleanUuid } from "../db/utils";
import { DbCategory } from "../models/db/DbCategory";
import { DbTransaction } from "../models/db/DbTransaction";
import { DbUser } from "../models/db/DbUser";
import { ICategoryBalance } from "../models/ICategoryBalance";

function getCategory(user: DbUser, categoryId?: string): Promise<DbCategory> {
	return DbCategory
			.findOne(cleanUuid(categoryId))
			.then((category) => {
				if (category && user && category.profile.id !== user.activeProfile.id) {
					throw new Error("DbUser does not own this category");
				} else {
					return category;
				}
			});
}

function getAllCategories(user: DbUser): Promise<DbCategory[]> {
	return DbCategory
			.find<DbCategory>({
				profile: {
					id: user.activeProfile.id,
				},
			});
}

function getMemoCategoryBalances(user: DbUser): Promise<ICategoryBalance[]> {
	const categoryBalanceQuery = DbTransaction
			.createQueryBuilder("transaction")
			.leftJoin("transaction.category", "category")
			.select("transaction.category_id")
			.addSelect("SUM(amount)", "balance")
			.where("category.is_memo_category = TRUE")
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
					throw new Error("That category does not exist");
				} else {
					return category;
				}
			})
			.then((category) => category.remove());
}

export {
	getCategory,
	getAllCategories,
	getMemoCategoryBalances,
	saveCategory,
	deleteCategory,
};
