import {User} from "../models/User";
import Bluebird = require("bluebird");
import {Transaction} from "../models/Transaction";
import * as sequelize from "sequelize";
import {Account} from "../models/Account";
import AccountManager = require("../managers/account-manager");

export interface AccountBalance {
	account: Account;
	balance: number
}

function getAccountBalances(user: User, includeZero: boolean = false): Bluebird<AccountBalance[]> {
	const getAccountBalances = Transaction.findAll({
		attributes: [
			'accountId',
			[sequelize.fn('SUM', sequelize.col('amount')), 'balance']
		],
		where: {
			profileId: user.activeProfile.id
		},
		group: [['accountId']]
	});

	return Bluebird
			.all([
				AccountManager.getAllAccounts(user),
				getAccountBalances
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
	getAccountBalances
}
