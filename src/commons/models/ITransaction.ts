import * as Moment from "moment";
import { IAccount, mapAccountFromApi } from "./IAccount";
import { ICategory, mapCategoryFromApi } from "./ICategory";
import { IProfile, mapProfileFromApi } from "./IProfile";

type DateModeOption = "effective" | "transaction";

interface ITransaction {
  readonly id: string;
  readonly transactionDate: Moment.Moment;
  readonly effectiveDate: Moment.Moment;
  readonly amount: number;
  readonly payee: string;
  readonly note: string;
  readonly deleted: boolean;
  readonly creationDate?: Moment.Moment;

  readonly account: IAccount;
  readonly category: ICategory;
  readonly profile: IProfile;
}

const DEFAULT_TRANSACTION: ITransaction = {
  id: null,
  transactionDate: Moment(),
  effectiveDate: Moment(),
  amount: 0,
  payee: "",
  note: undefined,
  deleted: false,

  account: undefined,
  category: undefined,
  profile: undefined,
};

function mapTransactionFromApi(transaction?: ITransaction): ITransaction {
  if (!transaction) {
    return undefined;
  }

  return {
    ...transaction,
    transactionDate: Moment(transaction.transactionDate),
    effectiveDate: Moment(transaction.effectiveDate),
    creationDate: Moment(transaction.creationDate),

    account: mapAccountFromApi(transaction.account),
    category: mapCategoryFromApi(transaction.category),
    profile: mapProfileFromApi(transaction.profile),
  };
}

function getNextTransactionForContinuousCreation(prev: Partial<ITransaction>): ITransaction {
  return {
    ...DEFAULT_TRANSACTION,
    transactionDate: prev.transactionDate || DEFAULT_TRANSACTION.transactionDate,
    effectiveDate: prev.effectiveDate || DEFAULT_TRANSACTION.effectiveDate,
    account: prev.account || DEFAULT_TRANSACTION.account,
  };
}

export {
  DateModeOption,
  ITransaction,
  DEFAULT_TRANSACTION,
  mapTransactionFromApi,
  getNextTransactionForContinuousCreation,
};
