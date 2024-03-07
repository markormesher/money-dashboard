import { IDetailedAccountBalance } from "./IDetailedAccountBalance";

type IIsaDepositsData = {
  readonly years: {
    readonly startYear: number;
    readonly balances: IDetailedAccountBalance[];
  }[];
};

export { IIsaDepositsData };
