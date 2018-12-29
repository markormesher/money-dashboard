import { describe } from "mocha";
import { DEFAULT_CATEGORY, mapCategoryFromApi } from "./ICategory";

describe(__filename, () => {

	describe("mapCategoryFromApi()", () => {

		it("should be a no-op for now", () => {
			mapCategoryFromApi(DEFAULT_CATEGORY).should.equal(DEFAULT_CATEGORY);
		});
	});
});
