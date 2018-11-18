import * as Bluebird from "bluebird";
import * as sequelize from "sequelize";

import { getAllCategories } from "../managers/category-manager";
import { ThinCategory } from "../model-thins/ThinCategory";
import { Category } from "../models/Category";
import { Transaction } from "../models/Transaction";
import { User } from "../models/User";

interface ICategoryBalance {
	readonly category: Category | ThinCategory;
	readonly balance: number;
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

export {
	ICategoryBalance,
	getMemoCategoryBalances,
};
