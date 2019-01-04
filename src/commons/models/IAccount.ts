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

function mapAccountFromApi(account: IAccount): IAccount {
	return {
		...account,
		profile: account.profile ? mapProfileFromApi(account.profile) : undefined,
		transactions: account.transactions ? account.transactions.map(mapTransactionFromApi) : undefined,
	};
}

export {
	IAccount,
	DEFAULT_ACCOUNT,
	mapAccountFromApi,
};
