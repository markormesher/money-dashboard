import { faCircleNotch } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios, { AxiosResponse } from "axios";
import { string } from "prop-types";
import { stringify } from "qs";
import * as React from "react";
import { PureComponent, ReactElement, ReactNode } from "react";
import { DatatableResponse } from "../../../../server/helpers/datatable-helper";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";
import * as styles from "./DataTable.scss";
import { DataTableInnerHeader } from "./DataTableInnerHeader";
import { DataTableOuterFooter } from "./DataTableOuterFooter";
import { DataTableOuterHeader } from "./DataTableOuterHeader";

// TODO: tests

type SortDirection = "asc" | "desc";

interface IColumn {
	readonly title: string;
	readonly lowercaseTitle?: string;
	readonly sortable?: boolean;
	readonly sortField?: string | string[];
	readonly defaultSortDirection?: SortDirection;
	readonly defaultSortPriority?: number;
}

interface ISortEntry {
	readonly column: IColumn;
	readonly dir: SortDirection;
}

interface IDataTableProps<Model> {
	readonly api: string;
	readonly apiExtraParams?: { readonly [key: string]: any };
	readonly pageSize?: number;
	readonly columns: IColumn[];
	readonly rowRenderer: (row: Model, index: number) => ReactNode;
}

interface IDataTableState<Model> {
	readonly loading?: boolean;
	readonly failed: boolean;
	readonly currentPage?: number;
	readonly searchTerm?: string;
	readonly sortedColumns?: ISortEntry[];
	readonly data?: {
		readonly rows?: Model[],
		readonly filteredRowCount?: number,
		readonly totalRowCount?: number,
	};
}

class DataTable<Model> extends PureComponent<IDataTableProps<Model>, IDataTableState<Model>> {

	public static defaultProps: Partial<IDataTableProps<any>> = {
		apiExtraParams: {},
		pageSize: 15,
	};

	// give each remote request an increasing "frame" number so that late arrivals will be dropped
	private frameCounter = 0;
	private lastFrameReceived = 0;

	private fetchPending = false;

	constructor(props: IDataTableProps<Model>) {
		super(props);
		this.state = {
			loading: true,
			failed: false,
			currentPage: 0,
			sortedColumns: undefined,
			data: {
				rows: [] as Model[],
				filteredRowCount: 0,
				totalRowCount: 0,
			},
		};

		this.handlePageChange = this.handlePageChange.bind(this);
		this.handleSearchTermChange = this.handleSearchTermChange.bind(this);
		this.handleSortOrderChange = this.handleSortOrderChange.bind(this);

		this.fetchData = this.fetchData.bind(this);
		this.generateMsgRow = this.generateMsgRow.bind(this);
		this.onDataLoaded = this.onDataLoaded.bind(this);
		this.onDataLoadFailed = this.onDataLoadFailed.bind(this);
	}

	public componentDidMount(): void {
		this.fetchData();
	}

	public componentWillUpdate(nextProps: IDataTableProps<Model>, nextState: IDataTableState<Model>): void {
		// JSON.stringify(...) is a neat hack to do deep comparison of data-only structures
		if (this.state.currentPage !== nextState.currentPage
				|| this.state.searchTerm !== nextState.searchTerm
				|| JSON.stringify(this.state.sortedColumns) !== JSON.stringify(nextState.sortedColumns)
				|| JSON.stringify(this.props.apiExtraParams) !== JSON.stringify(nextProps.apiExtraParams)) {
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
		const { columns, rowRenderer, pageSize } = this.props;
		const { loading, failed, data, currentPage, sortedColumns } = this.state;
		const { filteredRowCount, totalRowCount } = data;

		const rows = data && data.rows.map(rowRenderer);

		return (
				<div className={combine(styles.tableWrapper, loading && styles.loading)}>
					<DataTableOuterHeader
							loading={loading}
							currentPage={currentPage}
							pageSize={pageSize}
							rowCount={filteredRowCount}
							onPageChange={this.handlePageChange}
							onSearchTermChange={this.handleSearchTermChange}
					/>

					<div className={styles.tableBodyWrapper}>
						<div className={styles.loadingIconWrapper}>
							{loading && <FontAwesomeIcon icon={faCircleNotch} spin={true} size={"2x"}/>}
						</div>

						<table className={combine(bs.table, styles.table, bs.tableStriped, bs.tableSm)}>
							<DataTableInnerHeader
									columns={columns}
									sortedColumns={sortedColumns}
									onSortOrderUpdate={this.handleSortOrderChange}
							/>

							<tbody>
							{!failed && (!rows || rows.length === 0) && this.generateMsgRow("No rows to display")}
							{failed && this.generateMsgRow("Failed to load data")}
							{rows}
							</tbody>
						</table>
					</div>

					<DataTableOuterFooter
							currentPage={currentPage}
							pageSize={pageSize}
							filteredRowCount={filteredRowCount}
							totalRowCount={totalRowCount}
							sortedColumns={sortedColumns}
					/>
				</div>
		);
	}

	private handlePageChange(page: number): void {
		this.setState({ currentPage: page });
	}

	private handleSearchTermChange(searchTerm: string): void {
		this.setState({ searchTerm });
	}

	private handleSortOrderChange(sortedColumns: ISortEntry[]): void {
		this.setState({ sortedColumns });
	}

	private generateMsgRow(msg: string): ReactElement<void> {
		return (
				<tr>
					<td colSpan={this.props.columns.length} className={combine(bs.textCenter, bs.textMuted)}>
						{msg}
					</td>
				</tr>
		);
	}

	private fetchData(): void {
		const { pageSize, apiExtraParams } = this.props;
		const { currentPage, searchTerm, sortedColumns } = this.state;

		this.setState({ loading: true });
		const frame = ++this.frameCounter;

		const ensureArray = (val: string | string[]) => val instanceof string ? [val] : val;
		const order = (sortedColumns || []).map((sortEntry) => []
				.concat(ensureArray(sortEntry.column.sortField))
				.concat(sortEntry.dir),
		);

		axios
				.get(this.props.api, {
					params: {
						...apiExtraParams,
						start: currentPage * pageSize,
						length: pageSize,
						searchTerm: searchTerm || "",
						order,
					},
					paramsSerializer: (params) => stringify(params, { arrayFormat: "indices" }),
				})
				.then((res: AxiosResponse<DatatableResponse<Model>>) => this.onDataLoaded(frame, res.data))
				.catch(() => this.onDataLoadFailed(frame));
	}

	private onFrameReceived(frame: number): void {
		this.lastFrameReceived = Math.max(frame, this.lastFrameReceived);
	}

	private onDataLoaded(frame: number, rawData: DatatableResponse<Model>): void {
		if (frame <= this.lastFrameReceived) {
			return;
		}

		this.onFrameReceived(frame);

		const { pageSize } = this.props;
		const { currentPage } = this.state;
		const { data, filteredRowCount, totalRowCount } = rawData;

		const maxPossiblePage = filteredRowCount === 0 ? 0 : Math.ceil(filteredRowCount / pageSize) - 1;
		this.setState({
			loading: false,
			failed: false,
			currentPage: Math.min(currentPage, maxPossiblePage),
			data: {
				rows: data as Model[],
				filteredRowCount,
				totalRowCount,
			},
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
			currentPage: 0,
			data: {
				rows: [] as Model[],
				filteredRowCount: 0,
				totalRowCount: 0,
			},
		});
	}
}

export {
	IColumn,
	IDataTableProps,
	IDataTableState,
	ISortEntry,
	SortDirection,
	DataTable,
};
