import { mapEntitiesFromApi } from "../utils/entities";
import { IBudget, mapBudgetFromApi } from "./IBudget";
import { IProfile, mapProfileFromApi } from "./IProfile";
import { ITransaction, mapTransactionFromApi } from "./ITransaction";

interface ICategory {
  readonly id: string;
  readonly name: string;
  readonly isMemoCategory: boolean;
  readonly isIncomeCategory: boolean;
  readonly isExpenseCategory: boolean;
  readonly isAssetGrowthCategory: boolean;
  readonly deleted: boolean;

  readonly budgets: IBudget[];
  readonly transactions: ITransaction[];
  readonly profile: IProfile;
}

const DEFAULT_CATEGORY: ICategory = {
  id: undefined,
  name: "",
  isMemoCategory: false,
  isIncomeCategory: false,
  isExpenseCategory: false,
  isAssetGrowthCategory: false,
  deleted: false,

  budgets: undefined,
  transactions: undefined,
  profile: undefined,
};

function mapCategoryFromApi(category?: ICategory): ICategory {
  if (!category) {
    return undefined;
  }

  return {
    ...category,

    budgets: mapEntitiesFromApi(mapBudgetFromApi, category.budgets),
    transactions: mapEntitiesFromApi(mapTransactionFromApi, category.transactions),
    profile: mapProfileFromApi(category.profile),
  };
}

export { ICategory, DEFAULT_CATEGORY, mapCategoryFromApi };
