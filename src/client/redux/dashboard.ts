import axios from "axios";
import { ActionCreator } from "redux";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { IAccountBalance } from "../../server/model-thins/IAccountBalance";
import { IBudgetBalance } from "../../server/statistics/budget-statistics";
import { ICategoryBalance } from "../../server/statistics/category-statistics";
import { AccountCacheKeys } from "./accounts";
import { BudgetCacheKeys } from "./budgets";
import { setError } from "./global";
import { KeyCache } from "./helpers/KeyCache";
import { PayloadAction } from "./helpers/PayloadAction";
import { TransactionCacheKeys } from "./transactions";

interface IDashboardState {
	readonly accountBalances?: IAccountBalance[];
	readonly budgetBalances?: IBudgetBalance[];
	readonly memoCategoryBalances?: ICategoryBalance[];
}

const initialState: IDashboardState = {
	accountBalances: undefined,
	budgetBalances: undefined,
};

enum DashboardActions {
	START_LOAD_ACCOUNT_BALANCES = "DashboardActions.START_LOAD_ACCOUNT_BALANCES",
	START_LOAD_BUDGET_BALANCES = "DashboardActions.START_LOAD_BUDGET_BALANCES",
	START_LOAD_MEMO_CATEGORY_BALANCES = "DashboardActions.START_LOAD_MEMO_CATEGORY_BALANCES",
	SET_ACCOUNT_BALANCES = "DashboardActions.SET_ACCOUNT_BALANCES",
	SET_BUDGET_BALANCES = "DashboardActions.SET_BUDGET_BALANCES",
	SET_MEMO_CATEGORY_BALANCES = "DashboardActions.SET_MEMO_CATEGORY_BALANCES",
}

enum DashboardCacheKeys {
	ACCOUNT_BALANCES = "DashboardCacheKeys.ACCOUNT_BALANCES",
	BUDGET_BALANCES = "DashboardCacheKeys.BUDGET_BALANCES",
	MEMO_CATEGORY_BALANCE = "DashboardCacheKeys.MEMO_CATEGORY_BALANCE",
}

const startLoadAccountBalances: ActionCreator<PayloadAction> = () => ({
	type: DashboardActions.START_LOAD_ACCOUNT_BALANCES,
});

const startLoadBudgetBalances: ActionCreator<PayloadAction> = () => ({
	type: DashboardActions.START_LOAD_BUDGET_BALANCES,
});

const startLoadMemoCategoryBalances: ActionCreator<PayloadAction> = () => ({
	type: DashboardActions.START_LOAD_MEMO_CATEGORY_BALANCES,
});

const setAccountBalances: ActionCreator<PayloadAction> = (accountBalances: IAccountBalance[]) => ({
	type: DashboardActions.SET_ACCOUNT_BALANCES,
	payload: { accountBalances },
});

const setBudgetBalances: ActionCreator<PayloadAction> = (budgetBalances: IBudgetBalance[]) => ({
	type: DashboardActions.SET_BUDGET_BALANCES,
	payload: { budgetBalances },
});

const setMemoCategoryBalances: ActionCreator<PayloadAction> = (memoCategoryBalances: ICategoryBalance[]) => ({
	type: DashboardActions.SET_MEMO_CATEGORY_BALANCES,
	payload: { memoCategoryBalances },
});

function*loadAccountBalancesSaga(): Generator {
	yield takeEvery(DashboardActions.START_LOAD_ACCOUNT_BALANCES, function*(): Generator {
		if (KeyCache.keyIsValid(DashboardCacheKeys.ACCOUNT_BALANCES, [
			TransactionCacheKeys.TRANSACTION_DATA, AccountCacheKeys.ACCOUNT_DATA,
		])) {
			return;
		}
		try {
			const balances: IAccountBalance[] = yield call(() => {
				return axios.get("/accounts/balances").then((res) => res.data);
			});
			yield all([
				put(setAccountBalances(balances)),
				put(KeyCache.touchKey(DashboardCacheKeys.ACCOUNT_BALANCES)),
			]);
		} catch (err) {
			yield all([
				put(setError(err)),
			]);
		}
	});
}

function*loadBudgetBalancesSaga(): Generator {
	yield takeEvery(DashboardActions.START_LOAD_BUDGET_BALANCES, function*(): Generator {
		if (KeyCache.keyIsValid(DashboardCacheKeys.BUDGET_BALANCES, [
			TransactionCacheKeys.TRANSACTION_DATA, BudgetCacheKeys.BUDGET_DATA,
		])) {
			return;
		}
		try {
			const balances: IBudgetBalance[] = yield call(() => {
				return axios.get("/budgets/balances").then((res) => res.data);
			});
			yield all([
				put(setBudgetBalances(balances)),
				put(KeyCache.touchKey(DashboardCacheKeys.BUDGET_BALANCES)),
			]);
		} catch (err) {
			yield all([
				put(setError(err)),
			]);
		}
	});
}

function*loadMemoCategoryBalancesSaga(): Generator {
	yield takeEvery(DashboardActions.START_LOAD_MEMO_CATEGORY_BALANCES, function*(): Generator {
		if (KeyCache.keyIsValid(DashboardCacheKeys.MEMO_CATEGORY_BALANCE, [TransactionCacheKeys.TRANSACTION_DATA])) {
			return;
		}
		try {
			const balances: IBudgetBalance[] = yield call(() => {
				return axios.get("/categories/memo-balances").then((res) => res.data);
			});
			yield all([
				put(setMemoCategoryBalances(balances)),
				put(KeyCache.touchKey(DashboardCacheKeys.MEMO_CATEGORY_BALANCE)),
			]);
		} catch (err) {
			yield all([
				put(setError(err)),
			]);
		}
	});
}

function*dashboardSagas(): Generator {
	yield all([
		loadAccountBalancesSaga(),
		loadBudgetBalancesSaga(),
		loadMemoCategoryBalancesSaga(),
	]);
}

function dashboardReducer(state: IDashboardState = initialState, action: PayloadAction): IDashboardState {
	switch (action.type) {
		case DashboardActions.SET_ACCOUNT_BALANCES:
			return {
				...state,
				accountBalances: action.payload.accountBalances,
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
	startLoadAccountBalances,
	startLoadBudgetBalances,
	startLoadMemoCategoryBalances,
	setAccountBalances,
	setBudgetBalances,
	setMemoCategoryBalances,
};
