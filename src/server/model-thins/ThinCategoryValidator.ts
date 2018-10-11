import { ThinCategory } from "./ThinCategory";

interface IThinCategoryValidationResult {
	isValid: boolean;
	errors: {
		name?: string,
		type?: string,
	};
}

function validateThinCategory(category: ThinCategory): IThinCategoryValidationResult {
	if (!category) {
		return {
			isValid: false,
			errors: {},
		};
	}

	const result: IThinCategoryValidationResult = {
		isValid: true,
		errors: {},
	};

	if (!category.name || category.name.trim() === "") {
		result.isValid = false;
		result.errors.name = "The name must not be blank";
	}

	return result;
}

export {
	IThinCategoryValidationResult,
	validateThinCategory,
};
