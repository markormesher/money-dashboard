import {createDeleteAction, createEditAction, generationActionsHtml} from "../../../helpers/entity-action-creator";
import {ThinProfile} from "../../../model-thins/ThinProfile";
import {MDWindow} from "../../global/window";
import {ThinUser} from "../../../model-thins/ThinUser";

function getActions(profile: ThinProfile): string {
	const user: ThinUser = (window as MDWindow).MoneyDashboard.user;

	return generationActionsHtml([
		createEditAction(`/settings/profiles/edit/${profile.id}`),
		user.profiles.length > 1 ? createDeleteAction(`/settings/profiles/delete/${profile.id}`) : null
	]);
}

$(() => {
	// TODO: merge with default DT options
	$('table#profiles').DataTable({
		columns: [
			{data: 'name'},
			{data: '_actions', orderable: false}
		],
		lengthMenu: [[25, 50, 100], [25, 50, 100]],
		serverSide: true,
		ajax: {
			url: '/settings/profiles/table-data',
			type: 'get',
			dataSrc: (raw: { data: ThinProfile[] }) => {
				return raw.data.map(profile => {
					const rawProfile = profile as any;
					rawProfile._actions = getActions(profile);
					return rawProfile
				});
			}
		}
	})
});
