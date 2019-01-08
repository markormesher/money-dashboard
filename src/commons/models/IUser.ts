import { mapEntitiesFromApi } from "../utils/entities";
import { IProfile, mapProfileFromApi } from "./IProfile";

interface IUser {
	readonly id: string;
	readonly googleId: string;
	readonly displayName: string;
	readonly image: string;
	readonly profiles: IProfile[];
	readonly activeProfile: IProfile;
	readonly deleted: boolean;
}

function mapUserFromApi(user?: IUser): IUser {
	if (!user) {
		return undefined;
	}

	return {
		...user,

		profiles: mapEntitiesFromApi(mapProfileFromApi, user.profiles),
		activeProfile: mapProfileFromApi(user.activeProfile),
	};
}

export {
	IUser,
	mapUserFromApi,
};
