import { IAccount } from "./IAccount";

interface IAccountBalance {
	readonly account: IAccount;
	readonly balance: number;
}

export {
	IAccountBalance,
};
