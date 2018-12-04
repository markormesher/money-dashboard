import { ICategory } from "../ICategory";

interface ICategoryValidationResult {
	readonly isValid: boolean;
	readonly errors: {
		readonly name?: string,
	};
}

function validateCategory(category: ICategory): ICategoryValidationResult {
	if (!category) {
		return {
			isValid: false,
			errors: {},
		};
	}

	let result: ICategoryValidationResult = {
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
	ICategoryValidationResult,
	validateCategory,
};
