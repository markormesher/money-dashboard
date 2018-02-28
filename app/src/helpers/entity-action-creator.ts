export interface EntityAction {
	type: 'edit' | 'delete';
	actionUrl?: string;
	dataId?: string;
}

function generationActionsHtml(actions: EntityAction[]): string {
	const concreteActions = actions.filter((action) => action !== null && action !== undefined);
	if (concreteActions.length === 0) {
		return '<span class="text-muted">None</span>';
	} else {
		let output = '<div class="btn-group">';
		concreteActions.forEach((action) => {
			switch (action.type) {
				case 'edit':
					output += `<a class="btn btn-mini btn-default edit-btn" href="${action.actionUrl}" data-id="${action.dataId || ''}">`;
					output += `<i class="far fa-fw fa-pencil"></i>`;
					output += `</a>`;
					break;

				case 'delete':
					output += `<btn class="btn btn-mini btn-default delete-btn" data-action-url="${action.actionUrl}" data-id="${action.dataId || ''}">`;
					output += `<i class="far fa-fw fa-trash"></i>`;
					output += `</btn>`;
					break;
			}
		});
		output += '</div>';
		return output;
	}
}

function createEditAction(url: string, dataId: string = null) {
	return {
		type: 'edit',
		actionUrl: url,
		dataId: dataId
	} as EntityAction;
}

function createDeleteAction(url: string, dataId: string = null) {
	return {
		type: 'delete',
		actionUrl: url,
		dataId: dataId
	} as EntityAction;
}

export {
	createEditAction,
	createDeleteAction,
	generationActionsHtml
}
