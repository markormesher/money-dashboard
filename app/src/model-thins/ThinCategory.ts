import {ThinProfile} from "./ThinProfile";

export class ThinCategory {
	id: string;
	name: string;
	isMemoCategory: boolean;
	isIncomeCategory: boolean;
	isExpenseCategory: boolean;
	isAssetGrowthCategory: boolean;
	profileId: string;
	profile: ThinProfile;
}
