import { describe } from "mocha";
import { DEFAULT_PROFILE, mapProfileFromApi } from "./IProfile";

describe(__filename, () => {

	describe("mapProfileFromApi()", () => {

		it("should not mutate the input", () => {
			mapProfileFromApi(DEFAULT_PROFILE).should.not.equal(DEFAULT_PROFILE);
		});
	});
});
