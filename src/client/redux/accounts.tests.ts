import { expect } from "chai";
import { describe, it } from "mocha";
import { DEFAULT_ACCOUNT, IAccount } from "../../commons/models/IAccount";
import {
	AccountActions,
	accountsReducer,
	addAccountEditInProgress,
	IAccountsState,
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

	describe("accountsReducer()", () => {

		const initialState = accountsReducer(undefined, { type: "@@INIT" });

		it("should initialise its state correctly", () => {
			accountsReducer(undefined, { type: "@@INIT" }).should.deep.equal({
				displayActiveOnly: true,
				accountToEdit: undefined,
				editorBusy: false,
				accountList: undefined,
				accountEditsInProgress: [],
			});
		});

		describe(AccountActions.SET_DISPLAY_ACTIVE_ONLY, () => {

			it("should set the active-only state", () => {
				accountsReducer(undefined, setDisplayActiveOnly(true)).displayActiveOnly.should.equal(true);
				accountsReducer(undefined, setDisplayActiveOnly(false)).displayActiveOnly.should.equal(false);
			});
		});

		describe(AccountActions.SET_ACCOUNT_TO_EDIT, () => {

			it("should set the account to edit", () => {
				expect(accountsReducer(undefined, setAccountToEdit(null)).accountToEdit).to.equal(null);
				expect(accountsReducer(undefined, setAccountToEdit(undefined)).accountToEdit).to.equal(undefined);
				accountsReducer(undefined, setAccountToEdit(DEFAULT_ACCOUNT)).accountToEdit.should.equal(DEFAULT_ACCOUNT);
			});
		});

		describe(AccountActions.SET_EDITOR_BUSY, () => {

			it("should set the editor-busy flag", () => {
				accountsReducer(undefined, setEditorBusy(true)).editorBusy.should.equal(true);
				accountsReducer(undefined, setEditorBusy(false)).editorBusy.should.equal(false);
			});
		});

		describe(AccountActions.SET_ACCOUNT_LIST, () => {

			const accountList = [DEFAULT_ACCOUNT];

			it("should set the account list", () => {
				accountsReducer(undefined, setAccountList(accountList)).accountList.should.equal(accountList);
			});
		});

		describe(AccountActions.ADD_ACCOUNT_EDIT_IN_PROGRESS, () => {

			const acc1: IAccount = { ...DEFAULT_ACCOUNT, id: "id1" };
			const acc2: IAccount = { ...DEFAULT_ACCOUNT, id: "id2" };

			it("should add the account to an empty list", () => {
				const state = accountsReducer(undefined, addAccountEditInProgress(acc1));
				state.accountEditsInProgress.should.have.all.members([acc1]);
			});

			it("should add the account to a non-empty list", () => {
				let state: IAccountsState = { ...initialState, accountEditsInProgress: [acc1] };
				state = accountsReducer(state, addAccountEditInProgress(acc2));
				state.accountEditsInProgress.should.have.all.members([acc1, acc2]);
			});

			it("should allow duplicate accounts", () => {
				let state = accountsReducer(undefined, addAccountEditInProgress(acc1));
				state = accountsReducer(state, addAccountEditInProgress(acc1));
				state.accountEditsInProgress.should.have.all.members([acc1, acc1]);
			});
		});

		describe(AccountActions.REMOVE_ACCOUNT_EDIT_IN_PROGRESS, () => {

			const acc1: IAccount = { ...DEFAULT_ACCOUNT, id: "id1" };
			const acc2: IAccount = { ...DEFAULT_ACCOUNT, id: "id2" };

			it("should do nothing to an empty list", () => {
				let state: IAccountsState = { ...initialState, accountEditsInProgress: [] };
				state = accountsReducer(state, removeAccountEditInProgress(acc1));
				state.accountEditsInProgress.should.have.all.members([]);
			});

			it("should do nothing to a list containing no matches", () => {
				let state: IAccountsState = { ...initialState, accountEditsInProgress: [acc1] };
				state = accountsReducer(state, removeAccountEditInProgress(acc2));
				state.accountEditsInProgress.should.have.all.members([acc1]);
			});

			it("should remove a matching account when it is the only account", () => {
				let state: IAccountsState = { ...initialState, accountEditsInProgress: [acc1] };
				state = accountsReducer(state, removeAccountEditInProgress(acc1));
				state.accountEditsInProgress.should.have.all.members([]);
			});

			it("should remove a matching account when it is not the only account", () => {
				let state: IAccountsState = { ...initialState, accountEditsInProgress: [acc1, acc2] };
				state = accountsReducer(state, removeAccountEditInProgress(acc1));
				state.accountEditsInProgress.should.have.all.members([acc2]);
			});

			it("should remove only one matching account when duplicates exist", () => {
				let state: IAccountsState = { ...initialState, accountEditsInProgress: [acc1, acc1] };
				state = accountsReducer(state, removeAccountEditInProgress(acc1));
				state.accountEditsInProgress.should.have.all.members([acc1]);
			});
		});
	});

	// TODO: sagas
});
