import { afterEach, beforeEach, describe, it } from "mocha";
import { createStore, Store } from "redux";
import { accountsReducer, IAccountsState } from "./accounts";

describe(__filename, () => {

	let store: Store<IAccountsState>;

	beforeEach(() => {
		store = createStore(accountsReducer);
	});

	it("should do things", () => {
		// TODO: tests
	});
});
