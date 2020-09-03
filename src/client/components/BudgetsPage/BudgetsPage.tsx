import { faCopy, faPencil, faPlus } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { PureComponent, ReactElement, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { CacheKeyUtil } from "@dragonlabs/redux-cache-key-util";
import { IBudget, mapBudgetFromApi } from "../../../commons/models/IBudget";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { formatBudgetPeriod, formatCurrencyStyled, generateBudgetTypeBadge } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import {
  BudgetCacheKeys,
  setBudgetCloneInProgress,
  setBudgetToEdit,
  setDisplayCurrentOnly,
  startDeleteBudget,
  toggleBudgetToClone,
} from "../../redux/budgets";
import { IRootState } from "../../redux/root";
import { CheckboxBtn } from "../_ui/CheckboxBtn/CheckboxBtn";
import { ControlledCheckboxInput } from "../_ui/ControlledInputs/ControlledCheckboxInput";
import { ApiDataTableDataProvider } from "../_ui/DataTable/DataProvider/ApiDataTableDataProvider";
import { DataTable, IColumn } from "../_ui/DataTable/DataTable";
import { DeleteBtn } from "../_ui/DeleteBtn/DeleteBtn";
import { IconBtn } from "../_ui/IconBtn/IconBtn";
import { KeyShortcut } from "../_ui/KeyShortcut/KeyShortcut";
import { BudgetCloneModal } from "../BudgetCloneModal/BudgetCloneModal";
import { BudgetEditModal } from "../BudgetEditModal/BudgetEditModal";
import { PageHeader, PageHeaderActions } from "../_ui/PageHeader/PageHeader";
import { PageOptions } from "../_ui/PageOptions/PageOptions";
import { Card } from "../_ui/Card/Card";

interface IBudgetsPageProps {
  readonly cacheTime: number;
  readonly displayCurrentOnly: boolean;
  readonly budgetToEdit?: IBudget;
  readonly budgetIdsToClone?: string[];
  readonly budgetCloneInProgress?: boolean;
  readonly actions?: {
    readonly deleteBudget: (budget: IBudget) => AnyAction;
    readonly setDisplayCurrentOnly: (active: boolean) => AnyAction;
    readonly setBudgetToEdit: (budget: IBudget) => AnyAction;
    readonly toggleBudgetToClone: (budgetId: string) => AnyAction;
    readonly setBudgetCloneInProgress: (inProgress: boolean) => AnyAction;
  };
}

function mapStateToProps(state: IRootState, props: IBudgetsPageProps): IBudgetsPageProps {
  return {
    ...props,
    cacheTime: CacheKeyUtil.getKeyTime(BudgetCacheKeys.BUDGET_DATA),
    displayCurrentOnly: state.budgets.displayCurrentOnly,
    budgetToEdit: state.budgets.budgetToEdit,
    budgetIdsToClone: state.budgets.budgetIdsToClone,
    budgetCloneInProgress: state.budgets.budgetCloneInProgress,
  };
}

function mapDispatchToProps(dispatch: Dispatch, props: IBudgetsPageProps): IBudgetsPageProps {
  return {
    ...props,
    actions: {
      deleteBudget: (budget): AnyAction => dispatch(startDeleteBudget(budget)),
      setDisplayCurrentOnly: (active): AnyAction => dispatch(setDisplayCurrentOnly(active)),
      setBudgetToEdit: (budget): AnyAction => dispatch(setBudgetToEdit(budget)),
      toggleBudgetToClone: (budgetId): AnyAction => dispatch(toggleBudgetToClone(budgetId)),
      setBudgetCloneInProgress: (inProgress): AnyAction => dispatch(setBudgetCloneInProgress(inProgress)),
    },
  };
}

class UCBudgetsPage extends PureComponent<IBudgetsPageProps> {
  private tableColumns: IColumn[] = [
    {
      title: "",
      sortable: false,
    },
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
  ];

  private dataProvider = new ApiDataTableDataProvider<IBudget>(
    "/api/budgets/table-data",
    () => ({
      cacheTime: this.props.cacheTime,
      currentOnly: this.props.displayCurrentOnly,
    }),
    mapBudgetFromApi,
  );

  constructor(props: IBudgetsPageProps) {
    super(props);

    this.tableRowRenderer = this.tableRowRenderer.bind(this);
    this.generateActionButtons = this.generateActionButtons.bind(this);
    this.startBudgetCreation = this.startBudgetCreation.bind(this);
    this.handleCloneCheckedChange = this.handleCloneCheckedChange.bind(this);
    this.startCloneOnSelectedBudgets = this.startCloneOnSelectedBudgets.bind(this);
  }

  public render(): ReactNode {
    const { cacheTime, budgetToEdit, budgetIdsToClone, budgetCloneInProgress, displayCurrentOnly } = this.props;

    return (
      <>
        {budgetToEdit !== undefined && <BudgetEditModal />}
        {budgetCloneInProgress && <BudgetCloneModal />}

        <PageHeader>
          <h2>Budgets</h2>
          <PageHeaderActions>
            <KeyShortcut targetStr={"c"} onTrigger={this.startBudgetCreation}>
              <IconBtn
                icon={faPlus}
                text={"New Budget"}
                onClick={this.startBudgetCreation}
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
            checked={this.props.displayCurrentOnly}
            onChange={this.props.actions.setDisplayCurrentOnly}
            btnProps={{
              className: combine(bs.btnOutlineInfo, bs.btnSm),
            }}
          />

          <IconBtn
            icon={faCopy}
            text={"Clone Selected"}
            onClick={this.startCloneOnSelectedBudgets}
            btnProps={{
              className: combine(bs.btnSm, bs.btnOutlineInfo),
              disabled: budgetIdsToClone.length === 0,
            }}
          />
        </PageOptions>

        <Card>
          <DataTable<IBudget>
            columns={this.tableColumns}
            dataProvider={this.dataProvider}
            rowRenderer={this.tableRowRenderer}
            watchedProps={{ cacheTime, displayCurrentOnly }}
          />
        </Card>
      </>
    );
  }

  private tableRowRenderer(budget: IBudget): ReactElement<void> {
    const { budgetIdsToClone } = this.props;
    return (
      <tr key={budget.id}>
        <td>
          <ControlledCheckboxInput
            id={budget.id}
            label={undefined}
            disabled={false}
            checked={budgetIdsToClone.indexOf(budget.id) >= 0}
            onCheckedChange={this.handleCloneCheckedChange}
          />
        </td>
        <td>{budget.category.name}</td>
        <td>{generateBudgetTypeBadge(budget)}</td>
        <td>{formatBudgetPeriod(budget.startDate, budget.endDate)}</td>
        <td>{formatCurrencyStyled(budget.amount)}</td>
        <td>{this.generateActionButtons(budget)}</td>
      </tr>
    );
  }

  private generateActionButtons(budget: IBudget): ReactElement<void> {
    return (
      <div className={combine(bs.btnGroup, bs.btnGroupSm)}>
        <IconBtn
          icon={faPencil}
          text={"Edit"}
          payload={budget}
          onClick={this.props.actions.setBudgetToEdit}
          btnProps={{
            className: combine(bs.btnOutlineDark, gs.btnMini),
            disabled: budget.category.deleted,
          }}
        />
        <DeleteBtn
          payload={budget}
          onConfirmedClick={this.props.actions.deleteBudget}
          btnProps={{
            className: combine(bs.btnOutlineDark, gs.btnMini),
          }}
        />
      </div>
    );
  }

  private startBudgetCreation(): void {
    this.props.actions.setBudgetToEdit(null);
  }

  private handleCloneCheckedChange(_: boolean, id: string): void {
    this.props.actions.toggleBudgetToClone(id);
  }

  private startCloneOnSelectedBudgets(): void {
    this.props.actions.setBudgetCloneInProgress(true);
  }
}

export const BudgetsPage = connect(mapStateToProps, mapDispatchToProps)(UCBudgetsPage);
