/*import {User} from "../models/User";
import Bluebird = require("bluebird");
import {Transaction} from "../models/Transaction";
import * as sequelize from "sequelize";
import {Account} from "../models/Account";
import CategoryManager = require("../managers/category-manager");

export interface AccountBalance {
	account: Account;
	balance: number
}

function getCategoryBalances(user: User, start: Date = null, end: Date = null): Bluebird<AccountBalance[]> {
	let dateQuery

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
				CategoryManager.getAllCategories(user),
				getCategoryBalances
			])
			.spread((accounts: Account[], balances: Transaction[]) => {
				const balanceMap: { [key: string]: number } = {};
				balances.forEach(sum => {
					balanceMap[sum.accountId] = sum.getDataValue('balance');
				});

				return accounts
						.map(account => {
							return {
								account: account,
								balance: balanceMap[account.id] || 0
							} as AccountBalance;
						})
						.filter(entry => includeZero || entry.balance != 0)
						.sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));
			});
}

export {
	getCategoryBalances
}
*/
