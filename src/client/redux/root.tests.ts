import { afterEach, beforeEach, describe, it } from "mocha";
import { createStore, Store } from "redux";
import { IRootState, rootReducer } from "./root";

describe(__filename, () => {

	let store: Store<IRootState>;

	beforeEach(() => {
		store = createStore(rootReducer);
	});

	it("should do things", () => {
		// TODO: tests
	});
});
