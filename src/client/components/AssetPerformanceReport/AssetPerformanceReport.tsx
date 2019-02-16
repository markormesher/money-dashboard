import { faPiggyBank } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios, { AxiosResponse } from "axios";
import { ChartDataSets } from "chart.js";
import { merge } from "lodash";
import * as Moment from "moment";
import * as React from "react";
import { Component, ReactNode } from "react";
import { Line, LinearComponentProps } from "react-chartjs-2";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { IAccount } from "../../../commons/models/IAccount";
import { IAssetPerformanceData } from "../../../commons/models/IAssetPerformanceData";
import { DateModeOption } from "../../../commons/models/ITransaction";
import { NULL_UUID } from "../../../commons/utils/entities";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { formatCurrency } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { startLoadAccountList } from "../../redux/accounts";
import { IRootState } from "../../redux/root";
import { chartColours, defaultDatasetProps, defaultLinearChartOverTimeProps } from "../_commons/reports/ReportDefaults";
import * as styles from "../_commons/reports/Reports.scss";
import { CheckboxBtn } from "../_ui/CheckboxBtn/CheckboxBtn";
import { ControlledRadioInput } from "../_ui/ControlledInputs/ControlledRadioInput";
import { DateModeToggleBtn } from "../_ui/DateModeToggleBtn/DateModeToggleBtn";
import { DateRangeChooser } from "../_ui/DateRangeChooser/DateRangeChooser";
import { LoadingSpinner } from "../_ui/LoadingSpinner/LoadingSpinner";
import { RelativeChangeIcon } from "../_ui/RelativeChangeIcon/RelativeChangeIcon";

interface IAssetPerformanceReportProps {
	readonly accountList?: IAccount[];

	readonly actions?: {
		readonly startLoadAccountList: () => AnyAction,
	};
}

interface IAssetPerformanceReportState {
	readonly startDate: Moment.Moment;
	readonly endDate: Moment.Moment;
	readonly dateMode: DateModeOption;
	readonly zeroBasis: boolean;
	readonly showAsPercent: boolean;
	readonly accountId: string;
	readonly data: IAssetPerformanceData;
	readonly loading: boolean;
	readonly failed: boolean;
}

function mapStateToProps(state: IRootState, props: IAssetPerformanceReportProps): IAssetPerformanceReportProps {
	return {
		...props,
		accountList: state.accounts.accountList,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IAssetPerformanceReportProps): IAssetPerformanceReportProps {
	return {
		...props,
		actions: {
			startLoadAccountList: () => dispatch(startLoadAccountList()),
		},
	};
}

class UCAssetPerformanceReport extends Component<IAssetPerformanceReportProps, IAssetPerformanceReportState> {

	private static seriesColours = [chartColours.red, chartColours.blue];

	// give each remote request an increasing "frame" number so that late arrivals will be dropped
	private frameCounter = 0;
	private lastFrameReceived = 0;

	private fetchPending = false;

	constructor(props: IAssetPerformanceReportProps, context: any) {
		super(props, context);
		this.state = {
			startDate: Moment().subtract(1, "year"),
			endDate: Moment(),
			dateMode: "transaction",
			zeroBasis: true,
			showAsPercent: false,
			accountId: NULL_UUID,
			data: undefined,
			loading: true,
			failed: false,
		};

		this.renderChart = this.renderChart.bind(this);
		this.renderInfoPanel = this.renderInfoPanel.bind(this);
		this.renderAccountChooser = this.renderAccountChooser.bind(this);
		this.renderAccountInputs = this.renderAccountInputs.bind(this);
		this.handleDateModeChange = this.handleDateModeChange.bind(this);
		this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
		this.handleAccountChange = this.handleAccountChange.bind(this);
		this.handleZeroBasisChange = this.handleZeroBasisChange.bind(this);
		this.handleShowAsPercentChange = this.handleShowAsPercentChange.bind(this);
	}

	public componentDidMount(): void {
		this.props.actions.startLoadAccountList();
		this.fetchData();
	}

	public componentWillUpdate(nextProps: {}, nextState: IAssetPerformanceReportState): void {
		if (this.state.startDate !== nextState.startDate
				|| this.state.endDate !== nextState.endDate
				|| this.state.dateMode !== nextState.dateMode
				|| this.state.accountId !== nextState.accountId
				|| this.state.zeroBasis !== nextState.zeroBasis
				|| this.state.showAsPercent !== nextState.showAsPercent) {
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
		const { startDate, endDate, accountId } = this.state;

		return (
				<>
					<div className={gs.headerWrapper}>
						<h1 className={bs.h2}>Asset Performance</h1>
						<div className={combine(bs.btnGroup, gs.headerExtras)}>
							{this.state.zeroBasis && <CheckboxBtn
									text={"Show as %"}
									checked={this.state.showAsPercent}
									onChange={this.handleShowAsPercentChange}
									btnProps={{
										className: combine(bs.btnOutlineInfo, bs.btnSm),
									}}
							/>}

							<CheckboxBtn
									text={"Zero Basis"}
									checked={this.state.zeroBasis}
									onChange={this.handleZeroBasisChange}
									btnProps={{
										className: combine(bs.btnOutlineInfo, bs.btnSm),
									}}
							/>

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
									includeAllTimePreset={true}
									includeYearToDatePreset={true}
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
							{this.renderAccountChooser()}
						</div>
						{
							accountId
							&& <div className={combine(bs.col12, bs.colLg6, bs.mb3)}>
								{this.renderInfoPanel()}
							</div>
						}
					</div>
				</>
		);
	}

	private renderChart(): ReactNode {
		const { loading, failed, data, startDate, endDate, zeroBasis, showAsPercent } = this.state;

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
			datasets = data.datasets.map((ds, i) => {
				return {
					...defaultDatasetProps,
					borderColor: UCAssetPerformanceReport.seriesColours[i],
					...ds,
				};
			});
		}

		const chartProps: Partial<LinearComponentProps> = merge({}, defaultLinearChartOverTimeProps, {
			options: {
				elements: {
					line: {
						fill: false,
					},
				},
				scales: {
					yAxes: [
						{
							ticks: {
								callback: (val: number) => zeroBasis && showAsPercent ? `${val * 100}%` : formatCurrency(val),
							},
						},
					],
				},
			},
		});

		return (
				<div className={combine(styles.chartContainer, loading && gs.loading)}>
					<Line
							{...chartProps}
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

		const { totalChangeInclGrowth, totalChangeExclGrowth } = data;
		const growthOnlyChange = totalChangeInclGrowth - totalChangeExclGrowth;

		return (
				<div className={bs.card}>
					<div className={combine(bs.cardBody, gs.cardBody)}>
						<div className={combine(bs.row, loading && gs.loading)}>
							<div className={combine(bs.col6, bs.colMd4)}>
								<h6>Change Excl. Growth:</h6>
								<p>
									<RelativeChangeIcon
											change={totalChangeExclGrowth}
											iconProps={{
												className: bs.mr2,
											}}
									/>
									{formatCurrency(totalChangeExclGrowth)}
								</p>
							</div>
							<div className={combine(bs.col6, bs.colMd4)}>
								<h6>Change Incl. Growth:</h6>
								<p>
									<RelativeChangeIcon
											change={totalChangeInclGrowth}
											iconProps={{
												className: bs.mr2,
											}}
									/>
									{formatCurrency(totalChangeInclGrowth)}
								</p>
							</div>
							<div className={combine(bs.col6, bs.colMd4)}>
								<h6>Net Growth:</h6>
								<p>
									<RelativeChangeIcon
											change={growthOnlyChange}
											iconProps={{
												className: bs.mr2,
											}}
									/>
									{formatCurrency(growthOnlyChange)}
								</p>
							</div>
						</div>
					</div>
				</div>
		);
	}

	private renderAccountChooser(): ReactNode {
		const { accountList } = this.props;
		return (
				<div className={bs.card}>
					<h5 className={combine(bs.cardHeader, bs.h5)}>
						<FontAwesomeIcon icon={faPiggyBank} className={bs.mr3}/>
						Select Account
					</h5>
					<div className={combine(bs.cardBody, gs.cardBody)}>
						{!accountList && <LoadingSpinner centre={true}/>}
						{accountList && this.renderAccountInputs()}
					</div>
				</div>
		);
	}

	private renderAccountInputs(): ReactNode {
		const { accountList } = this.props;
		const { accountId } = this.state;
		const accounts = accountList
				.filter((ac) => ac.type === "asset")
				.sort((a, b) => a.name.localeCompare(b.name));

		if (accounts.length === 0) {
			return <p>You don't have any asset-type accounts.</p>;
		}

		return (
				<form>
					<div className={bs.row}>
						<div
								key={`account-chooser-all`}
								className={combine(bs.col12, bs.colMd6, bs.mb3)}
						>
							<ControlledRadioInput
									name={"account"}
									id={NULL_UUID}
									value={NULL_UUID}
									label={"All Accounts"}
									checked={accountId === NULL_UUID}
									onValueChange={this.handleAccountChange}
							/>
						</div>
						<div className={combine(bs.col12, bs.mb3)}>
							<hr className={bs.my0}/>
						</div>
						{
							accounts.map((ac) => (
									<div
											key={`account-chooser-${ac.id}`}
											className={combine(bs.col12, bs.colMd6, bs.mb3)}
									>
										<ControlledRadioInput
												name={"account"}
												id={ac.id}
												value={ac.id}
												label={ac.name}
												checked={accountId === ac.id}
												onValueChange={this.handleAccountChange}
										/>
									</div>
							))
						}
					</div>
				</form>
		);
	}

	private handleDateModeChange(dateMode: DateModeOption): void {
		this.setState({ dateMode });
	}

	private handleDateRangeChange(startDate: Moment.Moment, endDate: Moment.Moment): void {
		this.setState({ startDate, endDate });
	}

	private handleAccountChange(accountId: string): void {
		this.setState({ accountId });
	}

	private handleZeroBasisChange(zeroBasis: boolean): void {
		this.setState({ zeroBasis });
	}

	private handleShowAsPercentChange(showAsPercent: boolean): void {
		this.setState({ showAsPercent });
	}

	private fetchData(): void {
		const { startDate, endDate, dateMode, accountId, zeroBasis, showAsPercent } = this.state;

		if (!accountId) {
			return;
		}

		this.setState({ loading: true });
		const frame = ++this.frameCounter;

		axios
				.get("/api/reports/asset-performance/data", {
					params: {
						startDate: startDate.toISOString(),
						endDate: endDate.toISOString(),
						dateMode,
						accountId,
						zeroBasis,
						showAsPercent,
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

export const AssetPerformanceReport = connect(mapStateToProps, mapDispatchToProps)(UCAssetPerformanceReport);
