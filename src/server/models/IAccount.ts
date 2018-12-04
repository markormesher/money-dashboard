import { IProfile } from "./IProfile";
import { ITransaction } from "./ITransaction";

interface IAccount {
	readonly id: string;
	readonly name: string;
	readonly type: string;
	readonly active: boolean;
	readonly transactions: ITransaction[];
	readonly profile: IProfile;
}

const DEFAULT_ACCOUNT: IAccount = {
	id: null,
	name: "",
	type: "current",
	active: true,
	transactions: undefined,
	profile: undefined,
};

function mapAccountFromApi(account: IAccount): IAccount {
	// no-op, for now
	return account;
}

export {
	IAccount,
	DEFAULT_ACCOUNT,
	mapAccountFromApi,
};
