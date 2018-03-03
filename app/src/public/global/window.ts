import { ThinUser } from "../../model-thins/ThinUser";

export interface MDWindow extends Window {
	MoneyDashboard: WindowEmbeds;
}

interface WindowEmbeds {
	toastrMessages: { [key: string]: string[] };
	user: ThinUser;
}
