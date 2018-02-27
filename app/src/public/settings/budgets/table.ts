import {createDeleteAction, createEditAction, generationActionsHtml} from "../../../helpers/entity-action-creator";
import {formatCurrency, formatBudgetPeriod, formatBudgetType} from "../../../helpers/formatters";
import {ThinBudget} from "../../../model-thins/ThinBudget";
import {refreshCloning} from "./cloning";
import {getCurrentOnlyState} from "./current-budgets";

let datatable: DataTables.Api = null;

function getActions(budget: ThinBudget): string {
	return generationActionsHtml([
		createEditAction(`/settings/budgets/edit/${budget.id}`),
		createDeleteAction(`/settings/budgets/delete/${budget.id}`)
	]);
}

function getCloneCheckbox(budget: ThinBudget): string {
	return `<input type="checkbox" name="cloneBudget" value="${budget.id}" />`;
}

function reloadTable() {
	datatable.ajax.reload();
}

$(() => {
	const table = $('table#budgets');
	if (table.length == 0) return;

	datatable = table.DataTable({
		columns: [
			{data: '_clone', orderable: false},
			{data: 'category.name', orderable: true},
			{data: 'type', orderable: true},
			{data: 'period', name: 'startDate', orderable: true},
			{data: 'amount', orderable: true},
			{data: '_actions', orderable: false}
		],
		order: [[1, 'asc']],
		lengthMenu: [[25, 50, 100], [25, 50, 100]],
		serverSide: true,
		ajax: {
			url: '/settings/budgets/table-data',
			data: ((data: { [key: string]: any }) => {
				data['currentOnly'] = getCurrentOnlyState();
				return data
			}),
			type: 'get',
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
		},
		drawCallback: refreshCloning
	})
});

export {
	reloadTable
}
