import { faPencil, faPlus } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinBudget } from "../../../server/model-thins/ThinBudget";
import * as bs from "../../bootstrap-aliases";
import { formatBudgetPeriod, formatCurrencyStyled, generateBudgetTypeBadge } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { IRootState } from "../../redux/root";
import { setDisplayCurrentOnly, startDeleteBudget } from "../../redux/settings/budgets/actions";
import CheckboxBtn from "../_ui/CheckboxBtn/CheckboxBtn";
import { DataTable, IColumn } from "../_ui/DataTable/DataTable";
import DeleteBtn from "../_ui/DeleteBtn/DeleteBtn";
import IconBtn from "../_ui/IconBtn/IconBtn";
import * as appStyles from "../App/App.scss";

interface IBudgetSettingsProps {
	lastUpdate: number;
	displayCurrentOnly: boolean;
	actions?: {
		deleteBudget: (id: string) => AnyAction,
		setDisplayActiveOnly: (active: boolean) => AnyAction,
	};
}

function mapStateToProps(state: IRootState, props: IBudgetSettingsProps): IBudgetSettingsProps {
	return {
		...props,
		...state.settings.budgets,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IBudgetSettingsProps): IBudgetSettingsProps {
	return {
		...props,
		actions: {
			deleteBudget: (id) => dispatch(startDeleteBudget(id)),
			setDisplayActiveOnly: (active) => dispatch(setDisplayCurrentOnly(active)),
		},
	};
}

class BudgetSettings extends Component<IBudgetSettingsProps> {

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
		const { lastUpdate, displayCurrentOnly } = this.props;
		return (
				<>
					<div className={appStyles.headerWrapper}>
						<h1 className={combine(bs.h2, bs.floatLeft)}>Budgets</h1>
						<div className={combine(bs.btnGroup, bs.floatRight)}>
							<CheckboxBtn
									text={"Current Budgets Only"}
									stateFilter={(state) => state.settings.budgets.displayCurrentOnly}
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
							btnProps={{
								className: combine(bs.btnOutlineDark, appStyles.btnMini),
							}}
					/>
					<DeleteBtn
							onConfirmedClick={() => this.props.actions.deleteBudget(budget.id)}
							btnProps={{
								className: combine(bs.btnOutlineDark, appStyles.btnMini),
							}}
					/>
				</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(BudgetSettings);
