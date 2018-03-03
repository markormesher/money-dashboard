import * as sequelize from "sequelize";
import { Op } from "sequelize";
import { Category } from "../models/Category";
import { Transaction } from "../models/Transaction";
import { User } from "../models/User";
import Bluebird = require("bluebird");
import CategoryManager = require("../managers/category-manager");

export interface CategoryBalance {
	category: Category;
	balance: number
}

function getCategoryBalances(user: User, start: Date = null, end: Date = null): Bluebird<CategoryBalance[]> {
	let dateQueryFragment = [];

	if (start != null) {
		dateQueryFragment.push({
			effectiveDate: {
				[Op.gte]: start
			}
		});
	}
	if (end != null) {
		dateQueryFragment.push({
			effectiveDate: {
				[Op.lte]: end
			}
		});
	}

	const getCategoryBalances = Transaction.findAll({
		attributes: [
			'categoryId',
			[sequelize.fn('SUM', sequelize.col('amount')), 'balance']
		],
		where: {
			profileId: user.activeProfile.id,
			[Op.and]: dateQueryFragment
		},
		group: [['categoryId']]
	});

	return Bluebird
			.all([
				CategoryManager.getAllCategories(user),
				getCategoryBalances
			])
			.spread((categories: Category[], balances: Transaction[]) => {
				const balanceMap: { [key: string]: number } = {};
				balances.forEach(sum => {
					balanceMap[sum.categoryId] = sum.getDataValue('balance');
				});

				return categories
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
	getCategoryBalances
}
