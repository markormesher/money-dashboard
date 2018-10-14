import { ThinCategory } from "./ThinCategory";
import { ThinProfile } from "./ThinProfile";

export class ThinBudget {

	public static DEFAULT: ThinBudget = {
		id: undefined,
		type: "budget",
		amount: 0,
		startDate: "",
		endDate: "",
		categoryId: undefined,
		category: undefined,
		profileId: undefined,
		profile: undefined,
		createdAt: undefined,
		updatedAt: undefined,
		deletedAt: undefined,
	};

	public id: string;
	public type: string;
	public amount: number;
	public startDate: string;
	public endDate: string;
	public categoryId: string;
	public category: ThinCategory;
	public profileId: string;
	public profile: ThinProfile;
	public createdAt: Date;
	public updatedAt: Date;
	public deletedAt: Date;
}
