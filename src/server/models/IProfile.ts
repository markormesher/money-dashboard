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
	readonly deleted: boolean;
}

const DEFAULT_PROFILE: IProfile = {
	id: null,
	name: "",
	accounts: undefined,
	budgets: undefined,
	users: undefined,
	usersWithProfileActivated: undefined,
	deleted: false,
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
