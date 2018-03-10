function refreshToggleBtns() {
	$("button.toggle-btn").on("click", function() {
		const btn = $(this);
		const accountId = btn.data("id").toString();

		btn.prop("disabled", true);
		btn.find("[data-fa-i2svg]").toggleClass("fa-asterisk").addClass("fa-spin");

		toggleAccountActiveState(accountId);
	});
}

function toggleAccountActiveState(accountId: string) {
	$.post(`/settings/accounts/toggle-active/${accountId}`)
			.done(() => {
				$(".dataTable").DataTable().ajax.reload();
			})
			.fail(() => {
				toastr.error("Sorry, that couldn't be changed!");
				$(".dataTable").DataTable().ajax.reload();
			});
}

$(() => {
	$(".dataTable").on("draw.dt", refreshToggleBtns);
});
