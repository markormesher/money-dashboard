import { mapEntitiesFromApi } from "../utils/entities";
import { IProfile, mapProfileFromApi } from "./IProfile";
import { ITransaction, mapTransactionFromApi } from "./ITransaction";

interface IAccount {
	readonly id: string;
	readonly name: string;
	readonly type: string;
	readonly active: boolean;
	readonly deleted: boolean;

	readonly profile: IProfile;
	readonly transactions: ITransaction[];
}

const DEFAULT_ACCOUNT: IAccount = {
	id: null,
	name: "",
	type: "current",
	active: true,
	deleted: false,

	profile: undefined,
	transactions: undefined,
};

function mapAccountFromApi(account?: IAccount): IAccount {
	if (!account) {
		return undefined;
	}

	return {
		...account,
		profile: mapProfileFromApi(account.profile),
		transactions: mapEntitiesFromApi(mapTransactionFromApi, account.transactions),
	};
}

export {
	IAccount,
	DEFAULT_ACCOUNT,
	mapAccountFromApi,
};
