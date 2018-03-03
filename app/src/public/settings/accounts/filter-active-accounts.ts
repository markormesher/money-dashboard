let activeOnlyBtn: JQuery = null;
let activeOnly = true;

function initActiveOnlyBtn() {
	activeOnlyBtn = $('#active-only-btn');
	activeOnlyBtn.on('click', toggleActiveOnly);

	updateActiveOnlyBtn();
}

function toggleActiveOnly() {
	activeOnly = !activeOnly;
	updateActiveOnlyBtn();
	$('.dataTable').DataTable().ajax.reload();
}

function updateActiveOnlyBtn() {
	activeOnlyBtn.data('activeOnly', activeOnly);
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
	initActiveOnlyBtn();
});

export {
	getActiveOnlyState
}
