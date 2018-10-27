import { faPencil, faPlus } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinBudget } from "../../../server/model-thins/ThinBudget";
import * as bs from "../../bootstrap-aliases";
import { formatBudgetPeriod, formatCurrencyStyled, generateBudgetTypeBadge } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { IRootState } from "../../redux/root";
import { setBudgetToEdit, setDisplayCurrentOnly, startDeleteBudget } from "../../redux/settings/budgets/actions";
import { CheckboxBtn } from "../_ui/CheckboxBtn/CheckboxBtn";
import { DataTable, IColumn } from "../_ui/DataTable/DataTable";
import { DeleteBtn } from "../_ui/DeleteBtn/DeleteBtn";
import { IconBtn } from "../_ui/IconBtn/IconBtn";
import * as appStyles from "../App/App.scss";
import { EditBudgetModal } from "./EditBudgetModal";

interface IBudgetSettingsProps {
	readonly lastUpdate: number;
	readonly displayCurrentOnly: boolean;
	readonly budgetToEdit?: ThinBudget;
	readonly actions?: {
		readonly deleteBudget: (id: string) => AnyAction,
		readonly setDisplayActiveOnly: (active: boolean) => AnyAction,
		readonly setBudgetToEdit: (budget: ThinBudget) => AnyAction,
	};
}

function mapStateToProps(state: IRootState, props: IBudgetSettingsProps): IBudgetSettingsProps {
	return {
		...props,
		lastUpdate: state.settings.budgets.lastUpdate,
		displayCurrentOnly: state.settings.budgets.displayCurrentOnly,
		budgetToEdit: state.settings.budgets.budgetToEdit,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IBudgetSettingsProps): IBudgetSettingsProps {
	return {
		...props,
		actions: {
			deleteBudget: (id) => dispatch(startDeleteBudget(id)),
			setDisplayActiveOnly: (active) => dispatch(setDisplayCurrentOnly(active)),
			setBudgetToEdit: (budget) => dispatch(setBudgetToEdit(budget)),
		},
	};
}

class UCBudgetSettings extends PureComponent<IBudgetSettingsProps> {

	private static currentOnlyStateFilter(state: IRootState) {
		return state.settings.budgets.displayCurrentOnly;
	}

	private tableColumns: IColumn[] = [
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

		this.tableRowRenderer = this.tableRowRenderer.bind(this);
		this.generateActionButtons = this.generateActionButtons.bind(this);
	}

	public render() {
		const { lastUpdate, budgetToEdit, displayCurrentOnly } = this.props;
		return (
				<>
					{budgetToEdit !== undefined && <EditBudgetModal/>}

					<div className={appStyles.headerWrapper}>
						<h1 className={combine(bs.h2, bs.floatLeft)}>Budgets</h1>
						<div className={combine(bs.btnGroup, bs.floatRight)}>
							<CheckboxBtn
									text={"Current Budgets Only"}
									stateFilter={UCBudgetSettings.currentOnlyStateFilter}
									stateModifier={this.props.actions.setDisplayActiveOnly}
									btnProps={{
										className: combine(bs.btnOutlineInfo, bs.btnSm),
									}}
							/>

							<IconBtn
									icon={faPlus}
									text={"New Budget"}
									btnProps={{
										className: combine(bs.btnSm, bs.btnSuccess),
										onClick: () => this.props.actions.setBudgetToEdit(null),
									}}
							/>
						</div>
					</div>

					<DataTable<ThinBudget>
							api={"/settings/budgets/table-data"}
							columns={this.tableColumns}
							rowRenderer={this.tableRowRenderer}
							apiExtraParams={{
								currentOnly: displayCurrentOnly,
								lastUpdate,
							}}
					/>
				</>
		);
	}

	private tableRowRenderer(budget: ThinBudget) {
		return (
				<tr key={budget.id}>
					<td>{budget.category.name}</td>
					<td>{generateBudgetTypeBadge(budget)}</td>
					<td>{formatBudgetPeriod(budget.startDate, budget.endDate)}</td>
					<td>{formatCurrencyStyled(budget.amount)}</td>
					<td>{this.generateActionButtons(budget)}</td>
				</tr>
		);
	}

	private generateActionButtons(budget: ThinBudget) {
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
}

export const BudgetSettings = connect(mapStateToProps, mapDispatchToProps)(UCBudgetSettings);
