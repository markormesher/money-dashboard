import React from "react";
import { deepEqual } from "../../../utils/utils.js";
import { useWaitGroup, type WaitGroupAdd, type WaitGroupDone } from "../../../utils/hooks.js";

type ErrorKey<T> = "global" | Extract<keyof T, string>;

type FormValidationResult<T> = {
	isValid: boolean;
	errors: Partial<Record<ErrorKey<T>, string>>;
};

type FormHookOptions<T> = {
	validator?: (model: Partial<T>) => FormValidationResult<T>;
};

type FormState<T> = {
	model: T | undefined;
	modelIteration: number;
	setModel: (model: T | undefined) => void;
	patchModel: (patch: Partial<T>) => void;

	valid: boolean;
	fieldError: (name: ErrorKey<T>) => string | undefined;

	modified: boolean;

	wgCount: number;
	wgAdd: WaitGroupAdd;
	wgDone: WaitGroupDone;

	fatalError: unknown;
	setFatalError: (error: unknown) => void;
};

function useForm<T>(options: FormHookOptions<T> = {}): FormState<T> {
	const { validator } = options;

	const [originalModel, setOriginalModel] = React.useState<T>();
	const [modelIteration, setModelIteration] = React.useState(0);
	const [model, setModelInner] = React.useState<T>();

	const [fatalError, setFatalError] = React.useState<unknown>();
	const [wgCount, wgAdd, wgDone] = useWaitGroup();

	const setModel = React.useCallback((m: T | undefined) => {
		setOriginalModel(m);
		setModelIteration((curr) => curr + 1);
		setModelInner(m);
	}, []);

	const patchModel = React.useCallback((m: Partial<T>) => {
		setModelInner((curr) => {
			if (!curr) {
				console.warn("Cannot patch model when the initial model has not been set");
				return;
			}

			return { ...curr, ...m };
		});
	}, []);

	const validationResult = React.useMemo<FormValidationResult<T>>(
		() => (validator && model ? validator(model) : { isValid: true, errors: {} }),
		[validator, model],
	);

	const modified = React.useMemo(() => !deepEqual(model, originalModel), [model, originalModel]);

	const valid = validationResult.isValid;

	const fieldError = (key: ErrorKey<T>) => {
		return validationResult.errors[key];
	};

	return {
		model,
		modelIteration,
		setModel,
		patchModel,
		valid,
		fieldError,
		modified,
		wgCount,
		wgAdd,
		wgDone,
		fatalError,
		setFatalError,
	};
}

export { useForm };
export type { FormState, FormValidationResult };
