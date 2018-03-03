let activeOnlyBtn: JQuery = null;
let activeOnly = true;

function initActiveOnly() {
	activeOnlyBtn = $('#active-only-btn');
	activeOnlyBtn.on('click', toggleActiveOnly);
}

function toggleActiveOnly() {
	activeOnly = !activeOnly;
	updateActiveOnlyButton();
	$('.dataTable').DataTable().ajax.reload();
}

function updateActiveOnlyButton() {
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
	initActiveOnly();
	updateActiveOnlyButton();
});

export {
	getActiveOnlyState
}
