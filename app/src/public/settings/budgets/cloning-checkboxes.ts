let cloneBtn: JQuery = null;
let inputs: JQuery = null;

function initCloningBtn() {
	cloneBtn = $('#clone-btn');
	updateCloneButton();
}

function attachCheckboxListeners() {
	inputs = $('input[name=cloneBudget]');
	inputs.on('change', updateCloneButton);
}

function updateCloneButton() {
	const checkedInputs = inputs ? inputs.filter(':checked') : null;
	if (!checkedInputs || checkedInputs.length == 0) {
		cloneBtn.addClass('disabled').prop('href', undefined);
	} else {
		const ids: string[] = [];
		checkedInputs.each((i, elem) => {
			ids.push($(elem).val().toString())
		});
		cloneBtn.removeClass('disabled').prop('href', `/settings/budgets/clone/${ids.join(',')}`);
	}
}

$(() => {
	initCloningBtn();

	$('.dataTable').on('draw.dt', attachCheckboxListeners);
});
