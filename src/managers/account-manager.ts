import { SelectQueryBuilder } from "typeorm";
import { IAccountBalance } from "../models/IAccountBalance";
import { StatusError } from "../utils/StatusError";
import { cleanUuid } from "../utils/entities";
import { IAccountBalanceUpdate } from "../models/IAccountBalanceUpdate";
import { DbAccount } from "../db/models/DbAccount";
import { DbUser } from "../db/models/DbUser";
import { DbTransaction } from "../db/models/DbTransaction";
import { roundCurrency } from "../utils/helpers";
import { getTransactionQueryBuilder, saveTransaction } from "./transaction-manager";
import { getCategoryQueryBuilder } from "./category-manager";

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

function getAllAccounts(user: DbUser, activeOnly = true): Promise<DbAccount[]> {
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
  const accountBalanceQuery: Promise<Array<{ account_id: string; balance: number }>> = getTransactionQueryBuilder()
    .select("transaction.account_id")
    .addSelect("SUM(transaction.amount)", "balance")
    .where("transaction.profile_id = :profileId")
    .andWhere("transaction.deleted = FALSE")
    .groupBy("transaction.account_id")
    .setParameters({
      profileId: user.activeProfile.id,
    })
    .getRawMany();

  return Promise.all([getAllAccounts(user), accountBalanceQuery]).then(([accounts, balances]) => {
    const balanceMap: { [key: string]: number } = {};
    balances.forEach((sum) => {
      balanceMap[sum.account_id] = roundCurrency(sum.balance);
    });

    return accounts.map((account) => {
      return {
        account,
        balance: balanceMap[account.id] ?? 0,
      };
    });
  });
}

function saveAccount(user: DbUser, accountId: string, properties: Partial<DbAccount>): Promise<DbAccount> {
  return getAccount(user, accountId).then((account) => {
    account = DbAccount.getRepository().merge(account || new DbAccount(), properties);
    account.profile = user.activeProfile;
    return account.save();
  });
}

function setAccountActive(user: DbUser, accountId: string, active: boolean): Promise<DbAccount> {
  return getAccount(user, accountId).then((account) => {
    account.active = active;
    return account.save();
  });
}

function deleteAccount(user: DbUser, accountId: string): Promise<DbAccount> {
  return getAccount(user, accountId).then((account) => {
    if (!account) {
      throw new StatusError(404, "That account does not exist");
    } else {
      account.deleted = true;
      return account.save();
    }
  });
}

async function updateAssetBalance(user: DbUser, assetBalanceUpdate: IAccountBalanceUpdate): Promise<string> {
  const accountId = assetBalanceUpdate.account.id;
  const account = await getAccount(user, accountId);
  if (!account) {
    throw new StatusError(404, "That account does not exist");
  } else if (account.type !== "asset") {
    return "That account is not an asset.";
  }

  const latestTransaction = await getTransactionQueryBuilder()
    .where("transaction.account_id = :accountId")
    .andWhere("transaction.deleted = FALSE")
    .orderBy("transaction_date", "DESC")
    .setParameters({
      accountId,
    })
    .getOne();
  if (latestTransaction.transactionDate > assetBalanceUpdate.updateDate) {
    return "This account already has a more recent update.";
  }

  const currentBalance: { balance: number } = await getTransactionQueryBuilder()
    .select("SUM(transaction.amount)", "balance")
    .where("transaction.account_id = :accountId")
    .andWhere("transaction.deleted = FALSE")
    .setParameters({
      accountId,
    })
    .getRawOne();

  const diff = Math.round((assetBalanceUpdate.balance - currentBalance.balance) * 100) / 100;

  const category = await getCategoryQueryBuilder()
    .where("category.is_asset_growth_category = TRUE")
    .andWhere("category.name ILIKE '%update%'")
    .andWhere("category.profile_id = :profileId")
    .andWhere("category.deleted = FALSE")
    .setParameters({
      profileId: user.activeProfile.id,
    })
    .getOne();

  if (!category) {
    return "Could not load a suitable asset value update category.";
  }

  const transaction: Partial<DbTransaction> = {
    transactionDate: assetBalanceUpdate.updateDate,
    effectiveDate: assetBalanceUpdate.updateDate,
    payee: "N/A",
    amount: diff,
    account,
    category,
  };

  return saveTransaction(user, undefined, transaction).then(() => "done");
}

export {
  getAccountQueryBuilder,
  getAccount,
  getAllAccounts,
  getAccountBalances,
  saveAccount,
  setAccountActive,
  deleteAccount,
  updateAssetBalance,
};
