import { afterEach, beforeEach, describe, it } from "mocha";
import { createStore, Store } from "redux";
import { categoriesReducer, ICategoriesState } from "./categories";

describe(__filename, () => {

	let store: Store<ICategoriesState>;

	beforeEach(() => {
		store = createStore(categoriesReducer);
	});

	it("should do things", () => {
		// TODO: tests
	});
});
