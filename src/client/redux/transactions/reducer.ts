import { ThinTransaction } from "../../../server/model-thins/ThinTransaction";
import { DateModeOption } from "../../../server/models/Transaction";
import { PayloadAction } from "../PayloadAction";
import { TransactionsActions } from "./actions";

interface ITransactionsState {
	readonly lastUpdate: number;
	readonly dateMode: DateModeOption;
	readonly transactionToEdit: ThinTransaction;
	readonly editorBusy: boolean;
	readonly payeeList: string[];
	readonly payeeListLastLoaded: number;
}

const initialState: ITransactionsState = {
	lastUpdate: 0,
	dateMode: "transaction",
	transactionToEdit: undefined,
	editorBusy: false,
	payeeList: undefined,
	payeeListLastLoaded: -1,
};

function transactionsReducer(state = initialState, action: PayloadAction): ITransactionsState {
	switch (action.type) {
		case TransactionsActions.SET_LAST_UPDATE:
			return {
				...state,
				lastUpdate: action.payload.lastUpdate,
			};

		case TransactionsActions.SET_DATE_MODE:
			return {
				...state,
				dateMode: action.payload.dateMode,
			};

		case TransactionsActions.SET_TRANSACTION_TO_EDIT:
			return {
				...state,
				transactionToEdit: action.payload.transaction,
			};

		case TransactionsActions.SET_EDITOR_BUSY:
			return {
				...state,
				editorBusy: action.payload.editorBusy,
			};

		case TransactionsActions.SET_PAYEE_LIST:
			return {
				...state,
				payeeList: action.payload.payeeList,
				payeeListLastLoaded: new Date().getTime(),
			};

		default:
			return state;
	}
}

export {
	ITransactionsState,
	transactionsReducer,
};