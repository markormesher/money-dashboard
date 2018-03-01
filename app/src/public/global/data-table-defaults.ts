import _ = require("lodash");

function withDataTableDefaults(settings: DataTables.Settings): DataTables.Settings {
	return _.merge({
		order: [[0, 'asc']],
		lengthMenu: [[25, 50, 100], [25, 50, 100]],
		serverSide: true,
		ajax: {
			type: 'get'
		}
	}, settings);
}

export {
	withDataTableDefaults
}
