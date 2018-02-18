import {createDeleteAction, createEditAction, generationActionsHtml} from "../../helpers/entity-action-creator";
import {formatCategoryTypes} from "../../helpers/formatters";
import {ThinCategory} from "../../model-thins/ThinCategory";

const getActions = (category: ThinCategory) => {
	return generationActionsHtml([
		createEditAction(`/settings/categories/edit/${category.id}`),
		createDeleteAction(`/settings/categories/delete/${category.id}`)
	]);
};

$(() => {
	$('table#categories').DataTable({
		columns: [
			{data: 'name'},
			{data: 'types', orderable: false},
			{data: '_actions', orderable: false}
		],
		lengthMenu: [[25, 50, 100], [25, 50, 100]],
		serverSide: true,
		ajax: {
			url: '/settings/categories/table-data',
			type: 'get',
			dataSrc: (raw: { data: ThinCategory[] }) => {
				return raw.data.map(category => {
					const output = category as any;
					output.types = formatCategoryTypes(category);
					output._actions = getActions(category);
					return output
				});
			}
		}
	})
});
