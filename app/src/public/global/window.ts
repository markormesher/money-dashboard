import { ThinUser } from "../../model-thins/ThinUser";

export interface IWindow extends Window {
	MoneyDashboard: WindowEmbeds;
}

class WindowEmbeds {
	public toastrMessages: { [key: string]: string[] };
	public user: ThinUser;
}
