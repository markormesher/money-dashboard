import { describe } from "mocha";
import { DEFAULT_PROFILE } from "./IProfile";
import { IUser, mapUserFromApi } from "./IUser";

describe(__filename, () => {

	describe("mapUserFromApi()", () => {

		it("should not mutate the input", () => {
			const user: IUser = {
				id: "id",
				googleId: "google id",
				displayName: "display name",
				image: "image",
				profiles: [DEFAULT_PROFILE],
				activeProfile: DEFAULT_PROFILE,
				deleted: false,
			};
			mapUserFromApi(user).should.not.equal(user);
		});
	});
});
