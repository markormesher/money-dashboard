import { afterEach, beforeEach, describe, it } from "mocha";
import { createStore, Store } from "redux";
import { IProfilesState, profilesReducer } from "./profiles";

describe(__filename, () => {

	let store: Store<IProfilesState>;

	beforeEach(() => {
		store = createStore(profilesReducer);
	});

	it("should do things", () => {
		// TODO: tests
	});
});
