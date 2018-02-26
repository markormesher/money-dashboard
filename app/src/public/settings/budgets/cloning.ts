let cloneBtn: JQuery = null;
let inputs: JQuery = null;

function initCloning() {
	cloneBtn = $('#clone-btn');
}

function refreshCloning() {
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
	initCloning();
	updateCloneButton();
});

export {
	refreshCloning
}
