import * as Bluebird from "bluebird";
import * as sequelize from "sequelize";
import { Op } from "sequelize";
import { IAccountBalance } from "../model-thins/IAccountBalance";
import { Account } from "../models/Account";
import { Profile } from "../models/Profile";
import { Transaction } from "../models/Transaction";
import { User } from "../models/User";

function getAccount(user: User, accountId: string): Bluebird<Account> {
	return Account
			.findOne({
				where: { id: accountId },
				include: [Profile],
			})
			.then((account) => {
				if (account && user && account.profile.id !== user.activeProfile.id) {
					throw new Error("User does not own this account");
				} else {
					return account;
				}
			});
}

function getAllAccounts(user: User, activeOnly: boolean = true): Bluebird<Account[]> {
	const activeOnlyQueryFragment = activeOnly ? { active: true } : {};

	return Account.findAll({
		where: {
			profileId: user.activeProfile.id,
			[Op.and]: activeOnlyQueryFragment,
		},
		include: [Profile],
	});
}

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

function saveAccount(user: User, accountId: string, properties: Partial<Account>): Bluebird<Account> {
	return getAccount(user, accountId)
			.then((account) => {
				account = account || new Account();
				return account.update(properties);
			})
			.then((account) => {
				return account.$set("profile", user.activeProfile);
			});
}

function toggleAccountActive(user: User, accountId: string): Bluebird<Account> {
	return getAccount(user, accountId)
			.then((account) => {
				account.active = !account.active;
				return account.save();
			});
}

function deleteAccount(user: User, accountId: string): Bluebird<void> {
	return getAccount(user, accountId)
			.then((account) => {
				if (!account) {
					throw new Error("That account does not exist");
				} else {
					return account;
				}
			})
			.then((account) => account.destroy());
}

export {
	getAccount,
	getAllAccounts,
	getAccountBalances,
	saveAccount,
	toggleAccountActive,
	deleteAccount,
};
