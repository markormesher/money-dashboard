import * as React from "react";
import { ReactElement, useState } from "react";
import { DEFAULT_BUDGET, IBudget, mapBudgetFromApi } from "../../../models/IBudget";
import * as bs from "../../global-styles/Bootstrap.scss";
import { formatBudgetPeriod, formatCurrencyStyled, generateBudgetTypeBadge } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { CheckboxBtn } from "../_ui/CheckboxBtn/CheckboxBtn";
import { ControlledCheckboxInput } from "../_ui/ControlledInputs/ControlledCheckboxInput";
import { ApiDataTableDataProvider } from "../_ui/DataTable/DataProvider/ApiDataTableDataProvider";
import { DataTable, Column } from "../_ui/DataTable/DataTable";
import { DeleteBtn } from "../_ui/DeleteBtn/DeleteBtn";
import { IconBtn } from "../_ui/IconBtn/IconBtn";
import { KeyShortcut } from "../_ui/KeyShortcut/KeyShortcut";
import { BudgetEditModal } from "../BudgetEditModal/BudgetEditModal";
import { PageHeader, PageHeaderActions } from "../_ui/PageHeader/PageHeader";
import { PageOptions } from "../_ui/PageOptions/PageOptions";
import { Card } from "../_ui/Card/Card";
import { globalErrorManager } from "../../helpers/errors/error-manager";
import { useNonceState } from "../../helpers/state-hooks";
import { BudgetApi } from "../../api/budgets";
import { BudgetCloneModal } from "../BudgetCloneModal/BudgetCloneModal";

function BudgetsPage(): ReactElement {
  // state
  const [nonce, updateNonce] = useNonceState();
  const [budgetToEdit, setBudgetToEdit] = useState<IBudget>();
  const [showCurrentOnly, setShowCurrentOnly] = useState(true);
  const [budgetIdsToClone, setBudgetIdToClone] = useState<string[]>([]);
  const [showCloneModal, setShowCloneModal] = useState(false);

  // data table
  const tableColumns: Column[] = [
    {
      title: "Name",
      sortField: "category.name",
      defaultSortDirection: "ASC",
      defaultSortPriority: 1,
    },
    {
      title: "Type",
      sortField: "budget.type",
    },
    {
      title: "Period",
      sortField: "budget.startDate",
      defaultSortDirection: "DESC",
      defaultSortPriority: 0,
    },
    {
      title: "Amount",
      sortField: "budget.amount",
    },
    {
      title: "Actions",
      sortable: false,
    },
    {
      title: "Clone",
      sortable: false,
    },
  ];

  const dataProvider = new ApiDataTableDataProvider<IBudget>(
    "/api/budgets/table-data",
    () => ({
      nonce,
      currentOnly: showCurrentOnly,
    }),
    mapBudgetFromApi,
  );

  function tableRowRenderer(budget: IBudget): ReactElement<void> {
    return (
      <tr key={budget.id}>
        <td>{budget.category.name}</td>
        <td>{generateBudgetTypeBadge(budget)}</td>
        <td>{formatBudgetPeriod(budget.startDate, budget.endDate)}</td>
        <td>{formatCurrencyStyled(budget.amount)}</td>
        <td>{generateActionButtons(budget)}</td>
        <td className={bs.textCenter}>
          <ControlledCheckboxInput
            id={budget.id}
            label={undefined}
            disabled={false}
            checked={budgetIdsToClone.includes(budget.id)}
            onCheckedChange={handleCloneCheckedChange}
          />
        </td>
      </tr>
    );
  }

  function generateActionButtons(budget: IBudget): ReactElement<void> {
    return (
      <div className={combine(bs.btnGroup, bs.btnGroupSm)}>
        <IconBtn
          icon={"edit"}
          text={"Edit"}
          payload={budget}
          onClick={editBudget}
          btnProps={{
            className: bs.btnOutlineDark,
            disabled: budget.category.deleted,
          }}
        />
        <DeleteBtn
          payload={budget}
          onConfirmedClick={deleteBudget}
          btnProps={{
            className: bs.btnOutlineDark,
          }}
        />
      </div>
    );
  }

  // budget actions
  function createBudget(): void {
    setBudgetToEdit(DEFAULT_BUDGET);
  }

  function editBudget(budget?: IBudget): void {
    setBudgetToEdit(budget);
  }

  function onEditCancel(): void {
    setBudgetToEdit(undefined);
  }

  function onEditComplete(): void {
    setBudgetToEdit(undefined);
    updateNonce();
  }

  function onCloneCancel(): void {
    setShowCloneModal(false);
  }

  function onCloneComplete(): void {
    setShowCloneModal(false);
    setBudgetIdToClone([]);
    updateNonce();
  }

  async function deleteBudget(budget?: IBudget): Promise<void> {
    if (!budget) {
      return;
    }

    try {
      await BudgetApi.deleteBudget(budget);
      updateNonce();
    } catch (error) {
      globalErrorManager.emitNonFatalError("Failed to delete budget", error);
    }
  }

  function handleCloneCheckedChange(checked: boolean, id: string): void {
    if (checked) {
      setBudgetIdToClone([...budgetIdsToClone, id]);
    } else {
      setBudgetIdToClone(budgetIdsToClone.filter((i) => i != id));
    }
  }

  return (
    <>
      {budgetToEdit ? (
        <BudgetEditModal budgetToEdit={budgetToEdit} onCancel={onEditCancel} onComplete={onEditComplete} />
      ) : null}

      {showCloneModal && budgetIdsToClone.length > 0 ? (
        <BudgetCloneModal budgetsToClone={budgetIdsToClone} onCancel={onCloneCancel} onComplete={onCloneComplete} />
      ) : null}

      <PageHeader>
        <h2>Budgets</h2>
        <PageHeaderActions>
          <IconBtn
            icon={"content_copy"}
            text={"Clone Selected"}
            onClick={() => setShowCloneModal(true)}
            btnProps={{
              className: combine(bs.btnSm, bs.btnOutlineInfo),
              disabled: budgetIdsToClone.length === 0,
            }}
          />

          <KeyShortcut targetStr={"c"} onTrigger={createBudget}>
            <IconBtn
              icon={"add"}
              text={"New Budget"}
              onClick={createBudget}
              btnProps={{
                className: combine(bs.btnSm, bs.btnSuccess),
              }}
            />
          </KeyShortcut>
        </PageHeaderActions>
      </PageHeader>

      <PageOptions>
        <CheckboxBtn
          text={"Current Budgets Only"}
          checked={showCurrentOnly}
          onChange={(checked) => setShowCurrentOnly(checked)}
          btnProps={{
            className: combine(bs.btnOutlineInfo, bs.btnSm),
          }}
        />
      </PageOptions>

      <Card>
        <DataTable<IBudget>
          columns={tableColumns}
          dataProvider={dataProvider}
          rowRenderer={tableRowRenderer}
          watchedProps={{ nonce, showCurrentOnly }}
        />
      </Card>
    </>
  );
}

export { BudgetsPage };
