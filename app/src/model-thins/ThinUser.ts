import {ThinProfile} from "./ThinProfile";

export class ThinUser {
	id: string;
	googleId: string;
	displayName: string;
	image: string;
	profiles: ThinProfile[];
	activeProfile: ThinProfile;
	createdAt: Date;
	updateedAt: Date;
	deletedAt: Date;
}
