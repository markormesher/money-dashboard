import {createDeleteAction, createEditAction, generationActionsHtml} from "../../../helpers/entity-action-creator";
import {ThinProfile} from "../../../model-thins/ThinProfile";
import {MDWindow} from "../../global/window";
import {ThinUser} from "../../../model-thins/ThinUser";
import {withDataTableDefaults} from "../../global/data-table-defaults";

function getActions(profile: ThinProfile): string {
	const user: ThinUser = (window as MDWindow).MoneyDashboard.user;

	return generationActionsHtml([
		createEditAction(`/settings/profiles/edit/${profile.id}`),
		user.profiles.length > 1 ? createDeleteAction(`/settings/profiles/delete/${profile.id}`) : null
	]);
}

$(() => {
	$('table#profiles').DataTable(withDataTableDefaults({
		columns: [
			{data: 'name'},
			{data: '_actions', orderable: false}
		],
		ajax: {
			url: '/settings/profiles/table-data',
			dataSrc: (raw: { data: ThinProfile[] }) => {
				return raw.data.map(profile => {
					const rawProfile = profile as any;
					rawProfile._actions = getActions(profile);
					return rawProfile
				});
			}
		}
	}))
});
