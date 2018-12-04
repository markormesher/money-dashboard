import { IBudget } from "./IBudget";
import { IProfile } from "./IProfile";

interface ICategory {
	readonly id: string;
	readonly name: string;
	readonly isMemoCategory: boolean;
	readonly isIncomeCategory: boolean;
	readonly isExpenseCategory: boolean;
	readonly isAssetGrowthCategory: boolean;
	readonly budgets: IBudget[];
	readonly profile: IProfile;
}

const DEFAULT_CATEGORY: ICategory = {
	id: undefined,
	name: "",
	isMemoCategory: false,
	isIncomeCategory: false,
	isExpenseCategory: false,
	isAssetGrowthCategory: false,
	budgets: undefined,
	profile: undefined,
};

function mapCategoryFromApi(category: ICategory): ICategory {
	// no-op, for now
	return category;
}

export {
	ICategory,
	DEFAULT_CATEGORY,
	mapCategoryFromApi,
};
