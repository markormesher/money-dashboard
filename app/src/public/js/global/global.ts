// top-level toastr defaults
toastr.options.closeButton = true;
toastr.options.timeOut = 2000;
toastr.options.extendedTimeOut = 10000;
toastr.options.progressBar = true;

$(() => {
	// set up names on ID'd form inputs
	$("input").each((i, e: Element) => {
		if (!$(e).attr("name")) {
			$(e).attr("name", e.id);
		}
	});

	// tooltips
	$("[data-toggle=tooltip]").tooltip();
});
