import { ThinUser } from "./ThinUser";

export class ThinProfile {

	public static DEFAULT: ThinProfile = {
		id: null,
		name: "",
		users: null,
		createdAt: null,
		updatedAt: null,
		deletedAt: null,
	};

	public id: string;
	public name: string;
	public users: ThinUser[];
	public createdAt: Date;
	public updatedAt: Date;
	public deletedAt: Date;
}
