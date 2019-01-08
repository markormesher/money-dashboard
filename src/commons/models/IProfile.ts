import { mapEntitiesFromApi } from "../utils/entities";
import { IAccount, mapAccountFromApi } from "./IAccount";
import { IBudget, mapBudgetFromApi } from "./IBudget";
import { ICategory, mapCategoryFromApi } from "./ICategory";
import { ITransaction, mapTransactionFromApi } from "./ITransaction";
import { IUser, mapUserFromApi } from "./IUser";

interface IProfile {
	readonly id: string;
	readonly name: string;
	readonly deleted: boolean;

	readonly accounts: IAccount[];
	readonly budgets: IBudget[];
	readonly categories: ICategory[];
	readonly transactions: ITransaction[];
	readonly users: IUser[];
	readonly usersWithProfileActivated: IUser[];
}

const DEFAULT_PROFILE: IProfile = {
	id: null,
	name: "",
	deleted: false,

	accounts: undefined,
	budgets: undefined,
	categories: undefined,
	transactions: undefined,
	users: undefined,
	usersWithProfileActivated: undefined,
};

function mapProfileFromApi(profile: IProfile): IProfile {
	if (!profile) {
		return undefined;
	}

	return {
		...profile,

		accounts: mapEntitiesFromApi(mapAccountFromApi, profile.accounts),
		budgets: mapEntitiesFromApi(mapBudgetFromApi, profile.budgets),
		categories: mapEntitiesFromApi(mapCategoryFromApi, profile.categories),
		transactions: mapEntitiesFromApi(mapTransactionFromApi, profile.transactions),
		users: mapEntitiesFromApi(mapUserFromApi, profile.users),
		usersWithProfileActivated: mapEntitiesFromApi(mapUserFromApi, profile.usersWithProfileActivated),
	};
}

export {
	IProfile,
	DEFAULT_PROFILE,
	mapProfileFromApi,
};
