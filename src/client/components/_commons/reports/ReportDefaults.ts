import { ChartDataSets } from "chart.js";
import { LinearComponentProps } from "react-chartjs-2";
import { formatCurrency, formatDate } from "../../../helpers/formatters";

const chartColours = {
	blue: "rgba(13, 71, 161, 1)",
	blueFaded: "rgba(13, 71, 161, .3)",
	red: "rgba(183, 28, 28, 1)",
	redFaded: "rgba(183, 28, 28, .3)",
};

const defaultDatasetProps: Partial<ChartDataSets> = {
	pointRadius: 0,
};

const defaultLinearChartOverTimeProps: Partial<LinearComponentProps> = {
	legend: {
		display: false,
	},
	options: {
		responsive: true,
		maintainAspectRatio: false,
		elements: {
			line: {
				borderWidth: 2,
				tension: 0,
			},
		},
		tooltips: {
			enabled: false,
		},
		scales: {
			display: true,
			xAxes: [
				{
					display: true,
					type: "time",
					ticks: {
						callback: (_: any, idx: number, values: Array<{ readonly value: number }>) => {
							const date = values[idx];
							return date ? formatDate(new Date(date.value)) : undefined;
						},
					},
				},
			],
			yAxes: [
				{
					display: true,
					ticks: {
						beginAtZero: true,
						callback: (val: number) => formatCurrency(val),
					},
				},
			],
		},
	},
};

export {
	chartColours,
	defaultDatasetProps,
	defaultLinearChartOverTimeProps,
};
