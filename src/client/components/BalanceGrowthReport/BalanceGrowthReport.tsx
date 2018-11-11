import axios, { AxiosResponse } from "axios";
import { ChartDataSets } from "chart.js";
import * as Moment from "moment";
import * as React from "react";
import { Component, ReactNode } from "react";
import { Line, LinearComponentProps } from "react-chartjs-2";
import { IBalanceGraphData } from "../../../server/controllers/reports/balance-graph";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { formatCurrency, formatDate } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { DateRangeChooser } from "../_ui/DateRangeChooser/DateRangeChooser";
import * as styles from "./BalanceGrowthReport.scss";

// TODO: a lot of this can be pulled out for generic charts

interface IBalanceReportState {
	readonly startDate: Moment.Moment;
	readonly endDate: Moment.Moment;
	readonly data: IBalanceGraphData;
	readonly loading: boolean;
	readonly failed: boolean;
}

class BalanceGrowthReport extends Component<{}, IBalanceReportState> {

	private static datasetProps: Partial<ChartDataSets> = {
		pointRadius: 0,
	};

	private static chartProps: Partial<LinearComponentProps> = {
		legend: {
			display: false,
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			elements: {
				line: {
					borderWidth: 2,
					borderColor: "rgba(13, 71, 161, 1)",
					backgroundColor: "rgba(13, 71, 161, .3)",
					fill: "zero",
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
							callback: (_: any, idx: number, values: Array<{ value: number }>) => {
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

	// give each remote request an increasing "frame" number so that late arrivals will be dropped
	private frameCounter = 0;
	private lastFrameReceived = 0;

	private fetchPending = false;

	constructor(props: {}, context: any) {
		super(props, context);
		this.state = {
			startDate: Moment().subtract(1, "year"),
			endDate: Moment(),
			data: undefined,
			loading: true,
			failed: false,
		};

		this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
	}

	public componentDidMount(): void {
		this.fetchData();
	}

	public componentWillUpdate(nextProps: {}, nextState: IBalanceReportState): void {
		if (this.state.startDate !== nextState.startDate
				|| this.state.endDate !== nextState.endDate) {
			this.fetchPending = true;
		}
	}

	public componentDidUpdate(): void {
		if (this.fetchPending) {
			this.fetchData();
			this.fetchPending = false;
		}
	}

	public render(): ReactNode {
		const { startDate, endDate, loading, failed, data } = this.state;

		const datasets = !data && [] || data.datasets.map((ds) => {
			return {
				...BalanceGrowthReport.datasetProps,
				...ds,
			};
		});

		return (
				<>
					<div className={gs.headerWrapper}>
						<h1 className={bs.h2}>Balance Growth</h1>
						<div className={gs.headerExtras}>
							<DateRangeChooser
									startDate={startDate}
									endDate={endDate}
									onValueChange={this.handleDateRangeChange}
							/>
						</div>
					</div>

					<div className={bs.row}>
						<div
								className={combine(bs.col12, loading && styles.loading)}
								style={{ height: "400px", position: "relative" }}
						>
							{
								!failed
								&& <Line
										{...BalanceGrowthReport.chartProps}
										data={{ datasets }}
								/>
							}
						</div>
					</div>
				</>
		);
	}

	public handleDateRangeChange(startDate: Moment.Moment, endDate: Moment.Moment): void {
		this.setState({ startDate, endDate });
	}

	private fetchData(): void {
		const { startDate, endDate } = this.state;

		this.setState({ loading: true });
		const frame = ++this.frameCounter;

		axios
				.get("/reports/balance-graph/data", {
					params: {
						startDate: startDate.toISOString(),
						endDate: endDate.toISOString(),
						dateField: "transactionDate",
					},
				})
				.then((res: AxiosResponse<ChartDataSets[]>) => res.data)
				.then((res) => this.onDataLoaded(frame, res))
				.catch(() => this.onDataLoadFailed(frame));
	}

	private onFrameReceived(frame: number): void {
		this.lastFrameReceived = Math.max(frame, this.lastFrameReceived);
	}

	private onDataLoaded(frame: number, rawData: any): void {
		if (frame <= this.lastFrameReceived) {
			return;
		}

		this.onFrameReceived(frame);

		this.setState({
			loading: false,
			failed: false,
			data: rawData,
		});
	}

	private onDataLoadFailed(frame: number): void {
		if (frame <= this.lastFrameReceived) {
			return;
		}

		this.onFrameReceived(frame);

		this.setState({
			loading: false,
			failed: true,
			data: undefined,
		});
	}
}

export {
	BalanceGrowthReport,
};
