$(() => {
	(<any> $('form.validate')).validate({
		highlight: (element: JQuery<HTMLElement>) => $(element).closest('.form-group').addClass('has-error'),
		unhighlight: (element: JQuery<HTMLElement>) => $(element).closest('.form-group').removeClass('has-error'),
		errorElement: 'span',
		errorClass: 'help-block',
		errorPlacement: (error: JQuery<HTMLElement>, element: JQuery<HTMLElement>) => {
			if (element.parent('.input-group').length) {
				error.insertAfter(element.parent());
			} else if (element.closest('.checkbox-set').length) {
				error.insertAfter(element.closest('.checkbox-set'));
			} else {
				error.insertAfter(element);
			}
		}
	})
});
