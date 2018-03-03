import {
	createDeleteAction,
	createEditAction,
	createToggleAction,
	generationActionsHtml
} from "../../../helpers/entity-action-creator";
import { formatAccountType, formatMutedText } from "../../../helpers/formatters";
import { ThinAccount } from "../../../model-thins/ThinAccount";
import { withDataTableDefaults } from "../../global/data-table-defaults";
import { getActiveOnlyState } from "./filter-active-accounts";

function getActions(account: ThinAccount): string {
	return generationActionsHtml([
		createEditAction(`/settings/accounts/edit/${account.id}`),
		createToggleAction(null, account.id, account.active),
		createDeleteAction(`/settings/accounts/delete/${account.id}`)
	]);
}

$(() => {
	$('table#accounts').DataTable(withDataTableDefaults({
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
