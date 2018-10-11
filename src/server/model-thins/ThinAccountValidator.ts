import { ThinAccount } from "./ThinAccount";

interface IThinAccountValidationResult {
	isValid: boolean;
	errors: {
		name?: string,
		type?: string,
	};
}

function validateThinAccount(account: ThinAccount): IThinAccountValidationResult {
	if (!account) {
		return {
			isValid: false,
			errors: {},
		};
	}

	const result: IThinAccountValidationResult = {
		isValid: true,
		errors: {},
	};

	if (!account.name || account.name.trim() === "") {
		result.isValid = false;
		result.errors.name = "The name must not be blank";
	}

	if (!account.type || ["current", "savings", "asset", "other"].indexOf(account.type) < 0) {
		result.isValid = false;
		result.errors.name = "A valid account type must be selected";
	}

	return result;
}

export {
	IThinAccountValidationResult,
	validateThinAccount,
};
