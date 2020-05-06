import { SelectQueryBuilder } from "typeorm";
import { startOfDay } from "date-fns";
import { StatusError } from "../../commons/StatusError";
import { cleanUuid } from "../../commons/utils/entities";
import { DbTransaction } from "../db/models/DbTransaction";
import { DbUser } from "../db/models/DbUser";

interface ITransactionQueryBuilderOptions {
  readonly withAccount?: boolean;
  readonly withCategory?: boolean;
  readonly withProfile?: boolean;
}

function getTransactionQueryBuilder(options: ITransactionQueryBuilderOptions = {}): SelectQueryBuilder<DbTransaction> {
  let builder = DbTransaction.createQueryBuilder("transaction");

  if (options.withAccount) {
    builder = builder.leftJoinAndSelect("transaction.account", "account");
  }

  if (options.withCategory) {
    builder = builder.leftJoinAndSelect("transaction.category", "category");
  }

  if (options.withProfile) {
    builder = builder.leftJoinAndSelect("transaction.profile", "profile");
  }

  return builder;
}

function getTransaction(user: DbUser, transactionId: string): Promise<DbTransaction> {
  return getTransactionQueryBuilder()
    .where("transaction.id = :transactionId")
    .andWhere("transaction.profile_id = :profileId")
    .andWhere("transaction.deleted = FALSE")
    .setParameters({
      transactionId: cleanUuid(transactionId),
      profileId: user.activeProfile.id,
    })
    .getOne();
}

function getAllPayees(user: DbUser): Promise<string[]> {
  return (getTransactionQueryBuilder()
    .select("DISTINCT payee")
    .where("transaction.profile_id = :profileId")
    .andWhere("transaction.deleted = FALSE")
    .setParameters({
      profileId: user.activeProfile.id,
    })
    .getRawMany() as Promise<Array<{ payee: string }>>).then((results) => results.map((r) => r.payee).sort());
}

function saveTransaction(
  user: DbUser,
  transactionId: string,
  properties: Partial<DbTransaction>,
): Promise<DbTransaction> {
  if (properties.transactionDate) {
    properties.transactionDate = startOfDay(properties.transactionDate).getTime();
  }
  if (properties.effectiveDate) {
    properties.effectiveDate = startOfDay(properties.effectiveDate).getTime();
  }
  return getTransaction(user, transactionId).then((transaction) => {
    transaction = DbTransaction.getRepository().merge(transaction || new DbTransaction(), properties);
    transaction.profile = user.activeProfile;
    return transaction.save();
  });
}

function deleteTransaction(user: DbUser, transactionId: string): Promise<DbTransaction> {
  return getTransaction(user, transactionId).then((transaction) => {
    if (!transaction) {
      throw new StatusError(404, "That transaction does not exist");
    } else {
      transaction.deleted = true;
      return transaction.save();
    }
  });
}

export { getTransactionQueryBuilder, getTransaction, getAllPayees, saveTransaction, deleteTransaction };
