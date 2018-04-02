const cloneBtn = $("#clone-btn");
let inputs = $("input[name=cloneBudget]");

function initCloningBtn() {
	updateCloneButton();
}

function attachCheckboxListeners() {
	inputs = $("input[name=cloneBudget]");
	inputs.on("change", updateCloneButton);
}

function updateCloneButton() {
	const checkedInputs = inputs ? inputs.filter(":checked") : null;
	if (!checkedInputs || checkedInputs.length === 0) {
		cloneBtn.addClass("disabled").prop("href", undefined);
	} else {
		const ids: string[] = [];
		checkedInputs.each((i, elem) => {
			ids.push($(elem).val() as string);
		});
		cloneBtn.removeClass("disabled").prop("href", `/settings/budgets/clone/${ids.join(",")}`);
	}
}

$(() => {
	initCloningBtn();

	$(".dataTable").on("draw.dt", attachCheckboxListeners);
});
