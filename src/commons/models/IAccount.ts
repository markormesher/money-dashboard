import { mapEntities } from "../utils/entities";
import { IProfile, mapProfileFromApi, mapProfileForApi } from "./IProfile";
import { ITransaction, mapTransactionFromApi, mapTransactionForApi } from "./ITransaction";
import { CurrencyCode } from "./ICurrency";

const ACCOUNT_TYPES = ["current", "savings", "asset", "other"] as const;
type AccountType = typeof ACCOUNT_TYPES[number];

const ACCOUNT_TAGS = ["pension", "isa"] as const;
type AccountTag = typeof ACCOUNT_TAGS[number];

const ACCOUNT_TAG_DISPLAY_NAMES: { [key in AccountTag]: string } = {
  pension: "Pension",
  isa: "ISA",
};

interface IAccount {
  readonly id: string;
  readonly name: string;
  readonly type: AccountType;
  readonly tags: AccountTag[];
  readonly note: string;
  readonly currencyCode: CurrencyCode;
  readonly active: boolean;
  readonly deleted: boolean;

  readonly profile: IProfile;
  readonly transactions: ITransaction[];
}

const DEFAULT_ACCOUNT: IAccount = {
  id: null,
  name: "",
  type: "current",
  tags: [],
  note: "",
  currencyCode: "GBP",
  active: true,
  deleted: false,

  profile: undefined,
  transactions: undefined,
};

function mapAccountFromApi(account?: IAccount): IAccount {
  if (!account) {
    return undefined;
  }

  return {
    ...account,

    profile: mapProfileFromApi(account.profile),
    transactions: mapEntities(mapTransactionFromApi, account.transactions),
  };
}

function mapAccountForApi(account?: IAccount): IAccount {
  if (!account) {
    return undefined;
  }

  return {
    ...account,

    profile: mapProfileForApi(account.profile),
    transactions: mapEntities(mapTransactionForApi, account.transactions),
  };
}

export {
  AccountType,
  ACCOUNT_TYPES,
  AccountTag,
  ACCOUNT_TAGS,
  ACCOUNT_TAG_DISPLAY_NAMES,
  IAccount,
  DEFAULT_ACCOUNT,
  mapAccountFromApi,
  mapAccountForApi,
};
