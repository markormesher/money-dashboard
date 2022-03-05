import { describe, it } from "mocha";
import { DEFAULT_ACCOUNT } from "../../models/IAccount";
import { IAccountBalance } from "../../models/IAccountBalance";
import { DEFAULT_BUDGET } from "../../models/IBudget";
import { IBudgetBalance } from "../../models/IBudgetBalance";
import { DEFAULT_CATEGORY } from "../../models/ICategory";
import { ICategoryBalance } from "../../models/ICategoryBalance";
import { IAccountBalanceUpdate } from "../../models/IAccountBalanceUpdate";
import {
  DashboardActions,
  dashboardReducer,
  setAccountBalances,
  setBudgetBalances,
  setMemoCategoryBalances,
  startLoadAccountBalances,
  startLoadBudgetBalances,
  startLoadMemoCategoryBalances,
  setAssetBalanceToUpdate,
  setAssetBalanceUpdateEditorBusy,
  setAssetBalanceUpdateError,
  startSaveAssetBalanceUpdate,
} from "./dashboard";

describe(__filename, () => {
  describe("startLoadAccountBalances()", () => {
    it("should generate an action with the correct type", () => {
      startLoadAccountBalances().type.should.equal(DashboardActions.START_LOAD_ACCOUNT_BALANCES);
    });
  });

  describe("startLoadBudgetBalances()", () => {
    it("should generate an action with the correct type", () => {
      startLoadBudgetBalances().type.should.equal(DashboardActions.START_LOAD_BUDGET_BALANCES);
    });
  });

  describe("startLoadMemoCategoryBalances()", () => {
    it("should generate an action with the correct type", () => {
      startLoadMemoCategoryBalances().type.should.equal(DashboardActions.START_LOAD_MEMO_CATEGORY_BALANCES);
    });
  });

  describe("startSaveAssetBalanceUpdate()", () => {
    const assetBalanceUpdate: IAccountBalanceUpdate = {
      account: DEFAULT_ACCOUNT,
      balance: 0,
      updateDate: 0,
    };

    it("should generate an action with the correct type", () => {
      startSaveAssetBalanceUpdate(assetBalanceUpdate).type.should.equal(
        DashboardActions.START_SAVE_ASSET_BALANCE_UPDATE,
      );
    });

    it("should add the balance to the payload", () => {
      startSaveAssetBalanceUpdate(assetBalanceUpdate).payload.should.have.keys("assetBalanceUpdate");
      startSaveAssetBalanceUpdate(assetBalanceUpdate).payload.assetBalanceUpdate.should.equal(assetBalanceUpdate);
    });
  });

  describe("setAccountBalances()", () => {
    const accountBalances = [
      {
        account: DEFAULT_ACCOUNT,
        balance: 0,
      },
    ];

    it("should generate an action with the correct type", () => {
      setAccountBalances(accountBalances).type.should.equal(DashboardActions.SET_ACCOUNT_BALANCES);
    });

    it("should add the balances to the payload", () => {
      setAccountBalances(accountBalances).payload.should.have.keys("accountBalances");
      setAccountBalances(accountBalances).payload.accountBalances.should.equal(accountBalances);
    });
  });

  describe("setBudgetBalances()", () => {
    const budgetBalances = [
      {
        budget: DEFAULT_BUDGET,
        balance: 0,
      },
    ];

    it("should generate an action with the correct type", () => {
      setBudgetBalances(budgetBalances).type.should.equal(DashboardActions.SET_BUDGET_BALANCES);
    });

    it("should add the balances to the payload", () => {
      setBudgetBalances(budgetBalances).payload.should.have.keys("budgetBalances");
      setBudgetBalances(budgetBalances).payload.budgetBalances.should.equal(budgetBalances);
    });
  });

  describe("setMemoCategoryBalances()", () => {
    const categoryBalances = [
      {
        category: DEFAULT_CATEGORY,
        balance: 0,
      },
    ];

    it("should generate an action with the correct type", () => {
      setMemoCategoryBalances(categoryBalances).type.should.equal(DashboardActions.SET_MEMO_CATEGORY_BALANCES);
    });

    it("should add the balances to the payload", () => {
      setMemoCategoryBalances(categoryBalances).payload.should.have.keys("memoCategoryBalances");
      setMemoCategoryBalances(categoryBalances).payload.memoCategoryBalances.should.equal(categoryBalances);
    });
  });

  describe("setAssetBalanceToUpdate()", () => {
    const assetBalance: IAccountBalance = {
      account: DEFAULT_ACCOUNT,
      balance: 0,
    };

    it("should generate an action with the correct type", () => {
      setAssetBalanceToUpdate(assetBalance).type.should.equal(DashboardActions.SET_ASSET_BALANCE_TO_UPDATE);
    });

    it("should add the balance to the payload", () => {
      setAssetBalanceToUpdate(assetBalance).payload.should.have.keys("assetBalance");
      setAssetBalanceToUpdate(assetBalance).payload.assetBalance.should.equal(assetBalance);
    });
  });

  describe("setAssetBalanceUpdateEditorBusy()", () => {
    it("should generate an action with the correct type", () => {
      setAssetBalanceUpdateEditorBusy(true).type.should.equal(DashboardActions.SET_ASSET_BALANCE_UPDATE_EDITOR_BUSY);
    });

    it("should add the state to the payload", () => {
      setAssetBalanceUpdateEditorBusy(true).payload.should.have.keys("busy");
      setAssetBalanceUpdateEditorBusy(true).payload.busy.should.equal(true);
    });
  });

  describe("setAssetBalanceUpdateError()", () => {
    it("should generate an action with the correct type", () => {
      setAssetBalanceUpdateError("oops").type.should.equal(DashboardActions.SET_ASSET_BALANCE_UPDATE_ERROR);
    });

    it("should add the error to the payload", () => {
      setAssetBalanceUpdateError("oops").payload.should.have.keys("error");
      setAssetBalanceUpdateError("oops").payload.error.should.equal("oops");
    });
  });

  describe("dashboardReducer()", () => {
    it("should initialise its state correctly", () => {
      dashboardReducer(undefined, { type: "@@INIT" }).should.deep.equal({
        accountBalances: undefined,
        budgetBalances: undefined,
        memoCategoryBalances: undefined,
        assetBalanceToUpdate: undefined,
        assetBalanceUpdateEditorBusy: false,
        assetBalanceUpdateError: undefined,
      });
    });

    describe(DashboardActions.SET_ACCOUNT_BALANCES, () => {
      const accountBalances: IAccountBalance[] = [{ account: DEFAULT_ACCOUNT, balance: 0 }];

      it("should set the account balances", () => {
        dashboardReducer(undefined, setAccountBalances(accountBalances)).accountBalances.should.equal(accountBalances);
      });
    });

    describe(DashboardActions.SET_BUDGET_BALANCES, () => {
      const budgetBalances: IBudgetBalance[] = [{ budget: DEFAULT_BUDGET, balance: 0 }];

      it("should set the budget balances", () => {
        dashboardReducer(undefined, setBudgetBalances(budgetBalances)).budgetBalances.should.equal(budgetBalances);
      });
    });

    describe(DashboardActions.SET_MEMO_CATEGORY_BALANCES, () => {
      const categoryBalances: ICategoryBalance[] = [{ category: DEFAULT_CATEGORY, balance: 0 }];

      it("should set the memo category balances", () => {
        dashboardReducer(undefined, setMemoCategoryBalances(categoryBalances)).memoCategoryBalances.should.equal(
          categoryBalances,
        );
      });
    });

    describe(DashboardActions.SET_ASSET_BALANCE_TO_UPDATE, () => {
      const assetBalance: IAccountBalance = {
        account: DEFAULT_ACCOUNT,
        balance: 0,
      };

      it("should set the asset balance", () => {
        dashboardReducer(undefined, setAssetBalanceToUpdate(assetBalance)).assetBalanceToUpdate.should.equal(
          assetBalance,
        );
      });
    });

    describe(DashboardActions.SET_ASSET_BALANCE_UPDATE_EDITOR_BUSY, () => {
      it("should set the state", () => {
        dashboardReducer(undefined, setAssetBalanceUpdateEditorBusy(true)).assetBalanceUpdateEditorBusy.should.equal(
          true,
        );
      });
    });

    describe(DashboardActions.SET_ASSET_BALANCE_UPDATE_ERROR, () => {
      it("should set the error", () => {
        dashboardReducer(undefined, setAssetBalanceUpdateError("oops")).assetBalanceUpdateError.should.equal("oops");
      });
    });
  });

  // TODO: sagas
});
