import { faCopy, faPencil, faPlus } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { PureComponent, ReactElement, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { IBudget, mapBudgetFromApi } from "../../../server/models/IBudget";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { formatBudgetPeriod, formatCurrencyStyled, generateBudgetTypeBadge } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import {
	BudgetCacheKeys,
	setBudgetIdsToClone,
	setBudgetToEdit,
	setDisplayCurrentOnly,
	startDeleteBudget,
} from "../../redux/budgets";
import { KeyCache } from "../../redux/helpers/KeyCache";
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

interface IBudgetsPageProps {
	readonly cacheTime: number;
	readonly displayCurrentOnly: boolean;
	readonly budgetToEdit?: IBudget;
	readonly budgetIdsToClone?: string[];
	readonly actions?: {
		readonly deleteBudget: (id: string) => AnyAction,
		readonly setDisplayCurrentOnly: (active: boolean) => AnyAction,
		readonly setBudgetToEdit: (budget: IBudget) => AnyAction,
		readonly setBudgetIdsToClone: (budgetIds: string[]) => AnyAction,
	};
}

interface IBudgetsPageState {
	readonly selectedBudgetIds: string[];
}

function mapStateToProps(state: IRootState, props: IBudgetsPageProps): IBudgetsPageProps {
	return {
		...props,
		cacheTime: KeyCache.getKeyTime(BudgetCacheKeys.BUDGET_DATA),
		displayCurrentOnly: state.budgets.displayCurrentOnly,
		budgetToEdit: state.budgets.budgetToEdit,
		budgetIdsToClone: state.budgets.budgetIdsToClone,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IBudgetsPageProps): IBudgetsPageProps {
	return {
		...props,
		actions: {
			deleteBudget: (id) => dispatch(startDeleteBudget(id)),
			setDisplayCurrentOnly: (active) => dispatch(setDisplayCurrentOnly(active)),
			setBudgetToEdit: (budget) => dispatch(setBudgetToEdit(budget)),
			setBudgetIdsToClone: (budgetIds) => dispatch(setBudgetIdsToClone(budgetIds)),
		},
	};
}

class UCBudgetsPage extends PureComponent<IBudgetsPageProps, IBudgetsPageState> {

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
			"/budgets/table-data",
			() => ({
				cacheTime: this.props.cacheTime,
				currentOnly: this.props.displayCurrentOnly,
			}),
			mapBudgetFromApi,
	);

	constructor(props: IBudgetsPageProps) {
		super(props);
		this.state = {
			selectedBudgetIds: [],
		};

		this.tableRowRenderer = this.tableRowRenderer.bind(this);
		this.generateActionButtons = this.generateActionButtons.bind(this);
		this.startBudgetCreation = this.startBudgetCreation.bind(this);
		this.handleCloneCheckedChange = this.handleCloneCheckedChange.bind(this);
		this.startCloneOnSelectedBudgets = this.startCloneOnSelectedBudgets.bind(this);
	}

	public render(): ReactNode {
		const { cacheTime, budgetToEdit, budgetIdsToClone, displayCurrentOnly } = this.props;
		const { selectedBudgetIds } = this.state;

		return (
				<>
					{budgetToEdit !== undefined && <BudgetEditModal/>}
					{budgetIdsToClone && <BudgetCloneModal/>}

					<div className={gs.headerWrapper}>
						<h1 className={bs.h2}>Budgets</h1>
						<div className={combine(bs.btnGroup, gs.headerExtras)}>
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
										disabled: selectedBudgetIds.length === 0,
									}}
							/>

							<KeyShortcut
									targetStr={"c"}
									onTrigger={this.startBudgetCreation}
							>
								<IconBtn
										icon={faPlus}
										text={"New Budget"}
										onClick={this.startBudgetCreation}
										btnProps={{
											className: combine(bs.btnSm, bs.btnSuccess),
										}}
								/>
							</KeyShortcut>
						</div>
					</div>

					<DataTable<IBudget>
							columns={this.tableColumns}
							dataProvider={this.dataProvider}
							rowRenderer={this.tableRowRenderer}
							watchedProps={{ cacheTime, displayCurrentOnly }}
					/>
				</>
		);
	}

	private tableRowRenderer(budget: IBudget): ReactElement<void> {
		const { selectedBudgetIds } = this.state;
		const cloneId = `clone-${budget.id}`;
		return (
				<tr key={budget.id}>
					<td>
						<ControlledCheckboxInput
								id={cloneId}
								label={undefined}
								disabled={false}
								checked={selectedBudgetIds.indexOf(cloneId) >= 0}
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
							}}
					/>
					<DeleteBtn
							payload={budget.id}
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

	private handleCloneCheckedChange(checked: boolean, id: string): void {
		const original = this.state.selectedBudgetIds;
		if (checked) {
			this.setState({
				selectedBudgetIds: original.concat([id]),
			});
		} else {
			this.setState({
				selectedBudgetIds: original.filter((b) => b !== id),
			});
		}
	}

	private startCloneOnSelectedBudgets(): void {
		this.props.actions.setBudgetIdsToClone(this.state.selectedBudgetIds.map((b) => b.replace("clone-", "")));
	}
}

export const BudgetsPage = connect(mapStateToProps, mapDispatchToProps)(UCBudgetsPage);
