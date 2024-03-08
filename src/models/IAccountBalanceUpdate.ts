import { IAccount } from "./IAccount";
import { IAccountBalance } from "./IAccountBalance";

type IAccountBalanceUpdate = {
  readonly account: IAccount;
  readonly balance: number;
  readonly updateDate: number;
};

function mapAccountBalanceToUpdate(accountBalance: IAccountBalance): IAccountBalanceUpdate {
  return { ...accountBalance, updateDate: new Date().getTime() };
}

export { IAccountBalanceUpdate, mapAccountBalanceToUpdate };
