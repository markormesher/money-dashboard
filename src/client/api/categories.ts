import axios from "axios";
import { ICategory } from "../../models/ICategory";

async function saveCategory(category: ICategory): Promise<void> {
  await axios.post(`/api/categories/edit/${category.id || ""}`, category);
}

async function deleteCategory(category: ICategory): Promise<void> {
  await axios.post(`/api/categories/delete/${category.id}`);
}

const CategoryApi = {
  saveCategory,
  deleteCategory,
};

export { CategoryApi };
