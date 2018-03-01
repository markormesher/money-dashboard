import {ThinProfile} from "./ThinProfile";

export class ThinAccount {
	id: string;
	name: string;
	type: string;
	active: boolean;
	profileId: string;
	profile: ThinProfile;
	createdAt: Date;
	updateedAt: Date;
	deletedAt: Date;
}
