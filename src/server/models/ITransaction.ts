import * as Moment from "moment";
import { IAccount } from "./IAccount";
import { ICategory } from "./ICategory";
import { IProfile } from "./IProfile";

type DateModeOption = "effective" | "transaction";

interface ITransaction {
	readonly id: string;
	readonly transactionDate: Moment.Moment;
	readonly effectiveDate: Moment.Moment;
	readonly amount: number;
	readonly payee: string;
	readonly note: string;
	readonly account: IAccount;
	readonly category: ICategory;
	readonly profile: IProfile;
}

const DEFAULT_TRANSACTION: ITransaction = {
	id: null,
	transactionDate: Moment(),
	effectiveDate: Moment(),
	amount: 0,
	payee: "",
	note: undefined,
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
