import { ThinCategory } from "./ThinCategory";
import { ThinProfile } from "./ThinProfile";

export class ThinBudget {
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
	public updateedAt: Date;
	public deletedAt: Date;
}
