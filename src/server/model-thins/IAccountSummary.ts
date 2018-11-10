import { Account } from "../models/Account";
import { ThinAccount } from "./ThinAccount";

interface IAccountSummary {
	readonly account: Account | ThinAccount;
	readonly balance: number;
}

export {
	IAccountSummary,
};
