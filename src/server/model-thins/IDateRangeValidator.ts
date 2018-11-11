import * as moment from "moment";
import { IDateRange } from "./IDateRange";

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
				startDate: "A valid startDate date must be selected",
			},
		};
	}

	if (!range.endDate || !moment(range.endDate, "YYYY-MM-DD", true).isValid()) {
		result = {
			isValid: false,
			errors: {
				...result.errors,
				endDate: "A valid endDate date must be selected",
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
				startDate: "The startDate date must be before the endDate date",
				endDate: "The startDate date must be before the endDate date",
			},
		};
	}

	return result;
}

export {
	IDateRangeValidationResult,
	validateDateRange,
};
