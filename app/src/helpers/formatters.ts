import {Category} from "../models/Category";

// generic

function formatCurrency(amount: number, styled: boolean = true): string {
	if (styled) {
		return `<span class="currency">${amount.toFixed(2)}</span>`;
	} else {
		return amount.toFixed(2);
	}
}

function formatTag(tag: string, tagClass?: string): string {
	tagClass = tagClass || 'default';
	return ` <span class="label label-${tagClass}">${tag}</span>`;
}

// accounts

function formatAccountType(type: string): string {
	switch (type) {
		case 'current':
			return 'Current Account';
		case 'savings':
			return 'Savings Account';
		case 'asset':
			return 'Asset';
		default:
			return 'Other'
	}
}

// budgets

function formatBudgetType(type: string): string {
	if (type == 'budget') {
		return formatTag('Budget', 'info');
	} else if (type == 'bill') {
		return formatTag('Bill', 'warning');
	} else {
		return formatTag(type);
	}
}

function formatBudgetPeriod(start: Date, end: Date): string {
	// TODO: period formatted
	return 'period';
}

// categories

function formatCategoryTypes(category: Category): string {
	let output = '';
	if (category.isMemoCategory) {
		output += formatTag('Memo', 'info');
	}
	if (category.isIncomeCategory) {
		output += formatTag('Income', 'success');
	}
	if (category.isExpenseCategory) {
		output += formatTag('Expense', 'danger');
	}
	if (category.isAssetGrowthCategory) {
		output += formatTag('Asset Growth', 'warning');
	}
	return output.trim();
}

export {
	formatCurrency,
	formatTag,
	formatAccountType,
	formatBudgetType,
	formatBudgetPeriod,
	formatCategoryTypes
}
