import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { IAccountBalance } from "../../server/models/IAccountBalance";
import { mapBudgetFromApi } from "../../server/models/IBudget";
import { IBudgetBalance } from "../../server/models/IBudgetBalance";
import { ICategoryBalance } from "../../server/models/ICategoryBalance";
import { AccountCacheKeys } from "./accounts";
import { BudgetCacheKeys } from "./budgets";
import { setError } from "./global";
import { KeyCache } from "./helpers/KeyCache";
import { PayloadAction } from "./helpers/PayloadAction";
import { ProfileCacheKeys } from "./profiles";
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

function startLoadAccountBalances(): PayloadAction {
	return {
		type: DashboardActions.START_LOAD_ACCOUNT_BALANCES,
	};
}

function startLoadBudgetBalances(): PayloadAction {
	return {
		type: DashboardActions.START_LOAD_BUDGET_BALANCES,
	};
}

function startLoadMemoCategoryBalances(): PayloadAction {
	return {
		type: DashboardActions.START_LOAD_MEMO_CATEGORY_BALANCES,
	};
}

function setAccountBalances(accountBalances: IAccountBalance[]): PayloadAction {
	return {
		type: DashboardActions.SET_ACCOUNT_BALANCES,
		payload: { accountBalances },
	};
}

function setBudgetBalances(budgetBalances: IBudgetBalance[]): PayloadAction {
	return {
		type: DashboardActions.SET_BUDGET_BALANCES,
		payload: { budgetBalances },
	};
}

function setMemoCategoryBalances(memoCategoryBalances: ICategoryBalance[]): PayloadAction {
	return {
		type: DashboardActions.SET_MEMO_CATEGORY_BALANCES,
		payload: { memoCategoryBalances },
	};
}

function*loadAccountBalancesSaga(): Generator {
	yield takeEvery(DashboardActions.START_LOAD_ACCOUNT_BALANCES, function*(): Generator {
		if (KeyCache.keyIsValid(DashboardCacheKeys.ACCOUNT_BALANCES, [
			TransactionCacheKeys.TRANSACTION_DATA,
			AccountCacheKeys.ACCOUNT_DATA,
			ProfileCacheKeys.CURRENT_PROFILE,
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
			TransactionCacheKeys.TRANSACTION_DATA,
			BudgetCacheKeys.BUDGET_DATA,
			ProfileCacheKeys.CURRENT_PROFILE,
		])) {
			return;
		}
		try {
			const balances: IBudgetBalance[] = yield call(() => {
				return axios.get("/budgets/balances").then((res) => {
					const raw: IBudgetBalance[] = res.data;
					return raw.map((rawItem) => ({
						...rawItem,
						budget: mapBudgetFromApi(rawItem.budget),
					}));
				});
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
		if (KeyCache.keyIsValid(DashboardCacheKeys.MEMO_CATEGORY_BALANCE, [
			TransactionCacheKeys.TRANSACTION_DATA,
			ProfileCacheKeys.CURRENT_PROFILE,
		])) {
			return;
		}
		try {
			const balances: ICategoryBalance[] = yield call(() => {
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
	DashboardActions,
	dashboardReducer,
	dashboardSagas,
	startLoadAccountBalances,
	startLoadBudgetBalances,
	startLoadMemoCategoryBalances,
	setAccountBalances,
	setBudgetBalances,
	setMemoCategoryBalances,
};
