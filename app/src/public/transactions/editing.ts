import {ThinTransaction} from "../../model-thins/ThinTransaction";
import {formatCurrency, formatDate} from "../../helpers/formatters";

interface ModalFields {
	transactionDate?: JQuery
	effectiveDate?: JQuery;
	account?: JQuery;
	payee?: JQuery;
	category?: JQuery;
	amount?: JQuery;
	note?: JQuery;
	saveBtn?: JQuery;
	addAnotherCheckbox?: JQuery;

	createOnlyElements?: JQuery;
	editOnlyElements?: JQuery;
}

let editorModal: JQuery = null;
let modalFields: ModalFields = {};

let saveInProgress = false;

function initEditControls() {
	editorModal = $('#editor-modal');
	modalFields.transactionDate = editorModal.find('#transactionDate');
	modalFields.effectiveDate = editorModal.find('#effectiveDate');
	modalFields.account = editorModal.find('#account');
	modalFields.payee = editorModal.find('#payee');
	modalFields.category = editorModal.find('#category');
	modalFields.amount = editorModal.find('#amount');
	modalFields.note = editorModal.find('#note');
	modalFields.saveBtn = editorModal.find('#save-btn');
	modalFields.addAnotherCheckbox = editorModal.find('#add-another');
	modalFields.createOnlyElements = editorModal.find('.create-only');
	modalFields.editOnlyElements = editorModal.find('.edit-only');

	$('#create-btn').on('click', (evt) => {
		evt.preventDefault();
		startTransactionEdit();
	});

	modalFields.saveBtn.on('click', saveTransaction);
}

function populateModal(transaction: ThinTransaction) {
	modalFields.transactionDate.val(formatDate(transaction.transactionDate, 'system'));
	modalFields.effectiveDate.val(formatDate(transaction.effectiveDate, 'system'));
	modalFields.account.val(transaction.accountId);
	modalFields.payee.val(transaction.payee);
	modalFields.category.val(transaction.categoryId);
	modalFields.amount.val(formatCurrency(transaction.amount, false));
	modalFields.note.val(transaction.note);
}

function clearModal(full: boolean) {
	modalFields.payee.val(null);
	modalFields.amount.val(null);
	modalFields.note.val(null);

	if (full) {
		const now = new Date();
		modalFields.transactionDate.val(formatDate(now, 'system'));
		modalFields.effectiveDate.val(formatDate(now, 'system'));
		modalFields.account.prop('selectedIndex', 0);
		modalFields.category.prop('selectedIndex', 0);
		modalFields.addAnotherCheckbox.prop('checked', true);
	}
}

function setModalLock(locked: boolean) {
	modalFields.transactionDate.prop('disabled', locked);
	modalFields.effectiveDate.prop('disabled', locked);
	modalFields.account.prop('disabled', locked);
	modalFields.payee.prop('disabled', locked);
	modalFields.category.prop('disabled', locked);
	modalFields.amount.prop('disabled', locked);
	modalFields.note.prop('disabled', locked);
	modalFields.saveBtn.prop('disabled', locked);
	modalFields.addAnotherCheckbox.prop('disabled', locked);
}

function startTransactionEdit(transaction?: ThinTransaction) {
	if (transaction) {
		populateModal(transaction);
		modalFields.createOnlyElements.hide();
		modalFields.editOnlyElements.show();
	} else {
		clearModal(true);
		modalFields.createOnlyElements.show();
		modalFields.editOnlyElements.hide();
	}

	editorModal.modal('show');
}

function saveTransaction() {
	if (saveInProgress) {
		return;
	}
	saveInProgress = true;

	// TODO: gather data from fields
	// TODO: send data to backend

	setTimeout(() => {
		setModalLock(false);
		saveInProgress = false;
	}, 2000);
}

$(() => {
	initEditControls()
});
