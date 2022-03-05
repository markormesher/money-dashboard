import { describe } from "mocha";
import { v4 } from "uuid";
import { parseISO } from "date-fns";
import { DEFAULT_ACCOUNT } from "../IAccount";
import { DEFAULT_CATEGORY } from "../ICategory";
import { DEFAULT_PROFILE } from "../IProfile";
import { ITransaction } from "../ITransaction";
import { validateTransaction } from "./TransactionValidator";

describe(__filename, () => {
  describe("validateTransaction()", () => {
    const VALID_TRANSACTION: ITransaction = {
      id: v4(),
      transactionDate: parseISO("2018-01-01").getTime(),
      effectiveDate: parseISO("2018-01-31").getTime(),
      payee: "Payee",
      note: "Note",
      amount: 100,
      account: { ...DEFAULT_ACCOUNT, id: v4() },
      category: { ...DEFAULT_CATEGORY, id: v4() },
      profile: DEFAULT_PROFILE,
      deleted: false,
    };

    it("should accept a valid transaction", () => {
      const result = validateTransaction(VALID_TRANSACTION);
      result.isValid.should.equal(true);
      result.errors.should.deep.equal({});
    });

    it("should reject a null transaction", () => {
      const result = validateTransaction(null);
      result.isValid.should.equal(false);
      result.errors.should.deep.equal({});
    });

    it("should reject an undefined transaction", () => {
      const result = validateTransaction(undefined);
      result.isValid.should.equal(false);
      result.errors.should.deep.equal({});
    });

    it("should reject a transaction with no account", () => {
      const result = validateTransaction({ ...VALID_TRANSACTION, account: undefined });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("account");
      result.errors.account.should.not.equal("");
    });

    it("should reject a transaction with a account with no ID", () => {
      const result = validateTransaction({ ...VALID_TRANSACTION, account: { ...DEFAULT_ACCOUNT, id: null } });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("account");
      result.errors.account.should.not.equal("");
    });

    it("should reject a transaction with a account with a blank ID", () => {
      const result = validateTransaction({ ...VALID_TRANSACTION, account: { ...DEFAULT_ACCOUNT, id: "" } });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("account");
      result.errors.account.should.not.equal("");
    });

    it("should reject a transaction with a account with a whitespace ID", () => {
      const result = validateTransaction({ ...VALID_TRANSACTION, account: { ...DEFAULT_ACCOUNT, id: "   " } });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("account");
      result.errors.account.should.not.equal("");
    });

    it("should reject a transaction with no category", () => {
      const result = validateTransaction({ ...VALID_TRANSACTION, category: undefined });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("category");
      result.errors.category.should.not.equal("");
    });

    it("should reject a transaction with a category with no ID", () => {
      const result = validateTransaction({ ...VALID_TRANSACTION, category: { ...DEFAULT_CATEGORY, id: null } });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("category");
      result.errors.category.should.not.equal("");
    });

    it("should reject a transaction with a category with a blank ID", () => {
      const result = validateTransaction({ ...VALID_TRANSACTION, category: { ...DEFAULT_CATEGORY, id: "" } });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("category");
      result.errors.category.should.not.equal("");
    });

    it("should reject a transaction with a category with a whitespace ID", () => {
      const result = validateTransaction({ ...VALID_TRANSACTION, category: { ...DEFAULT_CATEGORY, id: "   " } });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("category");
      result.errors.category.should.not.equal("");
    });

    it("should reject a transaction with no amount", () => {
      const result = validateTransaction({ ...VALID_TRANSACTION, amount: undefined });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("amount");
      result.errors.amount.should.not.equal("");
    });

    it("should reject a transaction with a NaN amount", () => {
      const result = validateTransaction({ ...VALID_TRANSACTION, amount: NaN });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("amount");
      result.errors.amount.should.not.equal("");
    });

    it("should reject a transaction with no payee", () => {
      const result = validateTransaction({ ...VALID_TRANSACTION, payee: undefined });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("payee");
      result.errors.payee.should.not.equal("");
    });

    it("should reject a transaction with a blank payee", () => {
      const result = validateTransaction({ ...VALID_TRANSACTION, payee: "" });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("payee");
      result.errors.payee.should.not.equal("");
    });

    it("should reject a transaction with a whitespace payee", () => {
      const result = validateTransaction({ ...VALID_TRANSACTION, payee: "  " });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("payee");
      result.errors.payee.should.not.equal("");
    });

    it("should reject a transaction with no transaction date", () => {
      const result = validateTransaction({ ...VALID_TRANSACTION, transactionDate: undefined });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("transactionDate");
      result.errors.transactionDate.should.not.equal("");
    });

    it("should reject a transaction with transaction date < global minimum", () => {
      const result = validateTransaction({ ...VALID_TRANSACTION, transactionDate: Date.UTC(2010, 0, 1, 0, 0, 0) });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("transactionDate");
      result.errors.transactionDate.should.not.equal("");
    });

    it("should reject a transaction with an invalid transaction date", () => {
      const result = validateTransaction({ ...VALID_TRANSACTION, transactionDate: parseISO("2018-01-40").getTime() });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("transactionDate");
      result.errors.transactionDate.should.not.equal("");
    });

    it("should reject a transaction with no effective date", () => {
      const result = validateTransaction({ ...VALID_TRANSACTION, effectiveDate: undefined });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("effectiveDate");
      result.errors.effectiveDate.should.not.equal("");
    });

    it("should reject a transaction with effective date < global minimum", () => {
      const result = validateTransaction({ ...VALID_TRANSACTION, effectiveDate: Date.UTC(2010, 0, 1, 0, 0, 0) });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("effectiveDate");
      result.errors.effectiveDate.should.not.equal("");
    });

    it("should reject a transaction with an invalid effective date", () => {
      const result = validateTransaction({ ...VALID_TRANSACTION, effectiveDate: parseISO("2018-01-40").getTime() });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("effectiveDate");
      result.errors.effectiveDate.should.not.equal("");
    });
  });
});
