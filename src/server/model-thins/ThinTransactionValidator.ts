import * as moment from "moment";
import { ThinTransaction } from "./ThinTransaction";

interface IThinTransactionValidationResult {
	readonly isValid: boolean;
	readonly errors: {
		readonly account?: string,
		readonly category?: string,
		readonly amount?: string,
		readonly payee?: string,
		readonly transactionDate?: string,
		readonly effectiveDate?: string,
		readonly note?: string,
	};
}

function validateThinTransaction(transaction: ThinTransaction): IThinTransactionValidationResult {
	if (!transaction) {
		return {
			isValid: false,
			errors: {},
		};
	}

	let result: IThinTransactionValidationResult = {
		isValid: true,
		errors: {},
	};

	if (!transaction.accountId || transaction.accountId.trim() === "") {
		result = {
			isValid: false,
			errors: {
				...result.errors,
				account: "An account must be selected",
			},
		};
	}

	if (!transaction.categoryId || transaction.categoryId.trim() === "") {
		result = {
			isValid: false,
			errors: {
				...result.errors,
				category: "A category must be selected",
			},
		};
	}

	if ((!transaction.amount && transaction.amount !== 0) || isNaN(transaction.amount)) {
		result = {
			isValid: false,
			errors: {
				...result.errors,
				amount: "The amount must be a valid number",
			},
		};
	}

	if (!transaction.payee || transaction.payee.trim() === "") {
		result = {
			isValid: false,
			errors: {
				...result.errors,
				payee: "A payee must be entered",
			},
		};
	}

	if (!transaction.transactionDate || !moment(transaction.transactionDate, "YYYY-MM-DD", true).isValid()) {
		result = {
			isValid: false,
			errors: {
				...result.errors,
				transactionDate: "A valid transaction date must be selected",
			},
		};
	}

	if (!transaction.effectiveDate || !moment(transaction.effectiveDate, "YYYY-MM-DD", true).isValid()) {
		result = {
			isValid: false,
			errors: {
				...result.errors,
				effectiveDate: "A valid effective date must be selected",
			},
		};
	}

	return result;
}

export {
	IThinTransactionValidationResult,
	validateThinTransaction,
};
