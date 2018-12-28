import { expect } from "chai";
import { v4 } from "uuid";
import { cleanUuid, NULL_UUID } from "./utils";

describe(__filename, () => {

	describe("cleanUuid()", () => {

		it("should return the null UUID for falsy inputs", () => {
			cleanUuid(null).should.equal(NULL_UUID);
			cleanUuid(undefined).should.equal(NULL_UUID);
		});

		it("should return the UUID for valid inputs (generic UUID - lower case)", () => {
			const uuid = v4().toLowerCase();
			cleanUuid(uuid).should.equal(uuid);
		});

		it("should return the UUID for valid inputs (generic UUID - upper case)", () => {
			const uuid = v4().toUpperCase();
			cleanUuid(uuid).should.equal(uuid);
		});

		it("should return the UUID for valid inputs (generic UUID - mixed case)", () => {
			let uuid = v4();
			uuid = uuid.toLowerCase().substr(0, 12) + uuid.toUpperCase().substring(12);
			cleanUuid(uuid).should.equal(uuid);
		});

		it("should return the UUID for valid inputs (null UUID)", () => {
			cleanUuid(NULL_UUID).should.equal(NULL_UUID);
		});

		it("should throw an error for invalid inputs (wrong format)", () => {
			expect(() => cleanUuid("not a uuid")).to.throw();
		});

		it("should throw an error for invalid inputs (wrong version)", () => {
			// note "0" in first position of third block; valid versions are 1-5
			expect(() => cleanUuid("73ea6d9e-bad0-0ddc-8eff-369b369ac3a9")).to.throw();
		});

		it("should throw an error for invalid inputs (wrong variant)", () => {
			// note "0" in first position of fourth block; valid variants are 8/9/a/b
			expect(() => cleanUuid("73ea6d9e-bad0-4ddc-0eff-369b369ac3a9")).to.throw();
		});

		it("should include the bad UUID in the error for invalid inputs", () => {
			expect(() => cleanUuid("not a uuid")).to.throw(/not a uuid/);
		});
	});
});
