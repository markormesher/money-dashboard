import { faArrowLeft, faArrowRight, faCircleNotch } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios, { AxiosResponse } from "axios";
import { ReactNode } from "react";
import * as React from "react";
import { DatatableResponse } from "../../../server/helpers/datatable-helper";
import * as bs from "../../bootstrap-aliases";
import { combine } from "../../helpers/style-helpers";
import * as styles from "./DataTable.scss";

interface IColumn {
	title: string;
	field?: string;
	sortable?: boolean;
}

interface IDataTableProps<Model> {
	// TODO: make some props optional and provide defaults
	api: string;
	apiExtraParams?: { [key: string]: any };
	pageSize: number;
	columns: IColumn[];
	rowRenderer: (row: Model, index: number) => ReactNode;
}

interface IDataTableState<Model> {
	loading?: boolean;
	currentPage?: number;
	searchTerm?: string;
	data?: {
		rows?: Model[],
		filteredRowCount?: number,
		totalRowCount?: number,
	};
}

class DataTable<Model> extends React.Component<IDataTableProps<Model>, IDataTableState<Model>> {

	private fetchPending = false;

	constructor(props: IDataTableProps<Model>) {
		super(props);
		this.state = {
			loading: true,
			currentPage: 0,
			searchTerm: "",
			data: {
				rows: [] as Model[],
				filteredRowCount: 0,
				totalRowCount: 0,
			},
		};

		this.gotoNextPage = this.gotoNextPage.bind(this);
		this.gotoPrevPage = this.gotoPrevPage.bind(this);
		this.changePage = this.changePage.bind(this);
		this.setSearchTerm = this.setSearchTerm.bind(this);
		this.fetchData = this.fetchData.bind(this);
	}

	public componentDidMount() {
		this.fetchData();
	}

	public componentWillUpdate(nextProps: IDataTableProps<Model>, nextState: IDataTableState<Model>) {
		if (this.state.currentPage !== nextState.currentPage) {
			this.fetchPending = true;
		}

		if (this.state.searchTerm !== nextState.searchTerm) {
			this.fetchPending = true;
		}
	}

	public componentDidUpdate() {
		if (this.fetchPending) {
			this.fetchData();
			this.fetchPending = false;
		}
	}

	public render() {
		const { columns, rowRenderer } = this.props;
		const { loading, data } = this.state;

		const columnHeaders = columns.map((col) => (<th key={col.title}>{col.title}</th>));
		const rows = data.rows.map(rowRenderer);

		return (
				<div className={combine(styles.tableWrapper, loading && styles.loading)}>
					{this.generateTableHeader()}

					<div className={styles.tableBody}>
						<div className={styles.loadingIconWrapper}>
							{loading && <FontAwesomeIcon icon={faCircleNotch} spin={true} size={"2x"}/>}
						</div>

						<table className={combine(bs.table, styles.table, bs.tableStriped, bs.tableSm)}>
							<thead>
							<tr>
								{columnHeaders}
							</tr>
							</thead>
							<tbody>
							{(!data || data.rows.length === 0) && this.generateNoDataMsg()}
							{rows}
							</tbody>
						</table>
					</div>

					{this.generateTableFooter()}
				</div>
		);
	}

	private gotoPrevPage() {
		this.changePage(-1);
	}

	private gotoNextPage() {
		this.changePage(1);
	}

	private changePage(direction: number) {
		this.setState({
			currentPage: this.state.currentPage + direction,
		});
	}

	private setSearchTerm(event: React.KeyboardEvent) {
		// TODO: buffer changes
		this.setState({
			searchTerm: (event.target as HTMLInputElement).value,
		});
	}

	private generateTableHeader() {
		const { pageSize } = this.props;
		const { loading, currentPage, data } = this.state;

		const displayCurrentPage = data.filteredRowCount === 0 ? 0 : currentPage + 1;
		const totalPages = data.filteredRowCount === 0 ? 0 : Math.ceil(data.filteredRowCount / pageSize);

		const prevBtnDisabled = loading || currentPage === 0;
		const nextBtnDisabled = loading || currentPage >= totalPages - 1;
		const btnStyles = combine(bs.btn, bs.btnOutlineDark);

		return (
				<div className={styles.tableHeader}>
					<div className={combine(bs.floatLeft, bs.btnGroup, bs.btnGroupSm)}>
						<button className={btnStyles} disabled={prevBtnDisabled} onClick={this.gotoPrevPage}>
							<FontAwesomeIcon icon={faArrowLeft}/>
						</button>
						<button className={btnStyles} disabled={true}>
							Page {displayCurrentPage} of {totalPages}
						</button>
						<button className={btnStyles} disabled={nextBtnDisabled} onClick={this.gotoNextPage}>
							<FontAwesomeIcon icon={faArrowRight}/>
						</button>
					</div>
					<div className={bs.floatRight}>
						<input placeholder={"Search"} className={combine(bs.formControl, bs.formControlSm)}
							   onKeyUp={this.setSearchTerm}/>
					</div>
				</div>
		);
	}

	private generateTableFooter() {
		const { pageSize } = this.props;
		const { currentPage, data } = this.state;
		const { filteredRowCount, totalRowCount } = data;

		const rowRangeFrom = Math.min(data.filteredRowCount, (currentPage * pageSize) + 1);
		const rowRangeTo = Math.min(data.filteredRowCount, (currentPage + 1) * pageSize);
		const showTotal = filteredRowCount !== totalRowCount;

		return (
				<div className={styles.tableFooter}>
					<p className={bs.floatRight}>
						Showing rows {rowRangeFrom} to {rowRangeTo} of {filteredRowCount}
						{showTotal && <> (filtered from {totalRowCount} total)</>}
					</p>
				</div>
		);
	}

	private generateNoDataMsg() {
		const { columns } = this.props;
		return (
				<tr>
					<td colSpan={columns.length} className={combine(bs.textCenter, bs.textMuted)}>
						No rows to display
					</td>
				</tr>
		);
	}

	private fetchData() {
		const { pageSize, apiExtraParams } = this.props;
		const { currentPage } = this.state;

		this.setState({ loading: true });
		axios
				.get(this.props.api, {
					params: {
						...apiExtraParams,
						start: currentPage * pageSize,
						length: pageSize,
						searchTerm: this.state.searchTerm,
					},
				})
				.then((res: AxiosResponse<DatatableResponse<Model>>) => {
					const { data, filteredRowCount, totalRowCount } = res.data;
					const maxPossiblePage = filteredRowCount === 0 ? 0 : Math.ceil(filteredRowCount / pageSize) - 1;

					setTimeout(() => {
						this.setState({
							loading: false,
							currentPage: Math.min(currentPage, maxPossiblePage),
							data: {
								rows: data as Model[],
								filteredRowCount,
								totalRowCount,
							},
						});
					}, 400);
				})
				.catch(() => {
					this.setState({
						loading: false,
						currentPage: 0,
						data: {
							rows: [] as Model[],
							filteredRowCount: 0,
							totalRowCount: 0,
						},
					});
				});
	}
}

export {
	IColumn,
	DataTable,
};
