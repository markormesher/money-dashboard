import { afterEach, beforeEach, describe, it } from "mocha";
import { createStore, Store } from "redux";
import { authReducer, IAuthState } from "./auth";

describe(__filename, () => {

	let store: Store<IAuthState>;

	beforeEach(() => {
		store = createStore(authReducer);
	});

	it("should do things", () => {
		// TODO: tests
	});
});
