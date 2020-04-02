import { startOfMonth, endOfMonth } from "date-fns";
import { ICategory, mapCategoryFromApi } from "./ICategory";
import { IProfile, mapProfileFromApi } from "./IProfile";

interface IBudget {
  readonly id: string;
  readonly type: "budget" | "bill";
  readonly amount: number;
  readonly startDate: number;
  readonly endDate: number;
  readonly deleted: boolean;

  readonly category: ICategory;
  readonly profile: IProfile;
}

const DEFAULT_BUDGET: IBudget = {
  id: undefined,
  amount: 0,
  type: "budget",
  startDate: startOfMonth(new Date()).getTime(),
  endDate: endOfMonth(new Date()).getTime(),
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

    category: mapCategoryFromApi(budget.category),
    profile: mapProfileFromApi(budget.profile),
  };
}

export { IBudget, DEFAULT_BUDGET, mapBudgetFromApi };
