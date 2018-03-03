import { ThinUser } from "./ThinUser";

export class ThinProfile {
	id: string;
	name: string;
	users: ThinUser[];
	createdAt: Date;
	updateedAt: Date;
	deletedAt: Date;
}
