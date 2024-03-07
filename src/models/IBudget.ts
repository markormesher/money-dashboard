import { startOfMonth, endOfMonth } from "date-fns";
import { convertUtcDateToLocal, convertLocalDateToUtc } from "../utils/dates";
import { ICategory, mapCategoryFromApi, mapCategoryForApi } from "./ICategory";
import { IProfile, mapProfileFromApi, mapProfileForApi } from "./IProfile";

type IBudget = {
  readonly id: string;
  readonly type: "budget" | "bill";
  readonly amount: number;
  readonly startDate: number;
  readonly endDate: number;
  readonly deleted: boolean;

  readonly category: ICategory;
  readonly profile: IProfile;
};

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
    startDate: convertUtcDateToLocal(budget.startDate),
    endDate: convertUtcDateToLocal(budget.endDate),

    category: mapCategoryFromApi(budget.category),
    profile: mapProfileFromApi(budget.profile),
  };
}

function mapBudgetForApi(budget?: IBudget): IBudget {
  if (!budget) {
    return undefined;
  }

  return {
    ...budget,
    startDate: convertLocalDateToUtc(budget.startDate),
    endDate: convertLocalDateToUtc(budget.endDate),

    category: mapCategoryForApi(budget.category), // TODO
    profile: mapProfileForApi(budget.profile), // TODO
  };
}

export { IBudget, DEFAULT_BUDGET, mapBudgetFromApi, mapBudgetForApi };
