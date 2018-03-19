import { IChartistLineChart } from "chartist";
import { formatCurrency } from "../../../../helpers/formatters";
import Chartist = require("chartist");
import moment = require("moment");

const dateRangeBtn = $("#date-range-btn");
const startDateText = dateRangeBtn.find("span.startDate");
const endDateText = dateRangeBtn.find("span.endDate");

let startDate = moment().subtract(1, "year");
let endDate = moment();

let chart: IChartistLineChart;

function updateDateRangeUi() {
	startDateText.text(startDate.format("DD MMM YY"));
	endDateText.text(endDate.format("DD MMM, YY"));
}

function updateChart() {
	// TODO: fade chart whilst updating
	// TODO: lock controls when updating

	$.get("/reports/balance-graph/data", {
		startDate: startDate.toISOString(),
		endDate: endDate.toISOString(),
	})
			.done((data) => {
				chart.update({
					series: [{ data }]
				});
			})
			.fail(() => {
				// TODO: handle failure
			});
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
				updateChart();
			}
	);

	chart = new Chartist.Line(
			"#balance-graph",
			{
				series: [
					{
						name: "Balance",
						data: [],
					}
				]
			},
			{
				axisX: {
					type: Chartist.AutoScaleAxis,
					scaleMinSpace: 40,
					labelInterpolationFnc: (value: number) => moment(value).format("DD MMM, YY"),
				},
				axisY: {
					low: 0,
					labelInterpolationFnc: (value: number) => formatCurrency(value, false),
				},
				chartPadding: {
					left: 20,
				},
				showLine: true,
				showPoint: false,
				showArea: true,
			}
	);

	updateDateRangeUi();
	updateChart();
});
