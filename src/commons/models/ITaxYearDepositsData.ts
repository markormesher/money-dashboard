import { mapEntities } from "../utils/entities";
import { ICategory, mapCategoryFromApi } from "./ICategory";
import { IDetailedCategoryBalance } from "./IDetailedCategoryBalance";

interface ITaxYearDepositsData {
  readonly allYears: number[];
  readonly allCategories: ICategory[];
  readonly yearData: { readonly [year: number]: { readonly [categoryId: string]: IDetailedCategoryBalance } };
}

function mapTaxYearDepositsDataFromApi(data?: ITaxYearDepositsData): ITaxYearDepositsData {
  if (!data) {
    return undefined;
  }

  return {
    ...data,
    allCategories: mapEntities(mapCategoryFromApi, data.allCategories),
    // TODO: map categories inside nested data
  };
}

export { ITaxYearDepositsData, mapTaxYearDepositsDataFromApi };
