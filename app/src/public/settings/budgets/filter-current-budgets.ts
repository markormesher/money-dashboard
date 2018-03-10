const currentOnlyBtn = $("#current-only-btn");
let currentOnly = true;

function initCurrentOnlyBtn() {
	currentOnlyBtn.on("click", (evt) => {
		evt.preventDefault();
		toggleCurrentOnly();
	});

	updateCurrentOnlyBtn();
}

function toggleCurrentOnly() {
	currentOnly = !currentOnly;
	updateCurrentOnlyBtn();
	$(".dataTable").DataTable().ajax.reload();
}

function updateCurrentOnlyBtn() {
	if (currentOnly) {
		currentOnlyBtn.find("[data-fa-i2svg]").toggleClass("fa-check-square");
	} else {
		currentOnlyBtn.find("[data-fa-i2svg]").toggleClass("fa-square");
	}
}

function getCurrentOnlyState(): boolean {
	return currentOnly;
}

$(() => {
	initCurrentOnlyBtn();
});

export {
	getCurrentOnlyState,
};
