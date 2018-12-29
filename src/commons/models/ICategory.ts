import { IBudget } from "./IBudget";
import { IProfile } from "./IProfile";
import { ITransaction } from "./ITransaction";

interface ICategory {
	readonly id: string;
	readonly name: string;
	readonly isMemoCategory: boolean;
	readonly isIncomeCategory: boolean;
	readonly isExpenseCategory: boolean;
	readonly isAssetGrowthCategory: boolean;
	readonly budgets: IBudget[];
	readonly transactions: ITransaction[];
	readonly profile: IProfile;
	readonly deleted: boolean;
}

const DEFAULT_CATEGORY: ICategory = {
	id: undefined,
	name: "",
	isMemoCategory: false,
	isIncomeCategory: false,
	isExpenseCategory: false,
	isAssetGrowthCategory: false,
	budgets: undefined,
	transactions: undefined,
	profile: undefined,
	deleted: false,
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
