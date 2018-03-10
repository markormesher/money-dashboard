import { ThinUser } from "./ThinUser";

export class ThinProfile {
	public id: string;
	public name: string;
	public users: ThinUser[];
	public createdAt: Date;
	public updateedAt: Date;
	public deletedAt: Date;
}
