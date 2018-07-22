import { ThinTransaction } from "../../../model-thins/ThinTransaction";
import { withDataTableDefaults } from "../global/data-table-defaults";
import { createDeleteAction, createEditAction, generationActionsHtml } from "../global/entity-action-creator";
import { formatCurrency, formatDate, formatInfoIcon } from "../../../helpers/formatters";
import { startTransactionEdit } from "./editing";
import { getDateField } from "./toggle-date-field";

const transactionCache: { [key: string]: ThinTransaction } = {};

function getActions(transaction: ThinTransaction): string {
	if (transaction.account.deletedAt !== null || !transaction.account.active || transaction.category.deletedAt !== null) {
		return generationActionsHtml([]);
	} else {
		return generationActionsHtml([
			createEditAction(null, transaction.id),
			createDeleteAction(`/transactions/delete/${transaction.id}`),
		]);
	}
}

$(() => {
	$("table#transactions").DataTable(withDataTableDefaults({
		columns: [
			{ data: "displayDate", orderable: true },
			{ data: "account.name", orderable: false },
			{ data: "payee", orderable: false },
			{ data: "amount", name: "startDate", orderable: false, className: "text-right" },
			{ data: "category.name", orderable: false },
			{ data: "_actions", orderable: false },
		],
		order: [[0, "desc"]],
		ajax: {
			url: "/transactions/table-data",
			data: ((data: { [key: string]: any }) => {
				data.dateField = getDateField();
				return data;
			}),
			dataSrc: (raw: { data: ThinTransaction[] }) => {
				return raw.data.map((transaction) => {
					transactionCache[transaction.id] = transaction;

					const output = {} as any;
					output.account = transaction.account;
					output.payee = transaction.payee;
					output.amount = formatCurrency(transaction.amount);
					output.category = transaction.category;
					output._actions = getActions(transaction);

					output.effectiveDate = formatDate(transaction.effectiveDate);
					output.transactionDate = formatDate(transaction.transactionDate);
					if (transaction.effectiveDate !== transaction.transactionDate) {
						output.effectiveDate += " " + formatInfoIcon(`Transaction: ${formatDate(transaction.transactionDate)}`);
						output.transactionDate += " " + formatInfoIcon(`Effective: ${formatDate(transaction.effectiveDate)}`);
					}
					output.displayDate = output[getDateField()];

					if (transaction.note !== null && transaction.note !== "") {
						output.payee += " " + formatInfoIcon(transaction.note);
					}

					return output;
				});
			},
		},
		drawCallback: () => {
			$(".edit-btn").on("click", function(evt) {
				evt.preventDefault();
				const transactionId = $(this).data("id").toString();
				const transaction = transactionCache[transactionId];
				startTransactionEdit(transaction);
			});
		},
	}));
});
