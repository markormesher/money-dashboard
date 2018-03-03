import {
	createDeleteAction,
	createEditAction,
	createToggleAction,
	generationActionsHtml
} from "../../../helpers/entity-action-creator";
import { formatAccountType, formatMutedText } from "../../../helpers/formatters";
import { ThinAccount } from "../../../model-thins/ThinAccount";
import { withDataTableDefaults } from "../../global/data-table-defaults";
import { getActiveOnlyState } from "./active-accounts";

let datatable: DataTables.Api = null;

function getActions(account: ThinAccount): string {
	return generationActionsHtml([
		createEditAction(`/settings/accounts/edit/${account.id}`),
		createToggleAction(null, account.id, account.active),
		createDeleteAction(`/settings/accounts/delete/${account.id}`)
	]);
}

function reloadTable() {
	datatable.ajax.reload();
}

$(() => {
	const table = $('table#accounts');
	if (table.length == 0) return;

	datatable = table.DataTable(withDataTableDefaults({
		columns: [
			{ data: 'name' },
			{ data: 'type' },
			{ data: '_actions', orderable: false }
		],
		ajax: {
			url: '/settings/accounts/table-data',
			data: ((data: { [key: string]: any }) => {
				data['activeOnly'] = getActiveOnlyState();
				return data
			}),
			dataSrc: (raw: { data: ThinAccount[] }) => {
				return raw.data.map(account => {
					const rawAccount = account as any;
					rawAccount.name = account.active ? account.name : formatMutedText(account.name);
					rawAccount.type = formatAccountType(rawAccount.type);
					rawAccount._actions = getActions(account);
					return rawAccount
				});
			}
		}
	}))
});

export {
	reloadTable
}
