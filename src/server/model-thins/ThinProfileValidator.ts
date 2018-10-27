import { ThinProfile } from "./ThinProfile";

interface IThinProfileValidationResult {
	readonly isValid: boolean;
	readonly errors: {
		readonly name?: string,
	};
}

function validateThinProfile(profile: ThinProfile): IThinProfileValidationResult {
	if (!profile) {
		return {
			isValid: false,
			errors: {},
		};
	}

	let result: IThinProfileValidationResult = {
		isValid: true,
		errors: {},
	};

	if (!profile.name || profile.name.trim() === "") {
		result = {
			isValid: false,
			errors: {
				...result.errors,
				name: "The name must not be blank",
			},
		};
	}

	return result;
}

export {
	IThinProfileValidationResult,
	validateThinProfile,
};
