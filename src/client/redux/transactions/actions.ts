import { ActionCreator } from "redux";
import { ThinTransaction } from "../../../server/model-thins/ThinTransaction";
import { PayloadAction } from "../PayloadAction";
import { DateModeOption } from "./reducer";

enum TransactionsActions {
	START_DELETE_TRANSACTION = "TransactionSettingsActions.START_DELETE_TRANSACTION",
	START_SAVE_TRANSACTION = "TransactionSettingsActions.START_SAVE_TRANSACTION",

	SET_DATE_MODE = "TransactionSettingsActions.SET_DATE_MODE",
	SET_LAST_UPDATE = "TransactionSettingsActions.SET_LAST_UPDATE",
	SET_TRANSACTION_TO_EDIT = "TransactionSettingsActions.SET_TRANSACTION_TO_EDIT",
	SET_EDITOR_BUSY = "TransactionSettingsActions.SET_EDITOR_BUSY",
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

const setDateMode: ActionCreator<PayloadAction> = (dateMode: DateModeOption) => {
	return {
		type: TransactionsActions.SET_DATE_MODE, payload: { dateMode },
	};
};

const setLastUpdate: ActionCreator<PayloadAction> = () => {
	return {
		type: TransactionsActions.SET_LAST_UPDATE, payload: { lastUpdate: new Date().getTime() },
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

export {
	TransactionsActions,
	startDeleteTransaction,
	startSaveTransaction,
	setDateMode,
	setLastUpdate,
	setTransactionToEdit,
	setEditorBusy,
};
