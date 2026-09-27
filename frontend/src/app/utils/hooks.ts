import React from "react";

type WaitGroup = {
	count: number;
	add: (qty?: number) => void;
	done: (qty?: number) => void;
};

function useWaitGroup(): WaitGroup {
	const [count, setCount] = React.useState(0);

	const add = (qty?: number) => {
		setCount((curr) => curr + (qty ?? 1));
	};

	const done = (qty?: number) => {
		setCount((curr) => curr - (qty ?? 1));
	};

	return { count, add, done };
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
export type { WaitGroup };
