$(() => {
	$('table.dataTable').on('draw.dt', () => {
		$('button.toggle-btn').on('click', function () {
			const btn = $(this);
			const accountId = btn.data('id');

			btn.prop('disabled', true);
			btn.find('[data-fa-i2svg]').toggleClass('fa-asterisk').addClass('fa-spin');

			$.post(`/settings/accounts/toggle-active/${accountId}`)
					.done(() => {
						btn.closest('.dataTable').DataTable().ajax.reload();
					})
					.fail(() => {
						toastr.error('Sorry, that couldn\'t be change!');
						btn.closest('.dataTable').DataTable().ajax.reload();
					});
		});
	});
});
