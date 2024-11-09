import { ICategory, mapCategoryFromApi } from "./ICategory";

type ICategoryBalance = {
  readonly category: ICategory;
  readonly balance: number;
};

function mapCategoryBalanceFromApi(categoryBalance?: ICategoryBalance): ICategoryBalance {
  if (!categoryBalance) {
    return undefined;
  }

  return {
    ...categoryBalance,

    category: mapCategoryFromApi(categoryBalance.category),
  };
}

export { ICategoryBalance, mapCategoryBalanceFromApi };
