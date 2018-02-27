import {createDeleteAction, createEditAction, generationActionsHtml} from "../../helpers/entity-action-creator";
import {formatCurrency} from "../../helpers/formatters";
import {ThinTransaction} from "../../model-thins/ThinTransaction";

let datatable: DataTables.Api = null;

function getActions(transaction: ThinTransaction): string {
	return generationActionsHtml([
		createEditAction(`/transactions/edit/${transaction.id}`),
		createDeleteAction(`/transactions/delete/${transaction.id}`)
	]);
}

$(() => {
	const table = $('table#transactions');
	if (table.length == 0) return;

	datatable = table.DataTable({
		columns: [
			{data: 'effectiveDate', orderable: true},
			{data: 'account.name', orderable: false},
			{data: 'payee', orderable: false},
			{data: 'amount', name: 'startDate', orderable: false},
			{data: 'category.name', orderable: false},
			{data: '_actions', orderable: false}
		],
		lengthMenu: [[25, 50, 100], [25, 50, 100]],
		serverSide: true,
		ajax: {
			url: '/transactions/table-data',
			type: 'get',
			dataSrc: (raw: { data: ThinTransaction[] }) => {
				return raw.data.map(transaction => {
					const output = transaction as any;
					output.amount = formatCurrency(transaction.amount);
					output._actions = getActions(transaction);
					return output
				});
			}
		}
	})
});
