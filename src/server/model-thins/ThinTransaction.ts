import * as moment from "moment";
import { formatDate } from "../../client/helpers/formatters";
import { ThinAccount } from "./ThinAccount";
import { ThinCategory } from "./ThinCategory";
import { ThinProfile } from "./ThinProfile";

export class ThinTransaction {

	public static DEFAULT: ThinTransaction = {
		id: null,
		transactionDate: formatDate(moment(), "system"),
		effectiveDate: formatDate(moment(), "system"),
		amount: 0,
		payee: "",
		note: undefined,
		accountId: undefined,
		account: undefined,
		categoryId: undefined,
		category: undefined,
		profileId: null,
		profile: null,
		createdAt: null,
		updatedAt: null,
		deletedAt: null,
	};

	public id: string;
	public transactionDate: string;
	public effectiveDate: string;
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
	public updatedAt: Date;
	public deletedAt: Date;
}
