import axios from "axios";
import { useState } from "react";
import { IAccount, mapAccountFromApi } from "../../models/IAccount";
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
  useAccountList,
};

export { AccountApi };
