import { describe } from "mocha";
import { DEFAULT_CATEGORY, mapCategoryFromApi } from "./ICategory";

describe(__filename, () => {

	describe("mapCategoryFromApi()", () => {

		it("should not mutate the input", () => {
			mapCategoryFromApi(DEFAULT_CATEGORY).should.not.equal(DEFAULT_CATEGORY);
		});
	});
});
