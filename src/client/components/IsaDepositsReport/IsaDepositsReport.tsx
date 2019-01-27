import axios, { AxiosResponse } from "axios";
import * as Moment from "moment";
import * as React from "react";
import { PureComponent, ReactElement, ReactNode } from "react";
import { IAccountBalance, mapAccountBalanceFromApi } from "../../../commons/models/IAccountBalance";
import { IDateRange } from "../../../commons/models/IDateRange";
import { DateModeOption } from "../../../commons/models/ITransaction";
import {
	getCurrentTaxYearEnd,
	getCurrentTaxYearStart,
	getTaxYearEnd,
	getTaxYearStart,
} from "../../../commons/utils/helpers";
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
			title: "Balance",
			sortable: false,
		},
	];

	private dataProvider = new ApiDataTableDataProvider<IAccountBalance>(
			"/api/reports/isa-deposits/table-data",
			() => ({
				startDate: formatDate(this.state.startDate, "system"),
				endDate: formatDate(this.state.endDate, "system"),
				dateMode: this.state.dateMode,
			}),
			mapAccountBalanceFromApi,
	);

	constructor(props: {}, context: any) {
		super(props, context);

		this.state = {
			startDate: getCurrentTaxYearStart(),
			endDate: getCurrentTaxYearEnd(),
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
		const currentTaxYearStartYear = getCurrentTaxYearStart().year();
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

					<DataTable<IAccountBalance>
							columns={this.tableColumns}
							dataProvider={this.dataProvider}
							watchedProps={{ startDate, endDate, dateMode }}
							rowRenderer={this.tableRowRenderer}
					/>
				</>
		);
	}

	private tableRowRenderer(balance: IAccountBalance): ReactElement<void> {
		return (
				<tr key={balance.account.id}>
					<td>{balance.account.name}</td>
					<td>{formatCurrencyStyled(balance.balance)}</td>
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
