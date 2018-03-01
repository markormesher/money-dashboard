import {ThinProfile} from "./ThinProfile";

export class ThinAccount {
	id: string;
	name: string;
	type: string;
	profileId: string;
	profile: ThinProfile;
	createdAt: Date;
	updateedAt: Date;
	deletedAt: Date;
}
