import { reloadTable } from "./table";

let activeOnlyBtn: JQuery = null;
let activeOnly = true;

function initActiveOnly() {
	activeOnlyBtn = $('#active-only-btn');
	activeOnlyBtn.on('click', toggleActiveOnly);
}

function toggleActiveOnly() {
	activeOnly = !activeOnly;
	updateActiveOnlyButton();
	reloadTable();
}

function updateActiveOnlyButton() {
	if (activeOnly) {
		activeOnlyBtn.find('[data-fa-i2svg]').toggleClass('fa-check-square');
	} else {
		activeOnlyBtn.find('[data-fa-i2svg]').toggleClass('fa-square');
	}
}

function getActiveOnlyState(): boolean {
	return activeOnly;
}

$(() => {
	initActiveOnly();
	updateActiveOnlyButton();
});

export {
	getActiveOnlyState
}
