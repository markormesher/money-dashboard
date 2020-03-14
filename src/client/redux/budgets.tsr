import axios from "axios";
import { Moment } from "moment";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { IBudget } from "../../commons/models/IBudget";
import { setError } from "./global";
import { CacheKeyUtil } from "./helpers/CacheKeyUtil";
import { PayloadAction } from "./helpers/PayloadAction";

interface IBudgetsState {
  readonly displayCurrentOnly: boolean;
  readonly budgetToEdit: IBudget;
  readonly budgetIdsToClone: string[];
  readonly budgetCloneInProgress: boolean;
  readonly editorBusy: boolean;
}

const initialState: IBudgetsState = {
  displayCurrentOnly: true,
  budgetToEdit: undefined,
  budgetIdsToClone: [],
  budgetCloneInProgress: false,
  editorBusy: false,
};

enum BudgetActions {
  START_DELETE_BUDGET = "BudgetActions.START_DELETE_BUDGET",
  START_SAVE_BUDGET = "BudgetActions.START_SAVE_BUDGET",
  START_CLONE_BUDGETS = "BudgetActions.START_CLONE_BUDGETS",

  SET_DISPLAY_CURRENT_ONLY = "BudgetActions.SET_DISPLAY_CURRENT_ONLY",
  SET_BUDGET_TO_EDIT = "BudgetActions.SET_BUDGET_TO_EDIT",
  SET_BUDGETS_TO_CLONE = "BudgetActions.SET_BUDGETS_TO_CLONE",
  TOGGLE_BUDGET_TO_CLONE = "BudgetActions.TOGGLE_BUDGET_TO_CLONE",
  SET_BUDGET_CLONE_IN_PROGRESS = "BudgetActions.SET_BUDGET_CLONE_IN_PROGRESS",
  SET_EDITOR_BUSY = "BudgetActions.SET_EDITOR_BUSY",
}

enum BudgetCacheKeys {
  BUDGET_DATA = "BudgetCacheKeys.BUDGET_DATA",
}

function startDeleteBudget(budget: IBudget): PayloadAction {
  return {
    type: BudgetActions.START_DELETE_BUDGET,
    payload: { budget },
  };
}

function startSaveBudget(budget: Partial<IBudget>): PayloadAction {
  return {
    type: BudgetActions.START_SAVE_BUDGET,
    payload: { budget },
  };
}

function startCloneBudgets(budgetIds: string[], startDate: Moment, endDate: Moment): PayloadAction {
  return {
    type: BudgetActions.START_CLONE_BUDGETS,
    payload: {
      budgetIds,
      startDate,
      endDate,
    },
  };
}

function setDisplayCurrentOnly(currentOnly: boolean): PayloadAction {
  return {
    type: BudgetActions.SET_DISPLAY_CURRENT_ONLY,
    payload: { currentOnly },
  };
}

function setBudgetToEdit(budget: IBudget): PayloadAction {
  return {
    type: BudgetActions.SET_BUDGET_TO_EDIT,
    payload: { budget },
  };
}

function setBudgetsToClone(budgetIds: string[]): PayloadAction {
  return {
    type: BudgetActions.SET_BUDGETS_TO_CLONE,
    payload: { budgetIds },
  };
}

function toggleBudgetToClone(budgetId: string): PayloadAction {
  return {
    type: BudgetActions.TOGGLE_BUDGET_TO_CLONE,
    payload: { budgetId },
  };
}

function setBudgetCloneInProgress(budgetCloneInProgress: boolean): PayloadAction {
  return {
    type: BudgetActions.SET_BUDGET_CLONE_IN_PROGRESS,
    payload: { budgetCloneInProgress },
  };
}

function setEditorBusy(editorBusy: boolean): PayloadAction {
  return {
    type: BudgetActions.SET_EDITOR_BUSY,
    payload: { editorBusy },
  };
}

function* deleteBudgetSaga(): Generator {
  yield takeEvery(BudgetActions.START_DELETE_BUDGET, function*(action: PayloadAction): Generator {
    try {
      const budget: IBudget = action.payload.budget;
      yield call(() => axios.post(`/api/budgets/delete/${budget.id}`).then((res) => res.data));
      yield put(CacheKeyUtil.updateKey(BudgetCacheKeys.BUDGET_DATA));
    } catch (err) {
      yield put(setError(err));
    }
  });
}

function* saveBudgetSaga(): Generator {
  yield takeEvery(BudgetActions.START_SAVE_BUDGET, function*(action: PayloadAction): Generator {
    try {
      const budget: Partial<IBudget> = action.payload.budget;
      const budgetId = budget.id || "";
      yield all([put(setEditorBusy(true)), call(() => axios.post(`/api/budgets/edit/${budgetId}`, budget))]);
      yield all([
        put(CacheKeyUtil.updateKey(BudgetCacheKeys.BUDGET_DATA)),
        put(setEditorBusy(false)),
        put(setBudgetToEdit(undefined)),
      ]);
    } catch (err) {
      yield put(setError(err));
    }
  });
}

function* cloneBudgetsSaga(): Generator {
  yield takeEvery(BudgetActions.START_CLONE_BUDGETS, function*(action: PayloadAction): Generator {
    try {
      const budgetIds: string[] = action.payload.budgetIds;
      const startDate: string = action.payload.startDate;
      const endDate: string = action.payload.endDate;
      yield all([
        put(setEditorBusy(true)),
        call(() =>
          axios.post("/api/budgets/clone", {
            budgetIds,
            startDate,
            endDate,
          }),
        ),
      ]);
      yield all([
        put(CacheKeyUtil.updateKey(BudgetCacheKeys.BUDGET_DATA)),
        put(setEditorBusy(false)),
        put(setBudgetCloneInProgress(false)),
        put(setBudgetsToClone([])),
      ]);
    } catch (err) {
      yield put(setError(err));
    }
  });
}

function* budgetsSagas(): Generator {
  yield all([deleteBudgetSaga(), saveBudgetSaga(), cloneBudgetsSaga()]);
}

function budgetsReducer(state = initialState, action: PayloadAction): IBudgetsState {
  switch (action.type) {
    case BudgetActions.SET_DISPLAY_CURRENT_ONLY:
      return {
        ...state,
        displayCurrentOnly: action.payload.currentOnly,
      };

    case BudgetActions.SET_BUDGET_TO_EDIT:
      return {
        ...state,
        budgetToEdit: action.payload.budget,
      };

    case BudgetActions.SET_BUDGETS_TO_CLONE:
      return {
        ...state,
        budgetIdsToClone: action.payload.budgetIds,
      };

    case BudgetActions.TOGGLE_BUDGET_TO_CLONE:
      return ((): IBudgetsState => {
        const budgetId = action.payload.budgetId as string;
        if (state.budgetIdsToClone.indexOf(budgetId) >= 0) {
          // remove
          const idx = state.budgetIdsToClone.indexOf(budgetId);
          const arrCopy = [...state.budgetIdsToClone];
          arrCopy.splice(idx, 1);
          return {
            ...state,
            budgetIdsToClone: arrCopy,
          };
        } else {
          // add
          const arrCopy = [...state.budgetIdsToClone];
          arrCopy.push(budgetId);
          return {
            ...state,
            budgetIdsToClone: arrCopy,
          };
        }
      })();

    case BudgetActions.SET_BUDGET_CLONE_IN_PROGRESS:
      return {
        ...state,
        budgetCloneInProgress: action.payload.budgetCloneInProgress,
      };

    case BudgetActions.SET_EDITOR_BUSY:
      return {
        ...state,
        editorBusy: action.payload.editorBusy,
      };

    default:
      return state;
  }
}

export {
  IBudgetsState,
  BudgetActions,
  BudgetCacheKeys,
  budgetsReducer,
  budgetsSagas,
  startDeleteBudget,
  startSaveBudget,
  startCloneBudgets,
  setDisplayCurrentOnly,
  setBudgetToEdit,
  setBudgetsToClone,
  toggleBudgetToClone,
  setBudgetCloneInProgress,
  setEditorBusy,
};
