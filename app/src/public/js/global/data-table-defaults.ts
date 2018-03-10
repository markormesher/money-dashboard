import { merge } from "lodash";

function withDataTableDefaults(settings: DataTables.Settings): DataTables.Settings {
	return merge({
		autoWidth: false,
		order: [[0, "asc"]],
		lengthMenu: [[25, 50, 100], [25, 50, 100]],
		serverSide: true,
		ajax: {
			type: "get",
		},
	} as DataTables.Settings, settings);
}

export {
	withDataTableDefaults,
};
