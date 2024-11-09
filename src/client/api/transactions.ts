import axios from "axios";
import { ITransaction, mapTransactionForApi } from "../../models/ITransaction";
import { cacheWrap } from "./utils";

async function saveTransaction(transaction: ITransaction): Promise<void> {
  await axios.post(`/api/transactions/edit/${transaction.id || ""}`, mapTransactionForApi(transaction));
}

async function deleteTransaction(transaction: ITransaction): Promise<void> {
  await axios.post(`/api/transactions/delete/${transaction.id}`);
}

async function getAllPayees(): Promise<string[]> {
  const res = await axios.get<string[]>("/api/transactions/payees");
  return res.data;
}

const TransactionApi = {
  saveTransaction,
  deleteTransaction,
  getAllPayees,
  usePayeeList: cacheWrap("payee-list", getAllPayees),
};

export { TransactionApi };
