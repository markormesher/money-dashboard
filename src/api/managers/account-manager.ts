import { SelectQueryBuilder } from "typeorm";
import { IAccountBalance } from "../../commons/models/IAccountBalance";
import { DbAccount } from "../db/models/DbAccount";
import { DbUser } from "../db/models/DbUser";
import { cleanUuid } from "../db/utils";
import { StatusError } from "../helpers/StatusError";
import { getTransactionQueryBuilder } from "./transaction-manager";

interface IAccountQueryBuilderOptions {
	readonly withProfile?: boolean;
}

function getAccountQueryBuilder(options: IAccountQueryBuilderOptions = {}): SelectQueryBuilder<DbAccount> {
	let builder = DbAccount.createQueryBuilder("account");

	if (options.withProfile) {
		builder = builder.leftJoinAndSelect("account.profile", "profile");
	}

	return builder;
}

function getAccount(user: DbUser, accountId: string): Promise<DbAccount> {
	return getAccountQueryBuilder()
			.where("account.id = :accountId")
			.andWhere("account.profile_id = :profileId")
			.andWhere("account.deleted = FALSE")
			.setParameters({
				accountId: cleanUuid(accountId),
				profileId: user.activeProfile.id,
			})
			.getOne();
}

function getAllAccounts(user: DbUser, activeOnly: boolean = true): Promise<DbAccount[]> {
	let query = getAccountQueryBuilder()
			.where("account.profile_id = :profileId")
			.andWhere("account.deleted = FALSE")
			.setParameters({
				profileId: user.activeProfile.id,
			});

	if (activeOnly) {
		query = query.andWhere("account.active = TRUE");
	}

	return query.getMany();
}

function getAccountBalances(user: DbUser): Promise<IAccountBalance[]> {
	const accountBalanceQuery: Promise<Array<{ account_id: string, balance: number }>> = getTransactionQueryBuilder()
			.select("transaction.account_id")
			.addSelect("SUM(transaction.amount)", "balance")
			.where("transaction.profile_id = :profileId")
			.andWhere("transaction.deleted = FALSE")
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

function setAccountActive(user: DbUser, accountId: string, active: boolean): Promise<DbAccount> {
	return getAccount(user, accountId)
			.then((account) => {
				account.active = active;
				return account.save();
			});
}

function deleteAccount(user: DbUser, accountId: string): Promise<DbAccount> {
	return getAccount(user, accountId)
			.then((account) => {
				if (!account) {
					throw new StatusError(404, "That account does not exist");
				} else {
					account.deleted = true;
					return account.save();
				}
			});
}

export {
	getAccountQueryBuilder,
	getAccount,
	getAllAccounts,
	getAccountBalances,
	saveAccount,
	setAccountActive,
	deleteAccount,
};
