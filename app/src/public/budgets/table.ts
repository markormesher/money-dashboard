import {createDeleteAction, createEditAction, generationActionsHtml} from "../../helpers/entity-action-creator";
import {formatCurrency, formatBudgetPeriod, formatBudgetType} from "../../helpers/formatters";
import {ThinBudget} from "../../model-thins/ThinBudget";

function getActions(budget: ThinBudget): string {
	return generationActionsHtml([
		createEditAction(`/settings/budgets/edit/${budget.id}`),
		createDeleteAction(`/settings/budgets/delete/${budget.id}`)
	]);
}

$(() => {
	const table = $('table#budgets');
	if (table.length == 0) return;

	table.DataTable({
		columns: [
			{data: 'category.name', orderable: true},
			{data: 'type', orderable: false},
			{data: 'period', orderable: true},
			{data: 'amount', orderable: true},
			{data: '_actions', orderable: false}
		],
		lengthMenu: [[25, 50, 100], [25, 50, 100]],
		serverSide: true,
		ajax: {
			url: '/settings/budgets/table-data',
			type: 'get',
			dataSrc: (raw: { data: ThinBudget[] }) => {
				return raw.data.map(budget => {
					const output = budget as any;
					output.period = formatBudgetPeriod(new Date(budget.startDate), new Date(budget.endDate));
					output.type = formatBudgetType(budget.type);
					output.amount = formatCurrency(budget.amount);
					output._actions = getActions(budget);
					return output
				});
			}
		}
	})
});
