import { numberTypeAnnotation } from "babel-types";
import { IChartistLineChart } from "chartist";
import { formatCurrency, formatDate } from "../../../../helpers/formatters";
import { getDateField } from "./toggle-date-field";
import { getSelectedAssetId } from "./asset-selector";
import Chartist = require("chartist");
import moment = require("moment");
import Node = JQuery.Node;

interface IApiResponse {
	dataExclGrowth: { x: number, y: number }[];
	dataInclGrowth: { x: number, y: number }[];
	totalChangeInclGrowth: number;
	totalChangeExclGrowth: number;
}

const dateRangeBtn = $("#date-range-btn");
const startDateText = dateRangeBtn.find("span.startDate");
const endDateText = dateRangeBtn.find("span.endDate");

let startDate = moment().subtract(1, "year");
let endDate = moment();

const chartArea = $("#balance-graph");
let chart: IChartistLineChart;
let chartUpdateInProgress = false;

const nonGrowthChangeText = $("#non-growth-change");
const growthOnlyChangeText = $("#growth-only-change");
const totalChangeText = $("#total-change");

function updateDateRangeUi() {
	startDateText.text(startDate.format("DD MMM YY"));
	endDateText.text(endDate.format("DD MMM YY"));
}

function updateChart() {
	if (chartUpdateInProgress) {
		return;
	}

	if (getSelectedAssetId() == null) {
		return;
	}

	chartUpdateInProgress = true;
	setUiLock(true);

	$.get("/reports/asset-performance/data", {
		startDate: startDate.toISOString(),
		endDate: endDate.toISOString(),
		dateField: getDateField(),
		account: getSelectedAssetId()
	}).done((raw: IApiResponse) => {
		chart.update({
			series: [
				{ data: raw.dataInclGrowth },
				{ data: raw.dataExclGrowth },
			]
		});
		updateSummary(raw);
		chartUpdateInProgress = false;
		setUiLock(false);
	}).fail(() => {
		toastr.error("The chart failed to update; please try again");
		chartUpdateInProgress = false;
		setUiLock(false);
	});
}

function updateSummary(raw: IApiResponse) {
	const nonGrowthChange = raw.totalChangeExclGrowth;
	const growthOnlyChange = raw.totalChangeInclGrowth - raw.totalChangeExclGrowth;
	const totalChange = raw.totalChangeInclGrowth;

	const nonGrowthChangeIcon = nonGrowthChangeText.closest("p").find("[data-fa-i2svg]");
	const growthOnlyChangeIcon = growthOnlyChangeText.closest("p").find("[data-fa-i2svg]");
	const totalChangeIcon = totalChangeText.closest("p").find("[data-fa-i2svg]");

	setAmountWithUpDownIndicator(nonGrowthChange, nonGrowthChangeText, nonGrowthChangeIcon);
	setAmountWithUpDownIndicator(growthOnlyChange, growthOnlyChangeText, growthOnlyChangeIcon);
	setAmountWithUpDownIndicator(totalChange, totalChangeText, totalChangeIcon);
}

function setAmountWithUpDownIndicator(amount: number, text: JQuery, icon: JQuery) {
	if (amount == 0) {
		text.html(formatCurrency(amount));
		icon.toggleClass("fa-caret-right");
		text.removeClass("text-danger text-success");
		icon.removeClass("text-danger text-success");
	} else if (amount > 0) {
		text.html(formatCurrency(amount));
		icon.toggleClass("fa-caret-up");
		text.removeClass("text-danger").addClass("text-success");
		icon.removeClass("text-danger").addClass("text-success");
	} else {
		text.html(formatCurrency(amount * -1));
		icon.toggleClass("fa-caret-down");
		text.removeClass("text-success").addClass("text-danger");
		icon.removeClass("text-success").addClass("text-danger");
	}
}

function setUiLock(locked: boolean) {
	dateRangeBtn.prop("disabled", locked);
	chartArea.fadeTo(0, locked ? 0.4 : 1.0);
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
			"#asset-performance",
			{
				series: [
					{
						name: "Balance incl. Growth",
						data: [],
					},
					{
						name: "Balance excl. Growth",
						data: [],
					},
				]
			},
			{
				axisX: {
					type: Chartist.AutoScaleAxis,
					scaleMinSpace: 40,
					labelInterpolationFnc: (value: number) => moment(value).format("DD MMM YY"),
				},
				axisY: {
					type: Chartist.AutoScaleAxis,
					labelInterpolationFnc: (value: number) => formatCurrency(value, false),
					referenceValue: 0
				},
				chartPadding: {
					top: 0,
					left: 20,
					right: 0,
				},
				showLine: true,
				showPoint: false,
				lineSmooth: false,
			}
	);

	updateDateRangeUi();
	updateChart();
});

export {
	updateChart,
}
