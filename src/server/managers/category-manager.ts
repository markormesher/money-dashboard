import * as Bluebird from "bluebird";
import * as sequelize from "sequelize";
import { ICategoryBalance } from "../model-thins/ICategoryBalance";
import { Category } from "../models/Category";
import { Profile } from "../models/Profile";
import { Transaction } from "../models/Transaction";
import { User } from "../models/User";

function getCategory(user: User, categoryId: string): Bluebird<Category> {
	return Category
			.findOne({
				where: { id: categoryId },
				include: [Profile],
			})
			.then((category) => {
				if (category && user && category.profile.id !== user.activeProfile.id) {
					throw new Error("User does not own this category");
				} else {
					return category;
				}
			});
}

function getAllCategories(user: User): Bluebird<Category[]> {
	return Category.findAll({
		where: {
			profileId: user.activeProfile.id,
		},
		include: [Profile],
	});
}

function getMemoCategoryBalances(user: User): Bluebird<ICategoryBalance[]> {
	const categoryBalanceQuery = Transaction.findAll({
		attributes: [
			"categoryId",
			[sequelize.fn("SUM", sequelize.col("amount")), "balance"],
		],
		where: {
			profileId: user.activeProfile.id,
		},
		group: [["categoryId"]],
	});

	return Bluebird
			.all([
				getAllCategories(user),
				categoryBalanceQuery,
			])
			.spread((categories: Category[], balances: Transaction[]) => {
				const balanceMap: { [key: string]: number } = {};
				balances.forEach((sum) => {
					balanceMap[sum.categoryId] = Math.round(sum.getDataValue("balance") * 100) / 100;
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

function saveCategory(user: User, categoryId: string, properties: Partial<Category>): Bluebird<Category> {
	return getCategory(user, categoryId)
			.then((category) => {
				category = category || new Category();
				return category.update(properties);
			})
			.then((category) => {
				return category.$set("profile", user.activeProfile);
			});
}

function deleteCategory(user: User, categoryId: string): Bluebird<void> {
	return getCategory(user, categoryId)
			.then((category) => {
				if (!category) {
					throw new Error("That category does not exist");
				} else {
					return category;
				}
			})
			.then((category) => category.destroy());
}

export {
	getCategory,
	getAllCategories,
	getMemoCategoryBalances,
	saveCategory,
	deleteCategory,
};
