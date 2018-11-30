import { Budget } from "../models/Budget";
import { ThinBudget } from "./ThinBudget";

interface IBudgetBalance {
	readonly budget: Budget | ThinBudget;
	readonly balance: number;
}

export {
	IBudgetBalance,
};
