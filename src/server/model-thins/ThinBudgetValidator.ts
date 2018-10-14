import * as moment from "moment";
import { ThinBudget } from "./ThinBudget";

interface IThinBudgetValidationResult {
	isValid: boolean;
	errors: {
		category?: string,
		type?: string,
		amount?: string,
		startDate?: string,
		endDate?: string,
	};
}

function validateThinBudget(budget: ThinBudget): IThinBudgetValidationResult {
	if (!budget) {
		return {
			isValid: false,
			errors: {},
		};
	}

	const result: IThinBudgetValidationResult = {
		isValid: true,
		errors: {},
	};

	if (!budget.categoryId || budget.categoryId.trim() === "") {
		result.isValid = false;
		result.errors.category = "A category must be selected";
	}

	if (budget.type !== "bill" && budget.type !== "budget") {
		result.isValid = false;
		result.errors.type = "A valid type must be selected";
	}

	if ((!budget.amount && budget.amount !== 0) || isNaN(budget.amount)) {
		result.isValid = false;
		result.errors.amount = "The amount must be a valid number";
	} else if (budget.amount <= 0) {
		result.isValid = false;
		result.errors.amount = "The amount must be greater than zero";
	}

	if (!budget.startDate || !moment(budget.startDate, "YYYY-MM-DD", true).isValid()) {
		result.isValid = false;
		result.errors.startDate = "A valid start date must be selected";
	}

	if (!budget.endDate || !moment(budget.endDate, "YYYY-MM-DD", true).isValid()) {
		result.isValid = false;
		result.errors.endDate = "A valid end date must be selected";
	}

	if ((budget.startDate && moment(budget.startDate, "YYYY-MM-DD", true).isValid())
			&& (budget.endDate && moment(budget.endDate, "YYYY-MM-DD", true).isValid())
			&& moment(budget.startDate).isSameOrAfter(moment(budget.endDate))) {
		result.isValid = false;
		result.errors.startDate = "The start date must be before the end date";
		result.errors.endDate = "The start date must be before the end date";
	}

	return result;
}

export {
	IThinBudgetValidationResult,
	validateThinBudget,
};
