import { ThinProfile } from "./ThinProfile";

export class ThinAccount {

	public static DEFAULT: ThinAccount = {
		id: null,
		name: "",
		type: "current",
		active: true,
		profileId: null,
		profile: null,
		createdAt: null,
		updatedAt: null,
		deletedAt: null,
	};

	public id: string;
	public name: string;
	public type: string;
	public active: boolean;
	public profileId: string;
	public profile: ThinProfile;
	public createdAt: Date;
	public updatedAt: Date;
	public deletedAt: Date;
}
