import {Account} from "../../models/Account";
import {createDeleteAction, createEditAction, generationActionsHtml} from "../../helpers/entity-action-creator";

const getActions = (account: Account) => {
	return generationActionsHtml([
		createEditAction(`/settings/accounts/edit/${account.id}`),
		createDeleteAction(`/settings/accounts/delete/${account.id}`)
	]);
};

function formatAccountType(type: string): string {
	switch (type) {
		case 'current':
			return 'Current Account';
		case 'savings':
			return 'Savings Account';
		case 'asset':
			return 'Asset';
		default:
			return 'Other'
	}
}

$(() => {
	$('table#accounts').DataTable({
		columns: [
			{data: 'name'},
			{data: 'type'},
			{data: '_actions', orderable: false}
		],
		lengthMenu: [[25, 50, 100], [25, 50, 100]],
		serverSide: true,
		ajax: {
			url: '/settings/accounts/table-data',
			type: 'get',
			dataSrc: (raw: { data: Account[] }) => {
				return raw.data.map(account => {
					const rawAccount = (account as any);
					rawAccount.type = formatAccountType(rawAccount.type);
					rawAccount._actions = getActions(account);
					return rawAccount
				});
			}
		}
	})
});
