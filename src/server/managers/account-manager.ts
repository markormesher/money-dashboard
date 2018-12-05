import { cleanUuid } from "../db/utils";
import { DbAccount } from "../models/db/DbAccount";
import { DbTransaction } from "../models/db/DbTransaction";
import { DbUser } from "../models/db/DbUser";
import { IAccountBalance } from "../models/IAccountBalance";

function getAccount(user: DbUser, accountId: string): Promise<DbAccount> {
	return DbAccount
			.findOne(cleanUuid(accountId))
			.then((account) => {
				if (account && user && account.profile.id !== user.activeProfile.id) {
					throw new Error("DbUser does not own this account");
				} else {
					return account;
				}
			});
}

function getAllAccounts(user: DbUser, activeOnly: boolean = true): Promise<DbAccount[]> {
	let query = DbAccount
			.createQueryBuilder("account")
			.where("account.profile_id = :profileId")
			.setParameters({
				profileId: user.activeProfile.id,
			});

	if (activeOnly) {
		query = query.andWhere("account.active = TRUE");
	}

	return query.getMany();
}

function getAccountBalances(user: DbUser): Promise<IAccountBalance[]> {
	const accountBalanceQuery: Promise<Array<{ account_id: string, balance: number }>> = DbTransaction
			.createQueryBuilder("transaction")
			.select("transaction.account_id")
			.addSelect("SUM(transaction.amount)", "balance")
			.where("transaction.profile_id = :profileId")
			.groupBy("transaction.account_id")
			.setParameters({
				profileId: user.activeProfile.id,
			})
			.getRawMany();

	return Promise
			.all([
				getAllAccounts(user),
				accountBalanceQuery,
			])
			.then(([accounts, balances]) => {
				const balanceMap: { [key: string]: number } = {};
				balances.forEach((sum) => {
					balanceMap[sum.account_id] = Math.round(sum.balance * 100) / 100;
				});

				return accounts.map((account) => {
					return {
						account,
						balance: balanceMap[account.id] || 0,
					};
				});
			});
}

function saveAccount(user: DbUser, accountId: string, properties: Partial<DbAccount>): Promise<DbAccount> {
	return getAccount(user, accountId)
			.then((account) => {
				account = DbAccount.getRepository().merge(account || new DbAccount(), properties);
				account.profile = user.activeProfile;
				return account.save();
			});
}

function toggleAccountActive(user: DbUser, accountId: string): Promise<DbAccount> {
	return getAccount(user, accountId)
			.then((account) => {
				account.active = !account.active;
				return account.save();
			});
}

function deleteAccount(user: DbUser, accountId: string): Promise<DbAccount> {
	return getAccount(user, accountId)
			.then((account) => {
				if (!account) {
					throw new Error("That account does not exist");
				} else {
					return account;
				}
			})
			.then((account) => account.remove());
}

export {
	getAccount,
	getAllAccounts,
	getAccountBalances,
	saveAccount,
	toggleAccountActive,
	deleteAccount,
};
