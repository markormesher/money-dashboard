import { IChartistLineChart } from "chartist";
import { formatCurrency, formatDate } from "../../../../helpers/formatters";
import { getDateField } from "./toggle-date-field";
import Chartist = require("chartist");
import moment = require("moment");

interface IApiResponse {
	data: { x: number, y: number }[];
	minTotal: number;
	minDate: number;
	maxTotal: number;
	maxDate: number;
	changeAbsolute: number;
}

const dateRangeBtn = $("#date-range-btn");
const startDateText = dateRangeBtn.find("span.startDate");
const endDateText = dateRangeBtn.find("span.endDate");

let startDate = moment().subtract(1, "year");
let endDate = moment();

const chartArea = $("#balance-graph");
let chart: IChartistLineChart;
let chartUpdateInProgress = false;

const minValueText = $("#min-value");
const minValueDateText = $("#min-value-date");
const maxValueText = $("#max-value");
const maxValueDateText = $("#max-value-date");
const changeAbsoluteText = $("#change-abs");

const accountGroupCheckboxes = $(".account-group-check-box");
const accountCheckboxes = $(".account-check-box");
const accountCountText = $(".account-count");

function updateDateRangeUi() {
	startDateText.text(startDate.format("DD MMM YY"));
	endDateText.text(endDate.format("DD MMM YY"));
}

function initAccountCheckboxes() {
	accountCheckboxes.on("change", function () {
		const groupWrapper = $(this).closest(".group-wrapper");
		const groupCheckbox = groupWrapper.find(".account-group-check-box");
		let countChecked = 0;
		let countUnchecked = 0;
		groupWrapper.find(".account-check-box").each(function () {
			if ($(this).is(":checked")) {
				++countChecked;
			} else {
				++countUnchecked;
			}
		});

		if (countChecked == 0) {
			groupCheckbox.prop("checked", false);
			groupCheckbox.prop("indeterminate", false);
		} else if (countUnchecked == 0) {
			groupCheckbox.prop("checked", true);
			groupCheckbox.prop("indeterminate", false);
		} else {
			groupCheckbox.prop("checked", false);
			groupCheckbox.prop("indeterminate", true);
		}

		updateChart();
		updateAccountCount();
	});

	accountGroupCheckboxes.on("change", function () {
		const groupedAccountCheckboxes = $(this).closest(".group-wrapper").find(".account-check-box");
		groupedAccountCheckboxes.prop("checked", $(this).is(":checked"));
		groupedAccountCheckboxes.first().trigger("change");
	});
}

function updateAccountCount() {
	const totalAccounts = accountCheckboxes.length;
	const checkedAccounts = accountCheckboxes.filter(":checked").length;

	if (totalAccounts == checkedAccounts) {
		accountCountText.html("");
	} else {
		accountCountText.html(`${checkedAccounts} of ${totalAccounts} selected`);
	}
}

function updateChart() {
	if (chartUpdateInProgress) {
		return;
	}

	chartUpdateInProgress = true;
	setUiLock(true);

	const accounts: string[] = [];
	accountCheckboxes.filter(":checked").each(function() {
		accounts.push($(this).val().toString());
	});

	$.get("/reports/balance-graph/data", {
		startDate: startDate.toISOString(),
		endDate: endDate.toISOString(),
		dateField: getDateField(),
		accounts
	}).done((raw: IApiResponse) => {
		chart.update({ series: [{ data: raw.data }] });
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
	minValueText.html(formatCurrency(raw.minTotal));
	minValueDateText.html(raw.minDate > 0 ? formatDate(new Date(raw.minDate)) : "N/A");
	maxValueText.html(formatCurrency(raw.maxTotal));
	maxValueDateText.html(raw.maxDate > 0 ? formatDate(new Date(raw.maxDate)) : "N/A");

	const absChangeIcon = changeAbsoluteText.closest("p").find("[data-fa-i2svg]");
	const absChangeIconAndText = changeAbsoluteText.closest("p").find("span, [data-fa-i2svg]");

	if (raw.changeAbsolute == 0) {
		changeAbsoluteText.html(formatCurrency(raw.changeAbsolute));
		absChangeIcon.toggleClass("fa-caret-right");
		absChangeIconAndText.removeClass("text-danger text-success");
	} else if (raw.changeAbsolute > 0) {
		changeAbsoluteText.html(formatCurrency(raw.changeAbsolute));
		absChangeIcon.toggleClass("fa-caret-up");
		absChangeIconAndText.removeClass("text-danger").addClass("text-success");
	} else {
		changeAbsoluteText.html(formatCurrency(raw.changeAbsolute * -1));
		absChangeIcon.toggleClass("fa-caret-down");
		absChangeIconAndText.removeClass("text-success").addClass("text-danger");
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
				showArea: true,
			}
	);

	initAccountCheckboxes();
	updateDateRangeUi();
	updateChart();
});

export {
	updateChart,
}
