import { NextFunction, Request, Response } from "express";
import * as Moment from "moment";
import { ThinCategory } from "../model-thins/ThinCategory";
import { Category } from "../models/Category";

// generic

function formatCurrency(amount: number, styled: boolean = true): string {
	if (styled) {
		return `<span class="currency">${amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</span>`;
	} else {
		return amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
	}
}

function formatTag(tag: string, tagClass?: string): string {
	tagClass = tagClass || 'default';
	return ` <span class="label label-${tagClass}">${tag}</span>`;
}

function formatDate(date: Date | Moment.Moment | string, format: 'user' | 'system' = 'user'): string {
	if (format == 'user') {
		return Moment(date).format('DD/MM/YYYY');
	} else if (format == 'system') {
		return Moment(date).format('YYYY-MM-DD');
	} else {
		throw new Error(`Illegal format: ${format}`);
	}
}

function formatMutedText(text: string): string {
	return `<span class="text-muted">${text}</span>`;
}

function formatTooltip(text: string, tooltip: string) {
	return `<span class="text-muted" data-toggle="tooltip" title="${tooltip}">${text}</span>`;
}

function formatInfoIcon(info: string): string {
	return formatTooltip(formatMutedText(`<i class="far fa-fw fa-info-circle"></i>`), info);
}

// accounts

function formatAccountType(type: string): string {
	switch (type) {
		case 'current':
			return formatTag('Current Account', 'info');
		case 'savings':
			return formatTag('Savings Account', 'success');
		case 'asset':
			return formatTag('Asset', 'warning');
		default:
			return formatTag('Other', 'danger');
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

	if (start.getDate() == 1
			&& start.getMonth() == end.getMonth()
			&& new Date(end.getTime() + oneDay).getMonth() != end.getMonth()) {
		// type: month
		return Moment(start).format('MMM, YYYY');

	} else if (start.getDate() == 1
			&& start.getMonth() == 0
			&& end.getDate() == 31
			&& end.getMonth() == 11
			&& start.getFullYear() == end.getFullYear()) {
		// type: calendar year
		return Moment(start).format('YYYY');

	} else if (start.getDate() == 6
			&& start.getMonth() == 3
			&& end.getDate() == 5
			&& end.getMonth() == 3
			&& start.getFullYear() == end.getFullYear() - 1) {
		// type: tax year
		return `${Moment(start).format('YYYY')}/${Moment(end).format('YYYY')} tax year`

	} else {
		// unrecognised type
		return `${formatDate(start)} to ${formatDate(end)}`;
	}
}

// categories

function formatCategoryTypes(category: Category | ThinCategory): string {
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

	if (output != '') {
		return output.trim();
	} else {
		return formatMutedText('None');
	}
}

// publishing

const formatterMiddleware = (req: Request, res: Response, next: NextFunction) => {
	res.locals.formatters = {
		formatCurrency: formatCurrency,
		formatTag: formatTag,
		formatDate: formatDate,
	};
	next();
};

export {
	formatCurrency,
	formatTag,
	formatDate,
	formatMutedText,
	formatTooltip,
	formatInfoIcon,

	formatAccountType,
	formatBudgetType,
	formatBudgetPeriod,
	formatCategoryTypes,

	formatterMiddleware
}
