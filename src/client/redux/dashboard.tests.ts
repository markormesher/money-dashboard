import { afterEach, beforeEach, describe, it } from "mocha";
import { createStore, Store } from "redux";
import { dashboardReducer, IDashboardState } from "./dashboard";

describe(__filename, () => {

	let store: Store<IDashboardState>;

	beforeEach(() => {
		store = createStore(dashboardReducer);
	});

	it("should do things", () => {
		// TODO: tests
	});
});
