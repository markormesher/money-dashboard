import {reloadTable} from "./table";

const TRANSACTION_DATE = 'transactionDate';
const EFFECTIVE_DATE = 'effectiveDate';

let toggleFieldBtn: JQuery = null;
let toggleFieldLabel: JQuery = null;
let field = TRANSACTION_DATE;

function initCurrentOnly() {
	toggleFieldBtn = $('#toggle-field-btn');
	toggleFieldLabel = toggleFieldBtn.find('span');
	toggleFieldBtn.on('click', toggleField);
}

function toggleField() {
	field = field == TRANSACTION_DATE ? EFFECTIVE_DATE : TRANSACTION_DATE;
	updateToggleFieldBtn();
	reloadTable();
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
	initCurrentOnly();
	updateToggleFieldBtn();
});

export {
	getDateField
}
