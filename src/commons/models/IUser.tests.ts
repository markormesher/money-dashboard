import { expect } from "chai";
import { describe } from "mocha";
import { DEFAULT_PROFILE } from "./IProfile";
import { IUser, mapUserFromApi } from "./IUser";

describe(__filename, () => {
  describe("mapUserFromApi()", () => {
    it("should return undefined for null/undefined/empty-string inputs", () => {
      expect(mapUserFromApi(null)).to.equal(undefined);
      expect(mapUserFromApi(undefined)).to.equal(undefined);

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      expect(mapUserFromApi("")).to.equal(undefined);
    });

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
