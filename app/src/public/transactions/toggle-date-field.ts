const TRANSACTION_DATE = 'transactionDate';
const EFFECTIVE_DATE = 'effectiveDate';

let toggleFieldBtn: JQuery = null;
let toggleFieldLabel: JQuery = null;
let field = TRANSACTION_DATE;

function initToggleField() {
	toggleFieldBtn = $('#toggle-field-btn');
	toggleFieldLabel = toggleFieldBtn.find('span');
	toggleFieldBtn.on('click', toggleField);
}

function toggleField() {
	field = field == TRANSACTION_DATE ? EFFECTIVE_DATE : TRANSACTION_DATE;
	updateToggleFieldBtn();
	$('.dataTable').DataTable().ajax.reload();
}

function updateToggleFieldBtn() {
	if (field == TRANSACTION_DATE) {
		toggleFieldLabel.html('Transaction');
	} else {
		toggleFieldLabel.html('Effective');
	}
}

function getDateField(): string {
	return field;
}

$(() => {
	initToggleField();
	updateToggleFieldBtn();
});

export {
	getDateField
}
