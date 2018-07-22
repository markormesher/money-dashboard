const detailedViewBtn = $("#detailed-view-btn");
let detailedView = false;

function initDetailedViewBtn() {
	detailedViewBtn.on("click", (evt) => {
		evt.preventDefault();
		toggleDetailedView();
	});

	updateDetailedViewBtn();
}

function toggleDetailedView() {
	detailedView = !detailedView;
	updateDetailedViewBtn();
	$(".dataTable").DataTable().ajax.reload();
}

function updateDetailedViewBtn() {
	if (detailedView) {
		detailedViewBtn.find("[data-fa-i2svg]").toggleClass("fa-check-square");
	} else {
		detailedViewBtn.find("[data-fa-i2svg]").toggleClass("fa-square");
	}
}

function getDetailedViewState(): boolean {
	return detailedView;
}

$(() => {
	initDetailedViewBtn();
});

export {
	getDetailedViewState,
};
