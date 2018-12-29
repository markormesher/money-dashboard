import { afterEach, beforeEach, describe, it } from "mocha";
import { DEFAULT_ACCOUNT } from "../../commons/models/IAccount";
import {
	AccountActions,
	addAccountEditInProgress,
	removeAccountEditInProgress,
	setAccountList,
	setAccountToEdit,
	setDisplayActiveOnly,
	setEditorBusy,
	startDeleteAccount,
	startLoadAccountList,
	startSaveAccount,
	startSetAccountActive,
} from "./accounts";

describe(__filename, () => {

	describe("startDeleteAccount()", () => {

		it("should generate an action with the correct type", () => {
			startDeleteAccount(DEFAULT_ACCOUNT).type.should.equal(AccountActions.START_DELETE_ACCOUNT);
		});

		it("should add the account to the payload", () => {
			startDeleteAccount(DEFAULT_ACCOUNT).payload.should.have.keys("account");
			startDeleteAccount(DEFAULT_ACCOUNT).payload.account.should.equal(DEFAULT_ACCOUNT);
		});
	});

	describe("startSaveAccount()", () => {

		it("should generate an action with the correct type", () => {
			startSaveAccount(DEFAULT_ACCOUNT).type.should.equal(AccountActions.START_SAVE_ACCOUNT);
		});

		it("should add the account to the payload", () => {
			startSaveAccount(DEFAULT_ACCOUNT).payload.should.have.keys("account");
			startSaveAccount(DEFAULT_ACCOUNT).payload.account.should.equal(DEFAULT_ACCOUNT);
		});
	});

	describe("startSetAccountActive()", () => {

		it("should generate an action with the correct type", () => {
			startSetAccountActive(DEFAULT_ACCOUNT, true).type.should.equal(AccountActions.START_SET_ACCOUNT_ACTIVE);
		});

		it("should add the account and active status to the payload", () => {
			startSetAccountActive(DEFAULT_ACCOUNT, true).payload.should.have.keys("account", "active");
			startSetAccountActive(DEFAULT_ACCOUNT, true).payload.account.should.equal(DEFAULT_ACCOUNT);
			startSetAccountActive(DEFAULT_ACCOUNT, true).payload.active.should.equal(true);
		});
	});

	describe("startLoadAccountList()", () => {

		it("should generate an action with the correct type", () => {
			startLoadAccountList().type.should.equal(AccountActions.START_LOAD_ACCOUNT_LIST);
		});
	});

	describe("setDisplayActiveOnly()", () => {

		it("should generate an action with the correct type", () => {
			setDisplayActiveOnly(true).type.should.equal(AccountActions.SET_DISPLAY_ACTIVE_ONLY);
		});

		it("should add the value to the payload", () => {
			setDisplayActiveOnly(true).payload.should.have.keys("activeOnly");
			setDisplayActiveOnly(true).payload.activeOnly.should.equal(true);
		});
	});

	describe("setAccountToEdit()", () => {

		it("should generate an action with the correct type", () => {
			setAccountToEdit(DEFAULT_ACCOUNT).type.should.equal(AccountActions.SET_ACCOUNT_TO_EDIT);
		});

		it("should add the account to the payload", () => {
			setAccountToEdit(DEFAULT_ACCOUNT).payload.should.have.keys("account");
			setAccountToEdit(DEFAULT_ACCOUNT).payload.account.should.equal(DEFAULT_ACCOUNT);
		});
	});

	describe("setEditorBusy()", () => {

		it("should generate an action with the correct type", () => {
			setEditorBusy(true).type.should.equal(AccountActions.SET_EDITOR_BUSY);
		});

		it("should add the value to the payload", () => {
			setEditorBusy(true).payload.should.have.keys("editorBusy");
			setEditorBusy(true).payload.editorBusy.should.equal(true);
		});
	});

	describe("setAccountList()", () => {

		const accounts = [DEFAULT_ACCOUNT];

		it("should generate an action with the correct type", () => {
			setAccountList(accounts).type.should.equal(AccountActions.SET_ACCOUNT_LIST);
		});

		it("should add the accounts to the payload", () => {
			setAccountList(accounts).payload.should.have.keys("accountList");
			setAccountList(accounts).payload.accountList.should.equal(accounts);
		});
	});

	describe("addAccountEditInProgress()", () => {

		it("should generate an action with the correct type", () => {
			addAccountEditInProgress(DEFAULT_ACCOUNT).type.should.equal(AccountActions.ADD_ACCOUNT_EDIT_IN_PROGRESS);
		});

		it("should add the account to the payload", () => {
			addAccountEditInProgress(DEFAULT_ACCOUNT).payload.should.have.keys("account");
			addAccountEditInProgress(DEFAULT_ACCOUNT).payload.account.should.equal(DEFAULT_ACCOUNT);
		});
	});

	describe("startDeleteAccount()", () => {

		it("should generate an action with the correct type", () => {
			removeAccountEditInProgress(DEFAULT_ACCOUNT).type.should.equal(AccountActions.REMOVE_ACCOUNT_EDIT_IN_PROGRESS);
		});

		it("should add the account to the payload", () => {
			removeAccountEditInProgress(DEFAULT_ACCOUNT).payload.should.have.keys("account");
			removeAccountEditInProgress(DEFAULT_ACCOUNT).payload.account.should.equal(DEFAULT_ACCOUNT);
		});
	});

	// TODO: reducer

	// TODO: sagas
});
