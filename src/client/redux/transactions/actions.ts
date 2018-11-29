import { ActionCreator } from "redux";
import { ThinTransaction } from "../../../server/model-thins/ThinTransaction";
import { DateModeOption } from "../../../server/models/Transaction";
import { PayloadAction } from "../PayloadAction";

enum TransactionsActions {
	START_DELETE_TRANSACTION = "TransactionSettingsActions.START_DELETE_TRANSACTION",
	START_SAVE_TRANSACTION = "TransactionSettingsActions.START_SAVE_TRANSACTION",
	START_LOAD_PAYEE_LIST = "TransactionSettingsActions.START_LOAD_PAYEE_LIST",

	SET_DATE_MODE = "TransactionSettingsActions.SET_DATE_MODE",
	SET_TRANSACTION_TO_EDIT = "TransactionSettingsActions.SET_TRANSACTION_TO_EDIT",
	SET_EDITOR_BUSY = "TransactionSettingsActions.SET_EDITOR_BUSY",
	SET_PAYEE_LIST = "TransactionSettingsActions.SET_PAYEE_LIST",
}

const startDeleteTransaction: ActionCreator<PayloadAction> = (transactionId: string) => {
	return {
		type: TransactionsActions.START_DELETE_TRANSACTION, payload: { transactionId },
	};
};

const startSaveTransaction: ActionCreator<PayloadAction> = (transaction: Partial<ThinTransaction>) => {
	return {
		type: TransactionsActions.START_SAVE_TRANSACTION, payload: { transaction },
	};
};

const startLoadPayeeList: ActionCreator<PayloadAction> = () => {
	return { type: TransactionsActions.START_LOAD_PAYEE_LIST };
};

const setDateMode: ActionCreator<PayloadAction> = (dateMode: DateModeOption) => {
	return {
		type: TransactionsActions.SET_DATE_MODE, payload: { dateMode },
	};
};

const setTransactionToEdit: ActionCreator<PayloadAction> = (transaction: ThinTransaction) => {
	return {
		type: TransactionsActions.SET_TRANSACTION_TO_EDIT, payload: { transaction },
	};
};

const setEditorBusy: ActionCreator<PayloadAction> = (editorBusy: boolean) => {
	return {
		type: TransactionsActions.SET_EDITOR_BUSY, payload: { editorBusy },
	};
};

const setPayeeList: ActionCreator<PayloadAction> = (payeeList: string[]) => {
	return {
		type: TransactionsActions.SET_PAYEE_LIST, payload: { payeeList },
	};
};

export {
	TransactionsActions,
	startDeleteTransaction,
	startSaveTransaction,
	startLoadPayeeList,
	setDateMode,
	setTransactionToEdit,
	setEditorBusy,
	setPayeeList,
};
