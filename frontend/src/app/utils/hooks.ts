import React from "react";

type WaitGroupAdd = () => void;
type WaitGroupDone = () => void;

function useWaitGroup(): [number, WaitGroupAdd, WaitGroupDone] {
	const [count, setCount] = React.useState(0);
	const add = React.useCallback(() => setCount((curr) => curr + 1), []);
	const done = React.useCallback(() => setCount((curr) => curr - 1), []);
	return [count, add, done];
}

function useNudge(): [number, () => void] {
	const [nudgeValue, setNudge] = React.useState(0);
	const nudge = () => {
		setNudge(Date.now());
	};

	return [nudgeValue, nudge];
}

function useFresh<T>(v: T): React.RefObject<T> {
	const ref = React.useRef(v);
	React.useEffect(() => {
		ref.current = v;
	}, [v]);
	return ref;
}

export { useWaitGroup, useNudge, useFresh };
export type { WaitGroupAdd, WaitGroupDone };
