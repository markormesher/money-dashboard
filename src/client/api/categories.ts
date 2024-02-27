import axios from "axios";
import { ICategory, mapCategoryFromApi } from "../../models/ICategory";
import { ICategoryBalance, mapCategoryBalanceFromApi } from "../../models/ICategoryBalance";
import { cacheWrap } from "./utils";

async function saveCategory(category: ICategory): Promise<void> {
  await axios.post(`/api/categories/edit/${category.id || ""}`, category);
}

async function deleteCategory(category: ICategory): Promise<void> {
  await axios.post(`/api/categories/delete/${category.id}`);
}

async function getAllCategories(): Promise<ICategory[]> {
  const res = await axios.get<ICategory[]>("/api/categories/list");
  return res.data.map(mapCategoryFromApi);
}

async function getMemoCategoryBalances(): Promise<ICategoryBalance[]> {
  const res = await axios.get<ICategoryBalance[]>("/api/categories/memo-balances");
  return res.data.map(mapCategoryBalanceFromApi);
}

const CategoryApi = {
  saveCategory,
  deleteCategory,
  getAllCategories,
  getMemoCategoryBalances,
  useCategoryList: cacheWrap("category-list", getAllCategories),
};

export { CategoryApi };
