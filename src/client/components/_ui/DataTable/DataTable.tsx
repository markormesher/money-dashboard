import { faCircleNotch } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios, { AxiosResponse } from "axios";
import { string } from "prop-types";
import { stringify } from "qs";
import * as React from "react";
import { ReactNode } from "react";
import { DatatableResponse } from "../../../../server/helpers/datatable-helper";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";
import * as styles from "./DataTable.scss";
import { DataTableInnerHeader } from "./DataTableInnerHeader";
import { DataTableOuterFooter } from "./DataTableOuterFooter";
import { DataTableOuterHeader } from "./DataTableOuterHeader";

type SortDirection = "asc" | "desc";

interface IColumn {
	title: string;
	lowercaseTitle?: string;
	sortable?: boolean;
	sortField?: string | string[];
	defaultSortDirection?: SortDirection;
	defaultSortPriority?: number;
}

interface ISortEntry {
	column: IColumn;
	dir: SortDirection;
}

interface IDataTableProps<Model> {
	api: string;
	apiExtraParams?: { [key: string]: any };
	pageSize?: number;
	columns: IColumn[];
	rowRenderer: (row: Model, index: number) => ReactNode;
}

interface IDataTableState<Model> {
	loading?: boolean;
	failed: boolean;
	currentPage?: number;
	searchTerm?: string;
	sortedColumns: ISortEntry[];
	data?: {
		rows?: Model[],
		filteredRowCount?: number,
		totalRowCount?: number,
	};
}

class DataTable<Model> extends React.Component<IDataTableProps<Model>, IDataTableState<Model>> {

	public static defaultProps: Partial<IDataTableProps<any>> = {
		apiExtraParams: {},
		pageSize: 15,
	};

	private static getNextSortDirection(dir: SortDirection): SortDirection {
		switch (dir) {
			case "asc":
				return "desc";

			case "desc":
				return undefined;

			default:
				return "asc";
		}
	}

	// give each remote request an increasing "frame" number so that late arrivals will be dropped
	private frameCounter = 0;
	private lastFrameReceived = -1;

	private fetchPending = false;

	constructor(props: IDataTableProps<Model>) {
		super(props);
		this.state = {
			loading: true,
			failed: false,
			currentPage: 0,
			sortedColumns: this.generateDefaultSortedColumns(),
			data: {
				rows: [] as Model[],
				filteredRowCount: 0,
				totalRowCount: 0,
			},
		};

		this.toggleColumnSortOrder = this.toggleColumnSortOrder.bind(this);
		this.fetchData = this.fetchData.bind(this);
		this.onDataLoaded = this.onDataLoaded.bind(this);
		this.onDataLoadFailed = this.onDataLoadFailed.bind(this);
	}

	public componentDidMount() {
		this.fetchData();
	}

	public componentWillUpdate(nextProps: IDataTableProps<Model>, nextState: IDataTableState<Model>) {
		// JSON.stringify(...) is a neat hack to do deep comparison of data-only structures
		if (this.state.currentPage !== nextState.currentPage
				|| this.state.searchTerm !== nextState.searchTerm
				|| JSON.stringify(this.state.sortedColumns) !== JSON.stringify(nextState.sortedColumns)
				|| JSON.stringify(this.props.apiExtraParams) !== JSON.stringify(nextProps.apiExtraParams)) {
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
		const { columns, rowRenderer, pageSize } = this.props;
		const { loading, failed, data, currentPage, sortedColumns } = this.state;
		const { filteredRowCount, totalRowCount } = data;

		const rows = data.rows.map(rowRenderer);

		return (
				<div className={combine(styles.tableWrapper, loading && styles.loading)}>
					<DataTableOuterHeader
							loading={loading}
							currentPage={currentPage}
							pageSize={pageSize}
							rowCount={data.filteredRowCount}
							onPrevPageClick={() => this.setState({ currentPage: this.state.currentPage - 1 })}
							onNextPageClick={() => this.setState({ currentPage: this.state.currentPage + 1 })}
							onSearchTermSet={(searchTerm) => this.setState({ searchTerm })}/>

					<div className={styles.tableBodyWrapper}>
						<div className={styles.loadingIconWrapper}>
							{loading && <FontAwesomeIcon icon={faCircleNotch} spin={true} size={"2x"}/>}
						</div>

						<table className={combine(bs.table, styles.table, bs.tableStriped, bs.tableSm)}>
							<DataTableInnerHeader
									columns={columns}
									sortedColumns={sortedColumns}
									onToggleSortOrder={this.toggleColumnSortOrder}/>

							<tbody>
							{!failed && (!data || data.rows.length === 0) && this.generateMsgRow("No rows to display")}
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
							sortedColumns={sortedColumns}/>
				</div>
		);
	}

	private toggleColumnSortOrder(column: IColumn) {
		const sortedColumns = this.state.sortedColumns.slice(0); // work on a copy
		const currentSortEntry: ISortEntry = sortedColumns.find((sc) => sc.column === column);

		if (currentSortEntry === undefined) {
			sortedColumns.unshift({ column, dir: "asc" });
		} else {
			const currentSortEntryIndex = sortedColumns.indexOf(currentSortEntry);
			const nextDir = DataTable.getNextSortDirection(currentSortEntry.dir);
			// remove...
			sortedColumns.splice(currentSortEntryIndex, 1);
			if (nextDir !== undefined) {
				// ...and re-add at the beginning
				sortedColumns.unshift({ column, dir: nextDir });
			}
		}

		this.setState({ sortedColumns });
	}

	private generateDefaultSortedColumns(): ISortEntry[] {
		return this.props.columns
				.filter((col) => col.defaultSortDirection !== undefined)
				.sort((a, b) => (a.defaultSortPriority || 0) - (b.defaultSortPriority || 0))
				.map((col) => ({ column: col, dir: col.defaultSortDirection }));
	}

	private generateMsgRow(msg: string) {
		return (
				<tr>
					<td colSpan={this.props.columns.length} className={combine(bs.textCenter, bs.textMuted)}>
						{msg}
					</td>
				</tr>
		);
	}

	private fetchData() {
		const { pageSize, apiExtraParams } = this.props;
		const { currentPage, searchTerm, sortedColumns } = this.state;

		this.setState({ loading: true });
		const frame = ++this.frameCounter;

		const ensureArray = (val: string | string[]) => val instanceof string ? [val] : val;
		const order = sortedColumns.map((sortEntry) => []
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

	private onFrameReceived(frame: number) {
		this.lastFrameReceived = Math.max(frame, this.lastFrameReceived);
	}

	private shouldDrawFrame(frame: number): boolean {
		return frame >= this.lastFrameReceived;
	}

	private onDataLoaded(frame: number, rawData: DatatableResponse<Model>) {
		this.onFrameReceived(frame);
		if (!this.shouldDrawFrame(frame)) {
			return;
		}

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

	private onDataLoadFailed(frame: number) {
		this.onFrameReceived(frame);
		if (!this.shouldDrawFrame(frame)) {
			return;
		}

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
