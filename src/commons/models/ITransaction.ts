import { convertLocalDateToUtc, convertUtcDateToLocal } from "../utils/dates";
import { IAccount, mapAccountFromApi, mapAccountForApi } from "./IAccount";
import { ICategory, mapCategoryFromApi, mapCategoryForApi } from "./ICategory";
import { IProfile, mapProfileFromApi, mapProfileForApi } from "./IProfile";

type DateModeOption = "effective" | "transaction";

interface ITransaction {
  readonly id: string;
  readonly transactionDate: number;
  readonly effectiveDate: number;
  readonly amount: number;
  readonly payee: string;
  readonly note: string;
  readonly deleted: boolean;
  readonly creationDate?: number;

  readonly account: IAccount;
  readonly category: ICategory;
  readonly profile: IProfile;
}

const DEFAULT_TRANSACTION: ITransaction = {
  id: null,
  transactionDate: new Date().getTime(),
  effectiveDate: new Date().getTime(),
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
    transactionDate: convertUtcDateToLocal(transaction.transactionDate),
    effectiveDate: convertUtcDateToLocal(transaction.effectiveDate),

    account: mapAccountFromApi(transaction.account),
    category: mapCategoryFromApi(transaction.category),
    profile: mapProfileFromApi(transaction.profile),
  };
}

function mapTransactionForApi(transaction?: ITransaction): ITransaction {
  if (!transaction) {
    return undefined;
  }

  return {
    ...transaction,
    transactionDate: convertLocalDateToUtc(transaction.transactionDate),
    effectiveDate: convertLocalDateToUtc(transaction.effectiveDate),

    account: mapAccountForApi(transaction.account),
    category: mapCategoryForApi(transaction.category),
    profile: mapProfileForApi(transaction.profile),
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
  mapTransactionForApi,
  getNextTransactionForContinuousCreation,
};
