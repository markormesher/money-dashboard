import * as Moment from "moment";
import { ICategory, mapCategoryFromApi } from "./ICategory";
import { IProfile, mapProfileFromApi } from "./IProfile";

interface IBudget {
  readonly id: string;
  readonly type: "budget" | "bill";
  readonly amount: number;
  readonly startDate: Moment.Moment;
  readonly endDate: Moment.Moment;
  readonly deleted: boolean;

  readonly category: ICategory;
  readonly profile: IProfile;
}

const DEFAULT_BUDGET: IBudget = {
  id: undefined,
  amount: 0,
  type: "budget",
  startDate: Moment().startOf("month"),
  endDate: Moment().endOf("month"),
  deleted: false,

  category: undefined,
  profile: undefined,
};

function mapBudgetFromApi(budget?: IBudget): IBudget {
  if (!budget) {
    return undefined;
  }

  return {
    ...budget,
    startDate: Moment(budget.startDate),
    endDate: Moment(budget.endDate),

    category: mapCategoryFromApi(budget.category),
    profile: mapProfileFromApi(budget.profile),
  };
}

export { IBudget, DEFAULT_BUDGET, mapBudgetFromApi };
