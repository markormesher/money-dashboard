import {PrimitiveProfile} from "./ThinProfile";

export class PrimitiveAccount {
	id: string;
	name: string;
	type: string;
	profileId: string;
	profile: PrimitiveProfile;
}
