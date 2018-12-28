import * as Moment from "moment";

interface IDateRange {
	readonly label?: string;
	readonly startDate?: Moment.Moment;
	readonly endDate?: Moment.Moment;
}

export {
	IDateRange,
};
