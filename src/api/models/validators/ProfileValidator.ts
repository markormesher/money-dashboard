import { IProfile } from "../IProfile";

interface IProfileValidationResult {
	readonly isValid: boolean;
	readonly errors: {
		readonly name?: string,
	};
}

function validateProfile(profile: IProfile): IProfileValidationResult {
	if (!profile) {
		return {
			isValid: false,
			errors: {},
		};
	}

	let result: IProfileValidationResult = {
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
	IProfileValidationResult,
	validateProfile,
};
