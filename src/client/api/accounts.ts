import axios from "axios";
import { useState } from "react";
import { IAccount, mapAccountFromApi } from "../../models/IAccount";
import { IAccountBalance, mapAccountBalanceFromApi } from "../../models/IAccountBalance";
import { IAccountBalanceUpdate } from "../../models/IAccountBalanceUpdate";
import { globalErrorManager } from "../helpers/errors/error-manager";

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

// hooks to access cached values

let cachedAccountList: IAccount[] | undefined = undefined;

function useAccountList(): [IAccount[] | undefined, () => void] {
  const [accountList, setAccountList] = useState<IAccount[] | undefined>(cachedAccountList);

  function refreshAccountList(): void {
    getAllAccounts()
      .then((accounts) => {
        setAccountList(accounts);
        cachedAccountList = accounts;
      })
      .catch((err) => {
        globalErrorManager.emitNonFatalError("Failed to reload account list", err);
      });
  }

  return [accountList, refreshAccountList];
}

const AccountApi = {
  saveAccount,
  deleteAccount,
  getAllAccounts,
  getAccountBalances,
  useAccountList,
  updateAccountBalance,
};

export { AccountApi };
