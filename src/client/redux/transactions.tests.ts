import { afterEach, beforeEach, describe, it } from "mocha";
import { createStore, Store } from "redux";
import { ITransactionsState, transactionsReducer } from "./transactions";

describe(__filename, () => {

	let store: Store<ITransactionsState>;

	beforeEach(() => {
		store = createStore(transactionsReducer);
	});

	it("should do things", () => {
		// TODO: tests
	});
});
