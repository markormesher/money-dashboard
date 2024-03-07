import { ICategory, mapCategoryFromApi } from "./ICategory";

type IDetailedCategoryBalance = {
  readonly category: ICategory;
  readonly balanceIn: number;
  readonly balanceOut: number;
};

function mapDetailedCategoryBalanceFromApi(balance?: IDetailedCategoryBalance): IDetailedCategoryBalance {
  if (!balance) {
    return undefined;
  }

  return {
    ...balance,
    category: mapCategoryFromApi(balance.category),
  };
}

export { IDetailedCategoryBalance, mapDetailedCategoryBalanceFromApi };
