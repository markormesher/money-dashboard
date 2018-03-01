import {createDeleteAction, createEditAction, generationActionsHtml} from "../../helpers/entity-action-creator";
import {formatCurrency, formatTooltip} from "../../helpers/formatters";
import {ThinTransaction} from "../../model-thins/ThinTransaction";
import {startTransactionEdit} from "./editing";
import _ = require("lodash");
import {withDataTableDefaults} from "../global/data-table-defaults";

let datatable: DataTables.Api = null;

const transactionCache: { [key: string]: ThinTransaction } = {};

function getActions(transaction: ThinTransaction): string {
	if (transaction.account.deletedAt != null || transaction.category.deletedAt != null) {
		return generationActionsHtml([]);
	} else {
		return generationActionsHtml([
			createEditAction(null, transaction.id),
			createDeleteAction(`/transactions/delete/${transaction.id}`)
		]);
	}
}

function reloadTable() {
	datatable.ajax.reload();
}

$(() => {
	const table = $('table#transactions');
	if (table.length == 0) return;

	// TODO: toggle display of effective/transaction date
	datatable = table.DataTable(withDataTableDefaults({
		columns: [
			{data: 'effectiveDate', orderable: true},
			{data: 'account.name', orderable: false},
			{data: 'payee', orderable: false},
			{data: 'amount', name: 'startDate', orderable: false},
			{data: 'category.name', orderable: false},
			{data: '_actions', orderable: false}
		],
		order: [[0, 'desc']],
		ajax: {
			url: '/transactions/table-data',
			dataSrc: (raw: { data: ThinTransaction[] }) => {
				return raw.data.map(transaction => {
					transactionCache[transaction.id] = _.clone(transaction);

					const output = transaction as any;
					output.amount = formatCurrency(transaction.amount);
					output._actions = getActions(transaction);
					if (transaction.note != null && transaction.note != '') {
						output.payee += ' ' + formatTooltip('<i class="far fa-fw fa-info-circle"></i>', transaction.note);
					}
					return output
				});
			}
		},
		drawCallback: () => {
			$('.edit-btn').on('click', function (evt) {
				evt.preventDefault();
				const transactionId = $(this).data('id').toString();
				const transaction = transactionCache[transactionId];
				startTransactionEdit(transaction);
			});
		}
	}))
});

export {
	reloadTable
}
