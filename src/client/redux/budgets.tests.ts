import { expect } from "chai";
import { describe, it } from "mocha";
import { parseISO } from "date-fns";
import { DEFAULT_BUDGET } from "../../models/IBudget";
import {
  BudgetActions,
  budgetsReducer,
  IBudgetsState,
  setBudgetCloneInProgress,
  setBudgetsToClone,
  setBudgetToEdit,
  setDisplayCurrentOnly,
  setEditorBusy,
  startCloneBudgets,
  startDeleteBudget,
  startSaveBudget,
  toggleBudgetToClone,
} from "./budgets";

describe(__filename, () => {
  describe("startDeleteBudget()", () => {
    it("should generate an action with the correct type", () => {
      startDeleteBudget(DEFAULT_BUDGET).type.should.equal(BudgetActions.START_DELETE_BUDGET);
    });

    it("should add the budget to the payload", () => {
      startDeleteBudget(DEFAULT_BUDGET).payload.should.have.keys("budget");
      startDeleteBudget(DEFAULT_BUDGET).payload.budget.should.equal(DEFAULT_BUDGET);
    });
  });

  describe("startSaveBudget()", () => {
    it("should generate an action with the correct type", () => {
      startSaveBudget(DEFAULT_BUDGET).type.should.equal(BudgetActions.START_SAVE_BUDGET);
    });

    it("should add the budget to the payload", () => {
      startSaveBudget(DEFAULT_BUDGET).payload.should.have.keys("budget");
      startSaveBudget(DEFAULT_BUDGET).payload.budget.should.equal(DEFAULT_BUDGET);
    });
  });

  describe("startCloneBudgets()", () => {
    const ids = ["test-id"];
    const start = parseISO("2018-01-01").getTime();
    const end = parseISO("2018-01-02").getTime();

    it("should generate an action with the correct type", () => {
      startCloneBudgets(ids, start, end).type.should.equal(BudgetActions.START_CLONE_BUDGETS);
    });

    it("should add the budget IDs and dates to the payload", () => {
      startCloneBudgets(ids, start, end).payload.should.have.keys("budgetIds", "startDate", "endDate");
      startCloneBudgets(ids, start, end).payload.budgetIds.should.equal(ids);
      startCloneBudgets(ids, start, end).payload.startDate.should.equal(start);
      startCloneBudgets(ids, start, end).payload.endDate.should.equal(end);
    });
  });

  describe("setDisplayCurrentOnly()", () => {
    it("should generate an action with the correct type", () => {
      setDisplayCurrentOnly(true).type.should.equal(BudgetActions.SET_DISPLAY_CURRENT_ONLY);
    });

    it("should add the value to the payload", () => {
      setDisplayCurrentOnly(true).payload.should.have.keys("currentOnly");
      setDisplayCurrentOnly(true).payload.currentOnly.should.equal(true);
    });
  });

  describe("setBudgetToEdit()", () => {
    it("should generate an action with the correct type", () => {
      setBudgetToEdit(DEFAULT_BUDGET).type.should.equal(BudgetActions.SET_BUDGET_TO_EDIT);
    });

    it("should add the budget to the payload", () => {
      setBudgetToEdit(DEFAULT_BUDGET).payload.should.have.keys("budget");
      setBudgetToEdit(DEFAULT_BUDGET).payload.budget.should.equal(DEFAULT_BUDGET);
    });
  });

  describe("setBudgetsToClone()", () => {
    const ids = ["test-id"];

    it("should generate an action with the correct type", () => {
      setBudgetsToClone(ids).type.should.equal(BudgetActions.SET_BUDGETS_TO_CLONE);
    });

    it("should add the budget IDs to the payload", () => {
      setBudgetsToClone(ids).payload.should.have.keys("budgetIds");
      setBudgetsToClone(ids).payload.budgetIds.should.equal(ids);
    });
  });

  describe("toggleBudgetToClone()", () => {
    const id = "test-id";

    it("should generate an action with the correct type", () => {
      toggleBudgetToClone(id).type.should.equal(BudgetActions.TOGGLE_BUDGET_TO_CLONE);
    });

    it("should add the budget IDs to the payload", () => {
      toggleBudgetToClone(id).payload.should.have.keys("budgetId");
      toggleBudgetToClone(id).payload.budgetId.should.equal(id);
    });
  });

  describe("setBudgetCloneInProgress()", () => {
    it("should generate an action with the correct type", () => {
      setBudgetCloneInProgress(true).type.should.equal(BudgetActions.SET_BUDGET_CLONE_IN_PROGRESS);
    });

    it("should add the budget IDs to the payload", () => {
      setBudgetCloneInProgress(true).payload.should.have.keys("budgetCloneInProgress");
      setBudgetCloneInProgress(true).payload.budgetCloneInProgress.should.equal(true);
      setBudgetCloneInProgress(false).payload.budgetCloneInProgress.should.equal(false);
    });
  });

  describe("setEditorBusy()", () => {
    it("should generate an action with the correct type", () => {
      setEditorBusy(true).type.should.equal(BudgetActions.SET_EDITOR_BUSY);
    });

    it("should add the value to the payload", () => {
      setEditorBusy(true).payload.should.have.keys("editorBusy");
      setEditorBusy(true).payload.editorBusy.should.equal(true);
    });
  });

  describe("budgetsReducer()", () => {
    const initialState = budgetsReducer(undefined, { type: "@@INIT" });

    it("should initialise its state correctly", () => {
      budgetsReducer(undefined, { type: "@@INIT" }).should.deep.equal({
        displayCurrentOnly: true,
        budgetToEdit: undefined,
        budgetIdsToClone: [],
        budgetCloneInProgress: false,
        editorBusy: false,
      });
    });

    describe(BudgetActions.SET_DISPLAY_CURRENT_ONLY, () => {
      it("should set the current-only state", () => {
        budgetsReducer(undefined, setDisplayCurrentOnly(true)).displayCurrentOnly.should.equal(true);
        budgetsReducer(undefined, setDisplayCurrentOnly(false)).displayCurrentOnly.should.equal(false);
      });
    });

    describe(BudgetActions.SET_BUDGET_TO_EDIT, () => {
      it("should set the budget to edit", () => {
        expect(budgetsReducer(undefined, setBudgetToEdit(null)).budgetToEdit).to.equal(null);
        expect(budgetsReducer(undefined, setBudgetToEdit(undefined)).budgetToEdit).to.equal(undefined);
        budgetsReducer(undefined, setBudgetToEdit(DEFAULT_BUDGET)).budgetToEdit.should.equal(DEFAULT_BUDGET);
      });
    });

    describe(BudgetActions.SET_BUDGETS_TO_CLONE, () => {
      const budgetIds = ["id1", "id2"];

      it("should set the budget clone list", () => {
        expect(budgetsReducer(undefined, setBudgetsToClone(null)).budgetIdsToClone).to.equal(null);
        expect(budgetsReducer(undefined, setBudgetsToClone(budgetIds)).budgetIdsToClone).to.equal(budgetIds);
      });
    });

    describe(BudgetActions.TOGGLE_BUDGET_TO_CLONE, () => {
      it("should add the budget to an empty list", () => {
        const state = budgetsReducer(undefined, toggleBudgetToClone("id1"));
        state.budgetIdsToClone.should.have.all.members(["id1"]);
      });

      it("should add the budget to a non-empty list that doesn't already contain it", () => {
        let state: IBudgetsState = { ...initialState, budgetIdsToClone: ["id1"] };
        state = budgetsReducer(state, toggleBudgetToClone("id2"));
        state.budgetIdsToClone.should.have.all.members(["id1", "id2"]);
      });

      it("should remove the budget from a non-empty list that already contains it", () => {
        let state: IBudgetsState = { ...initialState, budgetIdsToClone: ["id1"] };
        state = budgetsReducer(state, toggleBudgetToClone("id1"));
        state.budgetIdsToClone.should.have.all.members([]);
      });
    });

    describe(BudgetActions.SET_BUDGET_CLONE_IN_PROGRESS, () => {
      it("should set the in-progress state", () => {
        budgetsReducer(undefined, setBudgetCloneInProgress(true)).budgetCloneInProgress.should.equal(true);
        budgetsReducer(undefined, setBudgetCloneInProgress(false)).budgetCloneInProgress.should.equal(false);
      });
    });

    describe(BudgetActions.SET_EDITOR_BUSY, () => {
      it("should set the editor-busy flag", () => {
        budgetsReducer(undefined, setEditorBusy(true)).editorBusy.should.equal(true);
        budgetsReducer(undefined, setEditorBusy(false)).editorBusy.should.equal(false);
      });
    });
  });

  // TODO: sagas
});
