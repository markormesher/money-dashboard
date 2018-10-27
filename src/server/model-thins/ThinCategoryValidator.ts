import { ThinCategory } from "./ThinCategory";

interface IThinCategoryValidationResult {
	readonly isValid: boolean;
	readonly errors: {
		readonly name?: string,
	};
}

function validateThinCategory(category: ThinCategory): IThinCategoryValidationResult {
	if (!category) {
		return {
			isValid: false,
			errors: {},
		};
	}

	let result: IThinCategoryValidationResult = {
		isValid: true,
		errors: {},
	};

	if (!category.name || category.name.trim() === "") {
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
	IThinCategoryValidationResult,
	validateThinCategory,
};
