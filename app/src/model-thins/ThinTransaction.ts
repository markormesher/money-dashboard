import { ThinAccount } from "./ThinAccount";
import { ThinCategory } from "./ThinCategory";
import { ThinProfile } from "./ThinProfile";

export class ThinTransaction {
	public id: string;
	public transactionDate: Date;
	public effectiveDate: Date;
	public amount: number;
	public payee: string;
	public note: string;
	public accountId: string;
	public account: ThinAccount;
	public categoryId: string;
	public category: ThinCategory;
	public profileId: string;
	public profile: ThinProfile;
	public createdAt: Date;
	public updateedAt: Date;
	public deletedAt: Date;
}
