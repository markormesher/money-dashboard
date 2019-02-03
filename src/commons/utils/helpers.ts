import * as Moment from "moment";

const APRIL_MONTH = 3; // months are zero-indexed; 3 = April

function getTaxYear(date: Moment.Moment): number {
	if (date.month() === APRIL_MONTH) {
		if (date.date() >= 6) {
			return date.year();
		} else {
			return date.year() - 1;
		}
	} else if (date.month() > APRIL_MONTH) {
		return date.year();
	} else {
		return date.year() - 1;
	}
}

function getTaxYearStart(startYear: number): Moment.Moment {
	return Moment({ year: startYear, month: APRIL_MONTH, date: 6 });
}

function getTaxYearEnd(startYear: number): Moment.Moment {
	return Moment({ year: startYear + 1, month: APRIL_MONTH, date: 5 });
}

function groupBy<T>(data: T[], identifier: (entity: T) => string | number):
		{ readonly [key: string]: T[] } | { readonly [key: number]: T[] } {
	const empty: { [key: string]: T[] } = {};
	return data.reduce((returnVal, entity) => {
		const key = identifier(entity);
		(returnVal[identifier(entity)] = returnVal[key] || []).push(entity);
		return returnVal;
	}, empty);
}

export {
	getTaxYear,
	getTaxYearStart,
	getTaxYearEnd,
	groupBy,
};
