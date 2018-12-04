import * as Moment from "moment";
import { ICategory } from "./ICategory";
import { IProfile } from "./IProfile";

interface IBudget {
	readonly id: string;
	readonly type: "budget" | "bill";
	readonly amount: number;
	readonly startDate: Moment.Moment;
	readonly endDate: Moment.Moment;
	readonly category: ICategory;
	readonly profile: IProfile;
}

const DEFAULT_BUDGET: IBudget = {
	id: undefined,
	amount: 0,
	type: "budget",
	startDate: Moment().startOf("month"),
	endDate: Moment().endOf("month"),
	category: undefined,
	profile: undefined,
};

function mapBudgetFromApi(budget: IBudget): IBudget {
	// make sure dates are definitely Moment types
	return {
		...budget,
		startDate: Moment(budget.startDate),
		endDate: Moment(budget.endDate),
	};
}

export {
	IBudget,
	DEFAULT_BUDGET,
	mapBudgetFromApi,
};
