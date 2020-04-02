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
} from "./ITransaction";

describe(__filename, () => {
  describe("mapTransactionFromApi()", () => {
    it("should return undefined for null/undefined/empty-string inputs", () => {
      expect(mapTransactionFromApi(null)).to.equal(undefined);
      expect(mapTransactionFromApi(undefined)).to.equal(undefined);

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      expect(mapTransactionFromApi("")).to.equal(undefined);
    });

    it("should not mutate the input", () => {
      mapTransactionFromApi(DEFAULT_TRANSACTION).should.not.equal(DEFAULT_TRANSACTION);
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
});
