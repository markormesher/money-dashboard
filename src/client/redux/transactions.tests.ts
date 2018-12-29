import { expect } from "chai";
import { describe, it } from "mocha";
import { DEFAULT_TRANSACTION } from "../../commons/models/ITransaction";
import {
	setDateMode,
	setEditorBusy,
	setPayeeList,
	setTransactionToEdit,
	startDeleteTransaction,
	startLoadPayeeList,
	startSaveTransaction,
	TransactionActions,
	transactionsReducer,
} from "./transactions";

describe(__filename, () => {

	describe("startDeleteTransaction()", () => {

		it("should generate an action with the correct type", () => {
			startDeleteTransaction(DEFAULT_TRANSACTION).type.should.equal(TransactionActions.START_DELETE_TRANSACTION);
		});

		it("should add the transaction to the payload", () => {
			startDeleteTransaction(DEFAULT_TRANSACTION).payload.should.have.keys("transaction");
			startDeleteTransaction(DEFAULT_TRANSACTION).payload.transaction.should.equal(DEFAULT_TRANSACTION);
		});
	});

	describe("startSaveTransaction()", () => {

		it("should generate an action with the correct type", () => {
			startSaveTransaction(DEFAULT_TRANSACTION).type.should.equal(TransactionActions.START_SAVE_TRANSACTION);
		});

		it("should add the transaction to the payload", () => {
			startSaveTransaction(DEFAULT_TRANSACTION).payload.should.have.keys("transaction");
			startSaveTransaction(DEFAULT_TRANSACTION).payload.transaction.should.equal(DEFAULT_TRANSACTION);
		});
	});

	describe("startLoadPayeeList()", () => {

		it("should generate an action with the correct type", () => {
			startLoadPayeeList().type.should.equal(TransactionActions.START_LOAD_PAYEE_LIST);
		});
	});

	describe("setDateMode()", () => {

		it("should generate an action with the correct type", () => {
			setDateMode("transaction").type.should.equal(TransactionActions.SET_DATE_MODE);
		});

		it("should add the value to the payload", () => {
			setDateMode("transaction").payload.should.have.keys("dateMode");
			setDateMode("transaction").payload.dateMode.should.equal("transaction");
		});
	});

	describe("setTransactionToEdit()", () => {

		it("should generate an action with the correct type", () => {
			setTransactionToEdit(DEFAULT_TRANSACTION).type.should.equal(TransactionActions.SET_TRANSACTION_TO_EDIT);
		});

		it("should add the transaction to the payload", () => {
			setTransactionToEdit(DEFAULT_TRANSACTION).payload.should.have.keys("transaction");
			setTransactionToEdit(DEFAULT_TRANSACTION).payload.transaction.should.equal(DEFAULT_TRANSACTION);
		});
	});

	describe("setEditorBusy()", () => {

		it("should generate an action with the correct type", () => {
			setEditorBusy(true).type.should.equal(TransactionActions.SET_EDITOR_BUSY);
		});

		it("should add the value to the payload", () => {
			setEditorBusy(true).payload.should.have.keys("editorBusy");
			setEditorBusy(true).payload.editorBusy.should.equal(true);
		});
	});

	describe("setPayeeList()", () => {

		const payees = ["a"];

		it("should generate an action with the correct type", () => {
			setPayeeList(payees).type.should.equal(TransactionActions.SET_PAYEE_LIST);
		});

		it("should add the transactions to the payload", () => {
			setPayeeList(payees).payload.should.have.keys("payeeList");
			setPayeeList(payees).payload.payeeList.should.equal(payees);
		});
	});

	describe("transactionsReducer()", () => {

		it("should initialise its state correctly", () => {
			transactionsReducer(undefined, { type: "@@INIT" }).should.deep.equal({
				dateMode: "transaction",
				transactionToEdit: undefined,
				editorBusy: false,
				payeeList: undefined,
			});
		});

		describe(TransactionActions.SET_DATE_MODE, () => {

			it("should set the date mode", () => {
				transactionsReducer(undefined, setDateMode("effective")).dateMode.should.equal("effective");
				transactionsReducer(undefined, setDateMode("transaction")).dateMode.should.equal("transaction");
			});
		});

		describe(TransactionActions.SET_TRANSACTION_TO_EDIT, () => {

			it("should set the transaction to edit", () => {
				expect(transactionsReducer(undefined, setTransactionToEdit(null)).transactionToEdit).to.equal(null);
				expect(transactionsReducer(undefined, setTransactionToEdit(undefined)).transactionToEdit).to.equal(undefined);
				transactionsReducer(undefined, setTransactionToEdit(DEFAULT_TRANSACTION))
						.transactionToEdit.should.equal(DEFAULT_TRANSACTION);
			});
		});

		describe(TransactionActions.SET_EDITOR_BUSY, () => {

			it("should set the editor-busy flag", () => {
				transactionsReducer(undefined, setEditorBusy(true)).editorBusy.should.equal(true);
				transactionsReducer(undefined, setEditorBusy(false)).editorBusy.should.equal(false);
			});
		});

		describe(TransactionActions.SET_PAYEE_LIST, () => {

			const payeeList = ["a", "b", "c"];

			it("should set the payee list", () => {
				transactionsReducer(undefined, setPayeeList(payeeList)).payeeList.should.equal(payeeList);
			});
		});
	});

	// TODO: sagas
});
