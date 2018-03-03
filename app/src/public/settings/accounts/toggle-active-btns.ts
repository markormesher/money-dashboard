function refreshToggleBtns() {
	$('button.toggle-btn').on('click', function () {
		const btn = $(this);
		const accountId = btn.data('id');

		btn.prop('disabled', true);
		btn.find('[data-fa-i2svg]').toggleClass('fa-asterisk').addClass('fa-spin');

		toggleAccountActiveState(accountId);
	});
}

function toggleAccountActiveState(accountId: string) {
	$.post(`/settings/accounts/toggle-active/${accountId}`)
			.done(() => {
				$('.dataTable').DataTable().ajax.reload();
			})
			.fail(() => {
				toastr.error('Sorry, that couldn\'t be change!');
				$('.dataTable').DataTable().ajax.reload();
			});
}

$(() => {
	$('table.dataTable').on('draw.dt', refreshToggleBtns);
});
