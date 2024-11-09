import axios from "axios";
import { IBudget, mapBudgetForApi, mapBudgetFromApi } from "../../models/IBudget";
import { IBudgetBalance } from "../../models/IBudgetBalance";
import { IDateRange } from "../../models/IDateRange";
import { cacheWrap } from "./utils";

async function saveBudget(budget: IBudget): Promise<void> {
  await axios.post(`/api/budgets/edit/${budget.id || ""}`, mapBudgetForApi(budget));
}

async function deleteBudget(budget: IBudget): Promise<void> {
  await axios.post(`/api/budgets/delete/${budget.id}`);
}

async function cloneBudgets(budgetIds: string[], dateRange: IDateRange): Promise<void> {
  await axios.post("/api/budgets/clone", {
    budgetIds,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });
}

async function getBudgetBalances(): Promise<IBudgetBalance[]> {
  const res = await axios.get<IBudgetBalance[]>(`/api/budgets/balances`);
  return res.data.map((rawItem) => ({
    ...rawItem,
    budget: mapBudgetFromApi(rawItem.budget),
  }));
}

const BudgetApi = {
  saveBudget,
  deleteBudget,
  cloneBudgets,
  getBudgetBalances,

  // cached versions
  useBudgetBalances: cacheWrap("budget-balances", getBudgetBalances),
};

export { BudgetApi };
