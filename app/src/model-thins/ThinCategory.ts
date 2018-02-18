import {PrimitiveProfile} from "./ThinProfile";

export class PrimitiveCategory {
	id: string;
	name: string;
	isMemoCategory: boolean;
	isIncomeCategory: boolean;
	isExpenseCategory: boolean;
	isAssetGrowthCategory: boolean;
	profileId: string;
	profile: PrimitiveProfile;
}
