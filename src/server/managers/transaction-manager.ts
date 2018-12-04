import { cleanUuid } from "../db/utils";
import { DbTransaction } from "../models/db/DbTransaction";
import { DbUser } from "../models/db/DbUser";

function getTransaction(user: DbUser, transactionId: string, mustExist: boolean = false): Promise<DbTransaction> {
	return DbTransaction
			.findOne(cleanUuid(transactionId))
			.then((transaction) => {
				if (!transaction && mustExist) {
					throw new Error("That transaction does not exist");
				} else if (transaction && user && transaction.profile.id !== user.activeProfile.id) {
					throw new Error("DbUser does not own this transaction");
				} else {
					return transaction;
				}
			});
}

function getAllPayees(user: DbUser): Promise<string[]> {
	return (DbTransaction
			.createQueryBuilder("transaction")
			.select("DISTINCT payee")
			.where("transaction.profile_id = :profileId", { profileId: user.activeProfile.id })
			.getRawMany() as Promise<Array<{ payee: string }>>)
			.then((results) => results.map((r) => r.payee).sort());
}

function saveTransaction(
		user: DbUser,
		transactionId: string,
		properties: Partial<DbTransaction>,
): Promise<DbTransaction> {
	return getTransaction(user, transactionId)
			.then((transaction) => {
				transaction = DbTransaction.getRepository().merge(transaction || new DbTransaction(), properties)
				transaction.profile = user.activeProfile;
				return transaction.save();
			});
}

function deleteTransaction(user: DbUser, transactionId: string): Promise<DbTransaction> {
	return getTransaction(user, transactionId)
			.then((transaction) => {
				if (!transaction) {
					throw new Error("That transaction does not exist");
				} else {
					return transaction;
				}
			})
			.then((transaction) => transaction.remove());
}

export {
	getTransaction,
	getAllPayees,
	saveTransaction,
	deleteTransaction,
};
