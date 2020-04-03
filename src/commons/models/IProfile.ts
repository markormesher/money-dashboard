import { mapEntities } from "../utils/entities";
import { IAccount, mapAccountFromApi, mapAccountForApi } from "./IAccount";
import { IBudget, mapBudgetFromApi, mapBudgetForApi } from "./IBudget";
import { ICategory, mapCategoryFromApi, mapCategoryForApi } from "./ICategory";
import { ITransaction, mapTransactionFromApi, mapTransactionForApi } from "./ITransaction";
import { IUser, mapUserFromApi, mapUserForApi } from "./IUser";

interface IProfile {
  readonly id: string;
  readonly name: string;
  readonly deleted: boolean;

  readonly accounts: IAccount[];
  readonly budgets: IBudget[];
  readonly categories: ICategory[];
  readonly transactions: ITransaction[];
  readonly users: IUser[];
  readonly usersWithProfileActivated: IUser[];
}

const DEFAULT_PROFILE: IProfile = {
  id: null,
  name: "",
  deleted: false,

  accounts: undefined,
  budgets: undefined,
  categories: undefined,
  transactions: undefined,
  users: undefined,
  usersWithProfileActivated: undefined,
};

function mapProfileFromApi(profile: IProfile): IProfile {
  if (!profile) {
    return undefined;
  }

  return {
    ...profile,

    accounts: mapEntities(mapAccountFromApi, profile.accounts),
    budgets: mapEntities(mapBudgetFromApi, profile.budgets),
    categories: mapEntities(mapCategoryFromApi, profile.categories),
    transactions: mapEntities(mapTransactionFromApi, profile.transactions),
    users: mapEntities(mapUserFromApi, profile.users),
    usersWithProfileActivated: mapEntities(mapUserFromApi, profile.usersWithProfileActivated),
  };
}

function mapProfileForApi(profile: IProfile): IProfile {
  if (!profile) {
    return undefined;
  }

  return {
    ...profile,

    accounts: mapEntities(mapAccountForApi, profile.accounts),
    budgets: mapEntities(mapBudgetForApi, profile.budgets),
    categories: mapEntities(mapCategoryForApi, profile.categories),
    transactions: mapEntities(mapTransactionForApi, profile.transactions),
    users: mapEntities(mapUserForApi, profile.users),
    usersWithProfileActivated: mapEntities(mapUserForApi, profile.usersWithProfileActivated),
  };
}

export { IProfile, DEFAULT_PROFILE, mapProfileFromApi, mapProfileForApi };
