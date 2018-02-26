interface Window {
	MoneyDashboard: WindowEmbeds;
}

interface WindowEmbeds {
	toastrMessages: { [key: string]: string[] };
	user: any; // TODO: make typed without breaking things
}

window.MoneyDashboard = {
	toastrMessages: undefined,
	user: undefined
};
