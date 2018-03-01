import {formatMutedText} from "./formatters";

export interface EntityAction {
	type: 'edit' | 'delete' | 'toggle';
	actionUrl?: string;
	dataId?: string;
	toggleEnabled?: boolean;
}

function generationActionsHtml(actions: EntityAction[]): string {
	const concreteActions = actions.filter((action) => action !== null && action !== undefined);
	if (concreteActions.length === 0) {
		return formatMutedText('None');
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
					output += `<button class="btn btn-mini btn-default delete-btn" data-action-url="${action.actionUrl}" data-id="${action.dataId || ''}">`;
					output += `<i class="far fa-fw fa-trash"></i>`;
					output += `</button>`;
					break;

				case 'toggle':
					output += `<button class="btn btn-mini btn-default toggle-btn" data-action-url="${action.actionUrl}" data-id="${action.dataId || ''}">`;
					if (action.toggleEnabled) {
						output += `<i class="far fa-fw fa-toggle-on"></i>`;
					} else {
						output += `<i class="far fa-fw fa-toggle-off"></i>`;
					}
					output += `</button>`;
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

function createToggleAction(url: string, dataId: string = null, toggleEnabled: boolean = true) {
	return {
		type: 'toggle',
		actionUrl: url,
		dataId: dataId,
		toggleEnabled: toggleEnabled
	} as EntityAction;
}

export {
	createEditAction,
	createDeleteAction,
	createToggleAction,
	generationActionsHtml
}
