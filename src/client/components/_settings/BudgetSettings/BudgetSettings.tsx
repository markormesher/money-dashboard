import { faPencil, faTrash } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Component } from "react";
import { ThinBudget } from "../../../../server/model-thins/ThinBudget";
import * as bs from "../../../bootstrap-aliases";
import { formatBudgetPeriod, formatCurrencyStyled, generateBudgetTypeBadge } from "../../../helpers/formatters";
import { combine } from "../../../helpers/style-helpers";
import * as appStyles from "../../App/App.scss";
import { DataTable } from "../../DataTable/DataTable";

class BudgetSettings extends Component {

	private static generateActionButtons(budget: ThinBudget) {
		return (
				<div className={combine(bs.btnGroup, bs.btnGroupSm)}>
					<button className={combine(bs.btn, bs.btnOutlineDark, appStyles.btnMini)}>
						<FontAwesomeIcon icon={faPencil} fixedWidth={true}/> Edit
					</button>
					<button className={combine(bs.btn, bs.btnOutlineDark, appStyles.btnMini)}>
						<FontAwesomeIcon icon={faTrash} fixedWidth={true}/> Delete
					</button>
				</div>
		);
	}

	public render() {
		return (
				<>
					<h1 className={bs.h2}>Budgets</h1>
					<DataTable<ThinBudget>
							api={"/settings/budgets/table-data"}
							columns={[
								{ title: "Name", sortField: ["category", "name"], defaultSortDirection: "asc" },
								{ title: "Type", sortField: "type" },
								{ title: "Period", sortField: "startDate" },
								{ title: "Amount", sortField: "amount" },
								{ title: "Actions", sortable: false },
							]}
							rowRenderer={(budget: ThinBudget) => (
									<tr key={budget.id}>
										<td>{budget.category.name}</td>
										<td>{generateBudgetTypeBadge(budget)}</td>
										<td>{formatBudgetPeriod(budget.startDate, budget.endDate)}</td>
										<td>{formatCurrencyStyled(budget.amount)}</td>
										<td>{BudgetSettings.generateActionButtons(budget)}</td>
									</tr>
							)}
					/>
				</>
		);
	}
}

export default BudgetSettings;
