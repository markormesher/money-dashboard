import {Profile} from "../../models/Profile";
import {User} from "../../models/User";

const getActions = (profile: Profile) => {
	const user: User = window.MoneyDashboard.user;

	const actions: string[] = [];
	actions.push(`<a href="/settings/profiles/edit/${profile.id}">Edit</a>`);

	if (user.profiles.length > 1) {
		actions.push(`<a href="/settings/profiles/delete/${profile.id}">Delete</a>`);
	}

	if (actions.length === 0) {
		return '<span class="text-muted">None</span>';
	} else {
		return actions.join(' <span class="text-muted">&bull;</span> ');
	}
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
