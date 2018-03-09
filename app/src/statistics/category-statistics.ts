import * as sequelize from "sequelize";
import { getAllCategories } from "../managers/category-manager";
import { Category } from "../models/Category";
import { Transaction } from "../models/Transaction";
import { User } from "../models/User";
import Bluebird = require("bluebird");

export interface CategoryBalance {
	category: Category;
	balance: number
}

function getMemoCategoryBalances(user: User): Bluebird<CategoryBalance[]> {
	const getCategoryBalances = Transaction.findAll({
		attributes: [
			'categoryId',
			[sequelize.fn('SUM', sequelize.col('amount')), 'balance']
		],
		where: {
			profileId: user.activeProfile.id
		},
		group: [['categoryId']]
	});

	return Bluebird
			.all([
				getAllCategories(user),
				getCategoryBalances
			])
			.spread((categories: Category[], balances: Transaction[]) => {
				const balanceMap: { [key: string]: number } = {};
				balances.forEach(sum => {
					balanceMap[sum.accountId] = Math.round(sum.getDataValue('balance') * 100) / 100;
				});

				return categories
						.filter(category => category.isMemoCategory)
						.map(category => {
							return {
								category: category,
								balance: balanceMap[category.id] || 0
							} as CategoryBalance;
						})
						.sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));
			});
}

export {
	getMemoCategoryBalances
}
