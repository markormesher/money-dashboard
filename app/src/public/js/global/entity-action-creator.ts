import { formatMutedText } from "./formatters";

export interface IEntityAction {
	type: string;
	actionUrl?: string;
	dataId?: string;
	toggleEnabled?: boolean;
}

function generationActionsHtml(actions: IEntityAction[]): string {
	const concreteActions = actions.filter((action) => action !== null && action !== undefined);
	if (concreteActions.length === 0) {
		return formatMutedText("None");
	} else {
		let output = `<div class="btn-group">`;
		concreteActions.forEach((action) => {
			const href = `href="${action.actionUrl}"`;
			const dataId = `data-id="${action.dataId || ""}"`;
			const dataUrl = `data-action-url="${action.actionUrl}"`;

			switch (action.type) {
				case "edit":
					output += `<a class="btn btn-mini btn-default edit-btn" ${href} ${dataId}>`;
					output += `<i class="far fa-fw fa-pencil"></i>`;
					output += `</a>`;
					break;

				case "delete":
					output += `<button class="btn btn-mini btn-default delete-btn" ${dataUrl} ${dataId}>`;
					output += `<i class="far fa-fw fa-trash"></i>`;
					output += `</button>`;
					break;

				case "toggle":
					output += `<button class="btn btn-mini btn-default toggle-btn" ${dataUrl} ${dataId}>`;
					if (action.toggleEnabled) {
						output += `<i class="far fa-fw fa-toggle-on"></i>`;
					} else {
						output += `<i class="far fa-fw fa-toggle-off"></i>`;
					}
					output += `</button>`;
					break;

				default:
					throw new Error(`Unknown action type: ${action.type}`);
			}
		});
		output += "</div>";
		return output;
	}
}

function createEditAction(url: string, dataId: string = null): IEntityAction {
	return {
		type: "edit",
		actionUrl: url,
		dataId,
	} as IEntityAction;
}

function createDeleteAction(url: string, dataId: string = null): IEntityAction {
	return {
		type: "delete",
		actionUrl: url,
		dataId,
	} as IEntityAction;
}

function createToggleAction(url: string, dataId: string = null, toggleEnabled: boolean = true): IEntityAction {
	return {
		type: "toggle",
		actionUrl: url,
		dataId,
		toggleEnabled,
	} as IEntityAction;
}

export {
	createEditAction,
	createDeleteAction,
	createToggleAction,
	generationActionsHtml,
};
