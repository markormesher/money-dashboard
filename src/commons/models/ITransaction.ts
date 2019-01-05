import * as Moment from "moment";
import { IAccount, mapAccountFromApi } from "./IAccount";
import { ICategory, mapCategoryFromApi } from "./ICategory";
import { IProfile, mapProfileFromApi } from "./IProfile";

type DateModeOption = "effective" | "transaction";

interface ITransaction {
	readonly id: string;
	readonly transactionDate: Moment.Moment;
	readonly effectiveDate: Moment.Moment;
	readonly creationDate: Moment.Moment;
	readonly amount: number;
	readonly payee: string;
	readonly note: string;
	readonly deleted: boolean;

	readonly account: IAccount;
	readonly category: ICategory;
	readonly profile: IProfile;
}

const DEFAULT_TRANSACTION: ITransaction = {
	id: null,
	transactionDate: Moment(),
	effectiveDate: Moment(),
	creationDate: Moment(),
	amount: 0,
	payee: "",
	note: undefined,
	deleted: false,

	account: undefined,
	category: undefined,
	profile: undefined,
};

function mapTransactionFromApi(transaction: ITransaction): ITransaction {
	// make sure dates are definitely Moment types
	return {
		...transaction,
		transactionDate: Moment(transaction.transactionDate),
		effectiveDate: Moment(transaction.effectiveDate),
		creationDate: Moment(transaction.creationDate),

		account: transaction.account ? mapAccountFromApi(transaction.account) : undefined,
		category: transaction.category ? mapCategoryFromApi(transaction.category) : undefined,
		profile: transaction.profile ? mapProfileFromApi(transaction.profile) : undefined,
	};
}

function getNextTransactionForContinuousCreation(prev: Partial<ITransaction>): ITransaction {
	return {
		...DEFAULT_TRANSACTION,
		transactionDate: prev.transactionDate || DEFAULT_TRANSACTION.transactionDate,
		effectiveDate: prev.effectiveDate || DEFAULT_TRANSACTION.effectiveDate,
		account: prev.account || DEFAULT_TRANSACTION.account,
	};
}

export {
	DateModeOption,
	ITransaction,
	DEFAULT_TRANSACTION,
	mapTransactionFromApi,
	getNextTransactionForContinuousCreation,
};
