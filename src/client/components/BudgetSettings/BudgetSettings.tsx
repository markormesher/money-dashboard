import { faCopy, faPencil, faPlus } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { PureComponent, ReactElement, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinBudget } from "../../../server/model-thins/ThinBudget";
import * as bs from "../../bootstrap-aliases";
import { formatBudgetPeriod, formatCurrencyStyled, generateBudgetTypeBadge } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { IRootState } from "../../redux/root";
import {
	setBudgetIdsToClone,
	setBudgetToEdit,
	setDisplayCurrentOnly,
	startDeleteBudget,
} from "../../redux/settings/budgets/actions";
import { CheckboxBtn } from "../_ui/CheckboxBtn/CheckboxBtn";
import { ApiDataTableDataProvider } from "../_ui/DataTable/ApiDataTableDataProvider";
import { DataTable, IColumn } from "../_ui/DataTable/DataTable";
import { DeleteBtn } from "../_ui/DeleteBtn/DeleteBtn";
import { ControlledCheckboxInput } from "../_ui/FormComponents/ControlledCheckboxInput";
import { IconBtn } from "../_ui/IconBtn/IconBtn";
import * as appStyles from "../App/App.scss";
import { CloneBudgetModal } from "./CloneBudgetModal";
import { EditBudgetModal } from "./EditBudgetModal";

interface IBudgetSettingsProps {
	readonly lastUpdate: number;
	readonly displayCurrentOnly: boolean;
	readonly budgetToEdit?: ThinBudget;
	readonly budgetIdsToClone?: string[];
	readonly actions?: {
		readonly deleteBudget: (id: string) => AnyAction,
		readonly setDisplayCurrentOnly: (active: boolean) => AnyAction,
		readonly setBudgetToEdit: (budget: ThinBudget) => AnyAction,
		readonly setBudgetIdsToClone: (budgetIds: string[]) => AnyAction,
	};
}

interface IBudgetSettingsState {
	readonly selectedBudgetIds: string[];
}

function mapStateToProps(state: IRootState, props: IBudgetSettingsProps): IBudgetSettingsProps {
	return {
		...props,
		lastUpdate: state.settings.budgets.lastUpdate,
		displayCurrentOnly: state.settings.budgets.displayCurrentOnly,
		budgetToEdit: state.settings.budgets.budgetToEdit,
		budgetIdsToClone: state.settings.budgets.budgetIdsToClone,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IBudgetSettingsProps): IBudgetSettingsProps {
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

class UCBudgetSettings extends PureComponent<IBudgetSettingsProps, IBudgetSettingsState> {

	private tableColumns: IColumn[] = [
		{
			title: "",
			sortable: false,
		},
		{
			title: "Name",
			sortField: ["category", "name"],
			defaultSortDirection: "asc",
			defaultSortPriority: 1,
		},
		{ title: "Type", sortField: "type" },
		{
			title: "Period",
			sortField: "startDate",
			defaultSortDirection: "desc",
			defaultSortPriority: 0,
		},
		{ title: "Amount", sortField: "amount" },
		{ title: "Actions", sortable: false },
	];

	constructor(props: IBudgetSettingsProps) {
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
		const { lastUpdate, budgetToEdit, budgetIdsToClone, displayCurrentOnly } = this.props;
		const { selectedBudgetIds } = this.state;

		const dataProvider = new ApiDataTableDataProvider<ThinBudget>("/settings/budgets/table-data", {
			lastUpdate,
			currentOnly: displayCurrentOnly,
		});

		return (
				<>
					{budgetToEdit !== undefined && <EditBudgetModal/>}
					{budgetIdsToClone && <CloneBudgetModal/>}

					<div className={appStyles.headerWrapper}>
						<h1 className={combine(bs.h2, bs.floatLeft)}>Budgets</h1>
						<div className={combine(bs.btnGroup, bs.floatRight)}>
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

							<IconBtn
									icon={faPlus}
									text={"New Budget"}
									onClick={this.startBudgetCreation}
									btnProps={{
										className: combine(bs.btnSm, bs.btnSuccess),
									}}
							/>
						</div>
					</div>

					<DataTable<ThinBudget>
							columns={this.tableColumns}
							dataProvider={dataProvider}
							rowRenderer={this.tableRowRenderer}
							watchedProps={{ displayCurrentOnly, lastUpdate }}
					/>
				</>
		);
	}

	private tableRowRenderer(budget: ThinBudget): ReactElement<void> {
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

	private generateActionButtons(budget: ThinBudget): ReactElement<void> {
		return (
				<div className={combine(bs.btnGroup, bs.btnGroupSm)}>
					<IconBtn
							icon={faPencil}
							text={"Edit"}
							payload={budget}
							onClick={this.props.actions.setBudgetToEdit}
							btnProps={{
								className: combine(bs.btnOutlineDark, appStyles.btnMini),
							}}
					/>
					<DeleteBtn
							payload={budget.id}
							onConfirmedClick={this.props.actions.deleteBudget}
							btnProps={{
								className: combine(bs.btnOutlineDark, appStyles.btnMini),
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

export const BudgetSettings = connect(mapStateToProps, mapDispatchToProps)(UCBudgetSettings);
