import { IAccountBalance } from "./IAccountBalance";

interface IIsaDepositsData {
	readonly years: Array<{
		readonly startYear: number;
		readonly balances: IAccountBalance[];
	}>;
}

export {
	IIsaDepositsData,
};
