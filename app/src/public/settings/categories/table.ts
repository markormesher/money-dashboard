import { createDeleteAction, createEditAction, generationActionsHtml } from "../../../helpers/entity-action-creator";
import { formatCategoryTypes } from "../../../helpers/formatters";
import { ThinCategory } from "../../../model-thins/ThinCategory";
import { withDataTableDefaults } from "../../global/data-table-defaults";

const getActions = (category: ThinCategory) => {
	return generationActionsHtml([
		createEditAction(`/settings/categories/edit/${category.id}`),
		createDeleteAction(`/settings/categories/delete/${category.id}`)
	]);
};

$(() => {
	$('table#categories').DataTable(withDataTableDefaults({
		columns: [
			{ data: 'name' },
			{ data: 'types', orderable: false },
			{ data: '_actions', orderable: false }
		],
		ajax: {
			url: '/settings/categories/table-data',
			dataSrc: (raw: { data: ThinCategory[] }) => {
				return raw.data.map(category => {
					const output = category as any;
					output.types = formatCategoryTypes(category);
					output._actions = getActions(category);
					return output
				});
			}
		}
	}))
});
