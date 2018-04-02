import { ThinProfile } from "./ThinProfile";

export class ThinCategory {
	public id: string;
	public name: string;
	public isMemoCategory: boolean;
	public isIncomeCategory: boolean;
	public isExpenseCategory: boolean;
	public isAssetGrowthCategory: boolean;
	public profileId: string;
	public profile: ThinProfile;
	public createdAt: Date;
	public updateedAt: Date;
	public deletedAt: Date;
}
