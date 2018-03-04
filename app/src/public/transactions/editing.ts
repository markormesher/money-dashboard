import { formatCurrency, formatDate } from "../global/formatters";
import { ThinTransaction } from "../../model-thins/ThinTransaction";

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
let editorForm: JQuery = null;
let modalFields: ModalFields = {};

let currentlyEditingId: string = null;
let saveInProgress = false;

function initEditControls() {
	editorModal = $('#editor-modal');
	editorForm = editorModal.find('form');

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

	// automatically copy transaction date to effective date
	modalFields.transactionDate.on('change', () => {
		modalFields.effectiveDate.val(modalFields.transactionDate.val());
	});

	// highlight the first input when the modal opens
	editorModal.on('shown.bs.modal', () => {
		modalFields.transactionDate.focus();
	});

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

		modalFields.transactionDate.focus();
	} else {
		modalFields.payee.focus();
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

	// prevent modal from being dismissed
	editorModal.data('bs.modal').options.backdrop = locked ? 'static' : true;
	editorModal.data('bs.modal').options.keyboard = !locked;
}

function startTransactionEdit(transaction?: ThinTransaction) {
	if (transaction) {
		currentlyEditingId = transaction.id;
		populateModal(transaction);
		modalFields.createOnlyElements.hide();
		modalFields.editOnlyElements.show();
	} else {
		currentlyEditingId = 'new';
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

	editorForm.validate();
	if (!editorForm.valid()) {
		return;
	}

	saveInProgress = true;

	const data: Partial<ThinTransaction> = {
		transactionDate: new Date(modalFields.transactionDate.val().toString()),
		effectiveDate: new Date(modalFields.effectiveDate.val().toString()),
		amount: parseFloat(modalFields.amount.val().toString()),
		payee: modalFields.payee.val().toString(),
		note: modalFields.note.val().toString(),
		accountId: modalFields.account.val().toString(),
		categoryId: modalFields.category.val().toString(),
	};

	onStartSaveTransaction();
	$.post(`/transactions/edit/${currentlyEditingId}`, data)
			.done(() => onFinishSaveTransaction(true))
			.fail(() => onFinishSaveTransaction(false));
}

function onStartSaveTransaction() {
	setModalLock(true);
	modalFields.saveBtn.find('[data-fa-i2svg]').toggleClass('fa-asterisk').addClass('fa-spin');
}

function onFinishSaveTransaction(successful: boolean) {
	setModalLock(false);
	modalFields.saveBtn.find('[data-fa-i2svg]').toggleClass('fa-save').removeClass('fa-spin');

	if (successful) {
		toastr.success('Transaction saved');
		$('.dataTable').DataTable().ajax.reload();
		if (currentlyEditingId == 'new' && modalFields.addAnotherCheckbox.is(':checked')) {
			clearModal(false);
		} else {
			clearModal(true);
			editorModal.modal('hide');
		}
	} else {
		toastr.error('Transaction could not be saved');
	}

	saveInProgress = false;
}

$(() => {
	initEditControls();
});

export {
	startTransactionEdit
}
