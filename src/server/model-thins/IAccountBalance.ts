import { Account } from "../models/Account";
import { ThinAccount } from "./ThinAccount";

interface IAccountBalance {
	readonly account: Account | ThinAccount;
	readonly balance: number;
}

export {
	IAccountBalance,
};
