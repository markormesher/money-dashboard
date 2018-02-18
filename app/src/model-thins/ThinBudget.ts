import {PrimitiveCategory} from "./ThinCategory";
import {PrimitiveProfile} from "./ThinProfile";

export class PrimitiveBudget {
	id: string;
	type: string;
	amount: number;
	startDate: string;
	endDate: string;
	categoryId: string;
	category: PrimitiveCategory;
	profileId: string;
	profile: PrimitiveProfile;
}
