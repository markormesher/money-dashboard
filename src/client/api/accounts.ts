import axios from "axios";
import { IAccount, mapAccountForApi, mapAccountFromApi } from "../../models/IAccount";
import { IAccountBalance, mapAccountBalanceFromApi } from "../../models/IAccountBalance";
import { IAccountBalanceUpdate } from "../../models/IAccountBalanceUpdate";
import { cacheWrap } from "./utils";

async function saveAccount(account: IAccount): Promise<void> {
  await axios.post(`/api/accounts/edit/${account.id || ""}`, mapAccountForApi(account));
}

async function deleteAccount(account: IAccount): Promise<void> {
  await axios.post(`/api/accounts/delete/${account.id}`);
}

async function getAllAccounts(): Promise<IAccount[]> {
  const res = await axios.get<IAccount[]>("/api/accounts/list");
  return res.data.map(mapAccountFromApi);
}

async function getAccountBalances(): Promise<IAccountBalance[]> {
  const res = await axios.get<IAccountBalance[]>("/api/accounts/balances");
  return res.data.map(mapAccountBalanceFromApi);
}

async function updateAccountBalance(balanceUpdate: IAccountBalanceUpdate): Promise<void> {
  await axios.post("/api/accounts/asset-balance-update", { balanceUpdate });
}

const AccountApi = {
  saveAccount,
  deleteAccount,
  getAllAccounts,
  getAccountBalances,
  updateAccountBalance,

  // cached versions
  useAccountList: cacheWrap("account-list", getAllAccounts),
  useAccountBalances: cacheWrap("account-balances", getAccountBalances),
};

export { AccountApi };
