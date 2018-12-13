import { expect } from "chai";
import { after, beforeEach, describe, it } from "mocha";
import { combineReducers, createStore } from "redux";
import { IKeyCacheAction, IKeyCacheState, KeyCache, KeyCacheActions } from "./KeyCache";

describe(__filename, () => {

	function resetStore(state: IKeyCacheState = {}): void {
		const store = createStore(combineReducers(
				{
					[KeyCache.STATE_KEY]: KeyCache.reducer,
				}),
				{
					[KeyCache.STATE_KEY]: state,
				},
		);
		KeyCache.setStore(store);
	}

	beforeEach(() => {
		resetStore();
	});

	after(() => {
		KeyCache.setStore(undefined);
	});

	describe("touchKey()", () => {

		it("should throw an exception when the store is not set", () => {
			KeyCache.setStore(undefined);
			expect(() => KeyCache.touchKey("key")).to.throw();
		});

		it("should generate an action with the correct type", () => {
			KeyCache.touchKey("test-key").type.should.equal(KeyCacheActions.TOUCH);
		});

		it("should generate an action with the provided key", () => {
			KeyCache.touchKey("test-key").key.should.equal("test-key");
		});
	});

	describe("getKeyTime()", () => {

		it("should throw an exception when the store is not set", () => {
			KeyCache.setStore(undefined);
			expect(() => KeyCache.getKeyTime("key")).to.throw();
		});

		it("should return zero for keys that have not been set", () => {
			KeyCache.getKeyTime("test-key").should.equal(0);
		});

		it("should return the key time for keys that have been set", () => {
			let state: IKeyCacheState = {};
			state = KeyCache.reducer(state, KeyCache.touchKey("test-key"));
			resetStore(state);
			KeyCache.getKeyTime("test-key").should.equal(state["test-key"]);
		});
	});

	describe("keyIsValid()", () => {

		it("should throw an exception when the store is not set", () => {
			KeyCache.setStore(undefined);
			expect(() => KeyCache.keyIsValid("key", [])).to.throw();
		});

		it("should return false for unset keys with no dependencies", () => {
			KeyCache.keyIsValid("test-key", []).should.equal(false);
		});

		it("should return false for unset keys with dependencies", () => {
			KeyCache.keyIsValid("test-key1", ["test-key-2"]).should.equal(false);
		});

		it("should return true for keys with no dependencies", () => {
			let state: IKeyCacheState = {};
			state = KeyCache.reducer(state, KeyCache.touchKey("test-key"));
			resetStore(state);
			KeyCache.keyIsValid("test-key", []).should.equal(true);
		});

		it("should return true for keys with unset dependencies", () => {
			let state: IKeyCacheState = {};
			state = KeyCache.reducer(state, KeyCache.touchKey("test-key1"));
			resetStore(state);
			KeyCache.keyIsValid("test-key1", ["test-key2"]).should.equal(true);
		});

		it("should return true for keys set after all dependencies", () => {
			let state: IKeyCacheState = {};
			state = KeyCache.reducer(state, KeyCache.touchKey("test-key2"));
			state = KeyCache.reducer(state, KeyCache.touchKey("test-key1"));
			resetStore(state);
			KeyCache.keyIsValid("test-key1", ["test-key2"]).should.equal(true);
		});

		it("should return false for keys set before all dependencies", () => {
			let state: IKeyCacheState = {};
			state = KeyCache.reducer(state, KeyCache.touchKey("test-key1"));
			state = KeyCache.reducer(state, KeyCache.touchKey("test-key2"));
			resetStore(state);
			KeyCache.keyIsValid("test-key1", ["test-key2"]).should.equal(false);
		});

		it("should return false for keys set before some dependencies", () => {
			let state: IKeyCacheState = {};
			state = KeyCache.reducer(state, KeyCache.touchKey("test-key3"));
			state = KeyCache.reducer(state, KeyCache.touchKey("test-key1"));
			state = KeyCache.reducer(state, KeyCache.touchKey("test-key2"));
			resetStore(state);
			KeyCache.keyIsValid("test-key1", ["test-key2", "test-key3"]).should.equal(false);
		});
	});

	describe("reducer()", () => {

		it("should initialise its state as an empty object", () => {
			KeyCache.reducer({}, { type: "@@INIT" }).should.deep.equal({});
		});

		it("should not mutate the state when an unrecognised action is passed", () => {
			const state = {};
			const action: IKeyCacheAction = { type: KeyCacheActions.TOUCH, key: "" };
			Object.defineProperty(action, "type", { writable: true, value: "random-action" });
			KeyCache.reducer(state, action).should.equal(state);
		});

		it("should add the key when the TOUCH action is passed", () => {
			let state: IKeyCacheState = {};
			state = KeyCache.reducer(state, KeyCache.touchKey("test-key"));
			state.should.have.keys("test-key");
			state["test-key"].should.be.greaterThan(0);
		});

		it("should issue increasing key times", () => {
			let state: IKeyCacheState = {};
			state = KeyCache.reducer(state, KeyCache.touchKey("test-key1"));
			state = KeyCache.reducer(state, KeyCache.touchKey("test-key2"));
			state = KeyCache.reducer(state, KeyCache.touchKey("test-key3"));
			state["test-key1"].should.be.lessThan(state["test-key2"]);
			state["test-key2"].should.be.lessThan(state["test-key3"]);
		});
	});
});
