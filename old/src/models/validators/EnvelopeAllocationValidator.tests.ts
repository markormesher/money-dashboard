import { describe } from "mocha";
import { v4 } from "uuid";
import { parseISO } from "date-fns";
import { DEFAULT_CATEGORY } from "../ICategory";
import { DEFAULT_PROFILE } from "../IProfile";
import { IEnvelopeAllocation } from "../IEnvelopeAllocation";
import { DEFAULT_ENVELOPE } from "../IEnvelope";
import { validateEnvelopeAllocation } from "./EnvelopeAllocationValidator";

describe(__filename, () => {
  describe("validateEnvelopeAllocation()", () => {
    const VALID_ALLOCATION: IEnvelopeAllocation = {
      id: v4(),
      deleted: false,
      startDate: parseISO("2018-01-01").getTime(),
      category: { ...DEFAULT_CATEGORY, id: v4() },
      envelope: { ...DEFAULT_ENVELOPE, id: v4() },
      profile: { ...DEFAULT_PROFILE, id: v4() },
    };

    it("should accept a valid allocation", () => {
      const result = validateEnvelopeAllocation(VALID_ALLOCATION);
      result.isValid.should.equal(true);
      result.errors.should.deep.equal({});
    });

    it("should reject a allocation with no category", () => {
      const result = validateEnvelopeAllocation({ ...VALID_ALLOCATION, category: undefined });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("category");
      result.errors.category.should.not.equal("");
    });

    it("should reject a allocation with a category with no ID", () => {
      const result = validateEnvelopeAllocation({ ...VALID_ALLOCATION, category: { ...DEFAULT_CATEGORY, id: null } });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("category");
      result.errors.category.should.not.equal("");
    });

    it("should reject a allocation with a category with a blank ID", () => {
      const result = validateEnvelopeAllocation({ ...VALID_ALLOCATION, category: { ...DEFAULT_CATEGORY, id: "" } });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("category");
      result.errors.category.should.not.equal("");
    });

    it("should reject a allocation with a category with a whitespace ID", () => {
      const result = validateEnvelopeAllocation({ ...VALID_ALLOCATION, category: { ...DEFAULT_CATEGORY, id: "   " } });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("category");
      result.errors.category.should.not.equal("");
    });

    it("should reject a allocation with no envelope", () => {
      const result = validateEnvelopeAllocation({ ...VALID_ALLOCATION, envelope: undefined });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("envelope");
      result.errors.envelope.should.not.equal("");
    });

    it("should reject a allocation with a envelope with no ID", () => {
      const result = validateEnvelopeAllocation({ ...VALID_ALLOCATION, envelope: { ...DEFAULT_ENVELOPE, id: null } });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("envelope");
      result.errors.envelope.should.not.equal("");
    });

    it("should reject a allocation with a envelope with a blank ID", () => {
      const result = validateEnvelopeAllocation({ ...VALID_ALLOCATION, envelope: { ...DEFAULT_ENVELOPE, id: "" } });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("envelope");
      result.errors.envelope.should.not.equal("");
    });

    it("should reject a allocation with a envelope with a whitespace ID", () => {
      const result = validateEnvelopeAllocation({ ...VALID_ALLOCATION, envelope: { ...DEFAULT_ENVELOPE, id: "   " } });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("envelope");
      result.errors.envelope.should.not.equal("");
    });

    it("should reject a allocation with no start date", () => {
      const result = validateEnvelopeAllocation({ ...VALID_ALLOCATION, startDate: undefined });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("startDate");
      result.errors.startDate.should.not.equal("");
    });

    it("should reject a allocation with start date < global minimum", () => {
      const result = validateEnvelopeAllocation({ ...VALID_ALLOCATION, startDate: Date.UTC(2010, 0, 1, 0, 0, 0) });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("startDate");
      result.errors.startDate.should.not.equal("");
    });

    it("should reject a allocation with an invalid start date", () => {
      const result = validateEnvelopeAllocation({ ...VALID_ALLOCATION, startDate: parseISO("2018-01-40").getTime() });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("startDate");
      result.errors.startDate.should.not.equal("");
    });
  });
});
