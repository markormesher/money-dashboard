let currentOnlyBtn: JQuery = null;
let currentOnly = true;

function initCurrentOnly() {
	currentOnlyBtn = $('#current-only-btn');
	currentOnlyBtn.on('click', toggleCurrentOnly);
}

function toggleCurrentOnly() {
	currentOnly = !currentOnly;
	updateCurrentOnlyButton();
	$('.dataTable').DataTable().ajax.reload();
}

function updateCurrentOnlyButton() {
	if (currentOnly) {
		currentOnlyBtn.find('[data-fa-i2svg]').toggleClass('fa-check-square');
	} else {
		currentOnlyBtn.find('[data-fa-i2svg]').toggleClass('fa-square');
	}
}

function getCurrentOnlyState(): boolean {
	return currentOnly;
}

$(() => {
	initCurrentOnly();
	updateCurrentOnlyButton();
});

export {
	getCurrentOnlyState
}
