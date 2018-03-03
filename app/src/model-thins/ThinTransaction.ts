import { ThinAccount } from "./ThinAccount";
import { ThinCategory } from "./ThinCategory";
import { ThinProfile } from "./ThinProfile";

export class ThinTransaction {
	id: string;
	transactionDate: Date;
	effectiveDate: Date;
	amount: number;
	payee: string;
	note: string;
	accountId: string;
	account: ThinAccount;
	categoryId: string;
	category: ThinCategory;
	profileId: string;
	profile: ThinProfile;
	createdAt: Date;
	updateedAt: Date;
	deletedAt: Date;
}
