let lastChar = "";

function handleKeyPress(char: string) {
	const pairWasHandled = handleSequence(lastChar + char);
	if (!pairWasHandled) {
		handleSequence(char);
	}
	lastChar = char;
}

function handleSequence(seq: string): boolean {
	switch (seq) {
			// goto
		case "gd":
			window.location.href = "/";
			return true;
		case "gt":
			window.location.href = "/transactions";
			return true;

			// settings
		case "sa":
			window.location.href = "/settings/accounts";
			return true;
		case "sb":
			window.location.href = "/settings/budgets";
			return true;
		case "sc":
			window.location.href = "/settings/categories";
			return true;
		case "sp":
			window.location.href = "/settings/profiles";
			return true;

			// TODO: reports

			// misc
		case "c":
			const btn = $(".create-btn");
			if (btn.is("a") && btn.prop("href") as string !== "#") {
				window.location.href = btn.prop("href") as string;
			} else {
				btn.trigger("click");
			}
			return true;
		case "?":
			$("#key-shortcut-modal").modal("show");
			return true;
	}

	return false;
}

$(() => {
	$('body').on('keypress', (evt) => {
		const target = $(event.target);
		if (target.is('input') || target.is('select') || target.is('textarea')) {
			return
		} else {
			handleKeyPress(evt.key);
		}
	});
});
