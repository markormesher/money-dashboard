import {ThinCategory} from "./ThinCategory";
import {ThinProfile} from "./ThinProfile";

export class ThinBudget {
	id: string;
	type: string;
	amount: number;
	startDate: string;
	endDate: string;
	categoryId: string;
	category: ThinCategory;
	profileId: string;
	profile: ThinProfile;
	createdAt: Date;
	updateedAt: Date;
	deletedAt: Date;
}
