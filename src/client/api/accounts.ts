import axios from "axios";
import { IAccount, mapAccountFromApi } from "../../models/IAccount";
import { IAccountBalance, mapAccountBalanceFromApi } from "../../models/IAccountBalance";
import { IAccountBalanceUpdate } from "../../models/IAccountBalanceUpdate";
import { cacheWrap } from "./utils";

async function saveAccount(account: IAccount): Promise<void> {
  await axios.post(`/api/accounts/edit/${account.id || ""}`, account);
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

  useAccountList: cacheWrap("account-list", getAllAccounts),
};

export { AccountApi };
