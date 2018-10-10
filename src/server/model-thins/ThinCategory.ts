import { ThinProfile } from "./ThinProfile";

export class ThinCategory {

	public static DEFAULT: ThinCategory = {
		id: null,
		name: "",
		isMemoCategory: false,
		isIncomeCategory: false,
		isExpenseCategory: false,
		isAssetGrowthCategory: false,
		profileId: null,
		profile: null,
		createdAt: null,
		updatedAt: null,
		deletedAt: null,
	};

	public id: string;
	public name: string;
	public isMemoCategory: boolean;
	public isIncomeCategory: boolean;
	public isExpenseCategory: boolean;
	public isAssetGrowthCategory: boolean;
	public profileId: string;
	public profile: ThinProfile;
	public createdAt: Date;
	public updatedAt: Date;
	public deletedAt: Date;
}
