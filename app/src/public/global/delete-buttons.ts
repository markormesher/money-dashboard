$(() => {
	$('table.dataTable').on('draw.dt', () => {
		$('btn.delete-btn').on('click', function () {
			const btn = $(this);
			if (btn.hasClass('btn-danger')) {
				// TODO: fix icon swapping for FA5
				btn.find('i').removeClass('fa-trash').addClass('fa-circle-o-notch').addClass('fa-spin');
				$.post(btn.data('action-url'))
						.done(() => {
							btn.closest('.dataTable').DataTable().ajax.reload();
						})
						.fail(() => {
							toastr.error('Sorry, that couldn\'t be deleted!');
						})
			} else {
				btn.removeClass('btn-default').addClass('btn-danger');
				setTimeout((() => btn.addClass('btn-default').removeClass('btn-danger')), 2000);
			}
		});
	});
});
