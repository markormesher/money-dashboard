import {createDeleteAction, createEditAction, generationActionsHtml} from "../../helpers/entity-action-creator";
import {formatCurrency, formatDate, formatInfoIcon, formatTooltip} from "../../helpers/formatters";
import {ThinTransaction} from "../../model-thins/ThinTransaction";
import {startTransactionEdit} from "./editing";
import _ = require("lodash");
import {withDataTableDefaults} from "../global/data-table-defaults";
import {getDateField} from "./toggle-date-field";

const INFO_ICON = '<i class="far fa-fw fa-info-circle"></i>';

let datatable: DataTables.Api = null;

const transactionCache: { [key: string]: ThinTransaction } = {};

function getActions(transaction: ThinTransaction): string {
	if (transaction.account.deletedAt != null || !transaction.account.active || transaction.category.deletedAt != null) {
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

	datatable = table.DataTable(withDataTableDefaults({
		columns: [
			{data: 'displayDate', orderable: true},
			{data: 'account.name', orderable: false},
			{data: 'payee', orderable: false},
			{data: 'amount', name: 'startDate', orderable: false},
			{data: 'category.name', orderable: false},
			{data: '_actions', orderable: false}
		],
		order: [[0, 'desc']],
		ajax: {
			url: '/transactions/table-data',
			data: ((data: { [key: string]: any }) => {
				data['dateField'] = getDateField();
				return data
			}),
			dataSrc: (raw: { data: ThinTransaction[] }) => {
				return raw.data.map(transaction => {
					transactionCache[transaction.id] = _.clone(transaction);

					const output = _.clone(transaction) as any;
					output.amount = formatCurrency(transaction.amount);
					output._actions = getActions(transaction);

					output.effectiveDate = formatDate(transaction.effectiveDate);
					output.transactionDate = formatDate(transaction.transactionDate);
					if (transaction.effectiveDate != transaction.transactionDate) {
						output.effectiveDate += ' ' + formatInfoIcon(`Transaction: ${output.transactionDate}`);
						output.transactionDate += ' ' + formatInfoIcon(`Effective: ${output.effectiveDate}`);
					}
					output.displayDate = output[getDateField()];

					if (transaction.note != null && transaction.note != '') {
						output.payee += ' ' + formatInfoIcon(transaction.note);
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
