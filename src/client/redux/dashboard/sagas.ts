import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { IAccountSummary } from "../../../server/model-thins/IAccountSummary";
import { setError } from "../global/actions";
import { DashboardActions, setAccountSummaries } from "./actions";

function*loadAccountSummariesSaga(): Generator {
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

function*dashboardSagas(): Generator {
	yield all([
		loadAccountSummariesSaga(),
	]);
}

export {
	dashboardSagas,
};
