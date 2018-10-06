import { faPencil } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinBudget } from "../../../../server/model-thins/ThinBudget";
import * as bs from "../../../bootstrap-aliases";
import { formatBudgetPeriod, formatCurrencyStyled, generateBudgetTypeBadge } from "../../../helpers/formatters";
import { combine } from "../../../helpers/style-helpers";
import { IRootState } from "../../../redux/root";
import { startDeleteBudget } from "../../../redux/settings/budgets/actions";
import CheckboxBtn from "../../_ui/CheckboxBtn/CheckboxBtn";
import { DataTable } from "../../_ui/DataTable/DataTable";
import DeleteBtn from "../../_ui/DeleteBtn/DeleteBtn";
import * as appStyles from "../../App/App.scss";

interface IBudgetSettingsProps {
	lastUpdate: number;
	actions?: {
		deleteBudget: (id: string) => AnyAction,
	};
}

interface IBudgetSettingsState {
	currentOnly?: boolean;
}

function mapStateToProps(state: IRootState, props: IBudgetSettingsProps): IBudgetSettingsProps {
	return {
		...props,
		lastUpdate: state.settings.accounts.lastUpdate,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IBudgetSettingsProps): IBudgetSettingsProps {
	return {
		...props,
		actions: {
			deleteBudget: (id) => dispatch(startDeleteBudget(id)),
		},
	};
}

class BudgetSettings extends Component<IBudgetSettingsProps, IBudgetSettingsState> {

	constructor(props: IBudgetSettingsProps) {
		super(props);
		this.state = {
			currentOnly: true,
		};

		this.toggleCurrentOnly = this.toggleCurrentOnly.bind(this);
	}

	public render() {
		const { lastUpdate } = this.props;
		const { currentOnly } = this.state;
		return (
				<>
					<div className={appStyles.headerWrapper}>
						<h1 className={combine(bs.h2, bs.floatLeft)}>Budgets</h1>
						<div className={combine(bs.btnGroupSm, bs.floatRight)}>
							<CheckboxBtn
									initiallyChecked={true}
									onChange={this.toggleCurrentOnly}
									btnClassNames={combine(bs.btnOutlineInfo, bs.btnSm)}>
								Current Budgets Only
							</CheckboxBtn>
						</div>
					</div>
					<DataTable<ThinBudget>
							api={"/settings/budgets/table-data"}
							columns={[
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
							]}
							apiExtraParams={{ currentOnly, lastUpdate }}
							rowRenderer={(budget: ThinBudget) => (
									<tr key={budget.id}>
										<td>{budget.category.name}</td>
										<td>{generateBudgetTypeBadge(budget)}</td>
										<td>{formatBudgetPeriod(budget.startDate, budget.endDate)}</td>
										<td>{formatCurrencyStyled(budget.amount)}</td>
										<td>{this.generateActionButtons(budget)}</td>
									</tr>
							)}
					/>
				</>
		);
	}

	private generateActionButtons(budget: ThinBudget) {
		return (
				<div className={combine(bs.btnGroup, bs.btnGroupSm)}>
					<button className={combine(bs.btn, bs.btnOutlineDark, appStyles.btnMini)}>
						<FontAwesomeIcon icon={faPencil} fixedWidth={true}/> Edit
					</button>
					<DeleteBtn
							btnClassNames={combine(bs.btnOutlineDark, appStyles.btnMini)}
							onClick={() => this.props.actions.deleteBudget(budget.id)}/>
				</div>
		);
	}

	private toggleCurrentOnly(currentOnly: boolean) {
		this.setState({ currentOnly });
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(BudgetSettings);
