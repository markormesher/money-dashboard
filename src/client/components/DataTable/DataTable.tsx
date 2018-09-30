import axios, { AxiosResponse } from "axios";
import * as React from "react";
import { DatatableResponse } from "../../../server/helpers/datatable-helper";
import { ThinUser } from "../../../server/model-thins/ThinUser";
import * as bs from "../../bootstrap-aliases";
import { combine } from "../../helpers/style-helpers";
import * as styles from "./DataTable.scss";

interface IColumn {
	title: string;
	field?: string;
	sortable?: boolean;
}

interface IDataTableProps<Model> {
	api: string;
	columns: IColumn[];
}

interface IDataTableState<Model> {
	loading?: boolean;
	currentPage?: number;
	data?: {
		rows?: Model[],
		filteredRowCount?: number,
		totalRowCount?: number,
	};
}

class DataTable<Model> extends React.Component<IDataTableProps<Model>, IDataTableState<Model>> {

	constructor(props: IDataTableProps<Model>) {
		super(props);
		this.state = {
			loading: true,
			currentPage: 0,
			data: {
				rows: [] as Model[],
				filteredRowCount: 0,
				totalRowCount: 0,
			},
		};

		this.fetchData = this.fetchData.bind(this);
	}

	public componentDidMount() {
		this.fetchData();
	}

	public render() {
		const { columns } = this.props;
		const { loading, currentPage, data } = this.state;

		const columnHeaders = columns.map((c) => (<th key={c.title}>{c.title}</th>));

		// TODO: make this not-shit
		const rows = data.rows.map((r: any, i) => (
				<tr key={i}>
					<td>{r.name}</td>
					<td></td>
					<td></td>
				</tr>
		));

		return (
				<div>
					<table className={combine(bs.table, styles.table, bs.tableStriped, bs.tableSm)}>
						<thead>
						<tr>
							{columnHeaders}
						</tr>
						</thead>
						<tbody>
						{(() => {
							if (!data.rows || data.rows.length === 0) {
								return (
										<tr>
											<td colSpan={columns.length}>No data to display</td>
										</tr>
								);
							}
						})()}

						{rows}
						</tbody>
					</table>
				</div>
		);
	}

	private fetchData() {
		this.setState({ loading: true });

		axios
				.get(this.props.api, {
					params: {
						start: this.state.currentPage * 10,
						length: 10,
						dateField: "transactionDate",
						search: {
							value: "",
						},
					},
				})
				.then((res: AxiosResponse<DatatableResponse<Model>>) => {
					this.setState({
						loading: true,
						data: {
							// TODO: parity between field names
							rows: res.data.data as Model[],
							filteredRowCount: res.data.recordsFiltered,
							totalRowCount: res.data.recordsTotal,
						},
					});
				});
	}
}

export default DataTable;
