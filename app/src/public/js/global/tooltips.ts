function initTooltips() {
	$("[data-toggle=tooltip]").tooltip();
}

$(() => {
	initTooltips();
	$(".dataTable").on("draw.dt", initTooltips);
});
