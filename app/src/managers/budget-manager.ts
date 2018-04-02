import Bluebird = require("bluebird");
import { Op } from "sequelize";

import { Budget } from "../models/Budget";
import { Category } from "../models/Category";
import { Profile } from "../models/Profile";
import { User } from "../models/User";

function getBudget(user: User, budgetId: string, mustExist: boolean = false): Bluebird<Budget> {
	return Budget
			.findOne({
				where: { id: budgetId },
				include: [Profile, Category],
			})
			.then((budget) => {
				if (!budget && mustExist) {
					throw new Error("That budget does not exist");
				} else if (budget && user && budget.profile.id !== user.activeProfile.id) {
					throw new Error("User does not own this budget");
				} else {
					return budget;
				}
			});
}

function getAllBudgets(user: User, start: Date = null, end: Date = null): Bluebird<Budget[]> {
	const dateQueryFragment = [];

	if (start !== null) {
		dateQueryFragment.push({
			endDate: {
				[Op.gte]: start,
			},
		});
	}
	if (end !== null) {
		dateQueryFragment.push({
			startDate: {
				[Op.lte]: end,
			},
		});
	}

	return Budget
			.findAll({
				where: {
					profileId: user.activeProfile.id,
					[Op.and]: dateQueryFragment,
				},
				include: [Profile, Category],
			});
}

function saveBudget(user: User, budgetId: string, properties: Partial<Budget>): Bluebird<Budget> {
	return getBudget(user, budgetId)
			.then((budget) => {
				budget = budget || new Budget();
				return budget.update(properties);
			})
			.then((budget) => {
				return budget.$set("profile", user.activeProfile);
			});
}

function deleteBudget(user: User, budgetId: string): Bluebird<void> {
	return getBudget(user, budgetId)
			.then((budget) => {
				if (!budget) {
					throw new Error("That budget does not exist");
				} else {
					return budget;
				}
			})
			.then((budget) => budget.destroy());
}

function cloneBudgets(user: User, budgetsIds: string[], startDate: Date, endDate: Date): Bluebird<Budget[]> {
	return Bluebird
			.all(budgetsIds.map((id) => getBudget(user, id, true)))
			.then((budgets: Budget[]) => {
				return budgets.map((budget) => {
					const clonedBudget = budget.buildClone();
					clonedBudget.startDate = startDate;
					clonedBudget.endDate = endDate;
					return clonedBudget;
				});
			})
			.then((clonedBudgets: Budget[]) => {
				return Bluebird.all(clonedBudgets.map((b) => b.save()));
			});
}

export {
	getBudget,
	getAllBudgets,
	saveBudget,
	deleteBudget,
	cloneBudgets,
};
