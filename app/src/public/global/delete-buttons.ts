$(() => {
	$("table.dataTable").on("draw.dt", () => {
		$("button.delete-btn").on("click", function() {
			const btn = $(this);
			if (btn.hasClass("btn-danger")) {
				btn.addClass("delete-confirmed");
				btn.prop("disabled", true);
				btn.find("[data-fa-i2svg]").toggleClass("fa-asterisk").addClass("fa-spin");

				$.post(btn.data("action-url").toString())
						.done(() => {
							btn.closest(".dataTable").DataTable().ajax.reload();
						})
						.fail(() => {
							toastr.error("Sorry, that couldn't be deleted!");
							btn.closest(".dataTable").DataTable().ajax.reload();
						});
			} else {
				btn.removeClass("btn-default").addClass("btn-danger");
				setTimeout((() => {
					if (!btn.hasClass("delete-confirmed")) {
						btn.addClass("btn-default").removeClass("btn-danger");
					}
				}), 2000);
			}
		});
	});
});
