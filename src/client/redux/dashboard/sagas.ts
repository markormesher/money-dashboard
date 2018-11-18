import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { IAccountSummary } from "../../../server/model-thins/IAccountSummary";
import { IBudgetBalance } from "../../../server/statistics/budget-statistics";
import { setError } from "../global/actions";
import { DashboardActions, setAccountSummaries, setBudgetBalances, setMemoCategoryBalances } from "./actions";

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

export {
	dashboardSagas,
};
