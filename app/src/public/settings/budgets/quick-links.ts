$(() => $('a.quick-period-link').on('click', function (e) {
	e.preventDefault();
	const link = $(this);
	$('#startDate').val(link.data('start'));
	$('#endDate').val(link.data('end'));
}));
