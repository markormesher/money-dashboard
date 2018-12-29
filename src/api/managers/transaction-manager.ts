import { DbTransaction } from "../db/models/DbTransaction";
import { DbUser } from "../db/models/DbUser";
import { cleanUuid } from "../db/utils";

function getTransaction(user: DbUser, transactionId: string): Promise<DbTransaction> {
	return DbTransaction
			.createQueryBuilder("transaction")
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
	return (
			DbTransaction
					.createQueryBuilder("transaction")
					.select("DISTINCT payee")
					.where("transaction.profile_id = :profileId")
					.andWhere("transaction.deleted = FALSE")
					.setParameters({
						profileId: user.activeProfile.id,
					})
					.getRawMany() as Promise<Array<{ payee: string }>>
	).then((results) => results.map((r) => r.payee).sort());
}

function saveTransaction(
		user: DbUser,
		transactionId: string,
		properties: Partial<DbTransaction>,
): Promise<DbTransaction> {
	return getTransaction(user, transactionId)
			.then((transaction) => {
				transaction = DbTransaction.getRepository().merge(transaction || new DbTransaction(), properties);
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
					transaction.deleted = true;
					return transaction.save();
				}
			});
}

export {
	getTransaction,
	getAllPayees,
	saveTransaction,
	deleteTransaction,
};
