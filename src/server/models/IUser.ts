import { IProfile } from "./IProfile";

interface IUser {
	readonly id: string;
	readonly googleId: string;
	readonly displayName: string;
	readonly image: string;
	readonly profiles: IProfile[];
	readonly activeProfile: IProfile;
}

function mapUserFromApi(user: IUser): IUser {
	// no-op, for now
	return user;
}

export {
	IUser,
	mapUserFromApi,
};
