import { formatBudgetPeriod, formatCurrency } from "../../../../helpers/formatters";
import { ThinBudgetBalance } from "../../../../statistics/budget-statistics";
import { withDataTableDefaults } from "../../global/data-table-defaults";
import { getDetailedViewState } from "./toggle-detailed-view";
import moment = require("moment");

const dateRangeBtn = $("#date-range-btn");
const startDateText = dateRangeBtn.find("span.startDate");
const endDateText = dateRangeBtn.find("span.endDate");

let startDate = moment().subtract(1, "year");
let endDate = moment();

function updateDateRangeUi() {
	startDateText.text(startDate.format("DD MMM YY"));
	endDateText.text(endDate.format("DD MMM YY"));
}

function updateTable() {
	$(".dataTable").DataTable().ajax.reload();
}

$(() => {
	dateRangeBtn.daterangepicker(
			{
				startDate,
				endDate,
				locale: {
					format: "DD MMM YY"
				},
				ranges: {
					"Year to Date": [moment().subtract(1, "year"), moment()],
					"This Year": [moment().startOf("year"), moment().endOf("year")],
					"Last Year": [moment().startOf("year").subtract(1, "year"), moment().endOf("year").subtract(1, "year")],
					"This Month": [moment().startOf("month"), moment().endOf("month")],
					"Last Month": [moment().startOf("month").subtract(1, "month"), moment().endOf("month").subtract(1, "month")],
				}
			},
			(start, end) => {
				startDate = start;
				endDate = end;
				updateDateRangeUi();
				updateTable();
			}
	);

	$("table#budget-table").DataTable(withDataTableDefaults({
		columns: [
			{ data: "category", orderable: true },
			{ data: "_performance", orderable: false },
		],
		searching: false,
		paging: false,
		order: [[0, "asc"]],
		ajax: {
			url: "/reports/budget-performance/table-data",
			data: ((data: { [key: string]: any }) => {
				data.startDate = startDate.toISOString();
				data.endDate = endDate.toISOString();
				return data;
			}),
			dataSrc: (raw: { data: [string, ThinBudgetBalance[]][] }) => {
				return raw.data.map((budgetData) => {
					const categoryName = budgetData[0];
					const budgetBalances = budgetData[1].sort((a, b) => a.budget.startDate.localeCompare(b.budget.startDate));

					const output = {} as any;
					output.category = categoryName;
					output._performance = budgetBalances.map((budgetBalance) => {
						const budget = budgetBalance.budget;
						const spend = budgetBalance.balance * -1;
						const spendPercent = budget.amount > 0 ? spend / budget.amount : 0;

						let icon = "";
						let style = "";
						if (spendPercent > 1) {
							icon = "fa-exclamation-circle";
							style = "text-danger";
						} else {
							icon = "fa-check-circle";
							style = "text-success";
						}

						if (getDetailedViewState()) {
							return `<div style="text-align: center; padding: 0 5px; margin-bottom: 4px; display: inline-block;">
								<i class="far fa-fw ${icon} ${style}"></i><br />
								${formatBudgetPeriod(budget.startDate, budget.endDate)}<br />
								S: ${formatCurrency(budget.amount, false)}<br />
								B: ${formatCurrency(spend, false)}
							</div>`;
						} else {
							const prettySpendPercent = Math.round(spendPercent * 100);
							const tooltip = `${formatBudgetPeriod(budget.startDate, budget.endDate)}<br />
								${formatCurrency(spend, false)} of ${formatCurrency(budget.amount, false)}<br />
								${prettySpendPercent}%`;

							return `<span title="${tooltip}" data-toggle="tooltip" data-html="true">
								<i class="far fa-fw ${icon} ${style}"></i>
							</span>`;
						}
					}).join(" ");

					return output;
				});
			},
		},
	}));

	updateDateRangeUi();
});
