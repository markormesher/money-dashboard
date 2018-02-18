import {PrimitiveProfile} from "./ThinProfile";

export class PrimitiveUser {
	id: string;
	googleId: string;
	displayName: string;
	image: string;
	profiles: PrimitiveProfile[];
	activeProfile: PrimitiveProfile;
}
