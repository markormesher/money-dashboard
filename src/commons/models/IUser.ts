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

function mapUserFromApi(user: IUser): IUser {
	return {
		...user,

		profiles: user.profiles ? user.profiles.map(mapProfileFromApi) : undefined,
		activeProfile: user.activeProfile ? mapProfileFromApi(user.activeProfile) : undefined,
	};
}

export {
	IUser,
	mapUserFromApi,
};
