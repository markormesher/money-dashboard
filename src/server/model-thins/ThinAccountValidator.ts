import { ThinAccount } from "./ThinAccount";

interface IThinAccountValidationResult {
	readonly isValid: boolean;
	readonly errors: {
		readonly name?: string,
		readonly type?: string,
	};
}

function validateThinAccount(account: ThinAccount): IThinAccountValidationResult {
	if (!account) {
		return {
			isValid: false,
			errors: {},
		};
	}

	let result: IThinAccountValidationResult = {
		isValid: true,
		errors: {},
	};

	if (!account.name || account.name.trim() === "") {
		result = {
			isValid: false,
			errors: {
				...result.errors,
				name: "The name must not be blank",
			},
		};
	}

	if (!account.type || ["current", "savings", "asset", "other"].indexOf(account.type) < 0) {
		result = {
			isValid: false,
			errors: {
				...result.errors,
				name: "A valid account type must be selected",
			},
		};
	}

	return result;
}

export {
	IThinAccountValidationResult,
	validateThinAccount,
};
