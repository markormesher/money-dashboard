import * as Bluebird from "bluebird";
import * as sequelize from "sequelize";
import { getAllAccounts } from "../managers/account-manager";
import { IAccountBalance } from "../model-thins/IAccountBalance";
import { Account } from "../models/Account";
import { Transaction } from "../models/Transaction";
import { User } from "../models/User";

function getAccountBalances(user: User): Bluebird<IAccountBalance[]> {
	const accountBalanceQuery = Transaction.findAll({
		attributes: [
			"accountId",
			[sequelize.fn("SUM", sequelize.col("amount")), "balance"],
		],
		where: {
			profileId: user.activeProfile.id,
		},
		group: [["accountId"]],
	});

	return Bluebird
			.all([
				getAllAccounts(user),
				accountBalanceQuery,
			])
			.spread((accounts: Account[], balances: Transaction[]) => {
				const balanceMap: { [key: string]: number } = {};
				balances.forEach((sum) => {
					balanceMap[sum.accountId] = Math.round(sum.getDataValue("balance") * 100) / 100;
				});

				return accounts.map((account) => {
					return {
						account,
						balance: balanceMap[account.id] || 0,
					};
				});
			});
}

export {
	getAccountBalances,
};
