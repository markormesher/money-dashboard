import { describe } from "mocha";
import { v4 } from "uuid";
import { parseISO } from "date-fns";
import { DEFAULT_PROFILE } from "../IProfile";
import { IEnvelopeTransfer } from "../IEnvelopeTransfer";
import { DEFAULT_ENVELOPE } from "../IEnvelope";
import { validateEnvelopeTransfer } from "./EnvelopeTransferValidator";

describe(__filename, () => {
  describe("validateEnvelopeTransfer()", () => {
    const VALID_TRANSFER: IEnvelopeTransfer = {
      id: v4(),
      deleted: false,
      date: parseISO("2018-01-01").getTime(),
      amount: 100,
      note: "hi",
      fromEnvelope: { ...DEFAULT_ENVELOPE, id: v4() },
      toEnvelope: { ...DEFAULT_ENVELOPE, id: v4() },
      profile: { ...DEFAULT_PROFILE, id: v4() },
    };

    it("should accept a valid transfer", () => {
      const result = validateEnvelopeTransfer(VALID_TRANSFER);
      result.isValid.should.equal(true);
      result.errors.should.deep.equal({});
    });

    it("should reject a transfer with no source envelope", () => {
      const result = validateEnvelopeTransfer({ ...VALID_TRANSFER, fromEnvelope: undefined });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("fromEnvelope");
      result.errors.fromEnvelope.should.not.equal("");
    });

    it("should reject a transfer with a source envelope with no ID", () => {
      const result = validateEnvelopeTransfer({ ...VALID_TRANSFER, fromEnvelope: { ...DEFAULT_ENVELOPE, id: null } });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("fromEnvelope");
      result.errors.fromEnvelope.should.not.equal("");
    });

    it("should reject a transfer with a source envelope with a blank ID", () => {
      const result = validateEnvelopeTransfer({ ...VALID_TRANSFER, fromEnvelope: { ...DEFAULT_ENVELOPE, id: "" } });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("fromEnvelope");
      result.errors.fromEnvelope.should.not.equal("");
    });

    it("should reject a transfer with a source envelope with a whitespace ID", () => {
      const result = validateEnvelopeTransfer({ ...VALID_TRANSFER, fromEnvelope: { ...DEFAULT_ENVELOPE, id: "   " } });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("fromEnvelope");
      result.errors.fromEnvelope.should.not.equal("");
    });

    it("should reject a transfer with no destination envelope", () => {
      const result = validateEnvelopeTransfer({ ...VALID_TRANSFER, toEnvelope: undefined });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("toEnvelope");
      result.errors.toEnvelope.should.not.equal("");
    });

    it("should reject a transfer with a destination envelope with no ID", () => {
      const result = validateEnvelopeTransfer({ ...VALID_TRANSFER, toEnvelope: { ...DEFAULT_ENVELOPE, id: null } });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("toEnvelope");
      result.errors.toEnvelope.should.not.equal("");
    });

    it("should reject a transfer with a destination envelope with a blank ID", () => {
      const result = validateEnvelopeTransfer({ ...VALID_TRANSFER, toEnvelope: { ...DEFAULT_ENVELOPE, id: "" } });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("toEnvelope");
      result.errors.toEnvelope.should.not.equal("");
    });

    it("should reject a transfer with a destination envelope with a whitespace ID", () => {
      const result = validateEnvelopeTransfer({ ...VALID_TRANSFER, toEnvelope: { ...DEFAULT_ENVELOPE, id: "   " } });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("toEnvelope");
      result.errors.toEnvelope.should.not.equal("");
    });

    it("should reject a transfer with no date", () => {
      const result = validateEnvelopeTransfer({ ...VALID_TRANSFER, date: undefined });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("date");
      result.errors.date.should.not.equal("");
    });

    it("should reject a transfer with date < global minimum", () => {
      const result = validateEnvelopeTransfer({ ...VALID_TRANSFER, date: Date.UTC(2010, 0, 1, 0, 0, 0) });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("date");
      result.errors.date.should.not.equal("");
    });

    it("should reject a transfer with an invalid date", () => {
      const result = validateEnvelopeTransfer({ ...VALID_TRANSFER, date: parseISO("2018-01-40").getTime() });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("date");
      result.errors.date.should.not.equal("");
    });

    it("should reject a transaction with no amount", () => {
      const result = validateEnvelopeTransfer({ ...VALID_TRANSFER, amount: undefined });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("amount");
      result.errors.amount.should.not.equal("");
    });

    it("should reject a transaction with a NaN amount", () => {
      const result = validateEnvelopeTransfer({ ...VALID_TRANSFER, amount: NaN });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("amount");
      result.errors.amount.should.not.equal("");
    });
  });
});
