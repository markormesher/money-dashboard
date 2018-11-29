import axios from "axios";
import { ActionCreator } from "redux";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { IAccountSummary } from "../../server/model-thins/IAccountSummary";
import { IBudgetBalance } from "../../server/statistics/budget-statistics";
import { ICategoryBalance } from "../../server/statistics/category-statistics";
import { setError } from "./global";
import { PayloadAction } from "./helpers/PayloadAction";

interface IDashboardState {
	readonly accountSummaries?: IAccountSummary[];
	readonly budgetBalances?: IBudgetBalance[];
	readonly memoCategoryBalances?: ICategoryBalance[];
}

const initialState: IDashboardState = {
	accountSummaries: undefined,
	budgetBalances: undefined,
};

enum DashboardActions {
	START_LOAD_ACCOUNT_SUMMARIES = "DashboardActions.START_LOAD_ACCOUNT_SUMMARIES",
	START_LOAD_BUDGET_BALANCES = "DashboardActions.START_LOAD_BUDGET_BALANCES",
	START_LOAD_MEMO_CATEGORY_BALANCES = "DashboardActions.START_LOAD_MEMO_CATEGORY_BALANCES",
	SET_ACCOUNT_SUMMARIES = "DashboardActions.SET_ACCOUNT_SUMMARIES",
	SET_BUDGET_BALANCES = "DashboardActions.SET_BUDGET_BALANCES",
	SET_MEMO_CATEGORY_BALANCES = "DashboardActions.SET_MEMO_CATEGORY_BALANCES",
}

const startLoadAccountSummaries: ActionCreator<PayloadAction> = () => ({
	type: DashboardActions.START_LOAD_ACCOUNT_SUMMARIES,
});

const startLoadBudgetBalances: ActionCreator<PayloadAction> = () => ({
	type: DashboardActions.START_LOAD_BUDGET_BALANCES,
});

const startLoadMemoCategoryBalances: ActionCreator<PayloadAction> = () => ({
	type: DashboardActions.START_LOAD_MEMO_CATEGORY_BALANCES,
});

const setAccountSummaries: ActionCreator<PayloadAction> = (accountSummaries: IAccountSummary[]) => ({
	type: DashboardActions.SET_ACCOUNT_SUMMARIES,
	payload: { accountSummaries },
});

const setBudgetBalances: ActionCreator<PayloadAction> = (budgetBalances: IBudgetBalance[]) => ({
	type: DashboardActions.SET_BUDGET_BALANCES,
	payload: { budgetBalances },
});

const setMemoCategoryBalances: ActionCreator<PayloadAction> = (memoCategoryBalances: ICategoryBalance[]) => ({
	type: DashboardActions.SET_MEMO_CATEGORY_BALANCES,
	payload: { memoCategoryBalances },
});

function*loadAccountSummariesSaga(): Generator {
	// TODO: caching
	yield takeEvery(DashboardActions.START_LOAD_ACCOUNT_SUMMARIES, function*(): Generator {
		try {
			const summaries: IAccountSummary[] = yield call(() => {
				return axios.get("/settings/accounts/summaries").then((res) => res.data);
			});
			yield put(setAccountSummaries(summaries));
		} catch (err) {
			yield all([
				put(setError(err)),
			]);
		}
	});
}

function*loadBudgetBalancesSaga(): Generator {
	// TODO: caching
	yield takeEvery(DashboardActions.START_LOAD_BUDGET_BALANCES, function*(): Generator {
		try {
			const balances: IBudgetBalance[] = yield call(() => {
				return axios.get("/settings/budgets/balances").then((res) => res.data);
			});
			yield put(setBudgetBalances(balances));
		} catch (err) {
			yield all([
				put(setError(err)),
			]);
		}
	});
}

function*loadMemoCategoryBalancesSaga(): Generator {
	// TODO: caching
	yield takeEvery(DashboardActions.START_LOAD_MEMO_CATEGORY_BALANCES, function*(): Generator {
		try {
			const balances: IBudgetBalance[] = yield call(() => {
				return axios.get("/settings/categories/memo-balances").then((res) => res.data);
			});
			yield put(setMemoCategoryBalances(balances));
		} catch (err) {
			yield all([
				put(setError(err)),
			]);
		}
	});
}

function*dashboardSagas(): Generator {
	yield all([
		loadAccountSummariesSaga(),
		loadBudgetBalancesSaga(),
		loadMemoCategoryBalancesSaga(),
	]);
}

function dashboardReducer(state: IDashboardState = initialState, action: PayloadAction): IDashboardState {
	switch (action.type) {
		case DashboardActions.SET_ACCOUNT_SUMMARIES:
			return {
				...state,
				accountSummaries: action.payload.accountSummaries,
			};

		case DashboardActions.SET_BUDGET_BALANCES:
			return {
				...state,
				budgetBalances: action.payload.budgetBalances,
			};

		case DashboardActions.SET_MEMO_CATEGORY_BALANCES:
			return {
				...state,
				memoCategoryBalances: action.payload.memoCategoryBalances,
			};

		default:
			return state;
	}
}

export {
	IDashboardState,
	dashboardReducer,
	dashboardSagas,
	startLoadAccountSummaries,
	startLoadBudgetBalances,
	startLoadMemoCategoryBalances,
	setAccountSummaries,
	setBudgetBalances,
	setMemoCategoryBalances,
};
