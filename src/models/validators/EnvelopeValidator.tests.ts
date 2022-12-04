import { describe } from "mocha";
import { v4 } from "uuid";
import { IEnvelope } from "../IEnvelope";
import { DEFAULT_PROFILE } from "../IProfile";
import { validateEnvelope } from "./EnvelopeValidator";

describe(__filename, () => {
  describe("validateEnvelope()", () => {
    const VALID_ENVELOPE: IEnvelope = {
      id: v4(),
      name: "Envelope",
      profile: DEFAULT_PROFILE,
      active: true,
      categoryAllocations: [],
      deleted: false,
    };

    it("should accept a valid envelope", () => {
      const result = validateEnvelope(VALID_ENVELOPE);
      result.isValid.should.equal(true);
      result.errors.should.deep.equal({});
    });

    it("should reject a null envelope", () => {
      const result = validateEnvelope(null);
      result.isValid.should.equal(false);
      result.errors.should.deep.equal({});
    });

    it("should reject an undefined envelope", () => {
      const result = validateEnvelope(undefined);
      result.isValid.should.equal(false);
      result.errors.should.deep.equal({});
    });

    it("should reject an envelope with no name", () => {
      const result = validateEnvelope({ ...VALID_ENVELOPE, name: undefined });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("name");
      result.errors.name.should.not.equal("");
    });

    it("should reject an envelope with a blank name", () => {
      const result = validateEnvelope({ ...VALID_ENVELOPE, name: "" });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("name");
      result.errors.name.should.not.equal("");
    });

    it("should reject an envelope with an all-whitespace name", () => {
      const result = validateEnvelope({ ...VALID_ENVELOPE, name: "   " });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("name");
      result.errors.name.should.not.equal("");
    });
  });
});
