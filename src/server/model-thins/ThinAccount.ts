import { ThinProfile } from "./ThinProfile";

export class ThinAccount {

	public static DEFAULT: Partial<ThinAccount> = {
		type: "current",
		active: true,
	};

	public id: string;
	public name: string;
	public type: string;
	public active: boolean;
	public profileId: string;
	public profile: ThinProfile;
	public createdAt: Date;
	public updateedAt: Date;
	public deletedAt: Date;
}
