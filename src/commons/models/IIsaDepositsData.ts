import { IDetailedAccountBalance } from "./IDetailedAccountBalance";

interface IIsaDepositsData {
  readonly years: Array<{
    readonly startYear: number;
    readonly balances: IDetailedAccountBalance[];
  }>;
}

export { IIsaDepositsData };
