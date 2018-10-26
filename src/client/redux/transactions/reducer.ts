import { ThinTransaction } from "../../../server/model-thins/ThinTransaction";
import { PayloadAction } from "../PayloadAction";
import { TransactionsActions } from "./actions";

interface ITransactionsState {
	lastUpdate: number;
	displayCurrentOnly: boolean;
	transactionToEdit: ThinTransaction;
	editorBusy: boolean;
}

const initialState: ITransactionsState = {
	lastUpdate: 0,
	displayCurrentOnly: true,
	transactionToEdit: undefined,
	editorBusy: false,
};

function transactionsReducer(state = initialState, action: PayloadAction): ITransactionsState {
	switch (action.type) {
		case TransactionsActions.SET_LAST_UPDATE:
			return {
				...state,
				lastUpdate: action.payload.lastUpdate,
			};

		case TransactionsActions.SET_DISPLAY_CURRENT_ONLY:
			return {
				...state,
				displayCurrentOnly: action.payload.currentOnly,
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

		default:
			return state;
	}
}

export {
	ITransactionsState,
	transactionsReducer,
};
