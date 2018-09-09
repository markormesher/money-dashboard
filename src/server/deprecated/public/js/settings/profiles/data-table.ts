import { ThinProfile } from "../../../../../model-thins/ThinProfile";
import { ThinUser } from "../../../../../model-thins/ThinUser";
import { withDataTableDefaults } from "../../global/data-table-defaults";
import { createDeleteAction, createEditAction, generationActionsHtml } from "../../global/entity-action-creator";
import { IWindow } from "../../global/window";

function getActions(profile: ThinProfile): string {
	const user: ThinUser = (window as IWindow).MoneyDashboard.user;

	return generationActionsHtml([
		createEditAction(`/settings/profiles/edit/${profile.id}`),
		user.profiles.length > 1 ? createDeleteAction(`/settings/profiles/delete/${profile.id}`) : null,
	]);
}

function initDataTable() {
	$("table#profiles").DataTable(withDataTableDefaults({
		columns: [
			{ data: "name" },
			{ data: "_actions", orderable: false },
		],
		ajax: {
			url: "/settings/profiles/table-data",
			dataSrc: (raw: { data: ThinProfile[] }) => {
				return raw.data.map((profile) => {
					const rawProfile = profile as any;
					rawProfile._actions = getActions(profile);
					return rawProfile;
				});
			},
		},
	}));
}

$(() => {
	initDataTable();
});
