import { afterEach, beforeEach, describe, it } from "mocha";
import { createStore, Store } from "redux";
import { INavState, navReducer } from "./nav";

describe(__filename, () => {

	let store: Store<INavState>;

	beforeEach(() => {
		store = createStore(navReducer);
	});

	it("should do things", () => {
		// TODO: tests
	});
});
