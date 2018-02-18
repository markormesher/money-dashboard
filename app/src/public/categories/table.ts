import {Category} from "../../models/Category";
import {createDeleteAction, createEditAction, generationActionsHtml} from "../../helpers/entity-action-creator";
import {formatCategoryTypes} from "../../helpers/formatters";

const getActions = (category: Category) => {
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
			dataSrc: (raw: { data: Category[] }) => {
				return raw.data.map((category: Category) => {
					const output = {} as any;
					output.name = category.name;
					output.types = formatCategoryTypes(category);
					output._actions = getActions(category);
					return output
				});
			}
		}
	})
});
