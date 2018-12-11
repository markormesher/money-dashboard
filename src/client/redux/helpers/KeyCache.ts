import { Store } from "redux";

interface IKeyCacheState {
	readonly [key: string]: number;
}

interface IKeyCacheAction {
	readonly type: KeyCacheActions;
	readonly key: string;
}

enum KeyCacheActions {
	TOUCH = "KeyCacheActions.TOUCH",
}

class KeyCache<State> {

	public static STATE_KEY = "__cache";
	public static store?: Store;

	public static setStore(store: Store): void {
		KeyCache.store = store;
	}

	public static reducer(state: IKeyCacheState = {}, action?: IKeyCacheAction): IKeyCacheState {
		if (!action) {
			return state;
		}

		switch (action.type) {
			case KeyCacheActions.TOUCH:
				return {
					...state,
					[action.key]: KeyCache.getTimestamp(),
				};

			default:
				return state;
		}
	}

	public static touchKey(key: string): IKeyCacheAction {
		KeyCache.checkStore();
		return {
			type: KeyCacheActions.TOUCH,
			key,
		};
	}

	public static getKeyTime(key: string): number {
		KeyCache.checkStore();
		const state = KeyCache.store.getState()[this.STATE_KEY] as IKeyCacheState;
		return state[key] || 0;
	}

	public static keyIsValid(key: string, dependencies: string[]): boolean {
		KeyCache.checkStore();
		const keyTime = KeyCache.getKeyTime(key);
		if (keyTime === 0) {
			return false;
		}
		let valid = true;
		dependencies.forEach((d) => {
			if (KeyCache.getKeyTime(d) >= keyTime) {
				valid = false;
			}
		});
		return valid;
	}

	private static maxTimestampGiven = 0;

	private static checkStore(): void {
		if (!KeyCache.store) {
			throw new Error("Store is not set");
		}
	}

	private static getTimestamp(): number {
		const raw = new Date().getTime();
		const output = raw > this.maxTimestampGiven ? raw : this.maxTimestampGiven + 1;
		this.maxTimestampGiven = output;
		return output;
	}

}

export {
	IKeyCacheState,
	IKeyCacheAction,
	KeyCacheActions,
	KeyCache,
};
