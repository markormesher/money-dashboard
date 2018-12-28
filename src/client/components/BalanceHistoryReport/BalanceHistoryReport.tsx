import axios, { AxiosResponse } from "axios";
import { ChartDataSets } from "chart.js";
import { merge } from "lodash";
import * as Moment from "moment";
import * as React from "react";
import { Component, ReactNode } from "react";
import { Line, LinearComponentProps } from "react-chartjs-2";
import { IBalanceHistoryData } from "../../../api/models/IBalanceHistoryData";
import { DateModeOption } from "../../../api/models/ITransaction";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { formatCurrency, formatDate } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { chartColours, defaultDatasetProps, defaultLinearChartOverTimeProps } from "../_commons/reports/ReportDefaults";
import * as styles from "../_commons/reports/Reports.scss";
import { DateModeToggleBtn } from "../_ui/DateModeToggleBtn/DateModeToggleBtn";
import { DateRangeChooser } from "../_ui/DateRangeChooser/DateRangeChooser";
import { RelativeChangeIcon } from "../_ui/RelativeChangeIcon/RelativeChangeIcon";

interface IBalanceHistoryReportState {
	readonly startDate: Moment.Moment;
	readonly endDate: Moment.Moment;
	readonly dateMode: DateModeOption;
	readonly data: IBalanceHistoryData;
	readonly loading: boolean;
	readonly failed: boolean;
}

class BalanceHistoryReport extends Component<{}, IBalanceHistoryReportState> {

	private static chartProps: Partial<LinearComponentProps> = merge({}, defaultLinearChartOverTimeProps, {
		options: {
			elements: {
				line: {
					borderColor: chartColours.blue,
					backgroundColor: chartColours.blueFaded,
					fill: "zero",
				},
			},
		},
	});

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

	public componentWillUpdate(nextProps: {}, nextState: IBalanceHistoryReportState): void {
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
						<h1 className={bs.h2}>Balance History</h1>
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
									includeAllTime={true}
									includeYearToDate={true}
									includeFuturePresets={false}
									setPosition={true}
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
		const { loading, failed, data, startDate, endDate } = this.state;

		if (failed) {
			return <p>Chart failed to load. Please try again.</p>;
		}

		let datasets: ChartDataSets[] = [{
			data: [
				// dummy values to show a blank chart
				{ x: startDate.toDate(), y: 0 },
				{ x: endDate.toDate(), y: 0 },
			],
		}];
		if (data) {
			datasets = data.datasets.map((ds) => {
				return {
					...defaultDatasetProps,
					...ds,
				};
			});
		}

		return (
				<div className={combine(styles.chartContainer, loading && gs.loading)}>
					<Line
							{...BalanceHistoryReport.chartProps}
							data={{ datasets }}
					/>
				</div>
		);
	}

	private renderInfoPanel(): ReactNode {
		const { loading, failed, data } = this.state;

		if (failed || !data) {
			return null;
		}

		const { minTotal, minDate, maxTotal, maxDate, changeAbsolute } = data;

		return (
				<div className={bs.card}>
					<div className={combine(bs.cardBody, gs.cardBody)}>
						<div className={combine(bs.row, loading && gs.loading)}>
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
									<RelativeChangeIcon
											change={changeAbsolute}
											iconProps={{
												className: bs.mr2,
											}}
									/>
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
				.get("/api/reports/balance-history/data", {
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
	BalanceHistoryReport,
};
