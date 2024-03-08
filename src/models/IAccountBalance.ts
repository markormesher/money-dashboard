import { IAccount, mapAccountFromApi } from "./IAccount";

type IAccountBalance = {
  readonly account: IAccount;
  readonly balance: number;
};

function mapAccountBalanceFromApi(balance?: IAccountBalance): IAccountBalance {
  if (!balance) {
    return undefined;
  }

  return {
    ...balance,
    account: mapAccountFromApi(balance.account),
  };
}

export { IAccountBalance, mapAccountBalanceFromApi };
