import { IWindow } from "./window";

$(() => {
	const toastrMessages = (window as IWindow).MoneyDashboard.toastrMessages;
	for (const type in toastrMessages) {
		if (toastrMessages.hasOwnProperty(type)) {
			const messages = toastrMessages[type];
			messages.forEach((message: string) => toastr[type](message));
		}
	}
});
