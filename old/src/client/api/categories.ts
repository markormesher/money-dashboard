import axios from "axios";
import { ICategory, mapCategoryForApi, mapCategoryFromApi } from "../../models/ICategory";
import { ICategoryBalance, mapCategoryBalanceFromApi } from "../../models/ICategoryBalance";
import { cacheWrap } from "./utils";

async function saveCategory(category: ICategory): Promise<void> {
  await axios.post(`/api/categories/edit/${category.id || ""}`, mapCategoryForApi(category));
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

  // cached versions
  useCategoryList: cacheWrap("category-list", getAllCategories),
  useMemoCategoryBalances: cacheWrap("memo-category-balances", getMemoCategoryBalances),
};

export { CategoryApi };
