import { afterEach, beforeEach, describe, it } from "mocha";
import { createStore, Store } from "redux";
import { globalReducer, IGlobalState } from "./global";

describe(__filename, () => {

	let store: Store<IGlobalState>;

	beforeEach(() => {
		store = createStore(globalReducer);
	});

	it("should do things", () => {
		// TODO: tests
	});
});
