import { ThinTransaction } from "../../../model-thins/ThinTransaction";
import { formatCurrency, formatDate } from "../../../helpers/formatters";
import { IWindow } from "../global/window";

const editorModal = $("#editor-modal");
const editorForm = editorModal.find("form");

const modalTransactionDate = editorModal.find("#transactionDate");
const modalEffectiveDate = editorModal.find("#effectiveDate");
const modalAccount = editorModal.find("#account");
const modalPayee = editorModal.find("#payee");
const modalCategory = editorModal.find("#category");
const modalAmount = editorModal.find("#amount");
const modalNote = editorModal.find("#note");
const modalSaveBtn = editorModal.find("#save-btn");
const modalAddAnotherCheckbox = editorModal.find("#add-another");
const modalCreateOnlyElements = editorModal.find(".create-only");
const modalEditOnlyElements = editorModal.find(".edit-only");

interface IJQueryWithModal {
	options: ModalOptions;
}

const modalAllInputs = [
	modalTransactionDate,
	modalEffectiveDate,
	modalAccount,
	modalPayee,
	modalCategory,
	modalAmount,
	modalNote,
	modalSaveBtn,
	modalAddAnotherCheckbox,
];

let currentlyEditingId: string = null;
let saveInProgress = false;

function initEditControls() {
	// automatically copy transaction date to effective date
	modalTransactionDate.on("change", () => {
		modalEffectiveDate.val(modalTransactionDate.val());
	});

	// set up payee autocomplete
	if ((window as IWindow).MoneyDashboard.transactions && (window as IWindow).MoneyDashboard.transactions.payees) {
		modalPayee.autocomplete({
			source: (window as IWindow).MoneyDashboard.transactions.payees,
			appendTo: editorModal
		});
	}

	// highlight the first input when the modal opens
	editorModal.on("shown.bs.modal", () => {
		modalTransactionDate.trigger("focus");
	});

	// "click" the enter button when ctrl/cmd+enter is pressed
	modalAllInputs.forEach((input) => {
		input.on("keydown", (evt) => {
			if ((evt.ctrlKey || evt.metaKey) && (evt.keyCode === 13 || evt.keyCode === 10)) {
				modalSaveBtn.trigger("click");
			}
		});
	});

	modalSaveBtn.on("click", saveTransaction);

	$("#create-btn").on("click", (evt) => {
		evt.preventDefault();
		startTransactionEdit();
	});
}

function populateModal(transaction: ThinTransaction) {
	modalTransactionDate.val(formatDate(transaction.transactionDate, "system"));
	modalEffectiveDate.val(formatDate(transaction.effectiveDate, "system"));
	modalAccount.val(transaction.accountId);
	modalPayee.val(transaction.payee);
	modalCategory.val(transaction.categoryId);
	modalAmount.val(formatCurrency(transaction.amount, false));
	modalNote.val(transaction.note);
}

function clearModal(full: boolean) {
	modalPayee.val(null);
	modalAmount.val(null);
	modalNote.val(null);

	if (full) {
		const now = new Date();
		modalTransactionDate.val(formatDate(now, "system"));
		modalEffectiveDate.val(formatDate(now, "system"));
		modalAccount.prop("selectedIndex", 0);
		modalCategory.prop("selectedIndex", 0);
		modalAddAnotherCheckbox.prop("checked", true);

		modalTransactionDate.focus();
	} else {
		modalPayee.focus();
	}
}

function setModalLock(locked: boolean) {
	// lock all inputs
	modalAllInputs.forEach((input) => input.prop("disabled", locked));

	// prevent modal from being dismissed
	(editorModal.data("bs.modal") as IJQueryWithModal).options.backdrop = locked ? "static" : true;
	(editorModal.data("bs.modal") as IJQueryWithModal).options.keyboard = !locked;
}

function startTransactionEdit(transaction?: ThinTransaction) {
	if (transaction) {
		currentlyEditingId = transaction.id;
		populateModal(transaction);
		modalCreateOnlyElements.hide();
		modalEditOnlyElements.show();
	} else {
		currentlyEditingId = "new";
		clearModal(true);
		modalCreateOnlyElements.show();
		modalEditOnlyElements.hide();
	}

	editorModal.modal("show");
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
		transactionDate: new Date(modalTransactionDate.val() as string),
		effectiveDate: new Date(modalEffectiveDate.val() as string),
		amount: modalAmount.val() as number,
		payee: modalPayee.val() as string,
		note: modalNote.val() as string,
		accountId: modalAccount.val() as string,
		categoryId: modalCategory.val() as string,
	};

	onStartSaveTransaction();
	$.post(`/transactions/edit/${currentlyEditingId}`, data)
			.done(() => onFinishSaveTransaction(true))
			.fail(() => onFinishSaveTransaction(false));
}

function onStartSaveTransaction() {
	setModalLock(true);
	modalSaveBtn.find("[data-fa-i2svg]").toggleClass("fa-asterisk").addClass("fa-spin");
}

function onFinishSaveTransaction(successful: boolean) {
	setModalLock(false);
	modalSaveBtn.find("[data-fa-i2svg]").toggleClass("fa-save").removeClass("fa-spin");

	if (successful) {
		toastr.success("Transaction saved");
		$(".dataTable").DataTable().ajax.reload();
		if (currentlyEditingId === "new" && modalAddAnotherCheckbox.is(":checked")) {
			clearModal(false);
		} else {
			clearModal(true);
			editorModal.modal("hide");
		}
	} else {
		toastr.error("Transaction could not be saved");
	}

	saveInProgress = false;
}

$(() => {
	initEditControls();
});

export {
	startTransactionEdit,
};
