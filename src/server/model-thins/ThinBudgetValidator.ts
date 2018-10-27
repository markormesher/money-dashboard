import { validateDateRange } from "./DateRangeValidator";
import { ThinBudget } from "./ThinBudget";

interface IThinBudgetValidationResult {
	readonly isValid: boolean;
	readonly errors: {
		readonly category?: string,
		readonly type?: string,
		readonly amount?: string,
		readonly startDate?: string,
		readonly endDate?: string,
	};
}

function validateThinBudget(budget: ThinBudget): IThinBudgetValidationResult {
	if (!budget) {
		return {
			isValid: false,
			errors: {},
		};
	}

	let result: IThinBudgetValidationResult = {
		isValid: true,
		errors: {},
	};

	if (!budget.categoryId || budget.categoryId.trim() === "") {
		result = {
			isValid: false,
			errors: {
				...result.errors,
				category: "A category must be selected",
			},
		};
	}

	if (budget.type !== "bill" && budget.type !== "budget") {
		result = {
			isValid: false,
			errors: {
				...result.errors,
				type: "A valid type must be selected",
			},
		};
	}

	if ((!budget.amount && budget.amount !== 0) || isNaN(budget.amount)) {
		result = {
			isValid: false,
			errors: {
				...result.errors,
				amount: "The amount must be a valid number",
			},
		};
	} else if (budget.amount <= 0) {
		result = {
			isValid: false,
			errors: {
				...result.errors,
				amount: "The amount must be greater than zero",
			},
		};
	}

	const dateRangeValidationResult = validateDateRange({
		startDate: budget.startDate,
		endDate: budget.endDate,
	});
	if (dateRangeValidationResult.errors.startDate) {
		result = {
			isValid: false,
			errors: {
				...result.errors,
				startDate: dateRangeValidationResult.errors.startDate,
			},
		};
	}

	if (dateRangeValidationResult.errors.endDate) {
		result = {
			isValid: false,
			errors: {
				...result.errors,
				endDate: dateRangeValidationResult.errors.endDate,
			},
		};
	}

	return result;
}

export {
	IThinBudgetValidationResult,
	validateThinBudget,
};
