import { describe } from "mocha";
import { DEFAULT_ACCOUNT, mapAccountFromApi } from "./IAccount";

describe(__filename, () => {

	describe("mapAccountFromApi()", () => {

		it("should not mutate the input", () => {
			mapAccountFromApi(DEFAULT_ACCOUNT).should.not.equal(DEFAULT_ACCOUNT);
		});
	});
});
