import {Profile} from "../../models/Profile";
import {User} from "../../models/User";
import {createDeleteAction, createEditAction, generationActionsHtml} from "../../helpers/entity-action-creator";

const getActions = (profile: Profile) => {
	const user: User = window.MoneyDashboard.user;

	return generationActionsHtml([
		createEditAction(`/settings/profiles/edit/${profile.id}`),
		user.profiles.length > 1 && !profile.active ? createDeleteAction(`/settings/profiles/delete/${profile.id}`) : null
	]);
};

$(() => {
	$('table#profiles').DataTable({
		columns: [
			{data: 'name'},
			{data: '_actions', orderable: false}
		],
		serverSide: true,
		ajax: {
			url: '/settings/profiles/table-data',
			type: 'get',
			dataSrc: (raw: { data: Profile[] }) => {
				return raw.data.map(profile => {
					const rawProfile = (profile as any);
					rawProfile._actions = getActions(profile);
					return rawProfile
				});
			}
		}
	})
});
