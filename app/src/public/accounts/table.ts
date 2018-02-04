import {Account} from "../../models/Account";
import {createDeleteAction, createEditAction, generationActionsHtml} from "../../helpers/entity-action-creator";

const getActions = (account: Account) => {
	return generationActionsHtml([
		createEditAction(`/settings/accounts/edit/${account.id}`),
		createDeleteAction(`/settings/accounts/delete/${account.id}`)
	]);
};

$(() => {
	$('table#accounts').DataTable({
		columns: [
			{data: 'name'},
			{data: 'type'},
			{data: '_actions', orderable: false}
		],
		serverSide: true,
		ajax: {
			url: '/settings/accounts/table-data',
			type: 'get',
			dataSrc: (raw: { data: Account[] }) => {
				return raw.data.map(account => {
					const rawAccount = (account as any);
					rawAccount._actions = getActions(account);
					return rawAccount
				});
			}
		}
	})
});
