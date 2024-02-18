import axios from "axios";
import { useState } from "react";
import { ICategory, mapCategoryFromApi } from "../../models/ICategory";
import { globalErrorManager } from "../helpers/errors/error-manager";

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

// hooks to access cached values

let cachedCategoryList: ICategory[] | undefined = undefined;

function useCategoryList(): [ICategory[] | undefined, () => void] {
  const [categoryList, setCategoryList] = useState<ICategory[] | undefined>(cachedCategoryList);

  function refreshCategoryList(): void {
    getAllCategories()
      .then((categories) => {
        setCategoryList(categories);
        cachedCategoryList = categories;
      })
      .catch((err) => {
        globalErrorManager.emitNonFatalError("Failed to reload category list", err);
      });
  }

  return [categoryList, refreshCategoryList];
}

const CategoryApi = {
  saveCategory,
  deleteCategory,
  getAllCategories,
  useCategoryList,
};

export { CategoryApi };
