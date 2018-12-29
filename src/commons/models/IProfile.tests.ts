import { describe } from "mocha";
import { DEFAULT_PROFILE, mapProfileFromApi } from "./IProfile";

describe(__filename, () => {

	describe("mapProfileFromApi()", () => {

		it("should be a no-op for now", () => {
			mapProfileFromApi(DEFAULT_PROFILE).should.equal(DEFAULT_PROFILE);
		});
	});
});
