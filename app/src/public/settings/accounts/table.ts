import {createDeleteAction, createEditAction, generationActionsHtml} from "../../../helpers/entity-action-creator";
import {formatAccountType} from "../../../helpers/formatters";
import {ThinAccount} from "../../../model-thins/ThinAccount";

function getActions(account: ThinAccount): string {
	return generationActionsHtml([
		createEditAction(`/settings/accounts/edit/${account.id}`),
		createDeleteAction(`/settings/accounts/delete/${account.id}`)
	]);
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
			dataSrc: (raw: { data: ThinAccount[] }) => {
				return raw.data.map(account => {
					const rawAccount = account as any;
					rawAccount.type = formatAccountType(rawAccount.type);
					rawAccount._actions = getActions(account);
					return rawAccount
				});
			}
		}
	})
});
