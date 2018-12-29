import { describe } from "mocha";
import { DEFAULT_ACCOUNT, mapAccountFromApi } from "./IAccount";

describe(__filename, () => {

	describe("mapAccountFromApi()", () => {

		it("should be a no-op for now", () => {
			mapAccountFromApi(DEFAULT_ACCOUNT).should.equal(DEFAULT_ACCOUNT);
		});
	});
});
