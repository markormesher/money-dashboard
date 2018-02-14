import {Budget} from "../../models/Budget";
import {createDeleteAction, createEditAction, generationActionsHtml} from "../../helpers/entity-action-creator";

const getActions = (budget: Budget) => {
	return generationActionsHtml([
		createEditAction(`/settings/budgets/edit/${budget.id}`),
		createDeleteAction(`/settings/budgets/delete/${budget.id}`)
	]);
};

$(() => {
	$('table#budgets').DataTable({
		columns: [
			{data: 'category.name'},
			{data: 'type', orderable: false},
			{data: 'period', orderable: false},
			{data: 'amount', orderable: false},
			{data: '_actions', orderable: false}
		],
		lengthMenu: [[25, 50, 100], [25, 50, 100]],
		serverSide: true,
		ajax: {
			url: '/settings/budgets/table-data',
			type: 'get',
			dataSrc: (raw: { data: Budget[] }) => {
				return raw.data.map((budget: Budget) => {
					const output = {} as any;
					output.category = budget.category;
					output.period = '';
					output.type = '';
					output.amount = 0.00;
					output._actions = getActions(budget);
					return output
				});
			}
		}
	})
});
