import {Category} from "../models/Category";
import * as moment from "moment";
import {PrimitiveProfile} from "ThinProfile.ts";
import {PrimitiveCategory} from "ThinCategory.ts";

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

function formatDate(date: Date): string {
	return moment(date).format('DD/MM/YYYY');
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
	const oneDay = 24 * 60 * 60 * 1000;

	console.log(start);
	console.log(typeof start);

	if (start.getDate() == 1
			&& start.getMonth() == end.getMonth()
			&& new Date(end.getTime() + oneDay).getMonth() != end.getMonth()) {
		// type: month
		return moment(start).format('MMM, YYYY');

	} else if (start.getDate() == 1
			&& start.getMonth() == 0
			&& end.getDate() == 31
			&& end.getMonth() == 11
			&& start.getFullYear() == end.getFullYear()) {
		// type: calendar year
		return moment(start).format('YYYY');

	} else if (start.getDate() == 6
			&& start.getMonth() == 3
			&& end.getDate() == 5
			&& end.getMonth() == 3
			&& start.getFullYear() == end.getFullYear() - 1) {
		// type: tax year
		return `${moment(start).format('YYYY')}/${moment(end).format('YYYY')} tax year`

	} else {
		// unrecognised type
		return `${formatDate(start)} to ${formatDate(end)}`;
	}
}

// categories

function formatCategoryTypes(category: Category | PrimitiveCategory): string {
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
