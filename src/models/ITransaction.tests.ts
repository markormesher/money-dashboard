import { expect } from "chai";
import { describe } from "mocha";
import { parseISO } from "date-fns";
import { DEFAULT_ACCOUNT } from "./IAccount";
import { DEFAULT_CATEGORY } from "./ICategory";
import { DEFAULT_PROFILE } from "./IProfile";
import {
  DEFAULT_TRANSACTION,
  getNextTransactionForContinuousCreation,
  ITransaction,
  mapTransactionFromApi,
  mapTransactionForApi,
  compareTransactionsByDate,
} from "./ITransaction";

describe(__filename, () => {
  describe("mapTransactionFromApi()", () => {
    it("should return undefined for null/undefined/empty-string inputs", () => {
      expect(mapTransactionFromApi(null)).to.equal(undefined);
      expect(mapTransactionFromApi(undefined)).to.equal(undefined);

      // @ts-expect-error testing wrong argument type
      expect(mapTransactionFromApi("")).to.equal(undefined);
    });

    it("should not mutate the input", () => {
      mapTransactionFromApi(DEFAULT_TRANSACTION).should.not.equal(DEFAULT_TRANSACTION);
    });
  });

  describe("mapTransactionForApi()", () => {
    it("should return undefined for null/undefined/empty-string inputs", () => {
      expect(mapTransactionForApi(null)).to.equal(undefined);
      expect(mapTransactionForApi(undefined)).to.equal(undefined);

      // @ts-expect-error testing wrong argument type
      expect(mapTransactionForApi("")).to.equal(undefined);
    });

    it("should not mutate the input", () => {
      mapTransactionForApi(DEFAULT_TRANSACTION).should.not.equal(DEFAULT_TRANSACTION);
    });
  });

  describe("getNextTransactionForContinuousCreation()", () => {
    it("should set a blank input to match the default transactions", () => {
      getNextTransactionForContinuousCreation({}).should.deep.equal(DEFAULT_TRANSACTION);
    });

    it("should overwrite inputs to match the default transactions (excl. dates and account)", () => {
      const input: ITransaction = {
        id: "id",
        transactionDate: parseISO("2018-01-01").getTime(),
        effectiveDate: parseISO("2018-01-02").getTime(),
        account: DEFAULT_ACCOUNT,
        category: DEFAULT_CATEGORY,
        amount: 100,
        payee: "payee",
        note: "note",
        profile: DEFAULT_PROFILE,
        deleted: false,
      };
      const output = getNextTransactionForContinuousCreation(input);

      // should match original
      output.account.should.equal(input.account);
      output.transactionDate.should.equal(input.transactionDate);
      output.effectiveDate.should.equal(input.effectiveDate);

      // should match default (with value)
      output.amount.should.equal(DEFAULT_TRANSACTION.amount);
      output.payee.should.equal(DEFAULT_TRANSACTION.payee);
      output.deleted.should.equal(DEFAULT_TRANSACTION.deleted);

      // should match default (no value)
      expect(output.id).to.equal(DEFAULT_TRANSACTION.id);
      expect(output.note).to.equal(DEFAULT_TRANSACTION.note);
      expect(output.category).to.equal(DEFAULT_TRANSACTION.category);
      expect(output.profile).to.equal(DEFAULT_TRANSACTION.profile);
    });
  });

  describe("compareTransactionsByDate()", () => {
    it("should return the distance between date fields", () => {
      const t1 = { ...DEFAULT_TRANSACTION, effectiveDate: 1, transactionDate: 2 };
      const t2 = { ...DEFAULT_TRANSACTION, effectiveDate: 4, transactionDate: 8 };
      compareTransactionsByDate(t1, t2, "effective").should.equal(1 - 4);
      compareTransactionsByDate(t1, t2, "transaction").should.equal(2 - 8);
    });
  });
});
