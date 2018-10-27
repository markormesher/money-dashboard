import { ThinProfile } from "../../../../server/model-thins/ThinProfile";
import { PayloadAction } from "../../PayloadAction";
import { ProfileSettingsActions } from "./actions";

interface IProfileSettingsState {
	readonly lastUpdate: number;
	readonly profileToEdit: ThinProfile;
	readonly editorBusy: boolean;
}

const initialState: IProfileSettingsState = {
	lastUpdate: 0,
	profileToEdit: undefined,
	editorBusy: false,
};

function profileSettingsReducer(state = initialState, action: PayloadAction): IProfileSettingsState {
	switch (action.type) {
		case ProfileSettingsActions.SET_LAST_UPDATE:
			return {
				...state,
				lastUpdate: action.payload.lastUpdate,
			};

		case ProfileSettingsActions.SET_PROFILE_TO_EDIT:
			return {
				...state,
				profileToEdit: action.payload.profile,
			};

		case ProfileSettingsActions.SET_EDITOR_BUSY:
			return {
				...state,
				editorBusy: action.payload.editorBusy,
			};

		default:
			return state;
	}
}

export {
	IProfileSettingsState,
	profileSettingsReducer,
};
