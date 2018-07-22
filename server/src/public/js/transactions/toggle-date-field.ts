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
	$(".dataTable").DataTable().ajax.reload();
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
