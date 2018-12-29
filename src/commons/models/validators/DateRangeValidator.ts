import { IDateRange } from "../IDateRange";

interface IDateRangeValidationResult {
	readonly isValid: boolean;
	readonly errors: {
		readonly startDate?: string,
		readonly endDate?: string,
	};
}

function validateDateRange(range: IDateRange): IDateRangeValidationResult {
	if (!range) {
		return {
			isValid: false,
			errors: {},
		};
	}

	let result: IDateRangeValidationResult = {
		isValid: true,
		errors: {},
	};

	if (!range.startDate || !range.startDate.isValid()) {
		result = {
			isValid: false,
			errors: {
				...result.errors,
				startDate: "A valid start date date must be selected",
			},
		};
	}

	if (!range.endDate || !range.endDate.isValid()) {
		result = {
			isValid: false,
			errors: {
				...result.errors,
				endDate: "A valid end date date must be selected",
			},
		};
	}

	if (
			range.startDate && range.startDate.isValid()
			&& range.startDate && range.startDate.isValid()
			&& range.startDate.isSameOrAfter(range.endDate)
	) {
		result = {
			isValid: false,
			errors: {
				...result.errors,
				startDate: "The start date date must be before the end date date",
				endDate: "The start date date must be before the end date date",
			},
		};
	}

	return result;
}

export {
	IDateRangeValidationResult,
	validateDateRange,
};
