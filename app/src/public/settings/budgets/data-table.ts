import { ThinBudget } from "../../../model-thins/ThinBudget";
import { withDataTableDefaults } from "../../global/data-table-defaults";
import { createDeleteAction, createEditAction, generationActionsHtml } from "../../global/entity-action-creator";
import { formatBudgetPeriod, formatBudgetType, formatCurrency } from "../../global/formatters";
import { getCurrentOnlyState } from "./filter-current-budgets";

function getActions(budget: ThinBudget): string {
	return generationActionsHtml([
		createEditAction(`/settings/budgets/edit/${budget.id}`),
		createDeleteAction(`/settings/budgets/delete/${budget.id}`)
	]);
}

function getCloneCheckbox(budget: ThinBudget): string {
	return `<input type="checkbox" name="cloneBudget" value="${budget.id}" />`;
}

function initDataTable() {
	$('table#budgets').DataTable(withDataTableDefaults({
		columns: [
			{ data: '_clone', orderable: false },
			{ data: 'category.name', orderable: true },
			{ data: 'type', orderable: true },
			{ data: 'period', name: 'startDate', orderable: true },
			{ data: 'amount', orderable: true },
			{ data: '_actions', orderable: false }
		],
		order: [[1, 'asc']],
		ajax: {
			url: '/settings/budgets/table-data',
			data: ((data: { [key: string]: any }) => {
				data['currentOnly'] = getCurrentOnlyState();
				return data
			}),
			dataSrc: (raw: { data: ThinBudget[] }) => {
				return raw.data.map(budget => {
					const output = budget as any;
					output._clone = getCloneCheckbox(budget);
					output.period = formatBudgetPeriod(new Date(budget.startDate), new Date(budget.endDate));
					output.type = formatBudgetType(budget.type);
					output.amount = formatCurrency(budget.amount);
					output._actions = getActions(budget);
					return output
				});
			}
		}
	}));
}

$(() => {
	initDataTable();
});
