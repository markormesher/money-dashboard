import { IAccount } from "./IAccount";
import { IBudget } from "./IBudget";
import { IUser } from "./IUser";

interface IProfile {
	readonly id: string;
	readonly name: string;
	readonly accounts: IAccount[];
	readonly budgets: IBudget[];
	readonly users: IUser[];
	readonly usersWithProfileActivated: IUser[];
}

const DEFAULT_PROFILE: IProfile = {
	id: null,
	name: "",
	accounts: undefined,
	budgets: undefined,
	users: undefined,
	usersWithProfileActivated: undefined,
};

function mapProfileFromApi(profile: IProfile): IProfile {
	// no-op, for now
	return profile;
}

export {
	IProfile,
	DEFAULT_PROFILE,
	mapProfileFromApi,
};
