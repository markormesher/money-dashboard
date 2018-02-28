import {MDWindow} from "./window";

$(() => {
	const toastrMessages = (window as MDWindow).MoneyDashboard.toastrMessages;
	for (let type in toastrMessages) {
		if (toastrMessages.hasOwnProperty(type)) {
			const messages = toastrMessages[type];
			messages.forEach((message: string) => toastr[type](message))
		}
	}
});
