import axios, { AxiosResponse } from "axios";
import * as Moment from "moment";
import * as React from "react";
import { PureComponent, ReactElement, ReactNode } from "react";
import { IDateRange } from "../../../commons/models/IDateRange";
import {
	IDetailedAccountBalance,
	mapDetailedAccountBalanceFromApi,
} from "../../../commons/models/IDetailedAccountBalance";
import { DateModeOption } from "../../../commons/models/ITransaction";
import { getTaxYear, getTaxYearEnd, getTaxYearStart } from "../../../commons/utils/helpers";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { formatCurrencyStyled, formatDate } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { ApiDataTableDataProvider } from "../_ui/DataTable/DataProvider/ApiDataTableDataProvider";
import { DataTable, IColumn } from "../_ui/DataTable/DataTable";
import { DateModeToggleBtn } from "../_ui/DateModeToggleBtn/DateModeToggleBtn";
import { DateRangeChooser } from "../_ui/DateRangeChooser/DateRangeChooser";

interface IIsaDepositReportState {
	readonly startDate: Moment.Moment;
	readonly endDate: Moment.Moment;
	readonly dateMode: DateModeOption;
	readonly minYear: number;
}

class IsaDepositsReport extends PureComponent<{}, IIsaDepositReportState> {

	private tableColumns: IColumn[] = [
		{
			title: "Account",
			sortField: "account.name",
			defaultSortDirection: "ASC",
			defaultSortPriority: 0,
		},
		{
			title: "Payments In",
			sortable: false,
		},
		{
			title: "Payments Out",
			sortable: false,
		},
		{
			title: "Net Payments",
			sortable: false,
		},
	];

	private dataProvider = new ApiDataTableDataProvider<IDetailedAccountBalance>(
			"/api/reports/isa-deposits/table-data",
			() => ({
				startDate: formatDate(this.state.startDate, "system"),
				endDate: formatDate(this.state.endDate, "system"),
				dateMode: this.state.dateMode,
			}),
			mapDetailedAccountBalanceFromApi,
	);

	constructor(props: {}, context: any) {
		super(props, context);

		this.state = {
			startDate: getTaxYearStart(getTaxYear(Moment())),
			endDate: getTaxYearEnd(getTaxYear(Moment())),
			minYear: Moment().year(),
			dateMode: "transaction",
		};

		this.getYearRange = this.getYearRange.bind(this);
		this.handleDateModeChange = this.handleDateModeChange.bind(this);
		this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
	}

	public componentDidMount(): void {
		this.getYearRange();
	}

	public render(): ReactNode {
		const { startDate, endDate, dateMode, minYear } = this.state;

		const yearRanges: IDateRange[] = [];
		const currentTaxYearStartYear = getTaxYearStart(getTaxYear(Moment())).year();
		for (let year = currentTaxYearStartYear; year >= minYear; --year) {
			yearRanges.push({
				startDate: getTaxYearStart(year),
				endDate: getTaxYearEnd(year),
				label: `${year}/${year + 1} Tax Year`,
			});
		}

		return (
				<>
					<div className={gs.headerWrapper}>
						<h1 className={bs.h2}>ISA Deposits</h1>
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
									includeCurrentPresets={false}
									includeAllTimePreset={false}
									includeYearToDatePreset={false}
									includeFuturePresets={false}
									customPresets={yearRanges}
									setPosition={true}
									btnProps={{
										className: combine(bs.btnOutlineDark, bs.btnSm),
									}}
							/>
						</div>
					</div>

					<DataTable<IDetailedAccountBalance>
							columns={this.tableColumns}
							pageSize={Number.MAX_SAFE_INTEGER}
							dataProvider={this.dataProvider}
							watchedProps={{ startDate, endDate, dateMode }}
							rowRenderer={this.tableRowRenderer}
					/>
				</>
		);
	}

	private tableRowRenderer(balance: IDetailedAccountBalance): ReactElement<void> {
		return (
				<tr key={balance.account.id}>
					<td>{balance.account.name}</td>
					<td>{formatCurrencyStyled(balance.balanceIn)}</td>
					<td>{formatCurrencyStyled(balance.balanceOut)}</td>
					<td>{formatCurrencyStyled(balance.balanceIn - balance.balanceOut)}</td>
				</tr>
		);
	}

	private getYearRange(): void {
		axios
				.get("/api/reports/isa-deposits/min-year")
				.then((res: AxiosResponse<number>) => res.data)
				.then((res) => this.setState({ minYear: res }));
	}

	private handleDateModeChange(dateMode: DateModeOption): void {
		this.setState({ dateMode });
	}

	private handleDateRangeChange(startDate: Moment.Moment, endDate: Moment.Moment): void {
		this.setState({ startDate, endDate });
	}
}

export {
	IsaDepositsReport,
};
