import Bluebird = require('bluebird');
import {User} from '../models/User';
import {Profile} from '../models/Profile';
import {Budget} from '../models/Budget';

export type BudgetOrId = Budget | string;

function convertBudgetOrIdToId(budgetOrId: BudgetOrId): string {
	if (budgetOrId instanceof Budget) {
		return (budgetOrId as Budget).id;
	} else {
		return (budgetOrId as string);
	}
}

function getBudget(user: User, budgetOrId: BudgetOrId): Bluebird<Budget> {
	const budgetId = convertBudgetOrIdToId(budgetOrId);
	return Budget
			.findOne({
				where: {id: budgetId},
				include: [Profile]
			})
			.then((budget) => {
				if (budget && user && budget.profile.id !== user.activeProfile.id) {
					throw new Error('User does not own this budget');
				} else {
					return budget;
				}
			});
}

function saveBudget(user: User, budgetOrId: BudgetOrId, properties: Partial<Budget>): Bluebird<Budget> {
	return getBudget(user, budgetOrId)
			.then((budget) => {
				budget = budget || new Budget();
				return budget.update(properties);
			})
			.then((budget) => {
				return budget.$set('profile', user.activeProfile);
			});
}

function deleteBudget(user: User, budgetOrId: BudgetOrId): Bluebird<void> {
	return getBudget(user, budgetOrId)
			.then((budget) => {
				if (!budget) {
					throw new Error('That budget does not exist');
				} else {
					return budget;
				}
			})
			.then((budget) => budget.destroy());
}

export {
	getBudget,
	saveBudget,
	deleteBudget
}
