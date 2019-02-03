import { mapEntitiesFromApi } from "../utils/entities";
import { ICategory, mapCategoryFromApi } from "./ICategory";
import { IDetailedCategoryBalance } from "./IDetailedCategoryBalance";

interface IPensionDepositsData {
	readonly allYears: number[];
	readonly allCategories: ICategory[];
	readonly yearData: { readonly [year: number]: { readonly [categoryId: string]: IDetailedCategoryBalance } };
}

function mapPensionDepositsDataFromApi(data?: IPensionDepositsData): IPensionDepositsData {
	if (!data) {
		return undefined;
	}

	return {
		...data,
		allCategories: mapEntitiesFromApi(mapCategoryFromApi, data.allCategories),
		// TODO: map categories inside nested data
	};
}

export {
	IPensionDepositsData,
	mapPensionDepositsDataFromApi,
};
