import { mapEntities } from "../utils/entities";
import { IBudget, mapBudgetFromApi, mapBudgetForApi } from "./IBudget";
import { IProfile, mapProfileFromApi, mapProfileForApi } from "./IProfile";
import { ITransaction, mapTransactionFromApi, mapTransactionForApi } from "./ITransaction";
import { ICategoryToEnvelopeAllocation } from "./ICategoryToEnvelopeAllocation";

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
  readonly envelopeAllocations: ICategoryToEnvelopeAllocation[];
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
  envelopeAllocations: undefined,
  profile: undefined,
};

function mapCategoryFromApi(category?: ICategory): ICategory {
  if (!category) {
    return undefined;
  }

  return {
    ...category,

    budgets: mapEntities(mapBudgetFromApi, category.budgets),
    transactions: mapEntities(mapTransactionFromApi, category.transactions),
    profile: mapProfileFromApi(category.profile),
  };
}

function mapCategoryForApi(category?: ICategory): ICategory {
  if (!category) {
    return undefined;
  }

  return {
    ...category,

    budgets: mapEntities(mapBudgetForApi, category.budgets),
    transactions: mapEntities(mapTransactionForApi, category.transactions),
    profile: mapProfileForApi(category.profile),
  };
}

export { ICategory, DEFAULT_CATEGORY, mapCategoryFromApi, mapCategoryForApi };
