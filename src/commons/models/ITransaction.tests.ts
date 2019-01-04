import { expect } from "chai";
import { describe } from "mocha";
import * as Moment from "moment";
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

		it("should not mutate the input", () => {
			mapTransactionFromApi(DEFAULT_TRANSACTION).should.not.equal(DEFAULT_TRANSACTION);
		});

		it("should map string dates to Moment dates", () => {
			// clone the default transaction and then change the dates without making typescript angry
			const transaction = { ...DEFAULT_TRANSACTION };
			Object.defineProperty(transaction, "effectiveDate", { writable: true, value: "2018-01-01" });
			Object.defineProperty(transaction, "transactionDate", { writable: true, value: "2018-01-31" });
			const mappedBudget = mapTransactionFromApi(transaction);

			(mappedBudget.effectiveDate instanceof Moment).should.equal(true);
			(mappedBudget.transactionDate instanceof Moment).should.equal(true);

			mappedBudget.effectiveDate.isSame(Moment("2018-01-01")).should.equal(true);
			mappedBudget.transactionDate.isSame(Moment("2018-01-31")).should.equal(true);
		});
	});

	describe("getNextTransactionForContinuousCreation()", () => {

		it("should set a blank input to match the default transactions", () => {
			getNextTransactionForContinuousCreation({}).should.deep.equal(DEFAULT_TRANSACTION);
		});

		it("should overwrite inputs to match the default transactions (excl. dates and account)", () => {
			const input: ITransaction = {
				id: "id",
				transactionDate: Moment("2018-01-01"),
				effectiveDate: Moment("2018-01-02"),
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
