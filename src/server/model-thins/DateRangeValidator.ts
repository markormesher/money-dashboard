import * as moment from "moment";
import { IDateRange } from "./DateRange";

interface IDateRangeValidationResult {
	readonly isValid: boolean;
	readonly errors: {
		readonly startDate?: string,
		readonly endDate?: string,
	};
}

function validateDateRange(range: IDateRange): IDateRangeValidationResult {
	let result: IDateRangeValidationResult = {
		isValid: true,
		errors: {},
	};

	if (!range.startDate || !moment(range.startDate, "YYYY-MM-DD", true).isValid()) {
		result = {
			isValid: false,
			errors: {
				...result.errors,
				startDate: "A valid start date must be selected",
			},
		};
	}

	if (!range.endDate || !moment(range.endDate, "YYYY-MM-DD", true).isValid()) {
		result = {
			isValid: false,
			errors: {
				...result.errors,
				endDate: "A valid end date must be selected",
			},
		};
	}

	if ((range.startDate && moment(range.startDate, "YYYY-MM-DD", true).isValid())
			&& (range.endDate && moment(range.endDate, "YYYY-MM-DD", true).isValid())
			&& moment(range.startDate).isSameOrAfter(moment(range.endDate))) {
		result = {
			isValid: false,
			errors: {
				...result.errors,
				startDate: "The start date must be before the end date",
				endDate: "The start date must be before the end date",
			},
		};
	}

	return result;
}

export {
	IDateRangeValidationResult,
	validateDateRange,
};
