import { describe, it } from "mocha";
import { levenshteinDistance } from "./levenshtein-distance";

describe(__filename, () => {

	it("should return zero for two empty strings", () => {
		levenshteinDistance("", "").should.equal(0);
	});

	it("should return zero for two matching strings", () => {
		levenshteinDistance("test", "test").should.equal(0);
	});

	it("should be case insensitive", () => {
		levenshteinDistance("test", "TEST").should.equal(0);
	});

	it("should return string length when the other string is empty", () => {
		levenshteinDistance("test", "").should.equal(4);
		levenshteinDistance("", "test").should.equal(4);
	});

	it("should return string length when the other string is undefined", () => {
		levenshteinDistance("test", undefined).should.equal(4);
		levenshteinDistance(undefined, "test").should.equal(4);
	});

	it("should return one for one-char differences", () => {
		levenshteinDistance("tes", "test").should.equal(1); // add one
		levenshteinDistance("test", "tes").should.equal(1); // remove one
		levenshteinDistance("tesx", "test").should.equal(1); // swap one
	});

	it("should return correct answers for known examples", () => {
		levenshteinDistance("book", "back").should.equal(2);
		levenshteinDistance("cow", "cat").should.equal(2);
		levenshteinDistance("hello", "world").should.equal(4);
	});
});
