import { IAccount, mapAccountFromApi } from "./IAccount";

interface IDetailedAccountBalance {
	readonly account: IAccount;
	readonly balanceIn: number;
	readonly balanceOut: number;
}

function mapDetailedAccountBalanceFromApi(balance?: IDetailedAccountBalance): IDetailedAccountBalance {
	if (!balance) {
		return undefined;
	}

	return {
		...balance,
		account: mapAccountFromApi(balance.account),
	};
}

export {
	IDetailedAccountBalance,
	mapDetailedAccountBalanceFromApi,
};
