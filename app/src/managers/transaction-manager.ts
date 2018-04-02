import Bluebird = require("bluebird");

import { Category } from "../models/Category";
import { Profile } from "../models/Profile";
import { Transaction } from "../models/Transaction";
import { User } from "../models/User";

function getTransaction(user: User, transactionId: string, mustExist: boolean = false): Bluebird<Transaction> {
	return Transaction
			.findOne({
				where: { id: transactionId },
				include: [Profile, Category],
			})
			.then((transaction) => {
				if (!transaction && mustExist) {
					throw new Error("That transaction does not exist");
				} else if (transaction && user && transaction.profile.id !== user.activeProfile.id) {
					throw new Error("User does not own this transaction");
				} else {
					return transaction;
				}
			});
}

function getAllPayees(user: User): Bluebird<string[]> {
	return Transaction
			.findAll({
				where: { profileId: user.activeProfile.id }
			})
			.then((transactions: Transaction[]) => {
				return Array.from(new Set(transactions.map((t) => t.payee))).sort();
			});
}

function saveTransaction(user: User, transactionId: string, properties: Partial<Transaction>): Bluebird<Transaction> {
	return getTransaction(user, transactionId)
			.then((transaction) => {
				transaction = transaction || new Transaction();
				return transaction.update(properties);
			})
			.then((transaction) => {
				return transaction.$set("profile", user.activeProfile);
			});
}

function deleteTransaction(user: User, transactionId: string): Bluebird<void> {
	return getTransaction(user, transactionId)
			.then((transaction) => {
				if (!transaction) {
					throw new Error("That transaction does not exist");
				} else {
					return transaction;
				}
			})
			.then((transaction) => transaction.destroy());
}

export {
	getTransaction,
	getAllPayees,
	saveTransaction,
	deleteTransaction,
};
