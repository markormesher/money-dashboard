import { afterEach, describe } from "mocha";
import * as sinon from "sinon";
import { DEFAULT_PROFILE } from "../IProfile";
import { validateProfile } from "./ProfileValidator";

describe(__filename, () => {

	// TODO: tests

	const sandbox = sinon.createSandbox();

	afterEach(() => {
		sandbox.restore();
	});

	describe("method()", () => {

		it("should do something", () => {
			validateProfile(DEFAULT_PROFILE);
		});
	});
});
