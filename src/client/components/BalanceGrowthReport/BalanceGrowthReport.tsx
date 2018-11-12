import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCaretDown, faCaretUp } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios, { AxiosResponse } from "axios";
import { ChartDataSets } from "chart.js";
import * as Moment from "moment";
import * as React from "react";
import { Component, ReactNode } from "react";
import { Line, LinearComponentProps } from "react-chartjs-2";
import { IBalanceGraphData } from "../../../server/controllers/reports/balance-graph";
import { DateModeOption } from "../../../server/models/Transaction";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { formatCurrency, formatDate } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { DateModeToggleBtn } from "../_ui/DateModeToggleBtn/DateModeToggleBtn";
import { DateRangeChooser } from "../_ui/DateRangeChooser/DateRangeChooser";
import { LoadingSpinner } from "../_ui/LoadingSpinner/LoadingSpinner";
import * as styles from "./BalanceGrowthReport.scss";

// TODO: a lot of this can be pulled out for generic charts

interface IBalanceReportState {
	readonly startDate: Moment.Moment;
	readonly endDate: Moment.Moment;
	readonly dateMode: DateModeOption;
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
			dateMode: "transaction",
			data: undefined,
			loading: true,
			failed: false,
		};

		this.renderChart = this.renderChart.bind(this);
		this.renderInfoPanel = this.renderInfoPanel.bind(this);
		this.handleDateModeChange = this.handleDateModeChange.bind(this);
		this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
	}

	public componentDidMount(): void {
		this.fetchData();
	}

	public componentWillUpdate(nextProps: {}, nextState: IBalanceReportState): void {
		if (this.state.startDate !== nextState.startDate
				|| this.state.endDate !== nextState.endDate
				|| this.state.dateMode !== nextState.dateMode) {
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
		const { startDate, endDate } = this.state;

		return (
				<>
					<div className={gs.headerWrapper}>
						<h1 className={bs.h2}>Balance Growth</h1>
						<div className={combine(bs.btnGroup, gs.headerExtras)}>
							<DateModeToggleBtn
									value={this.state.dateMode}
									onChange={this.handleDateModeChange}
									btnProps={{
										className: combine(bs.btnOutlineInfo, bs.btnSm),
									}}
							/>

							<DateRangeChooser
									startDate={startDate}
									endDate={endDate}
									onValueChange={this.handleDateRangeChange}
									btnProps={{
										className: combine(bs.btnOutlineDark, bs.btnSm),
									}}
							/>
						</div>
					</div>

					<div className={bs.row}>
						<div className={combine(bs.col12, bs.mb3)}>
							{this.renderChart()}
						</div>
						<div className={combine(bs.col12, bs.colLg6, bs.mb3)}>
							{this.renderInfoPanel()}
						</div>
					</div>
				</>
		);
	}

	private renderChart(): ReactNode {
		const { loading, failed, data } = this.state;

		if (failed) {
			return <p>Chart failed to load. Please try again.</p>;
		}

		if (!data) {
			// this is the first load
			return <LoadingSpinner centre={true}/>;
		}

		let datasets: ChartDataSets[] = [];
		if (data) {
			datasets = data.datasets.map((ds) => {
				return {
					...BalanceGrowthReport.datasetProps,
					...ds,
				};
			});
		}

		return (
				<div className={combine(styles.chartContainer, loading && styles.loading)}>
					<Line
							{...BalanceGrowthReport.chartProps}
							data={{ datasets }}
					/>
				</div>
		);
	}

	private renderInfoPanel(): ReactNode {
		const { loading, failed, data } = this.state;

		if (failed) {
			return null;
		}

		if (!data) {
			// this is the first load
			return <LoadingSpinner centre={true}/>;
		}

		const { minTotal, minDate, maxTotal, maxDate, changeAbsolute } = data;
		let changeIcon: IconProp;
		let changeClass: string;
		if (changeAbsolute < 0) {
			changeIcon = faCaretDown;
			changeClass = bs.textDanger;
		}
		if (changeAbsolute > 0) {
			changeIcon = faCaretUp;
			changeClass = bs.textSuccess;
		}

		return (
				<div className={bs.card}>
					<div className={bs.cardBody}>
						<div className={combine(bs.row, loading && styles.loading)}>
							<div className={combine(bs.col6, bs.colMd4)}>
								<h6>Minimum:</h6>
								<p>
									{formatCurrency(minTotal)}
									<br/>
									<span className={bs.textMuted}>{formatDate(new Date(minDate))}</span>
								</p>
							</div>
							<div className={combine(bs.col6, bs.colMd4)}>
								<h6>Maximum:</h6>
								<p>
									{formatCurrency(maxTotal)}
									<br/>
									<span className={bs.textMuted}>{formatDate(new Date(maxDate))}</span>
								</p>
							</div>
							<div className={combine(bs.col6, bs.colMd4)}>
								<h6>Change:</h6>
								<p>
									{
										changeAbsolute !== 0
										&& <FontAwesomeIcon icon={changeIcon} className={combine(changeClass, bs.mr2)}/>
									}
									{formatCurrency(changeAbsolute)}
								</p>
							</div>
						</div>
					</div>
				</div>
		);
	}

	private handleDateModeChange(dateMode: DateModeOption): void {
		this.setState({ dateMode });
	}

	private handleDateRangeChange(startDate: Moment.Moment, endDate: Moment.Moment): void {
		this.setState({ startDate, endDate });
	}

	private fetchData(): void {
		const { startDate, endDate, dateMode } = this.state;

		this.setState({ loading: true });
		const frame = ++this.frameCounter;

		axios
				.get("/reports/balance-graph/data", {
					params: {
						startDate: startDate.toISOString(),
						endDate: endDate.toISOString(),
						dateMode,
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
