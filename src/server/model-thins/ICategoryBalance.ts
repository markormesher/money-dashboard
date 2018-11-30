import { Category } from "../models/Category";
import { ThinCategory } from "./ThinCategory";

interface ICategoryBalance {
	readonly category: Category | ThinCategory;
	readonly balance: number;
}

export {
	ICategoryBalance,
};
