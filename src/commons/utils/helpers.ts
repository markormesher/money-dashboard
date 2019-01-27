import * as Moment from "moment";

function getTaxYear(date: Moment.Moment): number {
	if (date.month() === 4) {
		if (date.date() >= 6) {
			return date.year();
		} else {
			return date.year() - 1;
		}
	} else if (date.month() > 4) {
		return date.year();
	} else {
		return date.year() - 1;
	}
}

function getTaxYearStart(startYear: number): Moment.Moment {
	return Moment({ year: startYear, month: 3, date: 6 });
}

function getTaxYearEnd(startYear: number): Moment.Moment {
	return Moment({ year: startYear + 1, month: 3, date: 5 });
}

function getCurrentTaxYearStart(): Moment.Moment {
	const now = Moment();
	if (now.month() < 3 || (now.month() === 4 && now.date() <= 5)) {
		// we're in the second calendar year of the tax year
		return getTaxYearStart(now.year() - 1);
	} else {
		// we're in the first calendar year of the tax year
		return getTaxYearStart(now.year());
	}
}

function getCurrentTaxYearEnd(): Moment.Moment {
	const now = Moment();
	if (now.month() < 3 || (now.month() === 4 && now.date() <= 5)) {
		// we're in the second calendar year of the tax year
		return getTaxYearEnd(now.year() - 1);
	} else {
		// we're in the first calendar year of the tax year
		return getTaxYearEnd(now.year());
	}
}

export {
	getTaxYear,
	getTaxYearStart,
	getTaxYearEnd,
	getCurrentTaxYearStart,
	getCurrentTaxYearEnd,
};
