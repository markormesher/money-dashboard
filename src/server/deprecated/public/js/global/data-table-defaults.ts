function withDataTableDefaults(settings: DataTables.Settings): DataTables.Settings {
	const defaults: DataTables.Settings = {
		autoWidth: false,
		order: [[0, "asc"]],
		lengthMenu: [[25, 50, 100], [25, 50, 100]],
		serverSide: true,
		ajax: {
			type: "get",
		},
	};

	return Object.assign(defaults, settings);
}

export {
	withDataTableDefaults,
};
