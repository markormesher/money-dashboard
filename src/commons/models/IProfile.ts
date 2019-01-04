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
	return {
		...profile,

		accounts: profile.accounts ? profile.accounts.map(mapAccountFromApi) : undefined,
		budgets: profile.budgets ? profile.budgets.map(mapBudgetFromApi) : undefined,
		categories: profile.categories ? profile.categories.map(mapCategoryFromApi) : undefined,
		transactions: profile.transactions ? profile.transactions.map(mapTransactionFromApi) : undefined,
		users: profile.users ? profile.users.map(mapUserFromApi) : undefined,
		usersWithProfileActivated: profile.usersWithProfileActivated
				? profile.usersWithProfileActivated.map(mapUserFromApi) : undefined,
	};
}

export {
	IProfile,
	DEFAULT_PROFILE,
	mapProfileFromApi,
};
