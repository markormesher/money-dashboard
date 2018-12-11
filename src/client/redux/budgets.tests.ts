import { afterEach, beforeEach, describe, it } from "mocha";
import { createStore, Store } from "redux";
import { budgetsReducer, IBudgetsState } from "./budgets";

describe(__filename, () => {

	let store: Store<IBudgetsState>;

	beforeEach(() => {
		store = createStore(budgetsReducer);
	});

	it("should do things", () => {
		// TODO: tests
	});
});
