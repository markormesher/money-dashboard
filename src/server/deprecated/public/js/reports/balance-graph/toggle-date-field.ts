// TODO: persist setting for user
// TODO: reduce duplicated code between here and the button used for transactions

import { updateChart } from "./graph";

const TRANSACTION_DATE = "transactionDate";
const EFFECTIVE_DATE = "effectiveDate";

const toggleFieldBtn = $("#toggle-field-btn");
const toggleFieldLabel = toggleFieldBtn.find("span");
let field = TRANSACTION_DATE;

function initToggleField() {
	toggleFieldBtn.on("click", (evt) => {
		evt.preventDefault();
		toggleField();
	});
}

function toggleField() {
	field = field === TRANSACTION_DATE ? EFFECTIVE_DATE : TRANSACTION_DATE;
	updateToggleFieldBtn();
	updateChart()
}

function updateToggleFieldBtn() {
	if (field === TRANSACTION_DATE) {
		toggleFieldLabel.html("Transaction");
	} else {
		toggleFieldLabel.html("Effective");
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
	getDateField,
};
