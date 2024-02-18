import axios from "axios";
import { useState } from "react";
import { ITransaction } from "../../models/ITransaction";
import { globalErrorManager } from "../helpers/errors/error-manager";

async function saveTransaction(transaction: ITransaction): Promise<void> {
  await axios.post(`/api/transactions/edit/${transaction.id || ""}`, transaction);
}

async function deleteTransaction(transaction: ITransaction): Promise<void> {
  await axios.post(`/api/transactions/delete/${transaction.id}`);
}

async function getAllPayees(): Promise<string[]> {
  const res = await axios.get<string[]>("/api/transactions/payees");
  return res.data;
}

// hooks to access cached values

let cachedPayeeList: string[] | undefined = undefined;

function usePayeeList(): [string[] | undefined, () => void] {
  const [payeeList, setPayeeList] = useState<string[] | undefined>(cachedPayeeList);

  function refreshPayeeList(): void {
    getAllPayees()
      .then((payees) => {
        setPayeeList(payees);
        cachedPayeeList = payees;
      })
      .catch((err) => {
        globalErrorManager.emitNonFatalError("Failed to reload payee list", err);
      });
  }

  return [payeeList, refreshPayeeList];
}

const TransactionApi = {
  saveTransaction,
  deleteTransaction,
  getAllPayees,
  usePayeeList,
};

export { TransactionApi };
