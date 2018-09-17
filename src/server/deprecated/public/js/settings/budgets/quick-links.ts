function initQuickPeriodLinks() {
	$("a.quick-period-to").on("click", function(e) {
		e.preventDefault();
		const link = $(this);
		$("#startDate").val(link.data("start") as string);
		$("#endDate").val(link.data("end") as string);
	});
}

$(() => {
	initQuickPeriodLinks();
});
