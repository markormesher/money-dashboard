import { ThinProfile } from "./ThinProfile";

export class ThinUser {
	public id: string;
	public googleId: string;
	public displayName: string;
	public image: string;
	public profiles: ThinProfile[];
	public activeProfile: ThinProfile;
	public createdAt: Date;
	public updateedAt: Date;
	public deletedAt: Date;
}
